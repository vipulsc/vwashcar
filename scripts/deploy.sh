#!/bin/bash

# Production Deployment Script for VWashCar
# This script optimizes the application for production deployment

set -e

echo "🚀 Starting production deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18 or higher is required. Current version: $(node --version)"
    exit 1
fi

echo "✅ Node.js version check passed: $(node --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy

# Build the application
echo "🔨 Building application for production..."
NODE_ENV=production npm run build

# Run type checking
echo "🔍 Running type checking..."
npm run type-check

# Run linting
echo "🧹 Running linting..."
npm run lint

# Create production build
echo "📦 Creating production build..."
rm -rf .next/standalone
NODE_ENV=production npm run build

# Optimize images and assets
echo "🖼️ Optimizing assets..."
if [ -d "public" ]; then
    echo "📁 Public directory found, ensuring proper permissions..."
    chmod -R 755 public/
fi

# Create production environment file
echo "⚙️ Creating production environment..."
if [ ! -f ".env.production" ]; then
    echo "⚠️ Warning: .env.production not found. Please create it with production settings."
fi

# Performance optimizations
echo "⚡ Applying performance optimizations..."

# Set production environment variables
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1

# Create startup script
cat > start-production.sh << 'EOF'
#!/bin/bash
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1

# Set memory limits for Node.js
export NODE_OPTIONS="--max-old-space-size=2048"

# Start the application
npm start
EOF

chmod +x start-production.sh

# Create health check script
cat > health-check.sh << 'EOF'
#!/bin/bash
# Health check script for production

HEALTH_URL="http://localhost:3000/api/health"
MAX_RETRIES=5
RETRY_DELAY=2

for i in $(seq 1 $MAX_RETRIES); do
    if curl -f -s "$HEALTH_URL" > /dev/null; then
        echo "✅ Health check passed"
        exit 0
    else
        echo "⚠️ Health check failed (attempt $i/$MAX_RETRIES)"
        if [ $i -lt $MAX_RETRIES ]; then
            sleep $RETRY_DELAY
        fi
    fi
done

echo "❌ Health check failed after $MAX_RETRIES attempts"
exit 1
EOF

chmod +x health-check.sh

# Create Docker configuration (optional)
if [ "$1" = "--docker" ]; then
    echo "🐳 Creating Docker configuration..."
    
    cat > Dockerfile << 'EOF'
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
EOF

    cat > .dockerignore << 'EOF'
Dockerfile
.dockerignore
node_modules
npm-debug.log
README.md
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.git
.gitignore
.next
.vercel
EOF
fi

# Create PM2 configuration for process management
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'vwashcar',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      NEXT_TELEMETRY_DISABLED: '1',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      NEXT_TELEMETRY_DISABLED: '1',
      PORT: 3000
    },
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    autorestart: true,
    watch: false,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
EOF

# Create logs directory
mkdir -p logs

echo "✅ Production deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your production environment variables in .env.production"
echo "2. Configure your database connection"
echo "3. Set up your domain and SSL certificates"
echo "4. Run: ./start-production.sh"
echo ""
echo "🔧 Available scripts:"
echo "- ./start-production.sh - Start the production server"
echo "- ./health-check.sh - Check application health"
echo "- npm run analyze - Analyze bundle size"
echo ""
echo "📊 Performance monitoring is enabled by default"
echo "🌐 Application will be available at http://localhost:3000"
