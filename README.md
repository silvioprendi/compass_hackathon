# Compass Backend

A NestJS backend application with TypeORM and PostgreSQL.

## Features

- User authentication (registration & login)
- Password hashing with bcrypt
- TypeORM migrations
- PostgreSQL database
- RESTful API

## Prerequisites

- Node.js (v18+)
- pnpm
- PostgreSQL
- Docker (optional, for running database)

## Setup

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your database credentials:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5433
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_NAME=compass_db
   ```

3. **Start database** (using Docker Compose)
   ```bash
   docker-compose up -d
   ```

4. **Run migrations**
   ```bash
   pnpm migration:run       # Apply migrations
   ```

## Development

```bash
pnpm run dev  # Start in watch mode
```

Application runs on `http://localhost:5000`

## API Endpoints

### Users
- `POST /users` - Create user
- `POST /users/login` - Login user
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## Database Migrations

```bash
pnpm migration:generate  # Auto-generate migration from entity changes
pnpm migration:run       # Run pending migrations
pnpm migration:revert    # Revert last migration
```

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Validation**: class-validator
- **Password Hashing**: bcrypt