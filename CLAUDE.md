# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Next.js + Supabase + Stripe SaaS boilerplate** featuring:
- Authentication with Supabase
- Billing and subscription management with Stripe
- Entitlements management with Update
- Built with Tailwind CSS and shadcn/ui components
- Full-stack ready with App Router, Server/Client components, and Middleware

## Commands

### Development & Build
- `npm run dev` — Start development server (runs on http://localhost:3000)
- `npm run build` — Build for production
- `npm start` — Start production server
- `npm run lint` — Run ESLint to check code quality

## Architecture & Code Structure

### High-Level Design

The application follows Next.js App Router conventions with three main layers:

1. **Authentication Layer** — Handled by Supabase with Middleware at [middleware.ts](middleware.ts) for session management
2. **Authorization/Entitlements** — Managed by Update SDK (client-side and server-side)
3. **Billing** — Stripe integration for subscriptions and checkout

### Directory Structure

- **`app/`** — Next.js App Router routes
  - `(auth)/` — Public authentication pages (sign-in, sign-up)
  - `protected/` — Authenticated user routes requiring Supabase session
    - `subscription/` — Subscription management
    - `paid-content/` — Content gated by entitlements (requires Update integration)
    - `pricing/` — Pricing and plan selection
  - `api/` — API routes (server-side handlers)
  - `actions.ts` — Server actions for authentication (signIn, signUp, signOut)

- **`components/`** — Reusable React components
  - `ui/` — shadcn/ui component library
  - `header.tsx` — Global navigation header
  - `*-card.tsx` — Feature-specific card components
  - `*-button.tsx`, `*-actions.tsx` — User interaction components

- **`utils/`** — Utility functions and client initialization
  - `supabase/` — Supabase client setup
    - `client.ts` — Browser-side Supabase client
    - `server.ts` — Server-side Supabase client
    - `middleware.ts` — Session refresh middleware
  - `update/` — Update SDK client setup
    - `client.ts` — Browser-side Update client (for entitlements checks)
    - `server.ts` — Server-side Update client
  - `redirect.ts` — Utility for encoded redirects with error/success messages
  - `styles.ts` — Styling utilities (likely contains classname helpers)

### Key Architectural Patterns

#### Authentication Flow
1. Public routes in `(auth)/` for unauthenticated users
2. Server action `signInAction`, `signUpAction` in [actions.ts](app/actions.ts) handle credentials
3. Supabase session stored in browser/server-side cookies
4. [middleware.ts](middleware.ts) protects `/protected/*` routes by checking session validity

#### Entitlements & Billing
- **Update SDK** provides entitlements checks: `client.entitlements.check()` for feature access
- Components like [paid-content-card.tsx](components/paid-content-card.tsx) use entitlements to conditionally render paid features
- Stripe handles checkout and customer portal for subscription management

#### Component Structure
- **Client Components** — Used for interactivity (buttons, forms, theme switching)
- **Server Components** — Used by default for protected pages to check Supabase session
- **Layout Components** — Wrap routes with auth checks and UI structure

### Supabase Integration Points
- Session management via cookies (handled by `@supabase/ssr`)
- Authentication methods: email/password sign-in and sign-up
- Server-side session validation in protected routes

### Update SDK Integration Points
- Client-side entitlements checks for UI rendering
- Server-side entitlements validation for API protection
- Requires `NEXT_PUBLIC_UPDATE_PUBLISHABLE_KEY` environment variable

### Stripe Integration Points
- Likely implemented in `api/` routes for checkout and webhooks
- Customer portal for subscription management in `protected/subscription`

## Environment Variables

Create `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
NEXT_PUBLIC_UPDATE_PUBLISHABLE_KEY=<your-update-key>
```

Additional variables may be needed for Stripe integration (check Stripe webhook setup).

## Key Dependencies

- **Next.js** (16.0.1) — React framework with App Router
- **React** (19.0.0) — UI library
- **Supabase** (@supabase/supabase-js, @supabase/ssr) — Auth and database
- **Update** (@updatedev/js) — Entitlements management
- **Stripe** — Billing (likely via API calls, not shown as npm dependency)
- **Tailwind CSS** (4.0.13) — Styling
- **shadcn/ui** — Pre-built component library (via Radix UI)
- **next-themes** — Theme management (dark/light mode)

## Development Notes

1. **TypeScript Strict Mode** — Project uses `strict: true` in tsconfig.json
2. **Path Aliases** — `@/*` maps to root directory for clean imports
3. **Server Actions** — Use `"use server"` directive for server-side form handling
4. **Session Management** — Always check Supabase session in protected routes before rendering sensitive content
5. **Entitlements** — For paid features, call `client.entitlements.check()` on the client or server (Update SDK)
