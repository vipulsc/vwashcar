# VWashCar - Professional Car Wash Management System

A high-performance, production-ready car wash management system with real-time queue tracking, plate recognition, and comprehensive reporting.

## 🚀 Performance Optimizations

This application has been optimized for production performance with the following enhancements:

### Core Optimizations
- **Next.js 15** with App Router and Turbopack for faster development
- **React 19** with optimized rendering and memory management
- **SWC Minification** for faster builds and smaller bundles
- **Standalone Output** for optimized production deployments
- **Image Optimization** with WebP/AVIF support and automatic resizing

### Database Optimizations
- **Prisma Client** with connection pooling and query optimization
- **Database connection management** with graceful shutdown
- **Query caching** for frequently accessed data
- **Optimized database schema** with proper indexing

### API Performance
- **Request caching** with configurable TTL
- **Request timeouts** and error handling
- **Rate limiting** and request validation
- **Compression** enabled for all responses
- **CORS optimization** for cross-origin requests

### Frontend Optimizations
- **React.memo** for component memoization
- **useCallback** and **useMemo** for expensive operations
- **Debounced and throttled** user interactions
- **Optimized image capture** with quality settings
- **Lazy loading** for non-critical components

### Caching Strategy
- **In-memory caching** for API responses
- **Static asset caching** with immutable headers
- **Browser caching** optimization
- **CDN-ready** configuration

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vwashcar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:push
   npm run seed:users
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🚀 Production Deployment

### Automated Deployment
```bash
# Run the production deployment script
./scripts/deploy.sh

# For Docker deployment
./scripts/deploy.sh --docker
```

### Manual Deployment Steps

1. **Build for production**
   ```bash
   npm run build:prod
   ```

2. **Start production server**
   ```bash
   npm run start:prod
   ```

3. **Health check**
   ```bash
   ./health-check.sh
   ```

### Environment Configuration

Create `.env.production` with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# API Keys
PLATE_RECOGNIZER_API_KEY="your_api_key"

# Application
NODE_ENV="production"
NEXT_PUBLIC_BASE_URL="https://your-domain.com"

# Performance
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING="true"
NEXT_TELEMETRY_DISABLED="1"
```

## 📊 Performance Monitoring

The application includes built-in performance monitoring:

### Metrics Tracked
- **Load times** for pages and components
- **Render times** for React components
- **Memory usage** and garbage collection
- **API response times**
- **Database query performance**

### Monitoring Tools
```bash
# View performance metrics
npm run analyze

# Check application health
curl http://localhost:3000/api/health

# Monitor logs
tail -f logs/combined.log
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server with Turbopack
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run lint:fix        # Fix linting issues
npm run type-check      # Run TypeScript type checking

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema to database
npm run db:migrate      # Run database migrations
npm run db:studio       # Open Prisma Studio
npm run seed:users      # Seed initial users

# Performance
npm run analyze         # Analyze bundle size
npm run build:prod      # Production build
npm run start:prod      # Production start

# Deployment
./scripts/deploy.sh     # Automated deployment
./health-check.sh       # Health check
```

## 🏗️ Architecture

### Frontend
- **Next.js 15** with App Router
- **React 19** with concurrent features
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Backend
- **Next.js API Routes** for serverless functions
- **Prisma ORM** for database operations
- **PostgreSQL** for data storage
- **Plate Recognizer API** for license plate detection

### Performance Features
- **Server-side rendering** for better SEO
- **Static generation** for static pages
- **Incremental static regeneration** for dynamic content
- **Edge caching** for global performance
- **Image optimization** with automatic formats

## 📈 Performance Benchmarks

### Development
- **Build time**: ~30 seconds
- **Hot reload**: <1 second
- **Bundle size**: Optimized with tree shaking

### Production
- **First load**: <2 seconds
- **Subsequent loads**: <500ms (cached)
- **API response time**: <100ms average
- **Database queries**: <50ms average

## 🔒 Security Features

- **Input validation** on all API endpoints
- **Rate limiting** to prevent abuse
- **CORS configuration** for cross-origin requests
- **Environment variable** protection
- **Database connection** security
- **File upload** validation and size limits

## 🐳 Docker Deployment

```bash
# Build Docker image
docker build -t vwashcar .

# Run container
docker run -p 3000:3000 --env-file .env.production vwashcar

# Docker Compose
docker-compose up -d
```

## 📝 API Documentation

### Health Check
```bash
GET /api/health
```

### Plate Recognition
```bash
POST /api/upload
Content-Type: multipart/form-data
```

### Authentication
```bash
POST /api/auth/login
POST /api/auth/register
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the performance monitoring logs

## 🔄 Updates and Maintenance

### Regular Maintenance Tasks
- Monitor performance metrics
- Update dependencies regularly
- Review and optimize database queries
- Check for security updates
- Monitor error logs

### Performance Optimization Checklist
- [ ] Enable production mode
- [ ] Configure caching headers
- [ ] Optimize images and assets
- [ ] Monitor bundle size
- [ ] Set up performance monitoring
- [ ] Configure CDN (if applicable)
- [ ] Set up error tracking
- [ ] Monitor database performance
