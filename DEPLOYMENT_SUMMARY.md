# RoomMate Vercel Deployment — Implementation Summary

## Overview

RoomMate has been refactored from a traditional Express server to **Vercel serverless functions** with AWS S3 for image storage and MongoDB Atlas for persistence. This document summarizes what was implemented and how to deploy.

---

## Architecture Changes

### Before (Traditional Server)
```
React Frontend (localhost:5173)
        ↓
Express Server (localhost:5000)
        ↓
Local MongoDB + File System
```

### After (Serverless on Vercel)
```
React Frontend (vercel.app)
        ↓
Vercel Serverless Functions (/api/*)
        ↓
MongoDB Atlas + AWS S3
```

**Benefits:**
- ✅ No server to manage
- ✅ Auto-scaling
- ✅ Global CDN for frontend
- ✅ Reliable cloud storage (S3) instead of file system
- ✅ Managed MongoDB (Atlas) instead of local instance

---

## What Was Built

### 1. Serverless API Functions (`/api/`)

All Express routes migrated to Vercel serverless functions:

| Endpoint | Function | Purpose |
|----------|----------|---------|
| `POST /api/auth/register` | `api/auth/register.js` | User registration |
| `POST /api/auth/login` | `api/auth/login.js` | User login + JWT token |
| `PUT /api/auth/profile` | `api/auth/profile.js` | Update user profile + avatar |
| `GET /api/auth/favorites/[listingId]` | `api/auth/favorites/[listingId].js` | Toggle/get favorites |
| `POST /api/upload` | `api/upload.js` | Get S3 presigned URL |
| `GET /api/listings` | `api/listings/index.js` | List all listings + filters |
| `POST /api/listings` | `api/listings/index.js` | Create new listing |
| `GET /api/listings/[id]` | `api/listings/[id].js` | Get single listing |
| `PUT /api/listings/[id]` | `api/listings/[id].js` | Update listing |
| `DELETE /api/listings/[id]` | `api/listings/[id].js` | Delete listing |
| `GET /api/listings/my-listings` | `api/listings/my-listings/index.js` | Get user's own listings |
| `POST /api/listings/[id]/tour` | `api/listings/[id]/tour.js` | Schedule tour + email |
| `POST /api/listings/[id]/book` | `api/listings/[id]/book.js` | Book property + email |
| `POST /api/ask` | `api/ask.js` | Chatbot (Gemini or fallback) |
| `POST /api/contact` | `api/contact.js` | Contact form + email |

### 2. Database Connection Pooling (`api/_db.js`)

Serverless functions have connection limits. Solution: cache MongoDB connections:

```javascript
// Reuses same connection across invocations to avoid exhausting connection pool
let cachedConnection = null;
export async function connectToDatabase() {
  if (cachedConnection?.connection) return cachedConnection;
  // ... mongoose.connect() ...
}
```

### 3. Model Guards (`server/models/*.js`)

Prevent Mongoose model overwriting errors in serverless:

```javascript
// Instead of: mongoose.model('User', schema)
// Use:
export default mongoose.models.User || mongoose.model('User', schema);
```

### 4. S3 Presigned Upload Flow

**Problem:** Serverless can't handle large file uploads → handle I/O.

**Solution:** Presigned URLs let clients upload directly to S3.

**Flow:**
1. Client: `POST /api/upload` with filename + type
2. Server: Validates, creates AWS S3 `PutObjectCommand`, returns presigned URL
3. Client: `PUT <presigned-url>` with file (direct to S3, no server)
4. Server: Returns public URL for storage in MongoDB

**Benefits:** Faster uploads, reduced server load, scalable.

### 5. Upload Utility (`client/src/utils/uploadUtils.js`)

Centralized S3 upload logic to reduce code duplication:

```javascript
// Single file
const url = await uploadToS3(file, apiBaseUrl);

// Multiple files
const urls = await uploadMultipleToS3(files, apiBaseUrl);
```

Used in:
- `ProfilePage.jsx` — avatar upload
- `PostListing.jsx` — listing images

### 6. JWT Auth Middleware (`api/_auth.js`)

Reusable middleware for protected endpoints:

```javascript
export function verifyToken(req) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // ... fetch user from DB ...
  return { user, token };
}

export function withAuth(handler) {
  return async (req, res) => {
    try {
      const { user, token } = verifyToken(req);
      req.user = user;
      req.token = token;
      return handler(req, res);
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  };
}
```

Available for future protected endpoints.

### 7. File Validation

Server-side validation in `api/upload.js`:

```javascript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

if (fileSize > MAX_FILE_SIZE) throw new Error('File too large');
if (!ALLOWED_TYPES.includes(fileType)) throw new Error('Invalid file type');
```

### 8. Client URL Refactoring

Replaced hardcoded localhost URLs with environment variable:

**Before:**
```javascript
fetch('http://localhost:3000/api/listings')
```

**After:**
```javascript
const apiBase = import.meta.env.VITE_API_URL || '';
fetch(`${apiBase}/api/listings`)
```

In Vercel, leave `VITE_API_URL` empty → uses relative `/api` paths.

### 9. Deployment Configuration (`vercel.json`)

```json
{
  "buildCommand": "cd client && npm run build",
  "outputDirectory": "client/dist",
  "env": [
    "MONGO_URI",
    "JWT_SECRET",
    "GEMINI_API_KEY",
    "EMAIL_USER",
    "EMAIL_PASS",
    "S3_BUCKET",
    "S3_REGION",
    "S3_KEY",
    "S3_SECRET",
    "S3_ACL"
  ]
}
```

---

## Deployment Checklist

### Before Deploying

1. ✅ **Prepare accounts:**
   - MongoDB Atlas cluster
   - AWS S3 bucket + IAM credentials
   - Google Cloud Gemini API key
   - Gmail app password
   - GitHub repository pushed

2. ✅ **S3 CORS Configuration:**
   Add this in AWS S3 bucket CORS settings:
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

### Deploying to Vercel

Follow the step-by-step guide in **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)**.

TL;DR:
1. Link GitHub repo to Vercel
2. Set build: `npm run build` in `client` folder
3. Add 10 environment variables (Mongo, S3, JWT, etc.)
4. Deploy!

---

## Environment Variables

### Required in Vercel

```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/roommate
JWT_SECRET=<random-32-char-string>
GEMINI_API_KEY=<google-api-key>
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=<app-password>
S3_BUCKET=your-bucket-name
S3_REGION=us-east-1
S3_KEY=<aws-access-key>
S3_SECRET=<aws-secret-key>
S3_ACL=public-read
```

### Local Testing

Create `.env.local` in `server/` (if testing Express locally):

```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/roommate
JWT_SECRET=dev-secret-key
GEMINI_API_KEY=<google-api-key>
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=<app-password>
S3_BUCKET=your-bucket-name
S3_REGION=us-east-1
S3_KEY=<aws-access-key>
S3_SECRET=<aws-secret-key>
S3_ACL=public-read
```

---

## Testing Locally

### Option A: Test Client Build Only
```bash
cd client
npm install
npm run build
npm run preview  # Preview production build
```

### Option B: Full Stack with Vercel Dev Server
```bash
npm install -g vercel
vercel dev
```
This runs both frontend and serverless functions locally.

### Option C: Run Express Server Locally (Optional)
If you want to keep the traditional server for development:
```bash
cd server
npm install
npm run dev  # Runs with nodemon
```
But this is now optional—Vercel serverless is production.

---

## File Structure

```
RoomMate/
├── client/                         # React frontend (Vite)
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── pages/                 # Page components
│   │   ├── context/               # Auth + Theme context
│   │   ├── utils/
│   │   │   └── uploadUtils.js    # ✨ NEW: S3 upload centralized
│   │   └── App.jsx                # Routes + protected pages
│   ├── vercel.json                # Vercel config (auto-generated)
│   └── package.json               # Frontend dependencies
│
├── server/                         # Express server (for local dev only)
│   ├── models/
│   │   ├── User.js                # ✨ Guarded with mongoose.models check
│   │   └── Listing.js             # ✨ Guarded with mongoose.models check
│   ├── index.js                   # Entry point (local dev)
│   └── package.json               # Server dependencies
│
├── api/                           # ✨ NEW: Vercel serverless functions
│   ├── _db.js                     # MongoDB connection cache
│   ├── _auth.js                   # JWT middleware (reusable)
│   ├── upload.js                  # S3 presigned URL endpoint (validated)
│   ├── ask.js                     # Chatbot endpoint
│   ├── contact.js                 # Contact form endpoint
│   ├── auth/
│   │   ├── register.js
│   │   ├── login.js
│   │   ├── profile.js
│   │   └── favorites/[listingId].js
│   └── listings/
│       ├── index.js               # GET all, POST create
│       ├── [id].js                # GET/PUT/DELETE single
│       ├── [id]/tour.js           # Schedule tour
│       ├── [id]/book.js           # Book property
│       └── my-listings/           # ✨ NEW: User's listings
│           └── index.js
│
├── vercel.json                    # ✨ NEW: Deployment config
├── VERCEL_DEPLOYMENT.md           # ✨ NEW: Step-by-step deploy guide
├── DEPLOYMENT_SUMMARY.md          # ✨ This file
└── package.json                   # Root package (if needed)
```

---

## Key Improvements Made

| Improvement | Before | After | Benefit |
|-------------|--------|-------|---------|
| **File Upload** | Local file system | AWS S3 with presigned URLs | Scalable, no storage concerns |
| **Database** | Local MongoDB | MongoDB Atlas | Managed, no setup needed |
| **Server** | Traditional Express | Vercel serverless | Auto-scaling, no ops |
| **Upload Code** | Duplicate in ProfilePage + PostListing | Centralized `uploadUtils.js` | DRY, easier to maintain |
| **Auth Middleware** | Repeated in each endpoint | Reusable `_auth.js` | Consistency, less code |
| **File Validation** | Client-side only | Server-side + client | Security, better UX |
| **Mongo Models** | OverwriteModelError risk | Guarded registration | Stable in serverless |
| **API Base URL** | Hardcoded localhost | Environment variable | Works in any environment |

---

## Troubleshooting

### Issue: "Failed to upload file to S3"
- **Check:** S3 bucket CORS configuration (see above)
- **Check:** S3 IAM user has `s3:GetObject`, `s3:PutObject` permissions
- **Check:** Bucket name, region, credentials in Vercel env vars

### Issue: "Database connection failed"
- **Check:** `MONGO_URI` is correct (copy from Atlas)
- **Check:** IP whitelist in MongoDB Atlas includes `0.0.0.0/0`
- **Check:** Database user password has no special chars (or is URL-encoded)

### Issue: "Chatbot not responding"
- **Check:** `GEMINI_API_KEY` is set and valid
- **Check:** Google Cloud API is enabled for Generative AI
- **Check:** No quota limits exceeded

### Issue: "Auth token not working"
- **Check:** `JWT_SECRET` is same in all deployments
- **Check:** Token is being sent in `Authorization: Bearer <token>` header
- **Check:** Token hasn't expired (default 7 days)

---

## Next Steps

1. **Follow the deployment guide:** [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
2. **Set up S3 CORS** as described above
3. **Test locally** with `vercel dev` or separate dev servers
4. **Deploy to Vercel** and add environment variables
5. **Verify all features** in production (auth, uploads, chatbot, email)
6. **Set up custom domain** (optional)

---

## Production Checklist

- [ ] MongoDB Atlas cluster created and whitelist configured
- [ ] S3 bucket created with CORS rules
- [ ] S3 IAM user credentials generated
- [ ] Google Gemini API key obtained
- [ ] Gmail 2FA enabled and app password generated
- [ ] JWT secret generated (32+ characters)
- [ ] GitHub repository pushed
- [ ] Vercel project created and linked
- [ ] All 10 environment variables set in Vercel
- [ ] Client build succeeds locally
- [ ] Vercel deployment successful
- [ ] All endpoints tested (auth, listings, upload, chatbot)
- [ ] Email sending verified (tour/booking)
- [ ] Images uploaded and visible
- [ ] Profile picture upload works
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up (Vercel logs, MongoDB alerts)

---

## Support

For detailed setup instructions, see:
- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) — Complete step-by-step guide
- [server/README.md](./server/README.md) — Server-specific notes
- [client/README.md](./client/README.md) — Client-specific notes

Good luck with your deployment! 🚀
