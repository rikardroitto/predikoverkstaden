// ============================================================================
// PREDIKOVERKSTADEN – Lokal Node.js-server & Predikoarkiv-API
// ============================================================================

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ARCHIVE_FILE = path.join(__dirname, "sermons.json");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

function readArchive() {
  try {
    if (!fs.existsSync(ARCHIVE_FILE)) return [];
    return JSON.parse(fs.readFileSync(ARCHIVE_FILE, "utf8"));
  } catch (e) {
    return [];
  }
}

function writeArchive(list) {
  try {
    fs.writeFileSync(ARCHIVE_FILE, JSON.stringify(list.slice(0, 50), null, 2), "utf8");
  } catch (e) {
    console.error("Could not write archive:", e);
  }
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // API: Hämta eller spara predikohistorik
  if (url.pathname === "/api/sermons") {
    if (req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      return res.end(JSON.stringify(readArchive()));
    }
    if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        try {
          const item = JSON.parse(body);
          const list = readArchive();
          list.unshift(item);
          writeArchive(list);
          res.writeHead(201, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ ok: true, count: list.length }));
        } catch (err) {
          res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ error: "Invalid JSON" }));
        }
      });
      return;
    }
  }

  // Statiska filer (stöd även direktlänkarna /se, /sv och /en)
  const cleanPath = url.pathname.replace(/\/+$/, "");
  let filePath =
    cleanPath === "" || cleanPath === "/se" || cleanPath === "/sv" || cleanPath === "/en"
      ? "/index.html"
      : url.pathname;
  const fullPath = path.join(__dirname, path.normalize(filePath));

  if (!fullPath.startsWith(__dirname)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(fullPath, (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("404 Not Found");
    }
    const ext = path.extname(fullPath).toLowerCase();
    // Om ?r=N-100 eller ?score=N finns i URL:en, injicera dynamiska OpenGraph-taggar
    if (filePath === "/index.html" && (url.searchParams.has("r") || url.searchParams.has("score"))) {
      const rVal = url.searchParams.get("r") || url.searchParams.get("score") || "";
      const rawScore = parseInt(rVal, 10);
      if (!isNaN(rawScore)) {
        const sc = Math.max(0, Math.min(100, rawScore));
        const isSv =
          cleanPath === "/se" ||
          cleanPath === "/sv" ||
          url.searchParams.get("lang") === "se" ||
          url.searchParams.get("lang") === "sv";
        const ogTitle = isSv
          ? `Jag fick ${sc} av 100 poäng i "Predikoverkstaden"`
          : `I scored ${sc} out of 100 in "The Homiletics Workshop"`;
        const ogDesc = isSv
          ? `Ett homiletiskt strategispel om pastorns vardag, textens mognad och söndagens predikan. Kan du slå ${sc} av 100 poäng?`
          : `A homiletical strategy game of pastoral life, textual incubation, and Sunday preaching. Can you beat ${sc} out of 100 points?`;
        const htmlStr = content
          .toString("utf8")
          .replace(/<title>.*?<\/title>/, `<title>${ogTitle}</title>`)
          .replace(/id="og-title" content="[^"]*"/, `id="og-title" content='${ogTitle}'`)
          .replace(/id="og-desc" content="[^"]*"/, `id="og-desc" content="${ogDesc}"`);
        res.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store"
        });
        return res.end(htmlStr);
      }
    }
    res.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(content);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Predikoverkstaden server körs på http://localhost:${PORT} (och på lokalt Wi-Fi)`);
});
