# Server (Express) — Local setup

This file explains how to configure the server's environment variables and test the Gemini (Google Generative AI) integration locally.

1) Create a local `.env`

From the `server/` directory copy the example and edit it:

```bash
cp .env.example .env
# Then open server/.env in your editor and replace the placeholder with your real key
```

Set the Gemini API key in `server/.env`:

```bash
GEMINI_API_KEY=YOUR_REAL_GEMINI_API_KEY_GOES_HERE
```

Do NOT commit `.env` to git.

2) Confirm the key is valid in Google Cloud

- In the Google Cloud Console ensure the "Generative AI" (or "Generative Language") API is enabled for the project that issued the key.
- Check the API key's restrictions (API restrictions or IP restrictions) — try temporarily removing restrictions while testing.
- Confirm billing is enabled for the project if required by the API.

3) Restart the server

If the server was running when you added/changed `server/.env`, restart it so `process.env` is reloaded. From project root:

```bash
# example: change into server and start (replace with your dev command if different)
cd server
npm install    # if you haven't installed dependencies
node index.js  # or `npm run dev` if you use a dev script
```

4) Run the quick test request

From project root (one-off script included):

```bash
node server/test_request.mjs
```

You should see a 200 status and the JSON reply from the Gemini call. If you see a 500 with a message about the API key, check the steps above.

5) Common troubleshooting

- Error: "API key not valid": ensure you copied the correct key value and that it's enabled for the Generative API and not restricted to other APIs/IPs.
- Error: 403/permission: ensure the key belongs to a Google Cloud project with the API enabled and billing set up.
- If you still can't get a valid response, paste the exact error message (server logs) here and I'll help interpret it.

Security notes
- Never commit `.env` containing secrets to version control.
- For production, use a secure secrets manager (Google Secret Manager, environment settings in your deployment platform, etc.).

Happy testing!
