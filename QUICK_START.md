# Quick Start: Supabase Migration

Follow these steps to migrate your Solar Store to Supabase:

## 1. Create Supabase Project (5 minutes)

1. Go to https://supabase.com and sign up/login
2. Click **"New Project"**
3. Fill in:
   - **Name:** solar-store
   - **Database Password:** (choose a strong password)
   - **Region:** (select closest to you)
4. Click **"Create new project"** and wait ~2 minutes

## 2. Get Your Credentials (1 minute)

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL**
   - **anon public key**

## 3. Update Environment Variables (1 minute)

Open `.env.local` and replace with your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-key-here
```

## 4. Run Database Setup (2 minutes)

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy ALL contents from `supabase-setup.sql`
4. Paste and click **"Run"**
5. You should see: "Success. No rows returned"

## 5. Run Storage Setup (1 minute)

1. Still in **SQL Editor**, click **"New Query"** again
2. Copy ALL contents from `supabase-storage-setup.sql`
3. Paste and click **"Run"**
4. You should see: "Success. No rows returned"

## 6. Verify Setup (1 minute)

Run the verification script:

```bash
npm run verify-supabase
```

You should see all green checkmarks ✅

## 7. Start Your App (1 minute)

```bash
npm run dev
```

Visit http://localhost:3000 - your products should load from Supabase!

## 8. Test Admin Panel

1. Go to http://localhost:3000/admin
2. Try adding a new product with an image
3. Try editing an existing product
4. Try deleting a product

## ✅ Done!

Your app is now using Supabase for:
- Product storage (database)
- Image uploads (storage)
- Real-time capabilities (ready to add)

## Troubleshooting

### "Products not loading"
- Check `.env.local` has correct credentials
- Restart dev server: `Ctrl+C` then `npm run dev`

### "Verification script fails"
- Make sure you ran both SQL scripts
- Check credentials are correct
- Ensure Supabase project is active

### "Image upload fails"
- Verify storage bucket exists (check Supabase Storage tab)
- Make sure you ran `supabase-storage-setup.sql`

## Need Help?

See `SUPABASE_SETUP_GUIDE.md` for detailed instructions.
