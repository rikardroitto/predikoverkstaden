// Generates static OpenGraph HTML files in:
//   - r/<score>-av-100.html (matching nt2026-eller-nt1981's r/5-av-10.html pattern)
//   - share/se/<score>.html
//   - share/en/<score>.html
// so that 100% static hosts (like GitHub Pages) display "Jag fick N av 100 poäng!" / "I scored N out of 100!"
// directly in social media link previews ("sidospegeln"), and redirect human visitors to
// the minimalist shared landing screen (?r=N-100 or ?score=N).

const fs = require("fs");
const path = require("path");

const rDir = path.join(__dirname, "r");
const seDir = path.join(__dirname, "share", "se");
const enDir = path.join(__dirname, "share", "en");
fs.mkdirSync(rDir, { recursive: true });
fs.mkdirSync(seDir, { recursive: true });
fs.mkdirSync(enDir, { recursive: true });

const BASE_URL = "https://rikardroitto.github.io/predikoverkstaden";

for (let score = 0; score <= 100; score++) {
  const titleSv = `Jag fick ${score} av 100 poäng i "Predikoverkstaden"`;
  const descSv = `Ett homiletiskt strategispel om pastorns vardag, textens mognad och söndagens predikan. Kan du slå ${score} av 100 poäng?`;

  // 1. r/<score>-av-100.html (exakt som i nt2026-eller-nt1981)
  const htmlR = `<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titleSv}</title>
<meta name="description" content="${descSv}">
<meta property="og:type" content="website">
<meta property="og:locale" content="sv_SE">
<meta property="og:site_name" content="Predikoverkstaden">
<meta property="og:title" content='${titleSv}'>
<meta property="og:description" content="${descSv}">
<meta property="og:url" content="${BASE_URL}/r/${score}-av-100.html">
<meta name="twitter:card" content="summary">
<script>location.replace("../?r=${score}-100&lang=se");</script>
</head>
<body style="font-family:system-ui,sans-serif;text-align:center;padding:48px 16px">
<p>${titleSv}.</p>
<p><a href="../?r=${score}-100&lang=se">Spela Predikoverkstaden</a></p>
</body>
</html>`;
  fs.writeFileSync(path.join(rDir, `${score}-av-100.html`), htmlR, "utf8");

  // 2. share/se/<score>.html
  const htmlSv = `<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titleSv}</title>
<meta name="description" content="${descSv}">
<meta property="og:type" content="website">
<meta property="og:locale" content="sv_SE">
<meta property="og:site_name" content="Predikoverkstaden">
<meta property="og:title" content='${titleSv}'>
<meta property="og:description" content="${descSv}">
<meta property="og:url" content="${BASE_URL}/share/se/${score}.html">
<meta name="twitter:card" content="summary">
<script>location.replace("../../?r=${score}-100&lang=se");</script>
</head>
<body style="font-family:system-ui,sans-serif;text-align:center;padding:48px 16px">
<p>${titleSv}.</p>
<p><a href="../../?r=${score}-100&lang=se">Spela Predikoverkstaden</a></p>
</body>
</html>`;
  fs.writeFileSync(path.join(seDir, `${score}.html`), htmlSv, "utf8");

  // 3. share/en/<score>.html
  const titleEn = `I scored ${score} out of 100 in "The Homiletics Workshop"`;
  const descEn = `A homiletical strategy game of pastoral life, textual incubation, and Sunday preaching. Can you beat ${score} out of 100 points?`;
  const htmlEn = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titleEn}</title>
<meta name="description" content="${descEn}">
<meta property="og:type" content="website">
<meta property="og:locale" content="en_US">
<meta property="og:site_name" content="The Homiletics Workshop">
<meta property="og:title" content='${titleEn}'>
<meta property="og:description" content="${descEn}">
<meta property="og:url" content="${BASE_URL}/share/en/${score}.html">
<meta name="twitter:card" content="summary">
<script>location.replace("../../?r=${score}-100&lang=en");</script>
</head>
<body style="font-family:system-ui,sans-serif;text-align:center;padding:48px 16px">
<p>${titleEn}.</p>
<p><a href="../../?r=${score}-100&lang=en">Play The Homiletics Workshop</a></p>
</body>
</html>`;
  fs.writeFileSync(path.join(enDir, `${score}.html`), htmlEn, "utf8");
}

console.log("Generated static OpenGraph share pages in r/, share/se/, and share/en/.");
