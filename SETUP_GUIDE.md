# Freelance Marketplace - Setup Guide

## 🔒 Security Improvements Implemented

### Phase 1: Security Hardening (Completed)

✅ **Environment Variables Management**
- All sensitive credentials moved to `.env` files
- `.env` files ignored by Git for security
- Separate `.env.example` templates for reference

✅ **Strong JWT Authentication**
- JWT secret upgraded to 256-bit encryption
- Secret loaded from environment variables
- Improved token generation with explicit algorithm (HS256)

✅ **Password Validation**
- Strong password requirements enforced:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one digit
  - At least one special character (@$!%*?&)

✅ **Database Security**
- Database credentials externalized
- Removed hardcoded credentials from application.properties
- SQL logging disabled in production

✅ **API Configuration**
- Frontend API URL moved to environment variables
- WebSocket configuration externalized
- CORS properly configured with environment variables

---

## 📋 Prerequisites

- **Java**: 21+ (LTS)
- **Maven**: 3.8+
- **Node.js**: 18+
- **npm**: 9+
- **MySQL**: 5.7+

---

## 🚀 Getting Started

### 1. Backend Setup

#### Step 1: Install Dependencies
```bash
cd backend
mvn clean install
```

#### Step 2: Configure Environment Variables
```bash
# In the root directory, copy the template
copy .env.example .env

# Update .env with your values:
DB_URL=jdbc:mysql://localhost:3306/freelance_marketplace
DB_USERNAME=root
DB_PASSWORD=your_secure_password
JWT_SECRET=your_generated_secret_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

#### Step 3: Generate Strong JWT Secret (Optional)
If you want to generate a new JWT secret:
```bash
# On Windows PowerShell:
$bytes = New-Object Byte[] 32
[Security.Cryptography.RNGCryptoServiceProvider]::new().GetBytes($bytes)
[Convert]::ToBase64String($bytes)

# On Linux/Mac:
openssl rand -base64 32
```

#### Step 4: Create Database
```sql
CREATE DATABASE freelance_marketplace 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

#### Step 5: Run Backend
```bash
# From backend directory
mvn spring-boot:run
```

Backend will be available at: `http://localhost:8080`

---

### 2. Frontend Setup

#### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

#### Step 2: Configure Environment Variables
```bash
# Copy environment template
copy .env.example .env

# .env should contain:
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws
VITE_APP_NAME=Freelance Marketplace
VITE_APP_VERSION=1.0.0
VITE_LOG_LEVEL=debug
```

#### Step 3: Run Development Server
```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## 🔐 Security Best Practices

### 1. **Never Commit Sensitive Data**
- `.env` is already in `.gitignore`
- Always use `.env.example` for templates
- Review commits before pushing to ensure no secrets are exposed

### 2. **Database Password Security**
- Use a strong password (min 8 chars with special characters)
- Change default passwords immediately
- Use separate credentials for development, staging, and production

### 3. **JWT Secret Management**
- Generate a unique secret for each environment
- Store in secure vault (e.g., AWS Secrets Manager, HashiCorp Vault)
- Rotate secrets periodically

### 4. **Razorpay Keys**
- Use test keys for development
- Never expose secret keys in code or logs
- Rotate keys if compromised
- Use separate test and production keys

### 5. **CORS Configuration**
- Only allow trusted domains
- Update `CORS_ALLOWED_ORIGINS` for your deployment

---

## 🗂️ Project Structure

```
freelance-marketplace/
├── backend/                          # Spring Boot application
│   ├── src/main/java/com/freelance/demo/
│   │   ├── config/                  # Configuration classes
│   │   │   ├── DotEnvConfig.java    # ✨ NEW: Load .env
│   │   │   ├── SecurityConfig.java
│   │   │   └── WebSocketConfig.java
│   │   ├── validation/              # ✨ NEW: Validation
│   │   │   ├── ValidPassword.java   # ✨ NEW: Password annotation
│   │   │   └── StrongPasswordValidator.java  # ✨ NEW: Validator
│   │   ├── controller/
│   │   ├── service/
│   │   ├── entity/
│   │   ├── repository/
│   │   └── exception/
│   ├── pom.xml                      # Maven dependencies (dotenv added)
│   └── application.properties       # Updated with env variables
│
├── frontend/                         # React/Vite application
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js              # Updated with env URL
│   │   ├── utils/
│   │   │   └── auth.js             # Updated with env URL
│   │   └── App.jsx                 # Updated with env URL
│   ├── package.json
│   └── vite.config.js
│
├── .env                             # ✨ NEW: Environment variables (add to .gitignore)
├── .env.example                     # ✨ NEW: Template for .env
└── .gitignore                       # ✨ NEW/UPDATED: Includes .env

```

---

## 📝 What Changed in Phase 1

### Backend Changes
1. **Added dotenv-java** dependency to pom.xml
2. **Created DotEnvConfig.java** to load .env file at startup
3. **Updated JwtUtil.java**
   - JWT secret now loaded from environment
   - Changed from static methods to instance methods
   - Added explicit SignatureAlgorithm.HS256
4. **Created ValidPassword annotation** for strong password validation
5. **Created StrongPasswordValidator** for custom password rules
6. **Updated User.java** entity with password validation
7. **Updated application.properties** to use environment variables

### Frontend Changes
1. **Created .env and .env.example** files
2. **Updated api.js** to use VITE_API_URL environment variable
3. **Updated App.jsx** to use environment variables
4. **Updated auth.js** to use environment variables + added isAuthenticated()
5. **Added .gitignore entries** for .env files

### Root Level Changes
1. **Created .gitignore** - Prevents accidental commits of sensitive files
2. **Created .env** - Your environment configuration
3. **Created .env.example** - Template for others to follow

---

## ⚙️ Configuration Files Reference

### .env File
```
# Database
DB_URL=jdbc:mysql://localhost:3306/freelance_marketplace
DB_USERNAME=root
DB_PASSWORD=YourSecurePassword123!

# JWT
JWT_SECRET=base64_encoded_256bit_secret

# Razorpay
RAZORPAY_KEY_ID=test_key
RAZORPAY_KEY_SECRET=test_secret
```

### Frontend .env
```
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws
```

---

## 🧪 Testing the Setup

### 1. Test Backend
```bash
# Test API endpoint
curl http://localhost:8080/api/auth/test

# Should return: "Protected API working"
```

### 2. Test Frontend Connection
```bash
# Check console in browser (F12 -> Console)
# Should connect to API without errors
```

### 3. Test User Registration with Strong Password
```bash
# Password must match: ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$
# Valid example: MyPassword@123
# Invalid examples: password123, Pass123, MyPassword
```

---

## 🐛 Troubleshooting

### Issue: ".env file not found"
**Solution**: 
- Ensure .env file is in project root
- Check filename (must be exactly `.env`)
- Restart application after creating .env

### Issue: "Invalid JWT Secret"
**Solution**:
- Generate new secret using openssl
- Ensure it's base64 encoded
- Update .env and restart

### Issue: "CORS error on frontend"
**Solution**:
- Update CORS_ALLOWED_ORIGINS in .env
- Add your frontend URL: `http://localhost:5173`

### Issue: "Password validation failing on registration"
**Solution**:
- Password must be 8+ characters
- Must include: uppercase, lowercase, digit, special character
- Example: `SecurePass@2024`

---

## 📚 Next Steps (Phase 2+)

After Phase 1 security hardening:
- Phase 2: Error Handling & API Design
- Phase 3: Frontend Quality Improvements
- Phase 4: Documentation & Code Quality
- Phase 5: Testing & Polish

---

## 📞 Support

For issues or questions about security configuration:
1. Check this README
2. Review .env.example
3. Check application logs: `backend/logs/`

---

## ✅ Security Checklist Before Deployment

- [ ] Change all default passwords
- [ ] Generate unique JWT secret for production
- [ ] Use production Razorpay keys
- [ ] Update CORS origins for production domain
- [ ] Enable HTTPS in production
- [ ] Set `spring.jpa.show-sql=false` for production
- [ ] Remove debug logging from production
- [ ] Backup database before deployment
- [ ] Use strong database user credentials
- [ ] Store .env in secure vault (AWS Secrets Manager, etc.)

---

**Last Updated**: May 10, 2026  
**Phase**: 1 - Security Hardening (Complete)
