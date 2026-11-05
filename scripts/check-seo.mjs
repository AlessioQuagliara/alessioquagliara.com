// Controlli SEO di regressione su archivio e articoli del blog.
// Uso: BASE_URL=http://localhost:3000 node scripts/check-seo.mjs
// (dopo `npm run build && npm start`; funziona anche contro la produzione).
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const BASE_URL = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
// Origine dichiarata nei canonical e nella sitemap (lib/site-config.ts).
const SITE_URL = "https://alessioquagliara.com";
const UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

const failures = [];
const check = (ok, message) => {
  if (!ok) failures.push(message);
};

const decode = (text) =>
  text
    .replace(/<[^>]+>/g, "")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim();

const all = (html, re) => [...html.matchAll(re)].map((m) => decode(m[1]));

async function load(pathname) {
  const res = await fetch(BASE_URL + pathname, { redirect: "manual", headers: { "user-agent": UA } });
  const html = await res.text();
  return {
    status: res.status,
    location: res.headers.get("location"),
    xRobots: res.headers.get("x-robots-tag") ?? "",
    html,
    titles: all(html, /<title[^>]*>([\s\S]*?)<\/title>/g),
    canonicals: all(html, /<link rel="canonical" href="([^"]*)"/g),
    ogUrls: all(html, /<meta property="og:url" content="([^"]*)"/g),
    robots: all(html, /<meta name="robots" content="([^"]*)"/g),
    h1s: all(html, /<h1[^>]*>([\s\S]*?)<\/h1>/g),
  };
}

function checkPage(pathname, page) {
  check(page.status === 200, `${pathname}: status ${page.status}${page.location ? ` -> ${page.location}` : ""}`);
  check(page.titles.length === 1, `${pathname}: ${page.titles.length} <title>`);
  check(page.canonicals.length === 1, `${pathname}: ${page.canonicals.length} canonical`);
  check(page.canonicals[0] === SITE_URL + pathname, `${pathname}: canonical ${page.canonicals[0]}`);
  check(page.ogUrls.length === 1 && page.ogUrls[0] === SITE_URL + pathname, `${pathname}: og:url ${page.ogUrls}`);
  check(page.h1s.length === 1, `${pathname}: ${page.h1s.length} <h1>`);
  check(![...page.robots, page.xRobots].some((v) => /noindex/i.test(v)), `${pathname}: noindex`);
}

// Stessa regola di lib/blog.ts: i post con data futura non sono pubblici.
const postsDir = path.join(process.cwd(), "content", "posts");
const posts = readdirSync(postsDir)
  .filter((file) => file.endsWith(".json"))
  .map((file) => JSON.parse(readFileSync(path.join(postsDir, file), "utf8")))
  .filter((post) => new Date(post.publishedAt).getTime() <= Date.now());

const sitemap = await (await fetch(`${BASE_URL}/sitemap.xml`, { headers: { "user-agent": UA } })).text();
const locs = new Set(all(sitemap, /<loc>([^<]*)<\/loc>/g));
check(locs.has(`${SITE_URL}/blog`), "sitemap: manca /blog");

const archive = await load("/blog");
checkPage("/blog", archive);
const archiveTitle = archive.titles[0];
check(/Alessio Quagliara/.test(archiveTitle ?? ""), `/blog: title generico "${archiveTitle}"`);

const seenTitles = new Map();
for (const post of posts) {
  const pathname = `/blog/${post.slug}`;
  const page = await load(pathname);
  checkPage(pathname, page);
  const title = page.titles[0] ?? "";
  check(title.startsWith(post.title.it), `${pathname}: title "${title}" != "${post.title.it}"`);
  check(title !== archiveTitle, `${pathname}: title uguale all'archivio`);
  check(page.h1s[0] === post.title.it, `${pathname}: h1 "${page.h1s[0]}"`);
  check(!seenTitles.has(title), `${pathname}: title duplicato di ${seenTitles.get(title)}`);
  seenTitles.set(title, pathname);
  check(locs.has(SITE_URL + pathname), `sitemap: manca ${pathname}`);
  check(archive.html.includes(`href="${pathname}"`), `/blog: nessun link HTML a ${pathname}`);
}

console.log(`${BASE_URL}: archivio + ${posts.length} articoli controllati`);
if (failures.length > 0) {
  console.error(failures.map((f) => `FAIL ${f}`).join("\n"));
  process.exit(1);
}
console.log("OK");
