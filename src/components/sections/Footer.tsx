import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS, SITE } from "@/lib/constants";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-crystal-dark/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src={SITE.logo} alt="" width={24} height={24} className="w-6 h-6" />
              <span className="font-heading font-bold gradient-text">
                {SITE.name}
              </span>
            </Link>
            <p className="text-muted text-sm leading-relaxed max-w-xs">
              Your partner for cutting-edge digital solutions. Web, AI, bots,
              software, and blockchain development.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h3 className="font-heading font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted text-sm link-underline hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="font-heading font-semibold text-white mb-4">
              Connect
            </h3>
            <p className="text-muted text-sm mb-2">
              <a
                href={`mailto:${SITE.email}`}
                className="link-underline hover:text-crystal-cyan"
              >
                {SITE.email}
              </a>
            </p>
            <p className="text-muted text-sm mb-2">
              <a
                href={SITE.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline hover:text-crystal-cyan"
              >
                Discord
              </a>
            </p>
            <p className="text-muted text-sm mb-4">
              <a
                href={SITE.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline hover:text-crystal-cyan"
              >
                {SITE.telegramHandle}
              </a>
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-muted text-sm">
          <p>
            &copy; {year} {SITE.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
