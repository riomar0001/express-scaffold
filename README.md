# Express REST API Scaffold

A production-ready REST API built with Express.js, featuring comprehensive authentication, authorization, and security. Built with TypeScript, Prisma ORM, and PostgreSQL for modern backend development.

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

- **RESTful API Design**: Clean, intuitive REST endpoints following industry standards
- **JWT Authentication**: Stateless authentication with access and refresh tokens
- **Role-Based Authorization**: Multi-level access control (Admin, Member, Guest)
- **Comprehensive User Management**: Registration, login, logout, and profile operations
- **Advanced Security**: Rate limiting, CORS, helmet headers, bcrypt password hashing
- **PostgreSQL Integration**: Robust database with Prisma ORM for type-safe queries
- **Token Management**: Automatic refresh token rotation with expiration cleanup
- **Input Validation**: Strict request validation using express-validator
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **TypeScript**: Full type safety with custom type definitions
- **Background Jobs**: Automated token cleanup via cron jobs
- **Production Ready**: Environment-based configuration and security optimizations

## 🛠 Tech Stack

- **API Framework**: Express.js - Fast, minimalist web framework
- **Runtime**: Node.js
- **Language**: TypeScript - Full type safety and modern JS features
- **Database**: PostgreSQL - Robust relational database
- **ORM**: Prisma - Type-safe database client and query builder
- **Authentication**: JSON Web Tokens (JWT) - Stateless authentication
- **Password Security**: bcryptjs - Salt and hash passwords
- **Validation**: express-validator - Server-side input validation
- **Security**: Helmet, CORS, Rate Limiting - Comprehensive security layers
- **Development Tools**: tsx, nodemon - Hot reload and development utilities

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

The REST API server will start on `http://localhost:3000`

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

## 🔗 REST API Endpoints

### Authentication Routes (`/api/v1/auth`)

All endpoints return JSON responses with consistent structure:

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/` | User login | ❌ | - |
| POST | `/register` | User registration | ❌ | - |
| POST | `/refresh` | Refresh access token | ❌ | - |
| POST | `/logout` | User logout | ❌ | - |
| GET | `/user` | Get user profile | ✅ | Any |
| GET | `/admin` | Admin only endpoint | ✅ | Admin |

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Too Many Requests (Rate Limited)
- `500` - Internal Server Error

### Request/Response Examples

**Login**
```bash
POST /api/v1/auth
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

# Response (200 OK)
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "cm123456789",
      "email": "user@example.com",
      "role": "MEMBER"
    }
  }
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

# Response (201 Created)
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "cm123456789",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "MEMBER"
    }
  }
}
```

**Authentication Required Requests**
```bash
GET /api/v1/auth/user
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
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

- **JWT Authentication**: Stateless authentication with Bearer tokens
- **Password Security**: bcryptjs hashing with salt rounds
- **Rate Limiting**: API endpoint protection against abuse
- **CORS Protection**: Cross-origin request security
- **Security Headers**: Helmet middleware for HTTP security
- **Input Validation**: Comprehensive request body/query validation
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **Token Security**: Automatic refresh token rotation and cleanup
- **Login Security**: Failed attempt tracking and account lockout
- **Audit Trail**: IP address and user agent logging

## 🏗 REST API Design Principles

This API follows RESTful conventions and best practices:

- **Resource-Based URLs**: Endpoints represent resources (`/users`, `/auth`)
- **HTTP Methods**: Proper use of GET, POST, PUT, DELETE, PATCH
- **Status Codes**: Meaningful HTTP status codes for all responses
- **JSON Communication**: All requests and responses use JSON format
- **Stateless**: No server-side session storage (JWT-based)
- **Versioning**: API versioned with `/v1/` prefix for future compatibility
- **Consistent Responses**: Standardized response format across all endpoints
- **Error Handling**: Structured error responses with details
- **Authentication**: Bearer token authentication for protected resources
- **Content Negotiation**: Proper Content-Type headers

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

- [ ] Add comprehensive test suite with Jest/Supertest
- [ ] Implement password reset API endpoints
- [ ] Add email verification REST endpoints
- [ ] Implement file upload API for user profiles
- [ ] Add OpenAPI/Swagger documentation
- [ ] Create Docker configuration for containerization
- [ ] Implement structured logging with Winston
- [ ] Add API metrics and monitoring endpoints
- [ ] Create admin API endpoints for user management
- [ ] Add OAuth2 REST endpoints (Google, GitHub, etc.)
- [ ] Implement API versioning strategy
- [ ] Add GraphQL support as alternative to REST

### 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [JWT.io](https://jwt.io/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
