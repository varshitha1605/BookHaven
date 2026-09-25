# Deployment Guide

This guide explains how to make the Bookstore application publicly accessible.  
We use **Render.com** (free tier) for both the backend and the database, and **Netlify** (free tier) for the frontend.

---

## Architecture

```
Users
  │
  ├──► Netlify (React frontend)          https://your-bookstore.netlify.app
  │         │  (HTTPS, CDN, global)
  │         │  calls API via VITE_API_URL
  │         ▼
  └──► Render Web Service (Spring Boot)  https://bookstore-api.onrender.com
              │  (HTTPS, auto-sleep on free tier)
              ▼
         Render PostgreSQL (managed DB)  — private, not public
```

---

## Step 1 — Deploy the PostgreSQL database (Render)

1. Sign up at **https://render.com** (free account).
2. Click **New → PostgreSQL**.
3. Fill in:
   - **Name**: `bookstore-db`
   - **Region**: pick one close to your users
   - **Plan**: Free
4. Click **Create Database**.
5. Once created, copy:
   - **Internal Database URL** (used by the backend — stays inside Render's network)
   - Do **not** expose this URL publicly.

---

## Step 2 — Deploy the Spring Boot backend (Render)

### 2a. Push your code to GitHub

```bash
git init            # (if not already a git repo)
git add .
git commit -m "Initial commit"
# Create a repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/bookstore.git
git push -u origin main
```

### 2b. Create a Web Service on Render

1. In Render dashboard → **New → Web Service**.
2. Connect your GitHub repo.
3. Configure:

| Field | Value |
|---|---|
| **Name** | `bookstore-api` |
| **Root Directory** | `server` |
| **Runtime** | `Java` |
| **Build Command** | `mvn -q clean package -DskipTests` |
| **Start Command** | `java -jar target/bookstore-server-1.0.0-SNAPSHOT.jar` |
| **Plan** | Free |

4. Under **Environment Variables**, add:

| Key | Value |
|---|---|
| `DB_URL` | *(paste the Internal Database URL from Step 1, replace `postgres://` with `jdbc:postgresql://`)* |
| `DB_USERNAME` | *(from Render DB dashboard → Username)* |
| `DB_PASSWORD` | *(from Render DB dashboard → Password — keep this secret!)* |
| `JWT_SECRET` | *(generate a random 64-char string, e.g. `openssl rand -hex 32`)* |
| `CORS_ORIGINS` | `https://your-bookstore.netlify.app` *(fill in after Step 3)* |
| `STRIPE_SECRET_KEY` | `sk_test_...` *(your Stripe test key)* |

5. Click **Create Web Service**. Render will build and start the backend.
6. Copy the URL (e.g. `https://bookstore-api.onrender.com`).

> **Note:** On the free tier, the service sleeps after 15 minutes of inactivity. The first request after sleep takes ~30 seconds to wake up.

---

## Step 3 — Deploy the React frontend (Netlify)

### 3a. Set the backend URL

Edit `client/.env.production` — replace the placeholder with your Render backend URL:

```
VITE_API_URL=https://bookstore-api.onrender.com
```

Commit and push this change.

### 3b. Deploy to Netlify

1. Sign up at **https://netlify.com**.
2. Click **Add new site → Import an existing project**.
3. Connect GitHub and select your repo.
4. Configure:

| Field | Value |
|---|---|
| **Base directory** | `client` |
| **Build command** | `npm run build` |
| **Publish directory** | `client/dist` |

5. Click **Deploy site**.
6. Netlify gives you a URL like `https://your-bookstore.netlify.app`.

### 3c. Update CORS on the backend

Go back to Render → your Web Service → **Environment** tab.  
Update `CORS_ORIGINS` to your Netlify URL:

```
CORS_ORIGINS=https://your-bookstore.netlify.app
```

Render will automatically redeploy the backend with the new setting.

---

## Step 4 — Verify the deployment

1. Open your Netlify URL in a browser.
2. The bookstore home page should load (may take 30 s on first load while the backend wakes up).
3. Register a new account and place a test order.
4. Visit `https://bookstore-api.onrender.com/api/swagger-ui.html` to see the live API docs.

---

## Security checklist before going live

- [ ] `JWT_SECRET` is a long random string (≥32 chars), not the default value
- [ ] `DB_PASSWORD` is set only as an environment variable, never committed to git
- [ ] `STRIPE_SECRET_KEY` starts with `sk_live_` for real payments (use `sk_test_` for testing)
- [ ] `CORS_ORIGINS` lists only your frontend URL, not `*`
- [ ] PostgreSQL is not exposed on a public port (Render managed DB is private by default)

---

## Local development (unchanged)

```powershell
# Terminal 1 — database
docker compose up -d postgres

# Terminal 2 — backend
cd server
mvn spring-boot:run

# Terminal 3 — frontend
cd client
npm install
npm run dev
# Opens at http://localhost:5173
```

The frontend dev server proxies `/api` to `localhost:8080` automatically (see `vite.config.ts`).  
`VITE_API_URL` is empty in `.env.development`, so the proxy is used and no extra config is needed.
