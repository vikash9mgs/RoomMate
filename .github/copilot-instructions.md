# RoomMate Copilot Instructions

## Project Overview
RoomMate is a full-stack rental property listing platform with AI-powered features. The codebase follows a **client-server architecture** with:
- **Client**: React 19 + Vite, using React Router for SPA navigation
- **Server**: Node.js/Express with MongoDB, using JWT for authentication
- **AI Integration**: Google Generative AI (Gemini) for chatbot functionality

## Architecture & Data Flow

### Core Service Boundaries
1. **Authentication (JWT-based)**
   - Routes: `server/routes/auth.js` - Registration/Login
   - Context: `client/src/context/AuthContext.jsx` - Global auth state
   - Token stored in localStorage; passed in `Authorization: Bearer <token>` header
   - Roles: "user", "member", "admin" (see `ProtectedRoute.jsx`)

2. **Listing Management** (Property listings)
   - Model: `server/models/Listing.js` - Contains: user, type, title, price, location, amenities, images, coordinates
   - Routes: `server/routes/listings.js` - CRUD operations (protected with JWT middleware)
   - Client pages: `AllListingPage.jsx` (list view), `ListingDetailsPage.jsx` (detail view), `PostListing.jsx` (create)
   - Maps integration via `react-leaflet` and Leaflet for geolocation

3. **Gemini Chatbot**
   - Routes: `server/routes/chatbot.js` - Handles `/api/ask` endpoint
   - Client: `client/src/components/Chatbot.jsx` - Floating chat widget
   - Uses `@google/generative-ai` package for API calls

4. **File Upload**
   - Routes: `server/routes/upload.js` - Handles multipart image uploads
   - Stored in `/uploads` directory (served statically)

5. **Contact & Email**
   - Routes: `server/routes/contact.js` - Contact form submissions
   - Uses Nodemailer for sending emails (requires `NODEMAILER_*` env vars)

### Critical Environment Variables
**Server (.env or .env.local)**:
```
MONGO_URI=mongodb://127.0.0.1:27017/roommate (defaults to local if not set)
JWT_SECRET=your-secret-key
GOOGLE_API_KEY=your-gemini-api-key
PORT=5000
NODEMAILER_USER=email@gmail.com
NODEMAILER_PASS=app-password
```

**Client**: Uses `http://localhost:3000/api` hardcoded in fetch calls; assumes server runs on port 5000.

## Essential Workflows

### Running the Project
**Client** (from `client/`):
```bash
npm install
npm run dev        # Starts Vite on http://localhost:5173
npm run build      # Production build
npm run lint       # ESLint check
```

**Server** (from `server/`):
```bash
npm install
npm run dev        # With nodemon auto-reload
npm start          # Production (node index.js)
```

**Database**:
- Assumes MongoDB running locally on `127.0.0.1:27017`
- Use `server/seedListings.js` to populate test data
- Use `server/clearListings.js` to reset database

### Development Patterns
1. **Protected Routes**: Wrap components in `ProtectedRoute` if they require authentication
   ```jsx
   <Route path="/postlisting" element={
     <ProtectedRoute allowedRoles={['member']}>
       <PostListing />
     </ProtectedRoute>
   } />
   ```

2. **API Calls**: Always pass JWT token in header
   ```javascript
   const token = localStorage.getItem("token");
   fetch("/api/listings", {
     headers: { Authorization: `Bearer ${token}` }
   })
   ```

3. **Context Usage**: Auth and Theme contexts are global
   ```jsx
   import { useAuth } from "./context/AuthContext";
   const { user, token, login, logout } = useAuth();
   ```

4. **Styling**: Mix of Bootstrap (via `react-bootstrap`), CSS modules, and `styled-components`
   - Component-scoped CSS files (e.g., `ListingCard.css` paired with `ListingCard.jsx`)

## Key Files to Know
- `server/index.js` - Entry point; shows all route registrations and middleware stack
- `server/models/User.js`, `server/models/Listing.js` - Schema definitions (Mongoose)
- `client/src/App.jsx` - Route definitions; shows all pages and protected routes
- `client/src/context/AuthContext.jsx` - Global auth state management
- `client/src/components/ProtectedRoute.jsx` - Route protection logic

## Important Conventions
1. **Import format**: Project uses ES6 modules (`import`/`export`)
2. **Async handling**: Server uses async/await; client uses fetch API
3. **Error handling**: Minimal; add try-catch blocks when adding API calls
4. **Role-based access**: Check `user.role` in database or auth context
5. **Listings**: Each listing linked to a user via `user` field (foreign key)

## Known Gotchas
- **Port hardcoding**: Client hardcodes `http://localhost:3000/api` for API calls; change if server port differs
- **MongoDB defaults**: Falls back to local MongoDB if `MONGO_URI` is missing/invalid (see `config/db.js`)
- **ESM-only**: Server uses `import` only (no CommonJS); requires top-level await for dynamic imports
- **dotenv timing**: In `server/index.js`, dotenv must be loaded BEFORE route imports so they see env vars

## Testing & Debugging
- **No automated tests configured** - add Jest/Vitest if needed
- **Chatbot debugging**: Check `/api/ask` endpoint in `server/routes/chatbot.js` and browser console
- **Auth issues**: Verify JWT_SECRET and token in localStorage
- **Map not loading**: Check Leaflet CSS import and coordinates (latitude/longitude) presence in listings
