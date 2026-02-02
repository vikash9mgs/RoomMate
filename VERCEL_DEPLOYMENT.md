# 🚀 RoomMate Vercel Deployment Checklist

Complete this checklist to deploy RoomMate on Vercel with serverless API functions.

## Prerequisites

- Vercel account (free tier works)
- MongoDB Atlas cluster (free tier M0 works)
- AWS S3 bucket for image uploads
- AWS IAM user credentials (access key + secret key)
- Google Generative AI (Gemini) API key
- Gmail account with app password for Nodemailer

## Step 1: Configure MongoDB Atlas

1. Create a cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Copy the connection string: `mongodb+srv://username:password@cluster.mongodb.net/roommate?retryWrites=true&w=majority`
3. Save this for later (needed in Vercel env vars)

## Step 2: Configure AWS S3

1. Create an S3 bucket in AWS Console
2. Create an IAM user with S3 permissions
3. Generate access key + secret key
4. Configure CORS on the bucket:
   ```xml
   <CORSConfiguration>
     <CORSRule>
       <AllowedOrigin>*</AllowedOrigin>
       <AllowedMethod>GET</AllowedMethod>
       <AllowedMethod>PUT</AllowedMethod>
       <AllowedMethod>POST</AllowedMethod>
       <AllowedHeader>*</AllowedHeader>
       <MaxAgeSeconds>3000</MaxAgeSeconds>
     </CORSRule>
   </CORSConfiguration>
   ```
5. Save bucket name, region, access key, secret key for later

## Step 3: Get API Keys

### Google Gemini API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select a project
3. Enable Generative AI API
4. Create API key
5. Copy the key for later

### Gmail App Password
1. Enable 2FA on Gmail account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Select Mail and Device (or custom)
4. Copy the app password for later

## Step 4: Create JWT Secret

Generate a random JWT secret (min 32 characters):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 5: Deploy Frontend to Vercel

1. Push your code to GitHub (already done ✓)
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import the GitHub repository
5. Configure:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add these **Environment Variables**:
   ```
   VITE_API_URL=
   ```
   (Leave blank for relative `/api` paths)

7. Deploy!

## Step 6: Add Serverless API Environment Variables

After deployment, go to **Project Settings → Environment Variables** and add:

### Database
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/roommate?retryWrites=true&w=majority
```

### Authentication
```
JWT_SECRET=<your-random-secret-from-step-4>
```

### Google Generative AI (Gemini)
```
GEMINI_API_KEY=<your-api-key>
```

### S3 Upload
```
S3_BUCKET=<bucket-name>
S3_REGION=us-east-1
S3_KEY=<aws-access-key>
S3_SECRET=<aws-secret-key>
S3_ACL=public-read
```

### Email (Nodemailer)
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=<app-password-from-step-3>
```

**Important**: After adding/updating env vars, redeploy:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

## Step 7: Test the Deployment

1. Visit your Vercel URL
2. Test authentication (register, login)
3. Try uploading a profile picture
4. Create a listing with images
5. Test the AI chatbot
6. Check MongoDB Atlas for stored data

## Troubleshooting

### Images not uploading
- Verify S3 bucket CORS configuration
- Check S3 credentials in Vercel env vars
- Ensure bucket has public-read ACL

### Database connection fails
- Verify MONGO_URI is correct
- Check whitelist IP in MongoDB Atlas (allow all: `0.0.0.0/0`)
- Ensure database user password doesn't have special chars that need escaping

### Auth failing
- Clear browser localStorage and cookies
- Check JWT_SECRET env var is set
- Verify token is being sent in Authorization header

### Email not sending
- Verify EMAIL_USER and EMAIL_PASS are correct
- Ensure you're using app password (not Gmail password)
- Check that 2FA is enabled on Gmail account

## Optional: Custom Domain

1. In Vercel project settings, go to **Domains**
2. Add your custom domain
3. Follow DNS configuration steps provided

## Rollback

If something breaks, you can:
1. Go to Vercel project **Deployments**
2. Select a previous deployment
3. Click "Promote to Production"

## Local Testing Before Deploy

```bash
# Test client build locally
cd client
npm install
npm run build

# Install Vercel CLI and test serverless locally
npm install -g vercel
vercel dev
```

---

✅ **You're live!** Share your RoomMate URL and start inviting users.
