# Badminton Tournament Registration System

Next.js full-stack app for badminton tournament registration, applicant self-service, admin review, document download, and Player Badge PDF generation.

## Stack

- Next.js App Router
- Prisma 7 + PostgreSQL
- Supabase PostgreSQL + Supabase Storage
- Vercel deployment
- Vitest for critical business rules

## Local Setup

```bash
nvm use
npm install
cp .env.example .env
npm run db:push
npm run dev
```

Open `http://localhost:3000/apply`.

## Environment Variables

Set these in `.env` locally and in Vercel Project Settings:

```bash
DATABASE_URL="postgresql://postgres:YOUR_DB_PASSWORD@db.YOUR_SUPABASE_PROJECT_REF.supabase.co:5432/postgres?schema=public"
SESSION_SECRET="replace-with-a-long-random-production-secret"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="replace-before-deploy"
TOURNAMENT_NAME="Bangkok Badminton Open 2026"
REGISTRATION_CLOSE_AT="2026-06-30T16:59:59.000Z"
SUPABASE_URL="https://YOUR_SUPABASE_PROJECT_REF.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"
SUPABASE_BUCKET_NAME="badminton-bucket"
```

For Supabase passwords with special characters, URL-encode them in `DATABASE_URL`. Uploaded documents are stored in the Supabase Storage bucket named `badminton-bucket`.

## Main Routes

- `/apply` applicant registration with multi-file upload
- `/login` applicant login with Reference Code + password
- `/registration` applicant edit page
- `/admin/login` admin login from env credentials
- `/admin` admin registration list
- `/admin/registrations/[id]` full registration detail and document links
- `/api/admin/registrations/[id]/badge` Player Badge PDF download

## Deploy

1. Create a Supabase PostgreSQL project.
2. Create a private Supabase Storage bucket named `badminton-bucket`.
3. Add `DATABASE_URL`, Supabase Storage env vars, and other env vars in Vercel.
4. Connect this GitHub repo to Vercel.
5. Run database migration once:

```bash
npm run db:migrate
```

Vercel will run `npm install`, Prisma generation, and `npm run build` automatically.
