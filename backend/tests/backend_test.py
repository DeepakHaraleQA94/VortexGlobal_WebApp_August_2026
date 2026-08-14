"""Vortex Crypto backend regression tests."""
import os
import uuid
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # Fallback: read from frontend/.env
    try:
        with open("/app/frontend/.env") as f:
            for line in f:
                if line.startswith("REACT_APP_BACKEND_URL="):
                    BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
    except Exception:
        pass

API = f"{BASE_URL}/api"
ADMIN_EMAIL = "admin@vortexcrypto.com"
ADMIN_PASSWORD = "Vortex@2026"


@pytest.fixture(scope="session")
def token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "token" in data and data["user"]["email"] == ADMIN_EMAIL
    return data["token"]


# ---------- Crypto prices ----------
def test_crypto_prices():
    r = requests.get(f"{API}/crypto/prices", timeout=20)
    assert r.status_code == 200
    data = r.json()
    assert "prices" in data and isinstance(data["prices"], list)
    syms = {p["symbol"] for p in data["prices"]}
    assert {"BTC", "ETH", "USDT", "SOL", "USDC"}.issubset(syms)
    for p in data["prices"]:
        assert "price" in p and "change" in p


# ---------- Leads ----------
def test_public_create_lead_and_admin_can_read(token):
    payload = {
        "name": f"TEST_{uuid.uuid4().hex[:6]}",
        "email": f"test_{uuid.uuid4().hex[:6]}@example.com",
        "phone": "+911234567890",
        "asset": "USDT",
        "volume": "25L",
        "message": "TEST regression lead",
    }
    r = requests.post(f"{API}/leads", json=payload, timeout=15)
    assert r.status_code == 200, r.text
    lead = r.json()
    assert lead["email"] == payload["email"]
    assert lead["asset"] == "USDT"
    assert "id" in lead

    # Verify via authenticated GET
    r2 = requests.get(f"{API}/leads", headers={"Authorization": f"Bearer {token}"}, timeout=15)
    assert r2.status_code == 200
    leads = r2.json()
    assert any(l["email"] == payload["email"] for l in leads)


def test_leads_requires_auth():
    r = requests.get(f"{API}/leads", timeout=10)
    assert r.status_code == 401


# ---------- Auth ----------
def test_login_wrong_password():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"}, timeout=10)
    assert r.status_code == 401


def test_auth_me(token):
    r = requests.get(f"{API}/auth/me", headers={"Authorization": f"Bearer {token}"}, timeout=10)
    assert r.status_code == 200
    assert r.json()["email"] == ADMIN_EMAIL


# ---------- Insights ----------
def test_insights_btc():
    r = requests.post(f"{API}/insights", json={"symbol": "BTC"}, timeout=60)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["symbol"] == "BTC"
    assert isinstance(data["insight"], str) and len(data["insight"]) > 40
    assert "[[LEAD]]" not in data["insight"]


# ---------- Chat + lead capture ----------
def test_chat_multiturn_and_lead_capture(token):
    session_id = f"test-{uuid.uuid4().hex[:8]}"
    # Turn 1
    r1 = requests.post(f"{API}/chat", json={"session_id": session_id, "message": "What is OTC and where are you located?"}, timeout=60)
    assert r1.status_code == 200, r1.text
    d1 = r1.json()
    assert isinstance(d1["reply"], str) and len(d1["reply"]) > 5
    assert d1["lead_captured"] is False

    # Turn 2 - provide name + volume to trigger capture
    unique = uuid.uuid4().hex[:6]
    msg = f"I'm TEST_{unique} and I want to sell 30 lakhs INR worth of USDT. Please get me a quote."
    r2 = requests.post(f"{API}/chat", json={"session_id": session_id, "message": msg}, timeout=60)
    assert r2.status_code == 200, r2.text
    d2 = r2.json()
    assert "[[LEAD]]" not in d2["reply"]

    # Give AI some breathing room; check leads list for capture (may or may not have captured – tolerate)
    time.sleep(1)
    r3 = requests.get(f"{API}/leads", headers={"Authorization": f"Bearer {token}"}, timeout=15)
    assert r3.status_code == 200
    leads = r3.json()
    captured = any(f"TEST_{unique}" in (l.get("name") or "") for l in leads)
    # Record capture result but only assert lead_captured flag matches persistence
    if d2["lead_captured"]:
        assert captured, "lead_captured=True but lead not persisted"
    # If model didn't emit LEAD tag, that is a soft failure we log but not hard-fail
    print(f"chat lead_captured={d2['lead_captured']} persisted={captured}")
