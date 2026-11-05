import Link from "next/link";

import { buttonClass } from "@/components/ui/button";
import { getBlogPost, getLocalizedBlogPost } from "@/lib/blog";
import { getMessages, withLang, type Locale } from "@/lib/i18n";
import type { LandingKey } from "@/lib/landings";

/** Articoli sul tema della vecchia offerta: restano utili anche senza servizio. */
const RELATED_POSTS: Record<LandingKey, string[]> = {
  freelance: ["automazione-freelancer-clienti-flussi"],
  industrial: ["ai-pmi-como-ollama-llamacpp", "flask-warehouse-app"],
  saas: [],
};

/**
 * Landing di un servizio che non offro più: l'URL resta (niente 404),
 * il testo dice com'è andata e rimanda a progetti e articoli.
 */
export function ArchivedLanding({ landing, locale }: { landing: LandingKey; locale: Locale }) {
  const { landings, landingCommon, layout } = getMessages(locale).site;
  const content = landings[landing];
  const posts = RELATED_POSTS[landing].flatMap((slug) => {
    const post = getBlogPost(slug);
    return post ? [getLocalizedBlogPost(post, locale)] : [];
  });

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-24">
      <p className="text-xs uppercase tracking-[0.28em] text-[#c9ddff]">{landingCommon.eyebrow}</p>
      <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
        {content.title}
      </h1>
      <p className="mt-5 text-lg leading-8 text-[#e6f0ff]">{content.text}</p>

      {posts.length > 0 ? (
        <>
          <h2 className="mt-10 text-sm font-semibold uppercase tracking-wider text-white">
            {landingCommon.related}
          </h2>
          <ul className="mt-4 space-y-2">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={withLang(`/blog/${post.slug}`, locale)}
                  className="text-[#c8dcff] underline underline-offset-4 hover:text-white"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <div className="mt-10 flex flex-wrap gap-4">
        <Link href={withLang("/projects", locale)} className={buttonClass({ variant: "primary", size: "lg" })}>
          {layout.navbar.projects}
        </Link>
        <Link href={withLang("/casi-studio", locale)} className={buttonClass({ variant: "secondary", size: "lg" })}>
          {layout.navbar.caseStudies}
        </Link>
        <Link href={withLang("/blog", locale)} className={buttonClass({ variant: "secondary", size: "lg" })}>
          {layout.navbar.blog}
        </Link>
      </div>
    </section>
  );
}
