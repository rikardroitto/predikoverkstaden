// Generates 100% standalone static HTML result pages (0..100) for both Swedish and English:
//   - s/0.html .. s/100.html (Swedish static result pages)
//   - en/0.html .. en/100.html (English static result pages)
//   - r/0-av-100.html .. r/100-av-100.html (Swedish static result pages, nt2026-eller-nt1981 pattern)
//   - share/se/0.html .. 100.html & share/en/0.html .. 100.html
//
// Each page is a complete, self-contained HTML page (no fragile JS redirect needed!) with:
//   1. Full OpenGraph + Twitter Card tags including a dedicated 1200x630 PNG image (og/sv-<score>.png or og/en-<score>.png)
//   2. The clean landing screen showing the shared score ("Någon har delat sitt resultat: N av 100 poäng. Kan du slå det?")
//   3. A prominent "Spela" / "Play" button that opens the game directly in the chosen language.

const fs = require("fs");
const path = require("path");

const BASE_URL = "https://rikardroitto.github.io/predikoverkstaden";

const sDir = path.join(__dirname, "s");
const enDirRoot = path.join(__dirname, "en");
const rDir = path.join(__dirname, "r");
const shareSeDir = path.join(__dirname, "share", "se");
const shareEnDir = path.join(__dirname, "share", "en");

[sDir, enDirRoot, rDir, shareSeDir, shareEnDir].forEach((dir) => {
  fs.mkdirSync(dir, { recursive: true });
});

function buildStaticScorePage({ score, lang, canonicalPath, relRoot }) {
  const isEn = lang === "en";
  const pageTitle = isEn
    ? `I scored ${score} out of 100 in "The Homiletics Workshop"`
    : `Jag fick ${score} av 100 poäng i "Predikoverkstaden"`;
  const pageTitleAttr = isEn
    ? `I scored ${score} out of 100 in &quot;The Homiletics Workshop&quot;`
    : `Jag fick ${score} av 100 poäng i &quot;Predikoverkstaden&quot;`;
  const desc = isEn
    ? `A homiletical strategy game of pastoral life, textual incubation, and Sunday preaching. Can you beat ${score} out of 100 points?`
    : `Ett homiletiskt strategispel om pastorns vardag, textens mognad och söndagens predikan. Kan du slå ${score} av 100 poäng?`;

  const ogLocale = isEn ? "en_US" : "sv_SE";
  const siteName = isEn ? "The Homiletics Workshop" : "Predikoverkstaden";
  const ogUrl = `${BASE_URL}/${canonicalPath}`;
  const ogImg = `${BASE_URL}/og/${isEn ? "en" : "sv"}-${score}.png`;

  const heroTitle = isEn ? "The Homiletics Workshop" : "Predikoverkstaden";
  const heroLead = isEn
    ? "A homiletical strategy game of pastoral life, textual incubation, and Sunday preaching."
    : "Ett homiletiskt strategispel om pastorns vardag, textens mognad och söndagens predikan.";
  const friendHtml = isEn
    ? `Someone shared their score: <strong>${score} out of 100 points</strong>. Can you beat it?`
    : `Någon har delat sitt resultat: <strong>${score} av 100 poäng</strong>. Kan du slå det?`;
  const playLabel = isEn ? "Play" : "Spela";
  const playHref = isEn ? `${relRoot}?lang=en` : `${relRoot}?lang=se`;
  const svHref = `${relRoot}s/${score}.html`;
  const enHref = `${relRoot}en/${score}.html`;

  return `<!doctype html>
<html lang="${isEn ? "en" : "sv"}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${pageTitle}</title>
<meta name="description" content="${desc}">
<meta property="og:type" content="website">
<meta property="og:locale" content="${ogLocale}">
<meta property="og:site_name" content="${siteName}">
<meta property="og:title" content="${pageTitleAttr}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${ogUrl}">
<meta property="og:image" content="${ogImg}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${pageTitleAttr}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${ogImg}">
<style>
:root {
  --bg: #F6F3EC;
  --surface: #FFFFFF;
  --ink: #1D232A;
  --muted: #59636E;
  --line: #E0D9CB;
  --accent: #1F3A5F;
  --accent-ink: #FFFFFF;
  --shadow: 0 1px 2px rgba(29,35,42,.06), 0 6px 18px rgba(29,35,42,.07);
  --serif: "Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, "Times New Roman", serif;
  --sans: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  background: var(--bg);
  color: var(--ink);
  font: 17px/1.55 var(--sans);
  -webkit-font-smoothing: antialiased;
}
.wrap {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px 16px 48px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
header.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 0 18px;
}
.brand {
  font-family: var(--serif);
  font-weight: 700;
  font-size: 18px;
  color: var(--ink);
  text-decoration: none;
}
.lang-switch {
  display: flex;
  gap: 6px;
}
.flag-link {
  display: inline-flex;
  align-items: center;
  padding: 4px 6px;
  border-radius: 6px;
  border: 1.5px solid transparent;
  opacity: 0.65;
  transition: opacity .15s, border-color .15s;
}
.flag-link.active {
  opacity: 1;
  border-color: var(--accent);
  background: rgba(31,58,95,0.08);
}
.flag-link:hover { opacity: 1; }
main {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.hero {
  text-align: center;
  padding: 4vh 0 2vh;
}
.hero h1 {
  font-family: var(--serif);
  font-size: clamp(34px, 7vw, 62px);
  line-height: 1.08;
  margin: 0 0 14px;
  letter-spacing: -.01em;
  color: var(--accent);
}
.lead {
  max-width: 620px;
  margin: 0 auto 30px;
  color: var(--muted);
  font-size: 18px;
}
.friend {
  max-width: 560px;
  margin: 0 auto 28px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 16px 20px;
  box-shadow: var(--shadow);
  font-size: 18px;
}
.friend strong {
  font-variant-numeric: tabular-nums;
  color: var(--accent);
}
.choices {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
}
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font: inherit;
  font-weight: 650;
  border-radius: 12px;
  border: 1.5px solid var(--accent);
  background: var(--accent);
  color: var(--accent-ink);
  padding: 14px 40px;
  font-size: 18px;
  min-width: 180px;
  min-height: 52px;
  text-decoration: none;
  cursor: pointer;
  transition: transform .08s ease, filter .15s ease;
}
.btn:hover { filter: brightness(1.08); }
.btn:active { transform: translateY(1px); }
</style>
<script data-goatcounter="https://nt2026vsnt1981.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>
</head>
<body>
  <div class="wrap">
    <header class="bar">
      <a class="brand" href="${playHref}">⛪ ${heroTitle}</a>
      <div class="lang-switch">
        <a class="flag-link ${!isEn ? "active" : ""}" href="${svHref}" title="Svenska">
          <svg viewBox="0 0 16 10" width="24" height="15" aria-hidden="true">
            <rect width="16" height="10" fill="#006aa7"/>
            <rect x="5" y="0" width="2" height="10" fill="#fecc00"/>
            <rect x="0" y="4" width="16" height="2" fill="#fecc00"/>
          </svg>
        </a>
        <a class="flag-link ${isEn ? "active" : ""}" href="${enHref}" title="English">
          <svg viewBox="0 0 60 30" width="24" height="15" aria-hidden="true">
            <rect width="60" height="30" fill="#012169"/>
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/>
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" stroke-width="2.5"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/>
          </svg>
        </a>
      </div>
    </header>
    <main>
      <section class="hero">
        <h1>${heroTitle}</h1>
        <p class="lead">${heroLead}</p>
        <div class="friend">${friendHtml}</div>
        <div class="choices">
          <a class="btn" href="${playHref}">${playLabel}</a>
        </div>
      </section>
    </main>
  </div>
</body>
</html>`;
}

for (let score = 0; score <= 100; score++) {
  // 1. s/<score>.html (Svenska fristående statiska sidor)
  fs.writeFileSync(
    path.join(sDir, `${score}.html`),
    buildStaticScorePage({
      score,
      lang: "sv",
      canonicalPath: `s/${score}.html`,
      relRoot: "../"
    }),
    "utf8"
  );

  // 2. en/<score>.html (Engelska fristående statiska sidor)
  fs.writeFileSync(
    path.join(enDirRoot, `${score}.html`),
    buildStaticScorePage({
      score,
      lang: "en",
      canonicalPath: `en/${score}.html`,
      relRoot: "../"
    }),
    "utf8"
  );

  // 3. r/<score>-av-100.html (Svenska fristående statiska sidor i r/)
  fs.writeFileSync(
    path.join(rDir, `${score}-av-100.html`),
    buildStaticScorePage({
      score,
      lang: "sv",
      canonicalPath: `r/${score}-av-100.html`,
      relRoot: "../"
    }),
    "utf8"
  );

  // 4. share/se/<score>.html & share/en/<score>.html (Bakåtkompatibilitet)
  fs.writeFileSync(
    path.join(shareSeDir, `${score}.html`),
    buildStaticScorePage({
      score,
      lang: "sv",
      canonicalPath: `share/se/${score}.html`,
      relRoot: "../../"
    }),
    "utf8"
  );

  fs.writeFileSync(
    path.join(shareEnDir, `${score}.html`),
    buildStaticScorePage({
      score,
      lang: "en",
      canonicalPath: `share/en/${score}.html`,
      relRoot: "../../"
    }),
    "utf8"
  );
}

console.log("Generated 100% standalone static HTML score pages in s/, en/, r/, and share/.");
