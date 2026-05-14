# Link Shortener API

A REST API that shortens URLs and redirects users via unique short codes. Built with NestJS, TypeScript, and PostgreSQL.

## Tech Stack

- **Runtime** — Node.js
- **Framework** — NestJS (TypeScript)
- **Database** — PostgreSQL + Drizzle ORM
- **Validation** — class-validator / class-transformer
- **Testing** — Vitest + @nestjs/testing
- **Auth** — JWT (access tokens via @nestjs/jwt + Passport)

## Features

- Shorten any URL to a 6-character code
- Redirect to the original URL via the short code
- Input validation (rejects invalid URLs)
- JWT authentication — only authenticated users can create links
- Unit tests for controller and service layers

## Prerequisites

- Node.js 20+
- PostgreSQL
- pnpm

## Setup

1. **Clone and install dependencies**

```bash
git clone https://github.com/your-username/link-shortener.git
cd link-shortener
pnpm install
```

2. **Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your database credentials.

3. **Run database migrations**

```bash
pnpm drizzle-kit migrate
```

4. **Start the server**

```bash
# Development
pnpm start:dev

# Production
pnpm build && pnpm start:prod
```

## Environment Variables

| Variable       | Description                                         | Example                                              |
| -------------- | --------------------------------------------------- | ---------------------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string                        | `postgresql://user:pass@localhost:5432/shortener_db` |
| `JWT_SECRET`   | Secret key for signing JWT tokens                   | `your-secret-key`                                    |
| `PORT`         | Port the server listens on (optional, default 3000) | `3000`                                               |

## API Endpoints

### Auth

| Method | Endpoint         | Description          | Auth required |
| ------ | ---------------- | -------------------- | ------------- |
| `POST` | `/auth/register` | Create an account    | No            |
| `POST` | `/auth/login`    | Login, returns a JWT | No            |

### Links

| Method | Endpoint       | Description                  | Auth required |
| ------ | -------------- | ---------------------------- | ------------- |
| `POST` | `/links`       | Shorten a URL                | Yes           |
| `GET`  | `/links/:code` | Redirect to the original URL | No            |

### Examples

**Shorten a URL**

```bash
curl -X POST http://localhost:3000/links \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{ "url": "https://example.com/very/long/url" }'
```

```json
{
  "id": 1,
  "url": "https://example.com/very/long/url",
  "shortCode": "ab3x9z",
  "createdAt": "2026-05-14T10:00:00.000Z"
}
```

**Redirect**

```bash
curl -L http://localhost:3000/links/ab3x9z
# → 302 redirect to https://example.com/very/long/url
```

## Running Tests

```bash
# Unit tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:cov
```

## Project Structure

```
src/
├── auth/           # JWT strategy, guards, login/register
├── db/             # Drizzle connection and schema
├── links/          # Link shortener module (controller, service, DTO)
└── main.ts         # Entry point
```
