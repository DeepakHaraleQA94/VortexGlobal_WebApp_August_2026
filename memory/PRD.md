# Vortex Crypto Services — PRD

## Original Problem Statement
Binance-style dark-theme website for "Vortex Crypto Services", an OTC crypto settlement desk (HQ Hinjewadi, Pune). Core business: buying & selling USDT at scale (₹20–50L daily volume, 8 institutional clients). Offers OTC trading and access to all major tokens (USDT, SOL, BTC, USDC, ETH, SPAC, NVDAB, GMEB, ASMLB). Offices in Pune, Mumbai (BKC), Bangalore. Contact: +91 82620 30386, +91 72194 50687, 022 45670 0.

## User Choices
- Dark theme, Binance yellow/gold (#F0B90B) accents
- Live crypto price ticker (CoinGecko)
- Working contact/lead form + admin view (JWT auth)
- Generated Vortex logo
- Claude Sonnet 4.6 AI (Emergent LLM key): floating chat assistant "Vera" (with mid-conversation lead capture) + AI market insights widget

## Architecture
- **Frontend**: React 19, framer-motion, lenis smooth-scroll, react-fast-marquee, sonner, Tailwind. Routes: `/` (Landing), `/admin` (Admin).
- **Backend**: FastAPI + Motor/MongoDB. Routes under `/api`.
- **Integrations**: CoinGecko (public prices, in-memory cache + fallback); Claude Sonnet 4.6 via emergentintegrations LlmChat; JWT custom auth (bcrypt).

## Implemented (2026-08-14)
- Kinetic hero with on-load masked line reveal + swirl parallax bg, live price ticker marquee
- Sections: Stats, Services, Tokens bento grid, numbered Manifesto, AI Insights, editorial marquee, Locations, Lead form, Footer
- Backend: `/api/crypto/prices`, `/api/leads` (POST public, GET admin-only), `/api/auth/login` + `/auth/me`, `/api/chat` (multi-turn + `[[LEAD]]` capture), `/api/insights`
- Admin dashboard: JWT login, leads table (incl. chat-captured leads)
- Claude chat widget "Vera" with lead capture; AI insights per token using live price
- Tested: 100% backend & frontend (iteration_1). Role check added on GET /api/leads.

## Credentials
- Admin: admin@vortexcrypto.com / Vortex@2026 (see test_credentials.md)

## Backlog / Remaining
- P1: Add role check enforced (done); markdown sanitizer for AI output (currently naive bold regex)
- P2: Lead pagination/export (CSV), email notification on new lead, chat history persistence per user, per-office contact map
- P2: Rate limiting on public /chat and /leads endpoints
