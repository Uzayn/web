# WinPicks - Sports Betting Predictions Website

A Next.js 14 application for sports betting picks with free and VIP tiers.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Auth**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Payments**: Paystack
- **Language**: TypeScript

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

- **Clerk**: Get keys from [Clerk Dashboard](https://dashboard.clerk.com)
- **Supabase**: Get keys from [Supabase Dashboard](https://supabase.com/dashboard)
- **Paystack**: Get keys from [Paystack Dashboard](https://dashboard.paystack.com)

### 3. Set Up Database

Run the SQL schema in your Supabase dashboard:

```bash
# Copy contents of supabase/schema.sql to your Supabase SQL editor
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages (sign-in, sign-up)
│   ├── account/           # User account settings
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── blog/              # Blog (placeholder)
│   ├── dashboard/         # VIP user dashboard
│   ├── picks/             # Picks feed
│   ├── responsible-gambling/
│   ├── results/           # Track record
│   └── vip/               # VIP sales page
├── components/
│   ├── admin/             # Admin components
│   ├── features/          # Feature components
│   ├── layout/            # Layout components
│   └── ui/                # UI primitives
├── lib/                   # Utilities and configs
│   └── supabase/          # Supabase clients
├── hooks/                 # Custom hooks
└── types/                 # TypeScript types
```

## Key Features

- **Public picks feed** with sport filtering
- **VIP content gating** with blurred cards for non-subscribers
- **Full track record** with stats by sport
- **Paystack subscription** integration
- **Admin dashboard** for pick management
- **Responsible gambling** page and disclaimers

## Admin Access

Add your Clerk user ID to `ADMIN_USER_IDS` in `.env.local` to access admin pages.

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/picks` | GET | Get public picks |
| `/api/picks` | POST | Create pick (admin) |
| `/api/picks/[id]` | GET/PATCH/DELETE | Manage pick |
| `/api/picks/vip` | GET | Get VIP picks (auth) |
| `/api/stats` | GET | Get track record |
| `/api/subscribe` | POST | Initialize subscription |
| `/api/subscription/cancel` | POST | Cancel subscription |
| `/api/webhooks/paystack` | POST | Paystack webhooks |
| `/api/email/subscribe` | POST | Email signup |
| `/api/admin/users` | GET | List users (admin) |

## Deployment

### Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Paystack Webhooks

Set webhook URL in Paystack dashboard to:
```
https://yourdomain.com/api/webhooks/paystack
```

## License

Private - All rights reserved
