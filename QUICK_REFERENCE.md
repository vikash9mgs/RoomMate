# 🎯 RoomMate Development Quick Reference

## Local Development Setup

### First Time Setup
```bash
# Clone repo
git clone <repo-url>
cd RoomMate-main

# Install frontend
cd client && npm install

# Install backend (optional for local dev)
cd ../server && npm install

# Create .env.local in server/ with your credentials
cp ../.env.example .env.local
# Edit .env.local with real values
```

### Start Development Servers

**Option A: Vercel Local Dev (Recommended for testing serverless)**
```bash
npm install -g vercel
cd .. # Go to root
vercel dev
# Runs on http://localhost:3000 (frontend + /api functions)
```

**Option B: Traditional Development**
```bash
# Terminal 1: Client (Vite dev server)
cd client
npm run dev
# http://localhost:5173

# Terminal 2: Server (Express with nodemon)
cd server
npm run dev
# http://localhost:5000
```

**Option C: Client Only (if backend is already running)
```bash
cd client
npm run dev
```

---

## Project Structure

```
RoomMate/
├── api/                          # Vercel serverless functions
│   ├── _db.js                   # MongoDB connection cache
│   ├── _auth.js                 # JWT middleware (reusable)
│   ├── upload.js                # S3 presigned URL endpoint
│   ├── auth/                    # Authentication endpoints
│   ├── listings/                # Listing CRUD endpoints
│   ├── ask.js                   # Chatbot endpoint
│   └── contact.js               # Contact form endpoint
│
├── client/                       # React 19 + Vite frontend
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Page-level components
│   │   ├── context/             # Global state (Auth, Theme)
│   │   ├── utils/
│   │   │   └── uploadUtils.js  # S3 upload utility
│   │   └── App.jsx              # Router config
│   ├── vite.config.js           # Vite configuration
│   └── package.json
│
├── server/                       # Express (for local dev, optional)
│   ├── models/                  # MongoDB schemas
│   ├── routes/                  # Express routes
│   ├── config/                  # DB connection
│   ├── index.js                 # Entry point
│   └── package.json
│
├── VERCEL_DEPLOYMENT.md         # Step-by-step deploy guide
├── DEPLOYMENT_SUMMARY.md        # Architecture & changes
├── .env.example                 # Environment template
├── vercel.json                  # Vercel config
└── verify-deployment.sh         # Pre-deploy checklist
```

---

## Common Commands

### Client Commands
```bash
npm run dev         # Start dev server (Vite, port 5173)
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
npm run format      # Format code (Prettier)
```

### Server Commands
```bash
npm run dev         # Start dev server (Express, port 5000, with nodemon)
npm start           # Start production server
npm run seed        # Seed database with test data
npm run clear       # Clear database
```

### Root Commands
```bash
vercel dev          # Local Vercel dev (simulates serverless)
vercel deploy       # Deploy to production
vercel logs         # View live function logs
```

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `client/src/App.jsx` | Route definitions and protected routes |
| `client/src/context/AuthContext.jsx` | Global auth state and JWT management |
| `client/src/utils/uploadUtils.js` | S3 presigned upload utility |
| `server/models/User.js` | User schema (MongoDB) |
| `server/models/Listing.js` | Listing schema (MongoDB) |
| `api/_db.js` | MongoDB connection pooling for serverless |
| `api/_auth.js` | JWT verification middleware |
| `api/upload.js` | S3 presigned URL generation + validation |
| `vercel.json` | Deployment configuration |
| `.env.example` | Environment variables reference |

---

## API Endpoints

### Authentication
- `POST /api/auth/register` — Sign up new user
- `POST /api/auth/login` — Sign in + get JWT
- `PUT /api/auth/profile` — Update profile + avatar
- `GET /api/auth/favorites/[id]` — Toggle favorite listing

### Listings
- `GET /api/listings` — List all listings (with filters)
- `POST /api/listings` — Create new listing (protected)
- `GET /api/listings/[id]` — Get single listing
- `PUT /api/listings/[id]` — Update listing (protected)
- `DELETE /api/listings/[id]` — Delete listing (protected)
- `GET /api/listings/my-listings` — Get user's listings (protected)
- `POST /api/listings/[id]/tour` — Schedule tour
- `POST /api/listings/[id]/book` — Book property

### File Upload
- `POST /api/upload` — Get S3 presigned URL (protected)

### Other
- `POST /api/ask` — Chatbot query
- `POST /api/contact` — Contact form

---

## Authentication Flow

```
1. User registers/logs in via AuthModal
2. Server returns JWT token
3. Token stored in localStorage
4. Token sent in all protected requests: Authorization: Bearer <token>
5. Backend verifies JWT using JWT_SECRET
6. On logout, token cleared from localStorage
```

**Protected Routes:** Use `<ProtectedRoute>` wrapper in `App.jsx`

```jsx
<Route path="/postlisting" element={
  <ProtectedRoute allowedRoles={['member']}>
    <PostListing />
  </ProtectedRoute>
} />
```

---

## File Upload Flow

```
1. User selects image in ProfilePage or PostListing
2. Client calls POST /api/upload with filename + type
3. Server validates file (10MB max, JPEG/PNG/WebP/GIF)
4. Server generates S3 presigned PUT URL
5. Server returns { uploadUrl, publicUrl }
6. Client PUTs file directly to S3 (no server I/O)
7. Client stores publicUrl in database (listing or profile)
```

**Centralized Upload Utility:**
```javascript
import { uploadToS3 } from '@/utils/uploadUtils';

// Single file
const url = await uploadToS3(file, apiBase);

// Multiple files
const urls = await uploadMultipleToS3([file1, file2], apiBase);
```

---

## Environment Variables

### Vercel (Production)
Set these in Vercel Dashboard → Project Settings → Environment Variables:
- `MONGO_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — Random 32+ character secret
- `GEMINI_API_KEY` — Google Generative AI key
- `EMAIL_USER`, `EMAIL_PASS` — Gmail credentials
- `S3_BUCKET`, `S3_REGION`, `S3_KEY`, `S3_SECRET`, `S3_ACL` — AWS S3 config

### Local Development
Create `server/.env.local`:
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/roommate
JWT_SECRET=dev-secret-key
GEMINI_API_KEY=your-api-key
EMAIL_USER=email@gmail.com
EMAIL_PASS=app-password
S3_BUCKET=bucket-name
S3_REGION=us-east-1
S3_KEY=access-key
S3_SECRET=secret-key
S3_ACL=public-read
```

---

## Testing Checklist

- [ ] Register new account
- [ ] Login with credentials
- [ ] Update profile picture
- [ ] Create new listing with multiple images
- [ ] Search and filter listings
- [ ] View listing details
- [ ] View map
- [ ] Use AI chatbot
- [ ] Schedule tour / book property
- [ ] Receive confirmation emails
- [ ] Toggle favorites
- [ ] Contact form submission
- [ ] Dark/light theme toggle

---

## Debugging Tips

### Clear Browser Cache
```javascript
// In browser console:
localStorage.clear();
sessionStorage.clear();
```

### Check JWT Token
```javascript
// In browser console:
const token = localStorage.getItem('token');
console.log(JSON.parse(atob(token.split('.')[1]))); // Payload
```

### View Vercel Logs
```bash
vercel logs
# or
vercel logs --follow (live logs)
```

### MongoDB Connection Issues
- Verify MONGO_URI is correct
- Check IP whitelist in MongoDB Atlas (allow 0.0.0.0/0)
- Verify database user password has no special chars

### S3 Upload Issues
- Verify S3 bucket CORS is configured
- Check S3 credentials in env vars
- Verify S3 bucket name and region match
- Check IAM user has `s3:PutObject` permission

---

## Deployment Flow

```
1. Make code changes locally
2. Test with `vercel dev` or separate dev servers
3. Commit and push to GitHub
4. Vercel auto-deploys on push
5. Check Vercel Dashboard for build status
6. Verify deployment at yourapp.vercel.app
7. If issues, check logs: vercel logs
8. Rollback: Vercel → Deployments → Select previous → Promote
```

---

## Resources

- **Deployment Guide:** [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
- **Architecture:** [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)
- **Main README:** [README.md](./README.md)
- **React Docs:** https://react.dev
- **Vite Docs:** https://vitejs.dev
- **Express Docs:** https://expressjs.com
- **MongoDB Atlas:** https://mongodb.com/cloud/atlas
- **Vercel Docs:** https://vercel.com/docs

---

## Need Help?

1. Check the **Troubleshooting** section in [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)
2. View **Vercel Function Logs**: `vercel logs --follow`
3. Check browser console for client errors
4. Verify all environment variables are set correctly
5. Read the detailed [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) guide

---

**Happy coding! 🚀**
