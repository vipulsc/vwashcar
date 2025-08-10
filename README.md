# VWashCar - Professional Car Wash Management System

A comprehensive car wash management system with real-time queue tracking, plate recognition, and comprehensive reporting. Built with Next.js, TypeScript, Prisma, and PostgreSQL.

## Features

- 🔐 **JWT Authentication** with role-based access control
- 🏢 **Multi-site Management** for car wash locations
- 👥 **User Management** with Super Admin, Admin, and Salesman roles
- 🚗 **Booking System** with real-time status tracking
- 💰 **Revenue Tracking** with detailed analytics
- 📊 **Dashboard** with real-time statistics
- 🎯 **Plate Recognition** integration
- 📱 **Responsive Design** for all devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT with HTTP-only cookies
- **Deployment**: Vercel-ready

## Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn package manager

## Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd vwashcar
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file and configure it:

```bash
cp env.example .env.local
```

Update the following variables in `.env.local`:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/vwashcar"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Plate Recognition API (optional)
PLATE_RECOGNIZER_API_KEY="your_plate_recognizer_api_key"

# Application Configuration
NODE_ENV="development"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 4. Set up the database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database with initial data
npm run seed:db
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Login Credentials

After running the seed script, you can log in with these credentials:

### Super Admin

- **Email**: admin@vwashcar.com
- **Password**: admin123
- **Access**: Full system access, can manage all sites, users, and services

### Site Admins

- **Downtown Manager**: downtown@vwashcar.com / admin123
- **Mall Manager**: mall@vwashcar.com / admin123
- **Access**: Manage their assigned sites and salesmen

### Salesmen

- **John Salesman**: sales1@vwashcar.com / sales123
- **Jane Saleswoman**: sales2@vwashcar.com / sales123
- **Access**: Create and manage bookings for their assigned sites

## Project Structure

```
vwashcar/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── bookings/      # Booking management
│   │   ├── services/      # Service management
│   │   ├── sites/         # Site management
│   │   ├── stats/         # Statistics and analytics
│   │   └── users/         # User management
│   ├── sales/             # Sales interface
│   ├── superadmin/        # Super admin dashboard
│   └── login/             # Login page
├── lib/                   # Utility libraries
│   ├── auth.ts           # JWT authentication utilities
│   ├── prisma.ts         # Prisma client configuration
│   └── hooks/            # React hooks
├── prisma/               # Database schema and migrations
├── scripts/              # Database seeding scripts
└── public/               # Static assets
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Sites Management

- `GET /api/sites` - Get all sites
- `POST /api/sites` - Create new site
- `GET /api/sites/[id]` - Get specific site
- `PUT /api/sites/[id]` - Update site
- `DELETE /api/sites/[id]` - Delete site

### Services Management

- `GET /api/services` - Get all services
- `POST /api/services` - Create new service
- `GET /api/services/[id]` - Get specific service
- `PUT /api/services/[id]` - Update service
- `DELETE /api/services/[id]` - Delete service

### Bookings Management

- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/[id]` - Get specific booking
- `PUT /api/bookings/[id]` - Update booking
- `DELETE /api/bookings/[id]` - Delete booking

### User Management

- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/users/[id]` - Get specific user
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Statistics

- `GET /api/stats` - Get dashboard statistics

## Database Schema

The application uses a PostgreSQL database with the following main entities:

- **Users**: Super admins, admins, and salesmen
- **Sites**: Car wash locations
- **Services**: Available car wash services with pricing
- **Bookings**: Customer appointments and transactions
- **Revenue**: Daily revenue tracking per site and service

## Authentication & Authorization

The application uses JWT tokens stored in HTTP-only cookies for security. Role-based access control is implemented:

- **SUPER_ADMIN**: Full system access
- **ADMIN**: Manage assigned sites and salesmen
- **SALESMAN**: Create and manage bookings for assigned sites

## Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:migrate       # Run database migrations
npm run db:studio        # Open Prisma Studio
npm run db:reset         # Reset database

# Seeding
npm run seed:db          # Seed database with initial data
npm run seed:users       # Seed users only

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run type-check       # Run TypeScript type checking
```

### Environment Variables

See `env.example` for all available environment variables.

## Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the application: `npm run build`
2. Start the production server: `npm run start`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team.
