# Caldane Finance - Setup & Development Guide

## Quick Start

### Prerequisites
- Node.js 20 or higher
- Docker and Docker Compose (recommended)
- OR PostgreSQL 16+ (if running without Docker)
- Google Cloud account for OAuth setup

### Option 1: Docker Setup (Recommended)

1. **Clone and Install**
   ```bash
   git clone https://github.com/caldane/caldane-finance.git
   cd caldane-finance
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Google OAuth credentials
   ```

3. **Get Google OAuth Credentials**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable Google+ API
   - Navigate to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: Web application
   - Authorized redirect URIs: 
     - `http://localhost:3000/api/auth/callback/google`
   - Copy Client ID and Client Secret to `.env`

4. **Start the Application**
   ```bash
   docker-compose up -d
   ```

5. **Initialize Database**
   ```bash
   # Run migrations
   npm run db:push
   
   # Or create a migration
   npm run db:migrate
   ```

6. **Access the Application**
   - Open http://localhost:3000
   - Sign in with your Google account

### Option 2: Local Development (Without Docker)

1. **Install and Configure**
   ```bash
   git clone https://github.com/caldane/caldane-finance.git
   cd caldane-finance
   npm install
   cp .env.example .env
   # Edit .env with your database URL and Google OAuth credentials
   ```

2. **Start PostgreSQL**
   ```bash
   # macOS (with Homebrew)
   brew services start postgresql@16
   
   # Ubuntu/Debian
   sudo systemctl start postgresql
   
   # Create database
   createdb caldane_finance
   ```

3. **Setup Database**
   ```bash
   npm run db:push
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Environment Variables

```env
# Database - PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/caldane_finance"

# NextAuth.js - Authentication configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Google OAuth - Get from Google Cloud Console
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

### Generate Secure Secret
```bash
openssl rand -base64 32
```

## Database Management

### Prisma Commands

```bash
# Push schema changes (development)
npm run db:push

# Create a migration (production-ready)
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio

# Generate Prisma Client
npx prisma generate

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

### Database Schema Overview

```
User
├── id (cuid)
├── email (unique)
├── name
├── Categories[]
└── Transactions[]

Category
├── id (cuid)
├── name (unique per user)
├── type (PROFIT | DEFICIT)
├── reconciliationPeriod (BIWEEKLY | SEMIMONTHLY | MONTHLY | YEARLY | ONETIME)
├── userId
└── Transactions[]

Transaction
├── id (cuid)
├── amount (Float)
├── description
├── date
├── categoryId
└── userId
```

## Development Workflow

### Running the App

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build
npm start

# Lint code
npm run lint
```

### Creating Categories

**Deficit Categories (Spending)**
- Type: DEFICIT
- Reconciliation: Always MONTHLY
- Examples: Grocery, Bills, Rent, Entertainment

**Profit Categories (Income)**
- Type: PROFIT
- Reconciliation: Choose from:
  - BIWEEKLY: Every 2 weeks
  - SEMIMONTHLY: Twice per month (1st and 15th)
  - MONTHLY: Once per month
  - YEARLY: Annual income
  - ONETIME: One-time payment
- Examples: Paycheck (bi-weekly), Bonus (one-time)

### API Validation Rules

1. **Category Creation**
   - DEFICIT categories automatically get MONTHLY reconciliation
   - PROFIT categories must specify a reconciliation period
   - Category names must be unique per user

2. **Transactions**
   - Amount must be non-zero
   - Must belong to an existing category
   - Date defaults to current date if not provided

## Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f app
docker-compose logs -f db

# Rebuild and restart
docker-compose up -d --build

# Execute commands in container
docker-compose exec app npm run db:push
docker-compose exec db psql -U postgres caldane_finance
```

## Production Deployment

### Environment Setup

1. Use a managed PostgreSQL service (AWS RDS, Google Cloud SQL, etc.)
2. Generate a strong `NEXTAUTH_SECRET`
3. Set `NEXTAUTH_URL` to your production domain
4. Update Google OAuth redirect URIs to include production domain

### Build & Deploy

```bash
# Build production image
docker build -t caldane-finance .

# Or use docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

### Security Considerations

- Never commit `.env` file to version control
- Use environment variables or secrets management for sensitive data
- Enable HTTPS in production
- Set appropriate CORS policies
- Regularly update dependencies
- Monitor for security vulnerabilities with `npm audit`

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker-compose ps
# or
pg_isready

# Verify DATABASE_URL format
echo $DATABASE_URL

# Test connection
npx prisma db execute --stdin <<< 'SELECT 1;'
```

### OAuth Issues

1. Verify redirect URIs in Google Cloud Console match your app
2. Check CLIENT_ID and CLIENT_SECRET are correct
3. Ensure NEXTAUTH_URL matches your domain
4. Clear browser cookies and try again

### Build Failures

```bash
# Clear Next.js cache
rm -rf .next

# Regenerate Prisma Client
npx prisma generate

# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Project Structure

```
caldane-finance/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth endpoints
│   │   ├── categories/   # Category CRUD
│   │   └── transactions/ # Transaction CRUD
│   ├── auth/             # Auth pages
│   ├── components/       # React components
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home/Dashboard
│   └── providers.tsx     # Session provider
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   └── prisma.ts         # Prisma client
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeding
├── docker-compose.yml    # Docker services
├── Dockerfile            # App container
└── README.md             # Main documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details
