# Vercel Deployment Guide

## Prerequisites Before Deploying

### 1. Environment Variables Setup

You need to configure all environment variables in Vercel. Go to your project settings > Environment Variables and add:

#### Frontend Variables (NEXT*PUBLIC*\*)

These are exposed to the browser:

- `NEXT_PUBLIC_FIREBASE_API_KEY` - From Firebase Console > Project Settings > General
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - `your-project-id.firebaseapp.com`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Your Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - `your-project-id.appspot.com`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - From Firebase Console
- `NEXT_PUBLIC_FIREBASE_APP_ID` - From Firebase Console
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` - From Firebase Console (optional, for Analytics)
- `NEXT_PUBLIC_URL` - Your production URL (e.g., `https://your-app.vercel.app`)

#### Backend Variables (Server-side only)

- `FIREBASE_SERVICE_ACCOUNT_KEY` - Base64 encoded Firebase service account JSON
  - Get from: Firebase Console > Project Settings > Service Accounts > Generate new private key
  - Encode: `cat serviceAccountKey.json | base64` (on Mac/Linux) or use an online tool
  - Paste the entire base64 string as the value

- `DATABASE_URL` - MongoDB connection string
  - Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
  - Make sure your MongoDB Atlas IP whitelist includes Vercel's IPs (or use `0.0.0.0/0` for all)

- `NEXTAUTH_URL` - Your production URL (e.g., `https://your-app.vercel.app`)
- `NEXTAUTH_SECRET` - Generate a random secret: `openssl rand -base64 32`

- `NODE_ENV` - Set to `production` (Vercel sets this automatically)

### 2. Prisma Setup

**IMPORTANT**: Vercel needs to generate Prisma Client during build. Add this to your `package.json`:

```json
{
	"scripts": {
		"postinstall": "prisma generate"
	}
}
```

This ensures Prisma Client is generated after dependencies are installed.

### 3. Build Settings

Vercel should auto-detect Next.js, but verify:

- **Framework Preset**: Next.js
- **Build Command**: `yarn build`
- **Output Directory**: `.next` (default)
- **Install Command**: `yarn install`

### 4. Database Setup

#### MongoDB Atlas Configuration:

1. Create a MongoDB Atlas cluster (if not already done)
2. Create a database user with read/write permissions
3. Whitelist IP addresses:
   - Add `0.0.0.0/0` to allow all IPs (for Vercel's dynamic IPs)
   - Or add specific Vercel IP ranges (check Vercel docs for current IPs)
4. Get your connection string and set it as `DATABASE_URL`

#### Initial Database Schema:

After first deployment, you may need to push your Prisma schema:

- Run `npx prisma db push` locally (if you have direct DB access)
- Or create a Vercel serverless function to run migrations

### 5. Firebase Configuration

#### Firebase Admin SDK:

1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Encode it to base64:
   ```bash
   cat serviceAccountKey.json | base64
   ```
5. Copy the entire output and paste as `FIREBASE_SERVICE_ACCOUNT_KEY` in Vercel

#### Firebase Client Config:

- All `NEXT_PUBLIC_FIREBASE_*` variables should match your Firebase project
- Make sure Firebase Authentication is enabled
- Configure authorized domains in Firebase Console > Authentication > Settings > Authorized domains

### 6. Vercel-Specific Considerations

#### Build Timeout:

- Default is 45 seconds, should be enough for Next.js + Prisma
- If needed, increase in Project Settings > General

#### Function Timeout:

- Default is 10 seconds for Hobby plan
- Upgrade to Pro for 60 seconds if needed
- Your API routes should complete within the timeout

#### Edge Network:

- Static assets are automatically cached on Vercel's CDN
- API routes run as serverless functions

### 7. Deployment Steps

1. **Push to Git** (if using Git integration):

   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your Git repository
   - Configure environment variables (see above)
   - Deploy

3. **First Deployment**:
   - Vercel will run `yarn install` → `prisma generate` (via postinstall) → `yarn build`
   - Check build logs for any errors
   - If Prisma fails, ensure `postinstall` script is in package.json

4. **Verify Deployment**:
   - Check that all API routes work
   - Test authentication flow
   - Verify database connections
   - Check browser console for any client-side errors

### 8. Post-Deployment Checklist

- [ ] All environment variables are set correctly
- [ ] `NEXT_PUBLIC_URL` matches your Vercel deployment URL
- [ ] Firebase authorized domains include your Vercel domain
- [ ] MongoDB Atlas IP whitelist includes Vercel IPs
- [ ] Prisma Client is generating correctly (check build logs)
- [ ] API routes are responding correctly
- [ ] Authentication is working
- [ ] Database queries are working

### 9. Common Issues

#### Prisma Client Not Found:

- **Solution**: Add `"postinstall": "prisma generate"` to package.json scripts

#### Database Connection Timeout:

- **Solution**: Check MongoDB Atlas IP whitelist includes `0.0.0.0/0` or Vercel IPs

#### Firebase Admin Errors:

- **Solution**: Verify `FIREBASE_SERVICE_ACCOUNT_KEY` is correctly base64 encoded

#### Build Fails:

- **Solution**: Check build logs in Vercel dashboard for specific errors
- Common issues: missing env vars, Prisma schema issues, TypeScript errors

### 10. Updating package.json

Add the postinstall script if it's not already there:

```json
{
	"scripts": {
		"postinstall": "prisma generate",
		"dev": "next dev",
		"build": "next build",
		"start": "next start",
		"lint": "next lint"
	}
}
```

---

## Quick Reference: Environment Variables Checklist

Copy this list and check off as you add them in Vercel:

### Frontend (NEXT*PUBLIC*\*)

- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` (optional)
- [ ] `NEXT_PUBLIC_URL`

### Backend

- [ ] `FIREBASE_SERVICE_ACCOUNT_KEY` (base64 encoded)
- [ ] `DATABASE_URL` (MongoDB connection string)
- [ ] `NEXTAUTH_URL`
- [ ] `NEXTAUTH_SECRET`

---

**Note**: After deployment, update `NEXT_PUBLIC_URL` and `NEXTAUTH_URL` with your actual Vercel domain URL.
