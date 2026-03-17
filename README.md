# Job Portal

A full-stack job portal project with a Next.js frontend and multiple Node.js/TypeScript backend services.

## Repository Structure

```text
.
|-- fronend/          # Next.js frontend
`-- services/
    |-- auth/         # Authentication and user registration
    |-- job/          # Job, company, and application management
    |-- user/         # User profile APIs
    `-- utils/        # Media upload, email, and helper services
```

Note: the frontend folder is currently named `fronend` in this repository.

## Tech Stack

- Frontend: Next.js 16, React 19, TypeScript
- Backend: Express, TypeScript, Node.js
- Database: Neon/PostgreSQL
- Messaging and caching: Kafka, Redis
- Media and email: Cloudinary, Nodemailer

## Services

### Frontend

- Path: `fronend`
- Runs the web application
- Scripts:
  - `npm run dev`
  - `npm run build`
  - `npm run start`

### Auth Service

- Path: `services/auth`
- Default port: `3001`
- Responsibilities:
  - register and login
  - password reset flow
  - Redis-backed token/session helpers
  - initializes auth-related database tables

### User Service

- Path: `services/user`
- Default port: `3002`
- Responsibilities:
  - user profile APIs
  - resume/profile update flows

### Job Service

- Path: `services/job`
- Default port: `3003`
- Responsibilities:
  - company management
  - job posting
  - job applications
  - initializes job-related database tables

### Utils Service

- Path: `services/utils`
- Default port: `3005`
- Responsibilities:
  - media uploads
  - email/Kafka consumer workflows
  - helper integrations including Cloudinary and Gemini

## Environment Variables

The services read configuration from `.env` files. Based on the current codebase, you will likely need these values:

```env
# Shared / backend
PORT=
DB=
JWT_SECRET=
KAFKA_BROKER=

# Auth service
REDIS_URL=
UTILS_SERVICE_URL=
FRONTEND_URL=

# User / Job services
MEDIA_SERVICE_URL=

# Utils service
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SMTP_USER=
SMTP_PASS=
API_KEY_GEMINI=
```

## Getting Started

### 1. Install dependencies

Install dependencies in each app separately:

```bash
cd fronend && npm install
cd ../services/auth && npm install
cd ../job && npm install
cd ../user && npm install
cd ../utils && npm install
```

### 2. Configure environment files

Create `.env` files for each backend service and add the required values for your local environment.

### 3. Start the applications

Run each service in a separate terminal:

```bash
cd fronend && npm run dev
cd services/auth && npm run dev
cd services/user && npm run dev
cd services/job && npm run dev
cd services/utils && npm run dev
```

## Notes

- Several service packages currently include `node_modules` and build output folders in the working tree; the root `.gitignore` now excludes them.
- The backend services do not currently expose a single root workspace script, so each service is started independently.
