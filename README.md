# Venue Catalog

A Next.js application that displays a catalog of venues with search, filtering, and sorting capabilities.

## Prerequisites

- Node.js (version 18 or higher)
- pnpm (package manager)
- Supabase account with a configured project

## Getting Started

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Configure environment variables**
   Create a `.env` file in the root directory with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   DATABASE_URL=your_database_connection_string
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   ```

4. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `pnpm dev` - Starts the development server
- `pnpm build` - Builds the application for production
- `pnpm start` - Starts the production server
- `pnpm migrate` - Runs database migrations
- `pnpm migrate:clean` - Runs migrations and cleanup

## Technology Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Supabase (database and authentication)