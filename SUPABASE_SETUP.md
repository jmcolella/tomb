# Supabase Setup Instructions

## Required Environment Variables

To connect your Next.js app to Supabase, you need to create a `.env.local` file in the root of your project with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## How to Get Your Supabase Credentials

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** → Use this for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → Use this for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Database Table Setup

Make sure you have a `books` table in your Supabase database with at least a `title` column. Here's a sample SQL to create the table:

```sql
CREATE TABLE books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

## Security Note

The `.env.local` file is already in `.gitignore` and will not be committed to your repository. Keep your credentials secure and never commit them to version control.

