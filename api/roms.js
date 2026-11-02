const { handleUpload } = require("@vercel/blob/client");
const { list } = require("@vercel/blob");

const ALLOWED_EXTENSIONS = new Set([
  "nes", "unf", "unif", "gb", "gbc", "gba", "sms", "gg",
  "md", "gen", "smd", "sfc", "smc", "z64", "n64", "v64",
  "nds", "3ds", "pce", "iso", "chd", "cue", "bin"
]);
const ALLOWED_PLATFORMS = new Set([
  "nes", "game-boy", "game-boy-color", "game-boy-advance",
  "master-system", "game-gear", "mega-drive", "super-nintendo",
  "nintendo-64", "nintendo-ds", "pc-engine", "playstation"
]);
const MAX_SIZE = 64 * 1024 * 1024;

function send(res, status, data) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(data));
}

function cleanText(value, max) {
  return typeof value === "string" ? value.trim().replace(/[<>]/g, "").slice(0, max) : "";
}

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const result = await list({ prefix: "roms/", limit: 1000 });
      const games = result.blobs
        .filter((blob) => !blob.pathname.endsWith("/"))
        .map((blob) => {
          const parts = blob.pathname.split("/");
          const platform = parts[1] || "unknown";
          const filename = parts.slice(2).join("/");
          const title = decodeURIComponent(filename.replace(/-[a-zA-Z0-9]{6,}(?=\.)/, "").replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
          return {
            id: blob.pathname,
            title,
            platform,
            url: blob.url,
            size: blob.size,
            uploadedAt: blob.uploadedAt
          };
        });
      return send(res, 200, { games });
    } catch (error) {
      console.error("ROM catalog error:", error);
      return send(res, 500, { error: "Could not load the ROM catalog." });
    }
  }

  if (req.method === "POST") {
    try {
      const response = await handleUpload({
        body: req.body,
        request: req,
        onBeforeGenerateToken: async (_pathname, clientPayload) => {
          let payload;
          try { payload = JSON.parse(clientPayload || "{}"); } catch { payload = {}; }
          const title = cleanText(payload.title, 80);
          const platform = cleanText(payload.platform, 32).toLowerCase();
          const extension = cleanText(payload.extension, 8).replace(/^\./, "").toLowerCase();

          if (!title || !ALLOWED_PLATFORMS.has(platform)) {
            throw new Error("A valid game title and supported platform are required.");
          }
          if (!ALLOWED_EXTENSIONS.has(extension)) {
            throw new Error("This ROM file extension is not supported.");
          }
          if (payload.rightsConfirmed !== true) {
            throw new Error("You must confirm that you have the right to share this file.");
          }

          const slug = title.normalize("NFKD").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase() || "game";
          return {
            pathname: `roms/${platform}/${slug}.${extension}`,
            addRandomSuffix: true,
            maximumSizeInBytes: MAX_SIZE,
            allowedContentTypes: ["application/octet-stream", "application/zip", "application/x-zip-compressed"],
            tokenPayload: JSON.stringify({ title, platform, rightsConfirmed: true })
          };
        },
        onUploadCompleted: async ({ blob, tokenPayload }) => {
          // The Blob is immediately discoverable through GET /api/roms.
          // Keep this callback lightweight; never store ROM binaries in Git.
          console.info("ROM uploaded:", blob.pathname, tokenPayload ? "rights confirmed" : "no payload");
        }
      });
      return send(res, 200, response);
    } catch (error) {
      console.error("ROM upload error:", error);
      return send(res, 400, { error: error.message || "ROM upload failed." });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return send(res, 405, { error: "Method not allowed." });
};
