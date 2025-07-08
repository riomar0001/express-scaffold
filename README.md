# Express TypeScript Authentication API

A robust, production-ready Express.js API built with TypeScript, featuring secure JWT-based authentication, role-based access control, and PostgreSQL database integration with Prisma ORM.

## 🚀 Features

- **Secure Authentication**: JWT-based authentication with access and refresh tokens
- **Role-Based Access Control**: Support for ADMIN, MEMBER, and GUEST roles
- **Password Security**: Bcrypt password hashing with salt rounds
- **Rate Limiting**: Built-in rate limiting for authentication endpoints
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **Token Management**: Secure refresh token rotation with device tracking
- **IP Truncation**: Privacy-focused IP address truncation for user tracking
- **Input Validation**: Express-validator for robust request validation
- **Error Handling**: Centralized error handling with custom error types
- **CORS Support**: Configurable CORS for cross-origin requests
- **TypeScript**: Full TypeScript support with strict type checking

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Rate Limiting**: express-rate-limit
- **Development**: tsx (TypeScript execution)

## 📁 Project Structure

```
├── src/
│   ├── app.ts                          # Express app configuration
│   ├── config/
│   │   └── prismaConfig.ts             # Prisma client configuration
│   ├── constants/
│   │   └── userRole.ts                 # User role enums
│   ├── types/
│   │   ├── error.d.ts                  # Custom error types
│   │   ├── express.d.ts                # Express interface extensions
│   │   └── token.d.ts                  # Token-related types
│   ├── utils/
│   │   ├── passwordHashing.ts          # Password hashing utilities
│   │   ├── tokenGenerations.ts         # JWT token generation
│   │   ├── tokenHashing.ts             # Refresh token hashing
│   │   └── truncateIP.ts               # IP address truncation
│   └── v1/
│       ├── controllers/
│       │   └── authentication/
│       │       ├── admin.controller.ts  # Admin-specific endpoints
│       │       ├── index.ts             # Controller exports
│       │       ├── login.controller.ts  # User authentication
│       │       ├── logout.controller.ts # User logout
│       │       ├── refresh.controller.ts # Token refresh
│       │       ├── register.controller.ts # User registration
│       │       └── user.controller.ts   # User-specific endpoints
│       ├── middlewares/
│       │   ├── auth.middleware.ts       # JWT authentication middleware
│       │   ├── error.middleware.ts      # Error handling middleware
│       │   ├── rateLimiter.middleware.ts # Rate limiting middleware
│       │   └── role.middleware.ts       # Role-based access control
│       ├── routes/
│       │   └── authentication.route.ts  # Authentication routes
│       └── validators/
│           └── authValidationSchema.ts  # Input validation schemas
├── prisma/
│   ├── schema.prisma                   # Database schema
│   └── migrations/                     # Database migrations
├── server.ts                           # Application entry point
├── package.json                        # Dependencies and scripts
├── tsconfig.json                       # TypeScript configuration
└── .example.env                        # Environment variables template
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
   cp .example.env .env
   ```
   
   Fill in your environment variables in `.env`:
   ```env
   NODE_ENV=DEVELOPMENT
   PORT=3000
   
   # Database connection strings
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   DIRECT_URL="postgresql://username:password@localhost:5432/database_name"
   
   # JWT secrets (generate strong random strings)
   JWT_ACCESS_TOKEN_SECRET="your-access-token-secret"
   JWT_REFRESH_TOKEN_SECRET="your-refresh-token-secret"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   
   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000`

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm run prod
```

## 📚 API Documentation

### Authentication Endpoints

All authentication endpoints are prefixed with `/api/v1/auth`

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user.name.123456@umindanao.edu.ph",
  "password": "securepassword123"
}
```

**Note**: Email validation enforces UMindanao email format: `firstname.lastname.studentid@umindanao.edu.ph`

#### Login
```http
POST /api/v1/auth/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Rate Limit**: 5 attempts per 10 minutes per IP

#### Refresh Token
```http
POST /api/v1/auth/refresh
```

**Note**: Requires `refresh_token` cookie

#### Logout
```http
POST /api/v1/auth/logout
```

**Note**: Requires `refresh_token` cookie

#### Get User Profile
```http
GET /api/v1/auth/user
Authorization: Bearer <access_token>
```

#### Admin Access (Admin Only)
```http
GET /api/v1/auth/admin
Authorization: Bearer <access_token>
```

### Response Format

#### Success Response
```json
{
  "message": "Operation successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "ADMIN"
  },
  "accessToken": "jwt_token_here"
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## 🔐 Security Features

### JWT Token Strategy
- **Access Tokens**: Short-lived (3 hours) for API access
- **Refresh Tokens**: Long-lived (7 days) for token renewal
- **Secure Cookies**: HttpOnly, Secure, SameSite cookies for refresh tokens

### Password Security
- **Bcrypt Hashing**: 10 salt rounds for password encryption
- **Minimum Requirements**: 8+ characters for passwords

### Rate Limiting
- **Authentication Endpoints**: 5 attempts per 10 minutes per IP
- **Configurable**: Easy to adjust limits per endpoint

### Privacy & Tracking
- **IP Truncation**: IPv4 addresses truncated to /24 subnet
- **Device Tracking**: User agent and device information stored
- **Token Revocation**: Active refresh token management

## 🗄️ Database Schema

### User Table
```sql
user {
  id         String   @id @default(uuid())
  email      String   @unique
  password   String
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
  last_login DateTime? @default(now())
  role       String
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

## 🎯 User Roles

- **ADMIN**: Full system access
- **MEMBER**: Standard user access
- **GUEST**: Limited access

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build for production
- `npm run prod` - Start production server
- `npx prisma studio` - Open Prisma Studio for database management
- `npx prisma migrate dev` - Run database migrations

### Path Aliases

The project uses TypeScript path aliases for cleaner imports:

- `@/*` - src/
- `@controllers/*` - src/v1/controllers/
- `@middlewares/*` - src/v1/middlewares/
- `@utils/*` - src/utils/
- `@routes/*` - src/v1/routes/
- `@validators/*` - src/v1/validators/

## 🌐 CORS Configuration

The API is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (React dev server)

Update the `allowedOrigins` array in `src/app.ts` to add more allowed origins.

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (DEVELOPMENT/PRODUCTION) | Yes |
| `PORT` | Server port | No (defaults to 5000) |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `DIRECT_URL` | Direct PostgreSQL connection | Yes |
| `JWT_ACCESS_TOKEN_SECRET` | Secret for access tokens | Yes |
| `JWT_REFRESH_TOKEN_SECRET` | Secret for refresh tokens | Yes |

## 🚀 Deployment

1. Set `NODE_ENV=PRODUCTION` in your environment
2. Ensure all environment variables are set
3. Run database migrations: `npx prisma migrate deploy`
4. Build the application: `npm run build`
5. Start the server: `npm run prod`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

**riomar0001**

---

For more information or support, please contact the development team.
