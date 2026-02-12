# Caldane Finance

A personal finance management web application for tracking income and expenses with categories and transactions.

## Features

- **User Authentication**: Google OAuth integration using NextAuth.js
- **Categories Management**: Create and manage spending (deficit) and income (profit) categories
  - Deficit categories: Always have monthly reconciliation period (e.g., Grocery, Bills)
  - Profit categories: Flexible reconciliation periods (bi-weekly, semi-monthly, monthly, yearly, one-time)
- **Transaction Tracking**: Add, view, and delete transactions associated with categories
- **Filtering**: Filter transactions by category
- **Responsive UI**: Clean, modern interface built with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Node.js 20+
- Docker and Docker Compose (for running with Docker)
- PostgreSQL (if running without Docker)
- Google OAuth credentials

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/caldane/caldane-finance.git
cd caldane-finance
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/caldane_finance"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

#### Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client ID
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your `.env` file

### 4. Run with Docker (Recommended)

Start the PostgreSQL database and the application:

```bash
docker-compose up -d
```

The database will be automatically set up, and migrations will run.

### 5. Run locally without Docker

Start PostgreSQL locally, then:

```bash
# Push database schema
npm run db:push

# Or run migrations
npm run db:migrate

# Start development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Usage

1. **Sign In**: Click "Sign in with Google" on the landing page
2. **Create Categories**: 
   - Click "Add Category" 
   - Enter name and select type (Profit/Deficit)
   - For profit categories, select reconciliation period
   - Deficit categories automatically use monthly reconciliation
3. **Add Transactions**:
   - Click "Add Transaction"
   - Select category, enter amount, optional description, and date
   - Click "Create"
4. **View & Filter**:
   - Click on a category to filter transactions
   - Click "All Categories" to view all transactions
5. **Delete**:
   - Click the delete icon (🗑️) next to any category or transaction

## Database Schema

### User
- Authentication and session management
- One-to-many relationships with Categories and Transactions

### Category
- `type`: PROFIT or DEFICIT
- `reconciliationPeriod`: BIWEEKLY, SEMIMONTHLY, MONTHLY, YEARLY, or ONETIME
- Constraint: DEFICIT categories must have MONTHLY period

### Transaction
- Linked to a Category and User
- Contains amount, description, and date

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Open Prisma Studio (database GUI)
npm run db:studio
```

## Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up -d --build
```

## License

MIT License - see LICENSE file for details
