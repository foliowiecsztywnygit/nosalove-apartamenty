import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, relative, sep } from "node:path";

const rootDir = process.cwd();
const includeDist = process.argv.includes("--include-dist");
const utf8Decoder = new TextDecoder("utf-8", { fatal: true });

const sourceExtensions = new Set([".html", ".css", ".js", ".mjs"]);
const mojibakePatterns = [
  /�/u,
  /Ã./u,
  /Å./u,
  /Ä./u
];

function walk(dirPath, bucket) {
  for (const entry of readdirSync(dirPath)) {
    if (entry === "node_modules" || entry === ".git") continue;
    if (!includeDist && entry === "dist") continue;

    const fullPath = join(dirPath, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      walk(fullPath, bucket);
      continue;
    }

    if (sourceExtensions.has(extname(fullPath))) {
      bucket.push(fullPath);
    }
  }
}

function validateFile(filePath) {
  const raw = readFileSync(filePath);
  const relPath = relative(rootDir, filePath);
  const issues = [];
  let text = "";
  const skipPatternScan = relPath === join("scripts", "verify-encoding.mjs");

  try {
    text = utf8Decoder.decode(raw);
  } catch {
    issues.push("plik nie jest poprawnym UTF-8");
    return { filePath: relPath, issues };
  }

  if (text !== text.normalize("NFC")) {
    issues.push("tekst nie jest znormalizowany do NFC");
  }

  if (!skipPatternScan) {
    for (const pattern of mojibakePatterns) {
      if (pattern.test(text)) {
        issues.push(`wykryto podejrzany wzorzec: ${pattern}`);
        break;
      }
    }
  }

  if (filePath.endsWith(".html") && !/<meta charset="UTF-8"\s*\/?>/i.test(text)) {
    issues.push("brak deklaracji <meta charset=\"UTF-8\">");
  }

  return { filePath: relPath, issues };
}

const files = [];
walk(rootDir, files);

const htmlSourceFiles = files.filter(
  (filePath) => filePath.endsWith(".html") && !filePath.includes(`${sep}dist${sep}`)
);
const validated = files.map(validateFile);
const failures = validated.filter((result) => result.issues.length > 0);

if (!htmlSourceFiles.length) {
  console.error("Nie znaleziono plików HTML do weryfikacji.");
  process.exit(1);
}

if (failures.length) {
  console.error("Weryfikacja kodowania nie powiodła się:\n");

  for (const failure of failures) {
    console.error(`- ${failure.filePath}`);
    for (const issue of failure.issues) {
      console.error(`  * ${issue}`);
    }
  }

  process.exit(1);
}

console.log(
  `Kodowanie UTF-8 zweryfikowane poprawnie dla ${files.length} plików${includeDist ? " (ze zbudowanym dist)" : ""}.`
);
