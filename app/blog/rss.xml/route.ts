import { marked } from "marked";
import { getLocalizedBlogPosts, type LocalizedBlogPost } from "@/lib/blog";
import { SITE_URL } from "@/lib/site-config";

// I post programmati entrano nel feed entro un minuto, senza rebuild.
export const revalidate = 60;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// "]]>" chiuderebbe il CDATA in anticipo.
const cdata = (s: string) => `<![CDATA[${s.replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;

function renderPost(post: LocalizedBlogPost): string {
  const html = post.sections.map((section) => {
    const title = section.title ? `<h2>${esc(section.title)}</h2>` : "";
    const image = section.image ? `<img src="${section.image}" alt="" />` : "";
    return title + image + marked.parse(section.body, { async: false });
  });
  // I lettori RSS non conoscono il dominio: i path "/..." diventano assoluti.
  return `<img src="${post.cover}" alt="" />${html.join("")}`.replace(
    /(src|href)="\/(?!\/)/g,
    `$1="${SITE_URL}/`
  );
}

export function GET() {
  const posts = getLocalizedBlogPosts("it");
  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      return `<item>
<title>${esc(post.title)}</title>
<link>${url}</link>
<guid isPermaLink="true">${url}</guid>
<pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
<description>${esc(post.description)}</description>
<content:encoded>${cdata(renderPost(post))}</content:encoded>
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>Alessio Quagliara · Blog</title>
<link>${SITE_URL}/blog</link>
<atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
<description>Sviluppo software, automazioni e AI. Senza fuffa.</description>
<language>it</language>
${posts[0] ? `<lastBuildDate>${new Date(posts[0].updatedAt ?? posts[0].publishedAt).toUTCString()}</lastBuildDate>` : ""}
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
