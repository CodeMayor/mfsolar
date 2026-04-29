# Supabase Setup Guide for Solar Store

This guide will help you migrate your products to Supabase and enable image uploads from the admin panel.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in your project details:
   - Name: `solar-store` (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Select the closest region to your users
4. Click "Create new project" and wait for it to initialize

## Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

3. Update your `.env.local` file with these values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 3: Set Up the Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the contents of `supabase-setup.sql` and paste it into the editor
4. Click "Run" to execute the SQL

This will:
- Create the `products` table
- Enable Row Level Security (RLS)
- Set up policies for public read and authenticated write access
- Insert your existing products into the database

## Step 4: Set Up Storage for Images

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the contents of `supabase-storage-setup.sql` and paste it into the editor
4. Click "Run" to execute the SQL

This will:
- Create a public storage bucket called `product-images`
- Set up policies for public read and authenticated write access

## Step 5: Verify the Setup

1. Go to **Table Editor** in your Supabase dashboard
2. You should see the `products` table with 9 products
3. Go to **Storage** and verify the `product-images` bucket exists

## Step 6: Test Your Application

1. Restart your Next.js development server:
   ```bash
   npm run dev
   ```

2. Visit your homepage - products should load from Supabase
3. Go to `/admin` and try:
   - Adding a new product with an image upload
   - Editing an existing product
   - Deleting a product

## Features Enabled

✅ **Products stored in Supabase database**
- All CRUD operations (Create, Read, Update, Delete)
- Real-time data synchronization

✅ **Image uploads to Supabase Storage**
- Upload images directly from the admin panel
- Images stored in a public bucket
- Automatic URL generation

✅ **Row Level Security (RLS)**
- Public can read products
- Only authenticated users can modify products

## Authentication (Optional)

Currently, the app allows anyone to modify products. To restrict admin access:

1. Enable Supabase Authentication in your dashboard
2. Set up sign-in methods (Email, Google, etc.)
3. Add authentication to your admin page
4. The RLS policies are already configured to require authentication

## Troubleshooting

### Products not loading
- Check your `.env.local` file has the correct credentials
- Verify the `products` table exists in Supabase
- Check browser console for errors

### Image upload fails
- Verify the `product-images` bucket exists
- Check storage policies are set up correctly
- Ensure you're using a supported image format (jpg, png, webp)

### Database connection errors
- Verify your Supabase project is active
- Check your internet connection
- Ensure the Project URL and anon key are correct

## Next Steps

1. **Add Authentication**: Protect your admin panel with Supabase Auth
2. **Add More Categories**: Extend the category enum in the database
3. **Add Product Search**: Implement full-text search using Postgres
4. **Add Analytics**: Track product views and sales

## Support

- Supabase Documentation: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
