import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faInstagram, faLinkedin, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { GITHUB_URL, INSTAGRAM_URL, LINKEDIN_URL, YOUTUBE_URL } from "@/lib/site-config";

const SOCIALS = [
  { name: "GitHub", url: GITHUB_URL, icon: faGithub },
  { name: "LinkedIn", url: LINKEDIN_URL, icon: faLinkedin },
  { name: "YouTube", url: YOUTUBE_URL, icon: faYoutube },
  { name: "Instagram", url: INSTAGRAM_URL, icon: faInstagram },
];

export function SocialLinks({ label }: { label: string }) {
  return (
    <ul className="flex items-center gap-2" aria-label={label}>
      {SOCIALS.map((social) => (
        <li key={social.name}>
          <a
            href={social.url}
            target="_blank"
            rel="noreferrer"
            aria-label={social.name}
            className="grid h-10 w-10 place-items-center rounded-lg text-[#c9ddff] transition-colors hover:bg-white/5 hover:text-white"
          >
            <FontAwesomeIcon icon={social.icon} className="h-5 w-5" />
          </a>
        </li>
      ))}
    </ul>
  );
}
