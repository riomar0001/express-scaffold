# Express Scaffold

A robust Express.js API scaffold with authentication, authorization, and security features built with TypeScript, Prisma, and PostgreSQL.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Security Features](#security-features)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Complete user registration, login, logout, and profile management
- **Security**: Rate limiting, CORS, helmet security headers, password hashing
- **Database**: PostgreSQL with Prisma ORM
- **Token Management**: Refresh token rotation with automatic cleanup
- **Input Validation**: Request validation using express-validator
- **Error Handling**: Centralized error handling middleware
- **TypeScript**: Full TypeScript support with custom type definitions
- **Cron Jobs**: Automated cleanup of expired tokens
- **Production Ready**: Optimized for production deployment

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **Development**: tsx, nodemon

## 📁 Project Structure

```
express-scaffold/
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
├── src/
│   ├── app.ts                  # Express app configuration
│   ├── configs/                # Configuration files
│   │   ├── dotenv.config.ts    # Environment configuration
│   │   └── prisma.config.ts    # Prisma client configuration
│   ├── constants/              # Application constants
│   │   └── userRole.ts         # User role definitions
│   ├── cron/                   # Scheduled tasks
│   │   └── cleanupExpiredTokens.cron.ts
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Utility functions
│   │   ├── customErrors.ts     # Custom error classes
│   │   ├── passwordHashing.ts  # Password utilities
│   │   ├── responseHandler.ts  # Response formatting
│   │   ├── tokenGenerations.ts # JWT token utilities
│   │   └── tokenHashing.ts     # Token hashing utilities
│   └── v1/                     # API version 1
│       ├── controllers/        # Request handlers
│       ├── middlewares/        # Custom middleware
│       ├── routes/             # Route definitions
│       ├── services/           # Business logic
│       └── validators/         # Input validation schemas
├── server.ts                   # Application entry point
├── package.json
└── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd express-scaffold
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your environment variables (see [Environment Variables](#environment-variables))

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
DIRECT_URL="postgresql://username:password@localhost:5432/database_name"

# JWT Secrets
JWT_ACCESS_TOKEN_SECRET="your-super-secret-access-token-key"
JWT_REFRESH_TOKEN_SECRET="your-super-secret-refresh-token-key"

# Server
PORT=3000
NODE_ENV="DEVELOPMENT" # or "PRODUCTION"

# Optional: If using Supabase
SUPABASE_URL="your-supabase-url"
SUPABASE_ANON_KEY="your-supabase-anon-key"
```

## 🔗 API Endpoints

### Authentication Routes (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/` | User login | ❌ | - |
| POST | `/register` | User registration | ❌ | - |
| POST | `/refresh` | Refresh access token | ❌ | - |
| POST | `/logout` | User logout | ❌ | - |
| GET | `/user` | Get user profile | ✅ | Any |
| GET | `/admin` | Admin only endpoint | ✅ | Admin |

### Request/Response Examples

**Login**
```bash
POST /api/v1/auth
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Register**
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe"
}
```

## 🗃 Database Schema

### Users Table
- **id**: Unique identifier (CUID)
- **email**: User email (unique)
- **first_name**: User's first name
- **last_name**: User's last name
- **password**: Hashed password
- **role**: User role (ADMIN, MEMBER, GUEST)
- **status**: Account status (ACTIVE, INACTIVE, SUSPENDED, etc.)
- **email_verified**: Email verification status
- **failed_login_attempts**: Security tracking
- **last_login_at**: Activity tracking
- **created_at/updated_at**: Audit fields

### Refresh Tokens Table
- **id**: Unique identifier
- **user_id**: Foreign key to users
- **token_hash**: Hashed refresh token
- **ip_address**: Client IP address
- **user_agent**: Client user agent
- **device**: Device information
- **is_active**: Token status
- **expires_at**: Token expiration
- **created_at/updated_at**: Audit fields

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Rate Limiting**: Prevents brute force attacks
- **CORS Protection**: Configurable cross-origin requests
- **Helmet Security**: Security headers protection
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Prisma ORM protection
- **Token Rotation**: Automatic refresh token rotation
- **Failed Login Tracking**: Account lockout mechanism
- **IP Address Logging**: Security audit trail

## 📝 Scripts

```bash
# Development
npm run dev            # Start development server with hot reload

# Production
npm run build          # Build TypeScript to JavaScript
npm run prod           # Start production server

# Database
npx prisma generate    # Generate Prisma client
npx prisma migrate dev # Run database migrations
npx prisma studio      # Open Prisma Studio (database GUI)

# Testing
npm test               # Run tests (not implemented yet)
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**riomar0001**

---

### 🚧 TODO / Roadmap

- [ ] Add comprehensive test suite
- [ ] Implement password reset functionality
- [ ] Add email verification system
- [ ] Implement user profile image upload
- [ ] Add API documentation with Swagger
- [ ] Add Docker configuration
- [ ] Implement logging system
- [ ] Add metrics and monitoring
- [ ] Create admin dashboard
- [ ] Add OAuth integration (Google, GitHub, etc.)

### 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [JWT.io](https://jwt.io/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
