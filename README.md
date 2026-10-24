# TaskPilot: Task Reminder System

A simple Task Reminder System built with **Node.js, TypeScript, Express, PostgreSQL and Sequelize**. Users register, log in, create tasks with an optional reminder time, and a cron job fires each reminder once when its time arrives. A small React frontend is included in `client/`.

## Features

- Register and log in with JWT (Passport.js + bcrypt password hashing)
- Task CRUD where each user only sees and changes their own tasks
- Pagination and filtering: `GET /tasks?page=1&limit=10&done=false`
- Cron job (runs every minute) that sends due reminders once, using a `reminded` flag
- Database tables created with Sequelize migrations, with npm scripts for the database
- Swagger API docs at `/docs`
- ESLint, Prettier, Husky and lint-staged for clean commits

## Tech stack

Node.js, TypeScript, Express, PostgreSQL, Sequelize, Passport (JWT), bcrypt, node-cron, Swagger (swagger-jsdoc + swagger-ui-express). Frontend: React, Vite, TypeScript, react-hot-toast.

## Prerequisites

- Node.js 20 or newer (LTS)
- PostgreSQL 14 or newer, or Docker

## Setup

1. **Clone and install**

   ```bash
   git clone https://github.com/baskota-adarsha/Task-Reminder-System-using-node-js-typescript-
   cd Task-Reminder-System-using-node-js-typescript-
   npm install
   ```

2. **Start PostgreSQL** (skip this if you already have it running)

   ```bash
   docker run -d --name taskpilot-db -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:16
   ```

3. **Create your environment file**

   ```bash
   cp .env.example .env
   ```

   On Windows PowerShell use `copy .env.example .env`. Then open `.env` and fill in your values:

   | Variable        | Meaning                                | Example                       |
   | --------------- | -------------------------------------- | ----------------------------- |
   | `PORT`          | Port the API runs on                   | `3000`                        |
   | `DB_HOST`       | Database host                          | `localhost`                   |
   | `DB_PORT`       | Database port                          | `5432`                        |
   | `DB_USER`       | Database user                          | `postgres`                    |
   | `DB_PASS`       | Database password                      | `postgres`                    |
   | `DB_NAME`       | Database name                          | `taskpilot`                   |
   | `JWT_SECRET`    | Long random secret used to sign tokens | `change-me-to-something-long` |
   | `CLIENT_ORIGIN` | Frontend address allowed by CORS       | `http://localhost:5173`       |

4. **Create the database and tables**

   ```bash
   npm run db:create
   npm run db:migrate
   ```

5. **Run the app**
   ```bash
   npm run dev
   ```
   The API runs on http://localhost:3000 and the docs are at http://localhost:3000/docs

## Scripts

| Script               | What it does                               |
| -------------------- | ------------------------------------------ |
| `npm run dev`        | Start in development mode with auto-reload |
| `npm run build`      | Compile TypeScript to `dist/`              |
| `npm start`          | Run the compiled build                     |
| `npm run db:create`  | Create the database                        |
| `npm run db:migrate` | Run all pending migrations                 |
| `npm run db:undo`    | Undo the last migration                    |
| `npm run db:reset`   | Drop, recreate and migrate the database    |
| `npm run lint`       | Check code with ESLint                     |
| `npm run format`     | Format code with Prettier                  |

## API

Full interactive documentation is at **`/docs`** (Swagger UI). To try protected routes there, log in first, click **Authorize**, and paste the token (without the word `Bearer`).

| Method | Endpoint         | Auth | Description                          |
| ------ | ---------------- | ---- | ------------------------------------ |
| POST   | `/auth/register` | No   | Create an account                    |
| POST   | `/auth/login`    | No   | Log in and receive a JWT             |
| GET    | `/tasks`         | Yes  | List my tasks (paginated)            |
| POST   | `/tasks`         | Yes  | Create a task                        |
| GET    | `/tasks/:id`     | Yes  | Get one of my tasks                  |
| PATCH  | `/tasks/:id`     | Yes  | Update `title`, `remindAt` or `done` |
| DELETE | `/tasks/:id`     | Yes  | Delete a task                        |
| GET    | `/health`        | No   | Health check                         |

Protected routes need the header `Authorization: Bearer <token>`.

**Pagination and filters** (`GET /tasks`):

- `page` (default 1), `limit` (default 10, maximum 50)
- `done=true` or `done=false` to filter

**Example response:**

```json
{
  "data": [
    {
      "id": 1,
      "title": "Submit report",
      "remindAt": "2026-10-25T12:15:00.000Z",
      "reminded": false,
      "done": false,
      "userId": 1
    }
  ],
  "meta": { "total": 1, "page": 1, "limit": 10, "totalPages": 1 }
}
```

## How reminders work

1. A task can have a `remindAt` time.
2. A cron job runs every minute and finds tasks that are not done, not yet reminded, and whose `remindAt` time has passed.
3. For each one it sends the reminder (currently a console log) and sets `reminded = true`, so the same reminder is never sent twice.

Because the job runs once a minute, a reminder can arrive up to a minute after its exact time.

## Project structure

```
src/
  config/        database, passport, swagger
  controllers/   request handlers (auth, tasks)
  middlewares/   JWT auth, error handling
  models/        Sequelize models (User, Task)
  routes/        routes with Swagger comments
  services/      cron reminder job
  utils/         small helpers
  app.ts         Express app setup
  index.ts       server start
db/
  config.js      database settings for the Sequelize CLI
  migrations/    table definitions
client/          React frontend
```

## Frontend (React)

A small React + TypeScript (Vite) app in `client/`:

- Register and log in
- Add tasks with an optional reminder time, tick them done, delete them
- A toast pops up when a reminder time arrives, and stays until you close it
- A 🔔 badge shows on tasks the server has already reminded

Run it (the backend must already be running):

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173

## Security notes

- Passwords are hashed with bcrypt and never stored in plain text
- The owner of a task always comes from the verified JWT, never from the request body
- Every task query includes the user id, so users cannot access each other's tasks
- `.env` is not committed, and `.env.example` shows the variables needed
