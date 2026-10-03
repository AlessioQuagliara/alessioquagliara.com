import Link from "next/link";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import { AnimatedFaIcon } from "@/components/ui/animated-fa-icon";
import { getMessages, type Locale } from "@/lib/i18n";
import { getLandingPath, type LandingKey } from "@/lib/landings";

const SERVICE_KEYS: LandingKey[] = ["freelance", "industrial"];

/** Link alle landing servizi, con anchor text descrittivo. */
export function ServiceLinks({
  locale,
  tone = "light",
  showIntro = true,
}: {
  locale: Locale;
  tone?: "light" | "dark";
  showIntro?: boolean;
}) {
  const services = getMessages(locale).site.services;
  const isLight = tone === "light";

  return (
    <nav aria-label={services.title}>
      <p className={`text-xs uppercase tracking-[0.28em] ${isLight ? "text-[#3f63a8]" : "text-[#c9ddff]"}`}>
        {services.title}
      </p>
      {showIntro ? (
        <p className={`mt-3 text-sm leading-7 ${isLight ? "text-[#35548c]" : "text-[#d8e7ff]"}`}>
          {services.intro}
        </p>
      ) : null}
      <ul className="mt-4 grid gap-4 md:grid-cols-2">
        {SERVICE_KEYS.map((key) => (
          <li key={key}>
            <Link
              href={getLandingPath(key, locale)}
              className={`group flex h-full flex-col rounded-2xl border p-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ab0ff] ${
                isLight
                  ? "border-[#c9dbff] bg-white hover:border-[#2664eb]"
                  : "border-white/12 bg-[#081d48]/45 hover:border-[#8cb4ff]/60"
              }`}
            >
              <span
                className={`flex items-center gap-2 font-semibold ${isLight ? "text-[#102e66]" : "text-white"}`}
              >
                <span>{services[key].label}</span>
                <AnimatedFaIcon icon={faArrowRight} animation="float" className="text-xs" />
              </span>
              <span className={`mt-2 text-sm leading-6 ${isLight ? "text-[#35548c]" : "text-[#d8e7ff]"}`}>
                {services[key].text}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
