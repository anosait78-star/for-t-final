# SportsAcademy (Next.js rebuild)

Rebuild of the original ASP.NET Core SportsAcademy site using Next.js + Prisma + Postgres (Neon) + Cloudinary, built to deploy on Vercel.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Prisma 7 with the Neon serverless driver adapter (`@prisma/adapter-neon`)
- Postgres via [Neon](https://neon.tech)
- Image storage via [Cloudinary](https://cloudinary.com)
- Single-admin auth: a signed session cookie (`jose`), no database user table

## Local setup

1. Copy `.env` and fill in the real values:

   ```
   DATABASE_URL=              # Neon connection string
   ADMIN_EMAIL=                # the admin login email
   ADMIN_PASSWORD_HASH=         # bcrypt hash of the admin password, see below
   SESSION_SECRET=              # random 32+ char string: openssl rand -base64 32
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   ```

   To generate `ADMIN_PASSWORD_HASH`:

   ```bash
   node -e "console.log(require('bcryptjs').hashSync('your-password-here', 10))"
   ```

   **Important:** bcrypt hashes start with `$2b$10$...` — Next.js expands `$name` sequences in `.env` files, which silently corrupts the hash. Escape every `$` as `\$` when pasting it into `.env`, e.g. `ADMIN_PASSWORD_HASH="\$2b\$10\$..."`. (On Vercel's environment variable UI this escaping is not needed — paste the hash as-is there.)

2. Install dependencies and apply the schema:

   ```bash
   npm install
   npx prisma migrate dev --name init
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

## Migrating data from the old ASP.NET site

Run these once, locally, after the schema exists on Neon:

```bash
# 1. Upload every image in the old app's wwwroot/img to Cloudinary,
#    producing scripts/image-mapping.json
npm run migrate:images

# 2. Copy all rows from the old SQL Server database into Postgres,
#    rewriting image paths using the mapping from step 1
OLD_DB_CONNECTION_STRING="Server=...;Database=...;User Id=...;Password=...;TrustServerCertificate=True;" npm run migrate:data
```

`migrate-data.ts` migrates Coaches, Courses, Accredited Foundations (preserving IDs), then Certificates — and hard-fails if a certificate references a foundation that wasn't migrated. It prints old-vs-new row counts at the end so you can confirm nothing was lost.

## Deploying to Vercel

1. Push this repo to GitHub and import it in Vercel.
2. Set the same environment variables from `.env` in the Vercel project settings.
3. The build command (`prisma generate && prisma migrate deploy && next build`, already set in `package.json`) applies any pending schema migrations automatically on every deploy.
4. After the first successful deploy against an empty database, run the migration scripts above against the production `DATABASE_URL` to populate real data.

## Admin

Admin routes live under `/admin` and are protected by `proxy.ts` (Next.js 16's renamed `middleware.ts`) plus a server-side session check in `app/admin/(protected)/layout.tsx` — every admin route requires login, including Courses (the old app had left Course admin actions unintentionally public; this rebuild fixes that).
