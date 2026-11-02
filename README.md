# RetroVerse

RetroVerse is a static game catalog with an optional Vercel serverless API for community ROM uploads.

## ROM upload API

The API lives at `/api/roms` and is intended to run on **Vercel** (GitHub Pages cannot execute server-side API routes).

- `GET /api/roms` — returns the public ROM catalog from Vercel Blob.
- `POST /api/roms` — creates a secure client-upload token using Vercel Blob's client upload flow. The request body is the body expected by `handleUpload`.

### Required setup

1. Import this GitHub repository into Vercel and deploy it as a Node.js project.
2. Create a **public Vercel Blob store** for ROMs.
3. Add the store's `BLOB_READ_WRITE_TOKEN` to the Vercel project environment variables (Production and Preview as appropriate).
4. Redeploy after adding the token.
5. Point the website's API base URL to the deployed Vercel domain (or serve the site from the same Vercel project).

### Client upload flow

Use `@vercel/blob/client`'s `upload()` in the browser and pass `/api/roms` as the handle-upload endpoint. The client payload must include:

```json
{
  "title": "Example Homebrew Game",
  "platform": "nes",
  "extension": "nes",
  "rightsConfirmed": true
}
```

Supported platform identifiers: `nes`, `game-boy`, `game-boy-color`, `game-boy-advance`, `master-system`, `game-gear`, `mega-drive`, `super-nintendo`, `nintendo-64`, `nintendo-ds`, `pc-engine`, `playstation`.

The API accepts a limited set of ROM extensions and enforces a 64 MiB maximum upload size. The uploader must affirm they have the right to share the file. This affirmation is not a substitute for moderation or a legal review; add reporting and takedown handling before opening uploads broadly.

**Important:** this API stores uploaded files in Vercel Blob, not in the Git repository. GitHub Pages alone cannot host this API or accept uploads.
