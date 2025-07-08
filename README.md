# Express TypeScript Authentication API Scaffold

A well-architected, secure Express.js API built with TypeScript, featuring comprehensive JWT-based authentication, role-based access control, and PostgreSQL database integration with Prisma ORM. This project follows enterprise-grade patterns with proper separation of concerns and comprehensive error handling.

## ✅ Code Quality Assessment

**Status: High-Quality Implementation** - This project demonstrates excellent architectural patterns and security practices:

### ✅ **Strengths:**
- **Advanced Architecture**: Clean separation with service layer, custom error handling, and response utilities
- **Type Safety**: Comprehensive TypeScript implementation with proper interfaces and type definitions
- **Security Excellence**: Secure JWT implementation, proper token rotation, IP truncation for privacy
- **Error Handling**: Custom error classes with proper inheritance and operational error tracking
- **Code Organization**: Well-structured project with logical folder hierarchy and clear responsibilities
- **Modern Standards**: ES6 modules, proper async/await patterns, and up-to-date dependencies

### ⚠️ **Areas for Enhancement:**
- **Testing**: No test suite implemented yet
- **API Documentation**: Could benefit from OpenAPI/Swagger documentation
- **Logging**: Basic console logging, consider structured logging (Winston/Pino)
- **Validation**: Additional input sanitization for XSS protection

## 🚀 Features

- **Enterprise Architecture**: Service layer pattern with proper separation of concerns
- **Secure Authentication**: JWT-based authentication with access and refresh tokens
- **Advanced Error Handling**: Custom error classes with operational error tracking
- **Role-Based Access Control**: Support for ADMIN, MEMBER, and GUEST roles
- **Password Security**: Bcrypt password hashing with 10 salt rounds
- **Rate Limiting**: Configurable rate limiting for authentication and registration endpoints
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **Token Management**: Secure refresh token rotation with device and IP validation
- **Privacy Protection**: IP address truncation for user privacy
- **Input Validation**: Express-validator with comprehensive validation schemas
- **Response Standardization**: Consistent API response format with success/error handlers
- **CORS Support**: Configurable CORS for cross-origin requests
- **TypeScript**: Full TypeScript support with strict type checking and custom interfaces

## 🏗️ Architecture

This project follows a **layered architecture** pattern:

```
┌─────────────────┐
│   Controllers   │ ← Request/Response handling
├─────────────────┤
│    Services     │ ← Business logic
├─────────────────┤
│   Repositories  │ ← Data access (Prisma)
├─────────────────┤
│    Database     │ ← PostgreSQL
└─────────────────┘
```

### Key Architectural Decisions:
- **Service Layer**: Business logic separated from HTTP concerns
- **Custom Error Handling**: Operational vs programming error classification
- **Response Utilities**: Standardized API responses
- **Type Safety**: Comprehensive TypeScript interfaces for all data structures

## 🛠️ Tech Stack

### Core Technologies
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma Client

### Security & Authentication
- **JWT**: jsonwebtoken for token management
- **Password Hashing**: bcryptjs with 10 salt rounds
- **Rate Limiting**: express-rate-limit
- **CORS**: CORS middleware with origin validation

### Development Tools
- **TypeScript Compiler**: TSC for production builds
- **Development**: tsx for TypeScript execution
- **Validation**: express-validator with custom schemas

## 📁 Project Structure

```
src/
├── app.ts                              # Express application setup
├── configs/
│   ├── env.config.ts                   # Environment configuration
│   └── prisma.config.ts                # Prisma client setup
├── constants/
│   └── userRole.ts                     # User role enums
├── types/
│   ├── error.d.ts                      # Custom error interfaces
│   ├── express.d.ts                    # Express type extensions
│   └── token.d.ts                      # Token type definitions
├── utils/
│   ├── customErrors.ts                 # Custom error classes
│   ├── passwordHashing.ts              # Password utilities
│   ├── responseHandler.ts              # Standardized responses
│   ├── tokenGenerations.ts             # JWT token utilities
│   ├── tokenHashing.ts                 # Refresh token hashing
│   └── truncateIP.ts                   # IP privacy utilities
└── v1/
    ├── controllers/
    │   └── authentication/
    │       ├── admin.controller.ts      # Admin endpoint handlers
    │       ├── login.controller.ts      # Login request handling
    │       ├── logout.controller.ts     # Logout request handling
    │       ├── refresh.controller.ts    # Token refresh handling
    │       ├── register.controller.ts   # Registration handling
    │       └── user.controller.ts       # User endpoint handlers
    ├── middlewares/
    │   ├── auth.middleware.ts           # JWT authentication
    │   ├── error.middleware.ts          # Global error handling
    │   ├── rateLimiter.middleware.ts    # Rate limiting
    │   └── role.middleware.ts           # Role-based access control
    ├── routes/
    │   └── authentication.route.ts      # Authentication routes
    ├── services/
    │   └── authentication/
    │       ├── login.service.ts         # Login business logic
    │       ├── refresh.service.ts       # Token refresh logic
    │       └── register.service.ts      # Registration business logic
    └── validators/
        └── authValidationSchema.ts      # Input validation schemas
├── server.ts                           # Application entry point
├── package.json                        # Dependencies and scripts
├── tsconfig.json                       # TypeScript configuration
└── .example.env                        # Environment variables template
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** database
- **npm** or **yarn** package manager

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
   cp .example.env .env
   ```
   
   Configure your `.env` file:
   ```env
   NODE_ENV=DEVELOPMENT
   PORT=3000
   
   # Database URLs (Supabase or local PostgreSQL)
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   DIRECT_URL="postgresql://username:password@localhost:5432/database_name"
   
   # JWT Secrets (generate strong random strings)
   JWT_ACCESS_TOKEN_SECRET="your-strong-access-token-secret"
   JWT_REFRESH_TOKEN_SECRET="your-strong-refresh-token-secret"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev --name init
   
   # (Optional) Open Prisma Studio
   npx prisma studio
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3000`

### Production Deployment

```bash
# Build the application
npm run build

# Start production server
npm run prod
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1/auth
```

### Authentication Endpoints

#### Register User
```http
POST /register
Content-Type: application/json

{
  "email": "firstname.lastname.123456@umindanao.edu.ph",
  "password": "securepassword123"
}
```

**Validation Rules:**
- Email must match UMindanao format: `firstname.lastname.studentid@umindanao.edu.ph`
- Password minimum 8 characters

**Rate Limit:** 10 attempts per hour per IP

#### Login
```http
POST /
Content-Type: application/json

{
  "email": "user@umindanao.edu.ph",
  "password": "securepassword123"
}
```

**Rate Limit:** 5 attempts per 10 minutes per IP

#### Refresh Access Token
```http
POST /refresh
```
*Requires `refresh_token` cookie*

#### Logout
```http
POST /logout
```
*Requires `refresh_token` cookie*

#### Get User Profile
```http
GET /user
Authorization: Bearer <access_token>
```

#### Admin Access (Admin Only)
```http
GET /admin
Authorization: Bearer <access_token>
```

### Response Format

#### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "accessToken": "jwt_token_here",
    "user": {
      "id": "uuid",
      "email": "user@umindanao.edu.ph",
      "role": "ADMIN"
    }
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

#### Validation Error Response
```json
{
  "success": false,
  "message": [
    {
      "field": "email",
      "message": "Invalid Umindanao Email Address"
    }
  ]
}
```

## 🔐 Security Features

### Authentication Strategy
- **Access Tokens**: Short-lived (3 hours) JWT tokens for API access
- **Refresh Tokens**: Long-lived (7 days) tokens for seamless token renewal
- **Secure Cookies**: HttpOnly, Secure, SameSite strict cookies for refresh tokens
- **Token Rotation**: Refresh tokens are single-use and rotated on each refresh

### Password Security
- **Bcrypt Hashing**: Industry-standard password hashing with 10 salt rounds
- **Password Requirements**: Minimum 8 characters (configurable)

### Rate Limiting
- **Login Protection**: 5 attempts per 10 minutes per IP address
- **Registration Protection**: 10 attempts per hour per IP address
- **Configurable Limits**: Easy to adjust per endpoint

### Privacy Protection
- **IP Truncation**: IPv4 addresses truncated to /24 subnet for privacy
- **Device Tracking**: Secure user agent and device information storage
- **Token Validation**: Cross-reference IP and user agent for refresh tokens

### Advanced Security Features
- **Custom Error Classes**: Operational error tracking without exposing system details
- **Environment-based Responses**: Detailed errors in development, generic in production
- **Token Verification**: Multi-layer token validation with database cross-reference

## 🗄️ Database Schema

### User Table
```sql
user {
  id          String    @id @default(uuid())
  email       String    @unique
  first_name  String
  last_name   String
  password    String
  role        String
  last_login  DateTime? @default(now())
  is_active   Boolean   @default(true)
  is_verified Boolean   @default(false)
  is_deleted  Boolean   @default(false)
  verified_at DateTime?
  deleted_at  DateTime?
  created_at  DateTime  @default(now())
  updated_at  DateTime  @updatedAt
}
```

### Refresh Token Table
```sql
refresh_token {
  id         String    @id @default(uuid())
  user_id    String
  token      String    @unique
  ip_address String
  user_agent String
  device     String
  is_active  Boolean   @default(true)
  revoke_at  DateTime? @updatedAt
  expires_at DateTime
  created_at DateTime  @default(now())
  updated_at DateTime  @updatedAt
}
```

## 🎯 User Roles & Permissions

| Role | Description | Access Level |
|------|-------------|--------------|
| **ADMIN** | System administrators | Full system access |
| **MEMBER** | Regular users | Standard user operations |
| **GUEST** | Limited access users | Read-only operations |

## 🔧 Development

### Available Scripts

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm run prod

# Database operations
npx prisma studio          # Database GUI
npx prisma migrate dev      # Run migrations
npx prisma generate         # Generate client
```

### TypeScript Path Aliases

```typescript
// Available import aliases
import { } from "@/types/token"              // src/types/token
import { } from "@configs/prisma.config"     // src/configs/prisma.config
import { } from "@utils/customErrors"        // src/utils/customErrors
import { } from "@controllers/auth/login"    // src/v1/controllers/auth/login
import { } from "@middlewares/auth"          // src/v1/middlewares/auth
import { } from "@services/auth/login"       // src/v1/services/auth/login
import { } from "@validators/authSchema"     // src/v1/validators/authSchema
```

### Error Handling Best Practices

```typescript
// Custom error usage
import { AuthenticationError, ValidationError } from "@utils/customErrors";

// In services
if (!user) {
  throw new AuthenticationError("Invalid credentials");
}

// In controllers - errors are automatically handled by middleware
try {
  const result = await authService.login(email, password);
  return successResponse(res, 200, "Login successful", result);
} catch (error) {
  // Error middleware handles all custom errors
  next(error);
}
```

## 🌐 CORS Configuration

The API accepts requests from:
- `http://localhost:5173` (Vite development server)
- `http://localhost:3000` (React development server)

To add more origins, update the `allowedOrigins` array in `src/app.ts`.

## 📝 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | Yes | - |
| `PORT` | Server port | No | 3000 |
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `DIRECT_URL` | Direct PostgreSQL connection | Yes | - |
| `JWT_ACCESS_TOKEN_SECRET` | Access token signing secret | Yes | - |
| `JWT_REFRESH_TOKEN_SECRET` | Refresh token signing secret | Yes | - |

## 🚀 Deployment

### Production Checklist

1. **Environment Configuration**
   ```bash
   export NODE_ENV=PRODUCTION
   export PORT=3000
   # Set all required environment variables
   ```

2. **Database Setup**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

3. **Application Build**
   ```bash
   npm run build
   npm run prod
   ```

### Deployment Platforms

- **Railway**: Zero-config PostgreSQL + Node.js deployment
- **Vercel**: Serverless deployment with Vercel Postgres
- **Heroku**: Traditional PaaS deployment
- **DigitalOcean**: VPS deployment with managed PostgreSQL

## 🧪 Testing (Recommended)

While not implemented, consider adding:

```bash
# Recommended testing stack
npm install --save-dev jest @types/jest supertest @types/supertest

# Test structure
tests/
├── unit/
│   ├── services/
│   └── utils/
├── integration/
│   └── routes/
└── e2e/
    └── auth.test.ts
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Standards

- Follow TypeScript strict mode
- Use ESLint and Prettier for code formatting
- Write comprehensive JSDoc comments
- Follow the existing architectural patterns
- Add appropriate error handling

## 📄 License

This project is licensed under the ISC License.

## 👥 Author

**riomar0001** - [GitHub Profile](https://github.com/riomar0001)

## 🙏 Acknowledgments

- Built with [Express.js](https://expressjs.com/)
- Database powered by [Prisma](https://prisma.io/)
- Type safety with [TypeScript](https://typescriptlang.org/)
- Authentication via [JSON Web Tokens](https://jwt.io/)

---

For questions, issues, or contributions, please open an issue on GitHub.
