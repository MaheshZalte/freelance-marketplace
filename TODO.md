# TODO

- [x] Scan repository structure for frontend/backend and existing env support.
- [x] Hardening: remove plaintext DB_PASSWORD fallback from backend application.properties.
- [x] Hardening: make CORS origins configurable via CORS_ALLOWED_ORIGINS.
- [x] Add Docker deployment scaffolding (docker-compose.yml, backend/Dockerfile, frontend/Dockerfile).
- [x] Add DEPLOYMENT.md with end-to-end local Docker Compose run steps.
- [x] Add local verification checklist (compose up + smoke test endpoints).

- Verification (local Docker Compose):
  1) Create root .env (DB_PASSWORD, JWT_SECRET, RAZORPAY_KEY_ID/SECRET, CORS_ALLOWED_ORIGINS, VITE_API_URL)
  2) docker compose up -d --build
  3) Smoke test backend:
     - curl -i http://localhost:8080/api/auth/test
  4) Smoke test frontend:
     - Open http://localhost
  5) Confirm uploads work:
     - Upload any profile/job file and verify it persists

- [ ] (Later) Add migrations and disable ddl-auto=update for production.
- [ ] (Later) Add GitHub repo + Actions to build/push images (if you want CI/CD).

