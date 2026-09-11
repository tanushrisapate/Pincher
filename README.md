# Pincher — Haute Wardrobe Intelligence & AI Stylist

<div align="center">

![Pincher Banner](https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80)

**An AI-Powered Wardrobe Intelligence Platform, 100% Grounded in Your Real Clothes.**

[![Next.js 15](https://img.shields.io/badge/Frontend-Next.js%2015%20App%20Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20(Python%203.13)-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL 17](https://img.shields.io/badge/Database-PostgreSQL%2017-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![ONNX Runtime](https://img.shields.io/badge/ML%20Inference-DeepFashion2%20ONNX-005CED?style=for-the-badge&logo=onnx)](https://onnxruntime.ai/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%204.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Features](#-key-features) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [API Documentation](#-api-endpoints) • [Tech Stack](#-tech-stack)

</div>

---

## 📖 Overview

**Pincher** is a luxury wardrobe intelligence platform designed to eliminate daily decision fatigue. Unlike generic generative fashion tools that hallucinate unattainable clothes, **Pincher recommends outfits synthesized 100% from your real uploaded wardrobe items**, attuned to **live climate conditions** and **color harmony rules**.

Built with a curated **Balanced Gold luxury design system** (`#B8860B`, `#D4AF37`, `#FAFAF9`), Pincher combines browser-side **DeepFashion2 ONNX inference**, precision **CIELAB color extraction**, a high-performance **FastAPI backend**, and **PostgreSQL 17** persistence.

---

## Key Features

### 1. 100% Wardrobe-Grounded Outfit Recommendation Engine
* **No Fake/Hallucinated Clothes**: Generates combinations composed strictly of pieces you actually own.
* **Multi-Tier Outfit Scoring**:
  * **Color Harmony (50%)**: Evaluates Complementary, Monochromatic, Analogous, and Neutral Accent palettes.
  * **Weather Suitability (30%)**: Adapts to real-time temperature, wind, and precipitation probability.
  * **Style Persona (20%)**: Tunes recommendations to your aesthetic (*Classic, Minimalist, Streetwear, Formal*).
* **AI Styling Rationale**: Delivers human-readable styling explanations with weather badges.

### 2. 📸 DeepFashion2 AI Classification & Footwear Vision Analyzer
* **Client-Side ONNX Inference**: Sub-second browser inference using MobileNetV3 trained on the DeepFashion2 dataset.
* **Footwear & Accessory Vision Analyzer**: Automatically recognizes sneakers, boots, loafers, and oxfords through horizontal sole contours and midsole edge gradients.
* **1-Click Category Confirmation**: Interactive visual pills for *Tops, Bottoms, Outerwear, Dresses, Shoes, and Accessories*.

### 3. Precision Dominant Color Extraction
* **Background Masking**: Isolates the garment region and eliminates studio backdrops.
* **Perceived Luminance Detection**: Accurately recognizes dark shades (*Jet Black, Charcoal Black, Slate Grey*) without washing them out.
* **Luxury Palette Matching**: Automatically labels 20+ signature fashion hues (*Champagne Gold, Saddle Brown, Burgundy Wine, Emerald Forest Green, Navy Blue*).

### 4. Live Climate & Weather Advisory
* **Open-Meteo Live Integration**: Real-time GPS/City weather forecasts (Temperature, Feels Like, Humidity, Rain Probability).
* **Automated Layering Rules**: Dynamic warnings when temperatures dip below 18°C or rise above 28°C.

### 5. PostgreSQL 17 + JWT Authentication
* **Secure Session Management**: Bcrypt password hashing (10 salt rounds) and HMAC SHA-256 JWT tokens.
* **Dual Auth Support**: Supports both `httpOnly` secure cookies and `Authorization: Bearer` headers.
* **Live Profile & Persona Settings**: Customize your primary style persona and sync lookbooks across devices.

---

## 🏛️ Architecture

```mermaid
graph TD
    User([User Device / Browser]) -->|HTTPS / Next.js 15| Frontend[Frontend UI & ONNX Web Engine :3000]
    Frontend -->|Client-Side Inference| ONNX[DeepFashion2 MobileNetV3 ONNX Model]
    Frontend -->|Color Analysis| ColorEngine[Precision Luminance & CIELAB Extractor]
    
    Frontend -->|REST API Calls| Backend[FastAPI Intelligence Engine :8000]
    
    Backend -->|Auth Router| Security[Bcrypt + PyJWT Security Layer]
    Backend -->|Wardrobe Router| WardrobeService[Wardrobe Catalog CRUD]
    Backend -->|Outfits Router| Recommender[Multi-Constraint Recommendation Engine]
    Backend -->|Weather Router| WeatherAPI[Open-Meteo Live API + Geocoding]
    
    Recommender -->|Query User Pieces| DB[(PostgreSQL 17 Database)]
    WardrobeService --> DB
    Security --> DB
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | [Next.js 15](https://nextjs.org/) (App Router), React 19, [Tailwind CSS 4.0](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), Lucide Icons |
| **Machine Learning** | [ONNX Runtime Web](https://onnxruntime.ai/), PyTorch, MobileNetV3 Small (DeepFashion2 Dataset) |
| **Backend API** | [FastAPI](https://fastapi.tiangolo.com/), Python 3.13, Uvicorn, Pydantic v2, HTTPX |
| **Database** | [PostgreSQL 17](https://www.postgresql.org/), `psycopg2` Threaded Connection Pooling |
| **Authentication** | JSON Web Tokens (`PyJWT` / `jsonwebtoken`), Bcrypt password hashing, `httpOnly` Cookies |
| **External APIs** | [Open-Meteo Weather Forecast API](https://open-meteo.com/), Open-Meteo Geocoding Search |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: `v18.18+` or `v20+`
* **Python**: `3.10+` (Python `3.13` recommended)
* **PostgreSQL**: `v15+` (PostgreSQL `17` recommended)

---

### 1. Clone the Repository
```bash
git clone https://github.com/tanushrisapate/Pincher.git
cd Pincher
```

---

### 2. Configure Environment Variables

Create `.env` in `backend/`:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/pincher_db
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=YOUR_PASSWORD
PGDATABASE=pincher_db
JWT_SECRET=your_super_secure_jwt_secret_key_2026
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
DEBUG=True
PORT=8000
```

Create `.env.local` in `frontend/`:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/pincher_db
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=YOUR_PASSWORD
PGDATABASE=pincher_db
JWT_SECRET=your_super_secure_jwt_secret_key_2026
JWT_EXPIRES_IN=7d
```

---

### 3. Start the FastAPI Backend

```powershell
cd backend
pip install -r requirements.txt
python run.py
```
* Backend API: **`http://localhost:8000`**
* Interactive Swagger Docs: **`http://localhost:8000/docs`**

---

### 4. Start the Next.js Frontend

In a new terminal:
```powershell
cd frontend
npm install
npm run dev
```
* Open your browser at: **`http://localhost:3000`**

---

### 5. Automated Test Suite

Verify all database tables, authentication, weather geocoding, and the recommendation engine:
```powershell
cd backend
python test_api.py
```

---

## 📡 API Endpoints

### 🔐 Authentication
* `POST /api/auth/signup` — Create a new account with style persona
* `POST /api/auth/login` — Authenticate and issue secure JWT cookie
* `GET  /api/auth/me` — Retrieve currently logged-in user profile
* `POST /api/auth/logout` — Clear session cookie

### 👗 Wardrobe Catalog
* `GET    /api/wardrobe` — List user's wardrobe items with category & search filters
* `POST   /api/wardrobe` — Digitize and store a new wardrobe piece
* `GET    /api/wardrobe/{id}` — Fetch details for a specific item
* `PUT    /api/wardrobe/{id}` — Update garment metadata
* `DELETE /api/wardrobe/{id}` — Remove item from wardrobe

### AI Outfit Recommendations
* `POST   /api/outfits/recommend` — Generate weather & occasion attuned looks from real pieces
* `POST   /api/outfits/save` — Save outfit combination to personal lookbook
* `GET    /api/outfits/saved` — Retrieve all saved outfits with full item details
* `DELETE /api/outfits/{id}` — Delete outfit from saved lookbook
* `PATCH  /api/outfits/{id}/favorite` — Toggle outfit favorite status

###  Weather & Climate
* `GET /api/weather/current` — Live temperature, humidity & sky conditions by coordinates
* `GET /api/weather/by-city` — Weather forecast by city name

---

## Luxury Design Tokens

| Token | Hex Value | Role |
|---|---|---|
| **Primary Gold** | `#B8860B` | Primary CTAs, active highlights, key brand accents |
| **Champagne Accent** | `#D4AF37` | Secondary buttons, gradient transitions, badge borders |
| **Dark Gold** | `#8C6212` | Hover states, text emphasis, high-contrast badges |
| **Obsidian Black** | `#1C1917` / `#111111` | Primary text, executive cards, rich dark panels |
| **Luxury Background** | `#FAFAF9` / `#FAF8F5` | Ambient canvas, card containers, subtle borders |

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <sub>Crafted with precision for effortless elegance. © 2026 Pincher.</sub>
</div>
