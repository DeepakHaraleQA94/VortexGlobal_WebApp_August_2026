from dotenv import load_dotenv
from pathlib import Path
import os

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, BeforeValidator
from typing import List, Optional, Annotated
from datetime import datetime, timezone, timedelta
from bson import ObjectId
import logging
import uuid
import time
import bcrypt
import jwt
import httpx
import re
import json as _json
from emergentintegrations.llm.chat import LlmChat, UserMessage

# MongoDB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = "HS256"
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')
CLAUDE_MODEL = "claude-sonnet-4-6"

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------- Models ----------
PyObjectId = Annotated[str, BeforeValidator(str)]


class Lead(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    asset: str
    volume: str
    message: Optional[str] = ""
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class LeadCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    asset: str
    volume: str
    message: Optional[str] = ""


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ChatRequest(BaseModel):
    session_id: str
    message: str


class InsightRequest(BaseModel):
    symbol: str


VORTEX_CONTEXT = """You are "Vera", the AI concierge for Vortex Crypto Services — an institutional
Over-the-Counter (OTC) crypto settlement desk headquartered in Hinjewadi, Pune, India.

About Vortex:
- Core business: buying & selling USDT at scale. We settle ₹20–50 lakhs in USDT volume daily for 8 major institutional clients.
- OTC trading = direct buying/selling of assets between two parties through a dealer network, not on a centralized exchange. Benefits: zero slippage, single agreed price, immediate settlement, deep liquidity.
- Supported assets: USDT (flagship), BTC, ETH, SOL, USDC, SPAC, NVDAB, GMEB, ASMLB and all major tokens.
- Offices: Pune (Magarpatta City, Aditi Garden, Hadapsar 411013 — HQ), Mumbai (Bandra Kurla Complex 400051), Bangalore (108 Ramanashree Chambers, 37 Lady Curzon Road 560001).
- Contact: +91 82620 30386, +91 72194 50687, 022 45670 0.
- Email: finance@vortexglobal.info, adirajpatel@vortexglobal.info, saurabhi.kumari@vortexglobal.info, traders@vortexglobal.info.

Your job: answer visitor questions about our services, OTC trading, tokens, settlements and locations in a confident, concise, professional tone. Keep replies short (2-4 sentences). Never give financial/investment advice or price predictions; you may explain how OTC works and what Vortex offers.

LEAD CAPTURE: If the visitor wants to trade, get a quote, or shows buying/selling intent, naturally collect their NAME and the VOLUME they want to trade (optionally email, phone, and which ASSET). Once you have AT LEAST a name and a volume, append EXACTLY ONE line at the very end of your reply in this precise format (and nothing after it):
[[LEAD]]{"name":"...","email":"...","phone":"...","asset":"...","volume":"...","message":"..."}
Use empty strings for anything not provided. Do NOT mention this tag to the user. Only emit it once per conversation when the details are ready."""


# ---------- Auth helpers ----------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_user(request: Request) -> dict:
    auth_header = request.headers.get("Authorization", "")
    token = auth_header[7:] if auth_header.startswith("Bearer ") else None
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return {"id": str(user["_id"]), "email": user["email"], "role": user.get("role", "admin")}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ---------- Crypto price cache ----------
_price_cache = {"data": None, "ts": 0}
COINS = {
    "bitcoin": "BTC",
    "ethereum": "ETH",
    "tether": "USDT",
    "solana": "SOL",
    "usd-coin": "USDC",
}
COIN_NAMES = {
    "BTC": "Bitcoin",
    "ETH": "Ethereum",
    "USDT": "Tether",
    "SOL": "Solana",
    "USDC": "USD Coin",
}


def _liquidity_label(volume: float) -> str:
    if volume >= 5e9:
        return "Strong"
    if volume >= 1e9:
        return "Available"
    if volume >= 1e8:
        return "Moderate"
    return "Limited"


def _volatility_label(change: float) -> str:
    a = abs(change or 0)
    if a < 2:
        return "Low"
    if a < 6:
        return "Moderate"
    return "High"


@api_router.get("/crypto/prices")
async def crypto_prices():
    now = time.time()
    if _price_cache["data"] and now - _price_cache["ts"] < 45:
        return _price_cache["data"]
    ids = ",".join(COINS.keys())
    url = f"https://api.coingecko.com/api/v3/simple/price?ids={ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true"
    try:
        async with httpx.AsyncClient(timeout=10) as c:
            r = await c.get(url)
            r.raise_for_status()
            raw = r.json()
        result = []
        for cid, sym in COINS.items():
            d = raw.get(cid, {})
            result.append({
                "symbol": sym,
                "price": d.get("usd", 0),
                "change": round(d.get("usd_24h_change", 0) or 0, 2),
                "volume": round(d.get("usd_24h_vol", 0) or 0, 2),
            })
        payload = {"prices": result, "updated": datetime.now(timezone.utc).isoformat()}
        _price_cache["data"] = payload
        _price_cache["ts"] = now
        return payload
    except Exception as e:
        logger.warning(f"CoinGecko error: {e}")
        if _price_cache["data"]:
            return _price_cache["data"]
        fallback = [
            {"symbol": "BTC", "price": 97250.0, "change": 1.24, "volume": 32000000000},
            {"symbol": "ETH", "price": 3410.5, "change": -0.82, "volume": 15000000000},
            {"symbol": "USDT", "price": 1.0, "change": 0.01, "volume": 60000000000},
            {"symbol": "SOL", "price": 205.3, "change": 3.15, "volume": 4200000000},
            {"symbol": "USDC", "price": 1.0, "change": -0.0, "volume": 8000000000},
        ]
        return {"prices": fallback, "updated": datetime.now(timezone.utc).isoformat(), "fallback": True}


# ---------- Leads ----------
@api_router.post("/leads", response_model=Lead)
async def create_lead(payload: LeadCreate):
    lead = Lead(**payload.model_dump())
    await db.leads.insert_one(lead.model_dump())
    logger.info(f"New lead: {lead.email} / {lead.asset} / {lead.volume}")
    return lead


@api_router.get("/leads", response_model=List[Lead])
async def list_leads(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    docs = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return docs


# ---------- Auth routes ----------
@api_router.post("/auth/login")
async def login(payload: LoginRequest):
    user = await db.users.find_one({"email": payload.email.lower()})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(str(user["_id"]), user["email"])
    return {"token": token, "user": {"email": user["email"], "role": user.get("role", "admin")}}


@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user


@api_router.get("/")
async def root():
    return {"message": "Vortex Crypto Services API"}


# ---------- Claude AI (chat + insights) ----------
async def _extract_and_save_lead(text: str, session_id: str):
    """Detect [[LEAD]]{...} block, save lead, return cleaned text + captured flag."""
    m = re.search(r"\[\[LEAD\]\]\s*(\{.*\})", text, re.DOTALL)
    if not m:
        return text, False
    cleaned = text[: m.start()].strip()
    try:
        data = _json.loads(m.group(1))
        if data.get("name") and data.get("volume"):
            lead = Lead(
                name=data.get("name", "")[:120],
                email=data.get("email") or "chat-lead@vortexcrypto.com",
                phone=data.get("phone", ""),
                asset=data.get("asset") or "USDT",
                volume=data.get("volume", ""),
                message=(data.get("message", "") + " [captured via AI chat]").strip(),
            )
            await db.leads.insert_one(lead.model_dump())
            logger.info(f"AI chat captured lead: {lead.name} / {lead.volume}")
            return cleaned, True
    except Exception as e:
        logger.warning(f"Lead parse failed: {e}")
    return cleaned, False


@api_router.post("/chat")
async def chat(payload: ChatRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=503, detail="AI is not configured")

    # store user message
    now = datetime.now(timezone.utc).isoformat()
    await db.chat_messages.insert_one(
        {"session_id": payload.session_id, "role": "user", "content": payload.message, "created_at": now}
    )

    # build transcript for context
    history = await db.chat_messages.find(
        {"session_id": payload.session_id}, {"_id": 0}
    ).sort("created_at", 1).to_list(40)
    transcript = "\n".join(
        f"{'Visitor' if m['role'] == 'user' else 'Vera'}: {m['content']}" for m in history[:-1]
    )
    prompt = payload.message
    if transcript:
        prompt = f"Conversation so far:\n{transcript}\n\nVisitor: {payload.message}"

    chat_client = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=payload.session_id,
        system_message=VORTEX_CONTEXT,
    ).with_model("anthropic", CLAUDE_MODEL)

    try:
        raw = await chat_client.send_message(UserMessage(text=prompt))
    except Exception as e:
        logger.error(f"Claude chat error: {e}")
        raise HTTPException(status_code=502, detail="AI request failed")

    reply, captured = await _extract_and_save_lead(raw, payload.session_id)
    await db.chat_messages.insert_one(
        {"session_id": payload.session_id, "role": "assistant", "content": reply, "created_at": datetime.now(timezone.utc).isoformat()}
    )
    return {"reply": reply, "lead_captured": captured}


@api_router.post("/insights")
async def insights(payload: InsightRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=503, detail="AI is not configured")
    sym = payload.symbol.upper()
    if sym not in COIN_NAMES:
        raise HTTPException(status_code=404, detail="Asset not supported")

    prices = await crypto_prices()
    match = next((p for p in prices.get("prices", []) if p["symbol"] == sym), None)
    if not match:
        raise HTTPException(status_code=502, detail="Market data unavailable")

    name = COIN_NAMES[sym]
    price = match.get("price", 0)
    change = match.get("change", 0)
    volume = match.get("volume", 0)
    liquidity = _liquidity_label(volume)
    volatility = _volatility_label(change)
    direction = "up" if change >= 0 else "down"
    updated = datetime.now(timezone.utc).isoformat()

    market = {
        "price": price,
        "change": change,
        "volume": volume,
        "liquidity": liquidity,
        "volatility": volatility,
        "status": "Open · 24/7",
    }

    def _vol_str(v):
        if v >= 1e9:
            return f"${v / 1e9:.2f}B"
        if v >= 1e6:
            return f"${v / 1e6:.2f}M"
        return f"${v:,.0f}"

    key_factors = [
        {"n": "01", "title": "Price Movement",
         "detail": f"{sym} is trading at ${price:,.2f}, {direction} {abs(change):.2f}% over the last 24 hours."},
        {"n": "02", "title": "Volume Activity",
         "detail": f"24h traded volume is approximately {_vol_str(volume)} across global venues."},
        {"n": "03", "title": "Liquidity Conditions",
         "detail": f"Liquidity conditions indicate a {liquidity.lower()} depth profile based on recent volume."},
        {"n": "04", "title": "Volatility",
         "detail": f"24h market volatility is currently {volatility.lower()} at {abs(change):.2f}%."},
        {"n": "05", "title": "Market Context",
         "detail": "Digital-asset markets trade 24/7; execution conditions may vary with transaction size and timing."},
    ]

    client = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"insight-{sym}-{int(time.time())}",
        system_message=VORTEX_CONTEXT,
    ).with_model("anthropic", CLAUDE_MODEL)
    prompt = (
        f"Current market data for {name} ({sym}):\n"
        f"- Price: ${price:,.2f}\n- 24h change: {change:+.2f}% ({direction})\n"
        f"- 24h volume: {_vol_str(volume)}\n- Liquidity: {liquidity}\n- Volatility: {volatility}\n\n"
        "Write an institutional market briefing in TWO parts, separated by a line containing exactly '===OTC==='.\n\n"
        "PART 1 (the market brief): 2-3 short neutral paragraphs describing recent price movement, trading "
        "activity/volume, volatility and liquidity conditions as observations. Use neutral language like "
        "'Price has moved...', 'Trading activity is currently...', 'Liquidity conditions indicate...'. "
        "STRICTLY NO predictions, no buy/sell suggestions, no 'will rise/fall', no 'best time to trade', "
        "no guarantees.\n\n"
        "PART 2 (the OTC execution context): 1 short paragraph on indicative pricing, available liquidity, "
        "spread and order-size considerations for larger OTC transactions. Note that 'execution conditions "
        "may vary depending on transaction size, asset liquidity and prevailing market conditions.' Do NOT "
        "claim guaranteed execution, zero slippage or guaranteed liquidity.\n\n"
        "IMPORTANT OUTPUT RULES: Output ONLY the paragraph prose. Do NOT print any headings, titles, labels, "
        "'PART 1'/'PART 2', 'AI MARKET BRIEF', 'OTC EXECUTION CONTEXT', asset-name headers, reference-price "
        "lines, markdown, or '---' separators. Use only the single delimiter line ===OTC=== between the two "
        "parts. Do NOT include any [[LEAD]] tag."
    )
    try:
        text = await client.send_message(UserMessage(text=prompt))
    except Exception as e:
        logger.error(f"Claude insight error: {e}")
        raise HTTPException(status_code=502, detail="AI request failed")

    text = re.sub(r"\[\[LEAD\]\].*", "", text, flags=re.DOTALL).strip()
    if "===OTC===" in text:
        brief, otc = text.split("===OTC===", 1)
    else:
        brief, otc = text, ("Execution conditions may vary depending on transaction size, asset liquidity "
                            "and prevailing market conditions. Contact our OTC desk for indicative pricing.")

    def _clean_section(t: str) -> str:
        t = re.sub(r"(?im)^\s*\**\s*part\s*\d[^\n]*$", "", t)
        t = re.sub(r"(?im)^\s*\**\s*(ai market brief|otc execution context)\s*\**\s*:?\s*$", "", t)
        t = re.sub(r"(?im)^\s*-{3,}\s*$", "", t)
        t = re.sub(r"(?im)^\s*vortex crypto services[^\n]*$", "", t)
        t = re.sub(r"(?im)^\s*asset:\s*[^\n]*$", "", t)
        t = re.sub(r"\n{3,}", "\n\n", t)
        return t.strip()

    brief = _clean_section(brief)
    otc = _clean_section(otc)

    return {
        "symbol": sym,
        "name": name,
        "market": market,
        "source": "CoinGecko" if not prices.get("fallback") else "CoinGecko (cached)",
        "updated": updated,
        "brief": brief.strip(),
        "otc_context": otc.strip(),
        "key_factors": key_factors,
    }


DEFAULT_COMPANY = {
    "name": "Vortex Global Exchanges & Crypto Services",
    "headline": "Institutional OTC Crypto Settlement Desk · USDT Settlements · Digital Assets",
    "location": "Hinjewadi, Pune, India",
    "industry": "Financial Services · Crypto OTC",
    "companySize": "11–50 employees",
    "headquarters": "Hinjewadi, Pune, India",
    "type": "Privately Held",
    "specialtiesLine": "USDT Settlements · OTC Trading",
    "linkedinUrl": "https://www.linkedin.com/company/vortex-global-exchanges",
    "commitment": "Client Trust Is Our Commitment",
    "about": [
        "Vortex Global Exchanges & Crypto Services is an institutional Over-the-Counter (OTC) crypto settlement desk headquartered in Hinjewadi, Pune. We specialise in high-volume USDT buying, selling and settlement, alongside execution across major digital assets including BTC, ETH, SOL and USDC.",
        "OTC trading is the direct buying and selling of assets between two parties through a dealer network rather than a centralized exchange — offering negotiated pricing, privacy, deep liquidity and coordinated settlement for larger transactions. From initial inquiry through execution and settlement, our desk provides dedicated support at every step.",
    ],
    "specialties": [
        "Institutional OTC Trading", "USDT Settlement Services", "Digital Asset Trading",
        "Fixed-Price Execution", "Liquidity & Block Trades", "Dealer-to-Client Execution",
        "Coordinated Settlement", "BTC · ETH · SOL · USDC",
    ],
    "updates": [
        {"tag": "Commitment", "text": "At Vortex Global Exchanges, client trust is not just our goal — it's our commitment. Building a trustworthy future in cryptocurrency, one client relationship at a time."},
        {"tag": "Service", "text": "Institutional OTC desk for large USDT settlements and major digital assets — negotiated pricing, direct dealer execution and coordinated settlement."},
        {"tag": "Coverage", "text": "Now serving institutional clients across Pune, Mumbai and Bangalore with dedicated trade support from inquiry through settlement."},
    ],
    "offices": [
        {"city": "Pune (HQ)", "addr": "Magarpatta City, Aditi Garden, Hadapsar, Pune 411013"},
        {"city": "Mumbai", "addr": "Bandra Kurla Complex, Mumbai 400051"},
        {"city": "Bangalore", "addr": "108, Ramanashree Chambers, 37 Lady Curzon Road, Bangalore 560001"},
    ],
}


async def get_company_doc():
    doc = await db.company_profile.find_one({"_id": "singleton"})
    if not doc:
        doc = {"_id": "singleton", **DEFAULT_COMPANY}
        await db.company_profile.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.get("/company")
async def company_get():
    return await get_company_doc()


@api_router.put("/company")
async def company_put(payload: dict, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    payload.pop("_id", None)
    payload.pop("id", None)
    await db.company_profile.update_one({"_id": "singleton"}, {"$set": payload}, upsert=True)
    return await get_company_doc()


DEFAULT_ASSETS = {"usdt_balance": 56740.00, "inr_rate": 99.60}

# Dummy transactions (newest first). offset_minutes = how long ago from "now",
# so timestamps always render as today / 1-2 days back.
DUMMY_TXNS = [
    {"type": "receive", "amount": 3200, "counterparty": "Binance P2P — Client A", "note": "USDT credit", "balance_after": 56740, "offset_minutes": 18},
    {"type": "withdraw", "amount": 1500, "counterparty": "TRC20 wallet TR7…9kQ", "note": "Client payout", "balance_after": 53540, "offset_minutes": 95},
    {"type": "receive", "amount": 5000, "counterparty": "OTC Settlement — Client C", "note": "USDT credit", "balance_after": 55040, "offset_minutes": 240},
    {"type": "withdraw", "amount": 2750, "counterparty": "ERC20 wallet 0x4a…2f1", "note": "Withdrawal", "balance_after": 50040, "offset_minutes": 610},
    {"type": "receive", "amount": 1800, "counterparty": "Client D", "note": "USDT credit", "balance_after": 52790, "offset_minutes": 1120},
    {"type": "withdraw", "amount": 4200, "counterparty": "Client E settlement", "note": "Withdrawal", "balance_after": 50990, "offset_minutes": 1600},
    {"type": "receive", "amount": 6500, "counterparty": "Binance P2P — Client F", "note": "USDT credit", "balance_after": 55190, "offset_minutes": 2150},
    {"type": "receive", "amount": 900, "counterparty": "Client G", "note": "USDT credit", "balance_after": 48690, "offset_minutes": 2750},
]


async def get_assets_doc():
    doc = await db.assets.find_one({"_id": "singleton"})
    if not doc:
        doc = {"_id": "singleton", **DEFAULT_ASSETS}
        await db.assets.insert_one(doc)
    balance = round(doc.get("usdt_balance", 0), 2)
    rate = doc.get("inr_rate", 99.60)
    return {"usdt_balance": balance, "inr_rate": rate, "inr_value": round(balance * rate, 2)}


class AssetTxn(BaseModel):
    type: str  # withdraw | send | receive
    amount: float
    note: Optional[str] = ""
    counterparty: Optional[str] = ""


@api_router.get("/assets")
async def assets_get(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return await get_assets_doc()


@api_router.get("/assets/transactions")
async def assets_txns(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    docs = await db.asset_transactions.find({}, {"_id": 0}).to_list(200)
    now = datetime.now(timezone.utc)
    for d in docs:
        if d.get("dummy"):
            d["created_at"] = (now - timedelta(minutes=d.get("offset_minutes", 0))).isoformat()
        d.pop("offset_minutes", None)
        d.pop("dummy", None)
    docs.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return docs


@api_router.post("/assets/transaction")
async def assets_transaction(payload: AssetTxn, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    if payload.type not in ("withdraw", "send", "receive"):
        raise HTTPException(status_code=400, detail="Invalid transaction type")
    if payload.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than zero")
    current = await get_assets_doc()
    balance = current["usdt_balance"]
    if payload.type in ("withdraw", "send"):
        if payload.amount > balance:
            raise HTTPException(status_code=400, detail="Insufficient USDT balance")
        balance -= payload.amount
    else:
        balance += payload.amount
    balance = round(balance, 2)
    await db.assets.update_one({"_id": "singleton"}, {"$set": {"usdt_balance": balance}}, upsert=True)
    txn = {
        "id": str(uuid.uuid4()),
        "type": payload.type,
        "amount": round(payload.amount, 2),
        "note": payload.note or "",
        "counterparty": payload.counterparty or "",
        "balance_after": balance,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.asset_transactions.insert_one(dict(txn))
    result = await get_assets_doc()
    result["transaction"] = txn
    return result


app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    admin_email = os.environ["ADMIN_EMAIL"].strip().lower()
    admin_password = os.environ["ADMIN_PASSWORD"]
    # remove any stale admin accounts (e.g. old username-based logins)
    await db.users.delete_many({"role": "admin", "email": {"$ne": admin_email}})
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Seeded admin user")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
        logger.info("Updated admin password")

    # seed dummy asset transactions once (so Recent Transactions looks live)
    if await db.asset_transactions.count_documents({}) == 0:
        for t in DUMMY_TXNS:
            await db.asset_transactions.insert_one({"id": str(uuid.uuid4()), "dummy": True, **t})
        logger.info("Seeded dummy asset transactions")


@app.on_event("shutdown")
async def shutdown():
    client.close()
