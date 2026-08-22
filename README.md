# RecipeSafe

RecipeSafe is an early access Next.js app for keeping family recipes safe. It helps users save recipes, organize notes and ingredients, and build toward private family recipe sharing.

## Core Stack

- Next.js App Router
- React
- TypeScript
- MongoDB / Mongoose
- NextAuth
- Mantine
- Resend
- UploadThing
- Zustand

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Use `.env.local` for local development and configure matching production values in Vercel.

```bash
MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

RESEND_API_KEY=
EMAIL_FROM=support@getrecipesafe.com

NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_INVITE_BASE_URL=http://localhost:3000
```

Production values should use the canonical domain:

```bash
NEXTAUTH_URL=https://www.getrecipesafe.com
NEXT_PUBLIC_BASE_URL=https://www.getrecipesafe.com
NEXT_PUBLIC_INVITE_BASE_URL=https://www.getrecipesafe.com
```

## Google OAuth

In Google Cloud Console, configure the OAuth client for a web application.

Authorized JavaScript origins:

```text
https://www.getrecipesafe.com
https://getrecipesafe.com
http://localhost:3000
```

Authorized redirect URIs:

```text
https://www.getrecipesafe.com/api/auth/callback/google
https://getrecipesafe.com/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

If `getrecipesafe.com` permanently redirects to `www.getrecipesafe.com`, the `www` callback is the canonical one. Keeping both listed is harmless and avoids redirect/callback surprises while DNS and Vercel settle.

Add the Google credentials to Vercel:

```bash
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## Resend Email

RecipeSafe sends invite email through Resend.

Checklist:

- Verify `getrecipesafe.com` in Resend.
- Confirm SPF/DKIM DNS checks are passing in Resend.
- Set `EMAIL_FROM=support@getrecipesafe.com` in Vercel.
- Redeploy after changing the environment variable.

Resend domain verification allows sending from `support@getrecipesafe.com`; it does not automatically create an inbox. To receive mail sent to `support@getrecipesafe.com`, configure email hosting or forwarding with the domain/DNS provider.

Common forwarding options:

- Registrar email forwarding, if offered
- Cloudflare Email Routing
- Google Workspace
- Microsoft 365
- ImprovMX

## Deployment Notes

- Production domain: `https://www.getrecipesafe.com`
- Non-www domain should redirect to the canonical www domain.
- Old Preserved Recipes domains should redirect path-for-path to RecipeSafe.
- Keep `NEXTAUTH_URL`, public base URL vars, and OAuth callback URLs aligned with the canonical domain.

## Launch Records

Keep records that show first public use of the RecipeSafe name:

- Domain purchase receipt from the registrar
- Vercel deployment logs
- Git commits showing the rebrand
- Screenshots of the live site
- First user/signup records
- Resend domain verification screenshots

The domain receipt usually lives in the registrar account where the domain was purchased, often under billing, orders, invoices, or receipts. Email confirmations from the registrar also count.
