# NexBank - Database Setup with Prisma

## 🗄️ Database Configuration

This project uses **PostgreSQL** (Neon Database) with **Prisma ORM** for data management.

### Database Connection
- **Provider**: PostgreSQL (Neon)
- **Connection**: Pooled connection with SSL
- **Location**: Singapore (ap-southeast-1)

## 📊 Database Schema

### Tables Created

1. **users** - User authentication and profile
2. **profiles** - Extended user information (personal details, address, nominee)
3. **kyc** - KYC verification documents (Aadhaar, PAN)
4. **accounts** - Bank accounts (savings, current)
5. **transactions** - All financial transactions
6. **cards** - Debit and credit cards
7. **loans** - Loan applications and management
8. **investments** - FDs, RDs, and mutual funds
9. **notifications** - User notifications

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
The `.env` file is already configured with:
```env
DATABASE_URL="postgresql://neondb_owner:npg_ZFQkc2LREpe1@ep-dawn-paper-a18u8g2n-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="nexbank-secret-key-change-in-production-2024"
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Push Schema to Database
```bash
npx prisma db push
```

### 5. Seed Database with Demo Data
```bash
npm run db:seed
```

**Demo Credentials:**
- **User**: john@example.com / password123
- **Admin**: admin@bank.com / admin123

### 6. Open Prisma Studio (Database GUI)
```bash
npx prisma studio
```
Access at: http://localhost:5555

## 📁 Project Structure

```
banking/
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   └── migrations/            # Database migrations (if using migrate)
├── lib/
│   └── prisma.ts             # Prisma client instance
├── app/
│   └── api/
│       ├── auth/
│       │   ├── register/route.ts    # User registration
│       │   └── login/route.ts       # User login with JWT
│       ├── onboarding/route.ts      # Account opening
│       ├── transactions/route.ts    # Transaction processing
│       └── accounts/route.ts        # Account management
├── .env                       # Environment variables
└── prisma.config.ts          # Prisma 7 configuration
```

## 🔐 API Endpoints

### Authentication
- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login with email/password

### Onboarding
- **POST** `/api/onboarding` - Complete account opening process

### Transactions
- **POST** `/api/transactions` - Create new transaction
- **GET** `/api/transactions?userId=xxx` - Get user transactions

### Accounts
- **GET** `/api/accounts?userId=xxx` - Get user accounts

## 📝 Usage Examples

### Register User
```javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe',
    phone: '+919876543210'
  })
})
```

### Login
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
})
```

### Create Transaction (Payment Gateway)
```javascript
const response = await fetch('/api/transactions', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    userId: 'user-id',
    amount: 1000,
    description: 'Payment for services',
    paymentMethod: 'card',
    type: 'payment'
  })
})
```

## 🛠️ Prisma Commands

### Generate Client
```bash
npx prisma generate
```

### Push Schema Changes
```bash
npx prisma db push
```

### Create Migration
```bash
npx prisma migrate dev --name migration_name
```

### Reset Database
```bash
npx prisma db push --force-reset
```

### Open Prisma Studio
```bash
npx prisma studio
```

### Format Schema
```bash
npx prisma format
```

## 🔍 Database Schema Details

### User Model
- Email-based authentication
- Role-based access (user, admin, agent)
- Linked to profile, KYC, accounts, transactions

### Account Model
- Account number auto-generated
- Balance tracking with Decimal precision
- Interest rate for savings accounts
- Status management (active, frozen, closed)

### Transaction Model
- Complete transaction history
- Support for transfers between accounts
- Payment gateway integration
- Reference ID for tracking

### KYC Model
- Aadhaar and PAN verification
- Approval workflow
- One-to-one relationship with User

## 🔒 Security Features

- Passwords hashed with bcrypt
- JWT token-based authentication
- Secure database connection with SSL
- Environment variables for sensitive data
- SQL injection protection via Prisma

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Neon Database](https://neon.tech/docs)

## 🤝 Support

For issues or questions:
1. Check Prisma logs: `npx prisma studio`
2. View database in Prisma Studio
3. Check API responses in browser dev tools
4. Review server logs in terminal

## ℹ️ Important Notes

- **Prisma Version**: Using Prisma 5.x for stability
- **Database**: PostgreSQL (Neon) with SSL connection
- **Seeded Data**: Includes demo user (john@example.com) with transactions, cards, loans, and investments

---

**Database Status**: ✅ Connected and Ready  
**Tables Created**: 9 tables  
**API Endpoints**: 5 routes ready  
**Prisma Version**: 5.22.0  
**Demo Data**: ✅ Seeded
