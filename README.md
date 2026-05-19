# Freelance Marketplace (React + Spring Boot + MySQL)

A full-stack freelance marketplace where users can post jobs, submit proposals, manage contracts/payments, chat via WebSockets, and upload/manage profile content.

## Live Demo
- **Frontend:** `http://localhost/` (local)
- **Backend API:** `http://localhost:8080/` (local)

> For your resume/portfolio, after deploying to Render/Railway/VPS, paste your **production live URL** here.

---

## Tech Stack

### Frontend
- React
- Vite
- WebSocket (for chat)
- Razorpay Checkout (payments)

### Backend
- Spring Boot
- JWT authentication
- WebSocket messaging
- MySQL with JPA/Hibernate

### Infrastructure
- Docker + Docker Compose
- MySQL container

---

## Repository Structure

- `frontend/` — React/Vite app + Dockerfile
- `backend/` — Spring Boot app + Maven wrapper + Dockerfile
- `docker-compose.yml` — local multi-service orchestration (mysql + backend + frontend)
- `.env` — runtime secrets for docker compose (DO NOT commit)
- `.github/workflows/deploy.yml` — CI workflow (builds backend + frontend)

---

## Prerequisites

- Docker Desktop (or Docker Engine)
- Docker Compose
- (Optional for local dev) Node.js + JDK are not required if you use Docker

---

## Configure Secrets (required)

Docker Compose reads secrets from a root `.env` file located at:

`./.env` (same level as `docker-compose.yml`)

Create/edit `./.env`:

```env
# MySQL
DB_PASSWORD=your_mysql_root_password

# JWT
JWT_SECRET=your_jwt_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# CORS Allowed Origins (comma-separated)
# Example for local Docker usage
CORS_ALLOWED_ORIGINS=http://localhost

# Frontend build-time proxy base
# Use /api so nginx forwards /api requests to the backend container
VITE_API_URL=/api
```

### Notes
- Keep `.env` out of GitHub. The repo should ignore `.env` via `.gitignore`.
- If you change `CORS_ALLOWED_ORIGINS` or `VITE_API_URL`, rebuild containers.

---

## Run Locally with Docker Compose

From the repo root:

```bash
docker compose up -d --build
```

### Check services
- **Frontend UI:** http://localhost
- **Backend direct:** http://localhost:8080

### Stop services

```bash
docker compose down
```

---

## Useful Docker Commands

View logs:

```bash
docker compose logs -f backend
docker compose logs -f frontend
```

Rebuild only:

```bash
docker compose up -d --build
```

---

## Deployment (Resume/Portfolio)

This project is deployment-friendly because it already contains:
- Dockerfiles for `frontend/` and `backend/`
- A docker-compose configuration

Typical deployment flow:
1. Push to GitHub.
2. Create environment variables/secrets on your platform:
   - `DB_PASSWORD`
   - `JWT_SECRET`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `CORS_ALLOWED_ORIGINS`
   - `VITE_API_URL=/api`
3. Deploy services (frontend + backend + database, or use managed MySQL).
4. Copy the **production live URL** and place it in this README under **Live Demo**.

---

## Security / Secrets

- JWT secret (`JWT_SECRET`) is required.
- Razorpay secret (`RAZORPAY_KEY_SECRET`) must be stored in platform secrets (never in code).

---

## CI (GitHub Actions)

`.github/workflows/deploy.yml` builds the backend and frontend when you push to `main`.

> This workflow does not deploy to production by itself; it is a build pipeline. Deployment depends on the hosting provider you choose.

---

## Troubleshooting

### Common issues
- **CORS errors:** update `CORS_ALLOWED_ORIGINS`.
- **Backend can’t connect to DB:** verify `DB_PASSWORD` and MySQL credentials.
- **Frontend can’t call API:** ensure `VITE_API_URL=/api` and rebuild.

---

## Authors
- Mahesh Zalte


