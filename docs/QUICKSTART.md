# Quick Start Guide

This guide will help you get the KBeen Backend up and running quickly.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** v13 or higher ([Download](https://www.postgresql.org/download/))
- **Redis** v6 or higher ([Download](https://redis.io/download))
- **MQTT Broker** (e.g., Mosquitto) ([Download](https://mosquitto.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Papyjuloo/kbeen_backend.git
cd kbeen_backend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- AdonisJS framework
- Database drivers (PostgreSQL)
- Stripe SDK
- MQTT client
- QR code library
- And more...

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure the following:

#### Application Settings
```env
PORT=3333
HOST=0.0.0.0
NODE_ENV=development
APP_KEY=generate_using_next_step
APP_NAME=kbeen-backend
```

#### Database Configuration
```env
DB_CONNECTION=pg
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_DATABASE=kbeen
```

#### Redis Configuration
```env
REDIS_CONNECTION=local
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
```

#### Stripe Configuration
Get your keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys):
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### MQTT Configuration
```env
MQTT_BROKER_URL=mqtt://localhost:1883
MQTT_CLIENT_ID=kbeen-backend
MQTT_USERNAME=
MQTT_PASSWORD=
MQTT_TOPIC_PREFIX=kbeen
```

#### QR Code Configuration
```env
QR_CODE_BASE_URL=http://localhost:3333
QR_CODE_ERROR_CORRECTION=M
```

### 4. Generate Application Key

```bash
node ace generate:key
```

Copy the generated key and paste it into your `.env` file as `APP_KEY`.

### 5. Set Up Database

Create a PostgreSQL database:

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE kbeen;

# Exit PostgreSQL
\q
```

Run migrations to create tables:

```bash
node ace migration:run
```

You should see output like:
```
❯ Executing migrations
  ❯ 1_create_users_table.ts
  ❯ 2_create_resources_table.ts
  ❯ 3_create_reservations_table.ts
  ❯ 4_create_payments_table.ts
  ❯ 5_create_qr_code_scans_table.ts
  ❯ 6_create_iot_devices_table.ts
  ❯ 7_create_iot_telemetry_table.ts
  ❯ 8_create_iot_logs_table.ts
✔ Migrated in 245ms
```

### 6. Start Redis (if not running)

```bash
# On macOS/Linux
redis-server

# On Windows (if installed via WSL)
sudo service redis-server start
```

### 7. Start MQTT Broker (if not running)

```bash
# On macOS (via Homebrew)
brew services start mosquitto

# On Linux
sudo systemctl start mosquitto

# On Windows
net start mosquitto
```

### 8. Start the Development Server

```bash
npm run dev
```

You should see:
```
[ info ]  starting http server...
[ info ]  http server started on http://0.0.0.0:3333
```

### 9. Test the API

Open your browser or use curl:

```bash
curl http://localhost:3333/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

## Next Steps

### Create Your First User

```bash
curl -X POST http://localhost:3333/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePass123!",
    "name": "Admin User",
    "phone": "+1234567890"
  }'
```

### Login

```bash
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePass123!"
  }'
```

Save the returned token for authenticated requests.

### Create a Resource (requires database seeding or manual insert)

First, manually add a resource to the database or create a seed file.

### Make Your First Reservation

```bash
curl -X POST http://localhost:3333/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "resourceId": 1,
    "startTime": "2024-01-20T10:00:00Z",
    "endTime": "2024-01-20T12:00:00Z",
    "numberOfPeople": 2,
    "notes": "Team meeting"
  }'
```

## Recommended Development Tools

### API Testing
- **Postman** - [Download](https://www.postman.com/downloads/)
- **Insomnia** - [Download](https://insomnia.rest/download)
- **Thunder Client** (VS Code Extension)

### Database Management
- **pgAdmin** - [Download](https://www.pgadmin.org/download/)
- **DBeaver** - [Download](https://dbeaver.io/download/)
- **TablePlus** - [Download](https://tableplus.com/)

### MQTT Testing
- **MQTT Explorer** - [Download](http://mqtt-explorer.com/)
- **MQTTX** - [Download](https://mqttx.app/)

### VS Code Extensions
- ESLint
- Prettier
- AdonisJS
- PostgreSQL
- REST Client

## Common Issues & Solutions

### Issue: "Migration failed: relation already exists"

**Solution**: Drop the database and recreate it:
```bash
node ace migration:rollback
node ace migration:run
```

### Issue: "Cannot connect to PostgreSQL"

**Solution**: Check if PostgreSQL is running:
```bash
# macOS
brew services list

# Linux
sudo systemctl status postgresql

# Windows
# Check services.msc
```

### Issue: "MQTT connection refused"

**Solution**: Ensure Mosquitto is running:
```bash
# Check if Mosquitto is running
mosquitto -v

# Or start as a service
sudo systemctl start mosquitto
```

### Issue: "Stripe webhook signature verification failed"

**Solution**: Use Stripe CLI for local testing:
```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Forward webhooks to local server
stripe listen --forward-to localhost:3333/api/payments/webhook
```

### Issue: Port 3333 already in use

**Solution**: Change the port in `.env`:
```env
PORT=4000
```

Or kill the process using port 3333:
```bash
# macOS/Linux
lsof -ti:3333 | xargs kill -9

# Windows
netstat -ano | findstr :3333
taskkill /PID <PID> /F
```

## Development Workflow

### Making Changes

1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes

3. Run linter:
```bash
npm run lint
```

4. Format code:
```bash
npm run format
```

5. Run tests (when implemented):
```bash
npm test
```

6. Commit changes:
```bash
git add .
git commit -m "feat: your feature description"
```

7. Push to remote:
```bash
git push origin feature/your-feature-name
```

### Creating Migrations

```bash
node ace make:migration create_new_table
```

### Creating Models

```bash
node ace make:model ModelName
```

### Creating Controllers

```bash
node ace make:controller ControllerName
```

## Useful Commands

```bash
# Development
npm run dev              # Start dev server with hot reload

# Building
npm run build           # Build for production

# Testing
npm test               # Run tests
npm run test:watch     # Run tests in watch mode

# Code Quality
npm run lint           # Lint code
npm run lint:fix       # Fix linting issues
npm run format         # Format code with Prettier

# Database
node ace migration:run        # Run migrations
node ace migration:rollback   # Rollback last batch
node ace migration:refresh    # Rollback all and re-run
node ace migration:reset      # Rollback all migrations
node ace db:seed             # Run seeders

# Generate
node ace generate:key         # Generate APP_KEY
node ace make:migration name  # Create migration
node ace make:model name      # Create model
node ace make:controller name # Create controller
```

## Production Deployment Checklist

- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Generate a secure `APP_KEY`
- [ ] Use strong database credentials
- [ ] Configure production database
- [ ] Set up Redis for session storage
- [ ] Configure CORS for your domain
- [ ] Set up SSL/TLS certificates
- [ ] Configure production MQTT broker
- [ ] Set up Stripe production keys
- [ ] Enable rate limiting
- [ ] Set up logging and monitoring
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline
- [ ] Run security audit: `npm audit`
- [ ] Test all endpoints in production-like environment

## Getting Help

- **Documentation**: Check `/docs` folder
- **Issues**: [GitHub Issues](https://github.com/Papyjuloo/kbeen_backend/issues)
- **AdonisJS Docs**: [https://adonisjs.com](https://adonisjs.com)

## License

MIT License - See LICENSE file for details
