# Freelance Marketplace Deployment (Docker Compose)

This project uses:
- **frontend**: React/Vite
- **backend**: Spring Boot (JWT + MySQL + WebSocket)
- **database**: MySQL

## 1) Prerequisites
- Install **Docker Desktop** (or Docker Engine)
- Install **Docker Compose plugin**

## 2) Create environment file for Compose (required)
At repo root, create a real **`.env` file** (DO NOT commit it) so docker-compose can read your secrets.

> Note: Docker Compose does **not** automatically read `.env.example.deploy`. You must create `.env`.

Example:
```bash
# MySQL
DB_PASSWORD=change_this_password

# JWT
JWT_SECRET=base64_encoded_secret_value_here

# Razorpay
RAZORPAY_KEY_ID=test_key_id
RAZORPAY_KEY_SECRET=test_key_secret

# CORS allowed origins (comma-separated)
# IMPORTANT: set this to your deployed frontend origin(s)
# Example for local Docker: http://localhost
CORS_ALLOWED_ORIGINS=http://localhost

# Frontend build-time
# Use /api to let nginx proxy API calls to the backend container.
# The frontend Docker build reuses RAZORPAY_KEY_ID as the public checkout key.
VITE_API_URL=/api
```

## 3) Start the stack
From repo root:
```bash
docker compose up -d --build
```

## 4) If you changed CORS / VITE_API_URL
Rebuild is required:
```bash
docker compose up -d --build
```

## 5) Verify
- Frontend: http://localhost
- Backend API through frontend proxy: http://localhost/api
- Backend direct port, if needed: http://localhost:8080
- Uploads are persisted in the `uploads-data` Docker volume.

## 6) Production notes (important)
1. **CORS**: update `CORS_ALLOWED_ORIGINS` to your production frontend origin(s).
2. **Uploads**: ensure the `uploads-data` volume persists (it does by default).
3. **Database schema**: current backend uses `spring.jpa.hibernate.ddl-auto=update` (dev-like). For real production, consider migrations.
