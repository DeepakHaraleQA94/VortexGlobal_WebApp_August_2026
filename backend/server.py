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
    username: str
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
        return {"id": str(user["_id"]), "username": user.get("username", ""), "role": user.get("role", "admin")}
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


@api_router.get("/crypto/prices")
async def crypto_prices():
    now = time.time()
    if _price_cache["data"] and now - _price_cache["ts"] < 45:
        return _price_cache["data"]
    ids = ",".join(COINS.keys())
    url = f"https://api.coingecko.com/api/v3/simple/price?ids={ids}&vs_currencies=usd&include_24hr_change=true"
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
            {"symbol": "BTC", "price": 97250.0, "change": 1.24},
            {"symbol": "ETH", "price": 3410.5, "change": -0.82},
            {"symbol": "USDT", "price": 1.0, "change": 0.01},
            {"symbol": "SOL", "price": 205.3, "change": 3.15},
            {"symbol": "USDC", "price": 1.0, "change": -0.0},
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
    user = await db.users.find_one({"username": payload.username.strip().lower()})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = create_access_token(str(user["_id"]), user["username"])
    return {"token": token, "user": {"username": user["username"], "role": user.get("role", "admin")}}


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
    prices = await crypto_prices()
    match = next((p for p in prices.get("prices", []) if p["symbol"] == sym), None)
    price_line = (
        f"Current market data for {sym}: ${match['price']} (24h change {match['change']}%)."
        if match else f"{sym} is a token available on the Vortex OTC desk."
    )
    insight_client = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"insight-{sym}-{int(time.time())}",
        system_message=VORTEX_CONTEXT,
    ).with_model("anthropic", CLAUDE_MODEL)
    prompt = (
        f"{price_line}\n\nWrite a concise 3-4 sentence market briefing on {sym} for an institutional "
        f"OTC client. Cover what the asset is, how the current 24h move reads, and why settling {sym} "
        f"through Vortex's OTC desk (zero slippage, immediate settlement) makes sense for large size. "
        f"Do NOT give price predictions or investment advice. Do NOT include any [[LEAD]] tag."
    )
    try:
        text = await insight_client.send_message(UserMessage(text=prompt))
    except Exception as e:
        logger.error(f"Claude insight error: {e}")
        raise HTTPException(status_code=502, detail="AI request failed")
    text = re.sub(r"\[\[LEAD\]\].*", "", text, flags=re.DOTALL).strip()
    return {"symbol": sym, "insight": text, "market": match}


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
    await db.users.create_index("username", unique=True, sparse=True)
    admin_user = os.environ["ADMIN_USERNAME"].strip().lower()
    admin_password = os.environ["ADMIN_PASSWORD"]
    # remove any stale admin accounts (e.g. old email-based logins)
    await db.users.delete_many({"role": "admin", "username": {"$ne": admin_user}})
    existing = await db.users.find_one({"username": admin_user})
    if existing is None:
        await db.users.insert_one({
            "username": admin_user,
            "password_hash": hash_password(admin_password),
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Seeded admin user")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"username": admin_user}, {"$set": {"password_hash": hash_password(admin_password)}})
        logger.info("Updated admin password")


@app.on_event("shutdown")
async def shutdown():
    client.close()
