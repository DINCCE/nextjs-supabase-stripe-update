# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-featured SaaS starter built with Next.js, featuring authentication via Supabase, billing with Stripe, and entitlements management via Update. It uses the Next.js App Router, TypeScript, and Tailwind CSS with shadcn/ui components.

## Key Commands

### Development
- `npm run dev` — Start the Next.js development server (runs on http://localhost:3000)
- `npm run build` — Build the application for production
- `npm run start` — Start the production server
- `npm run lint` — Run ESLint to check for code quality issues

### Environment Setup
- Copy `.env.example` to `.env.local` and fill in values from Update, Supabase, and Stripe dashboards
- Required environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key
  - `NEXT_PUBLIC_UPDATE_PUBLISHABLE_KEY` — Update public key for client-side operations

## Architecture Overview

### File Structure
```
app/
  (auth)/                    # Authentication pages (sign-in, sign-up)
  api/                       # API routes
  protected/                 # Pages requiring authentication
    subscription/            # Subscription management UI
    pricing/                 # Pricing page
    paid-content/            # Gated content example
  layout.tsx                 # Root layout with theme provider
  actions.ts                 # Server actions
  page.tsx                   # Home page
utils/
  supabase/
    client.ts                # Browser-side Supabase client
    middleware.ts            # Supabase session management in middleware
    server.ts                # Server-side Supabase operations (if present)
  update/
    client.ts                # Update client setup with session token integration
    server.ts                # Server-side Update operations (if present)
components/
  ui/                        # shadcn/ui components (Button, Dialog, Card, etc.)
  header.tsx                 # Navigation header with auth state
```

### Authentication Flow
- **Middleware-based**: `middleware.ts` manages Supabase sessions on each request, updating the auth cookie
- **Supabase SSR**: Uses `@supabase/ssr` for secure session handling in both server and client contexts
- **Auth Routes**: Protected by route matching in `(auth)` group (sign-in, sign-up)
- **Protected Routes**: Routes under `/protected` require active session

### Update Integration
- **Client Setup**: `utils/update/client.ts` initializes the Update SDK with Supabase session token
- **Entitlements**: Use `client.entitlements.check()` in components to conditionally render features based on user's plan/organization
- **Environment**: Hardcoded to "test" environment in template (usually would be NODE_ENV-based)

### Styling
- **Tailwind CSS**: CSS framework with utility classes
- **Next.js Fonts**: Inter font loaded via `next/font/google`
- **Theme Provider**: `next-themes` for dark/light mode support
- **shadcn/ui**: Pre-built accessible UI components (Button, Dialog, Card, etc.)

### Key Dependencies
- `@supabase/ssr` — SSR-safe Supabase client
- `@supabase/supabase-js` — Supabase SDK
- `@updatedev/js` — Update SDK for entitlements and SaaS features
- `next` — React framework (v15+)
- `react` / `react-dom` — Core React (v19+)
- `tailwindcss` — Utility-first CSS
- `next-themes` — Dark mode theme management

## Development Patterns

### Server vs Client Components
- Root layout and theme provider run on server
- Use `"use client"` directive only where needed (interactive components)
- Server actions in `app/actions.ts` for mutations

### Protected Routes
- Routes under `app/protected/` expect active session from middleware
- Check entitlements using Update client before rendering paid content
- Redirect unauthenticated users via middleware or server-side checks

### Styling Components
- Use `clsx` and `tailwind-merge` to combine Tailwind classes dynamically
- Import shadcn/ui components from `components/ui/`
- Follow existing Tailwind spacing and color conventions

## Important Notes

- TypeScript strict mode is enabled (`strict: true` in tsconfig.json)
- Path alias `@/*` maps to the root directory for clean imports
- ESLint config extends Next.js defaults
- No custom Next.js config is currently set up (keep `next.config.ts` minimal unless needed)
