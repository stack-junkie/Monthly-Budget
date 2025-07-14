import { Link as I18nLink } from "@/i18n/routing";
import { GithubIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { SiReddit, SiX } from "react-icons/si";

export default function Footer() {
  const t = useTranslations("Home");
  const tFooter = useTranslations("Footer");
  return (
    <div className="bg-gray-800 dark:bg-primary-foreground text-gray-300">
      <footer className="py-2 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-12 lg:grid-cols-4">
            <div className="w-full flex flex-col gap-4 col-span-full md:col-span-2">
              <div className="space-y-4 flex-1">
                <div className="flex flex-col">
                  <span className="text-white text-4xl font-bold">
                    {t("title")}
                  </span>
                  <span className="text-gray-400 text-sm">
                    by Stack-Junkie.com
                  </span>
                </div>

                <p className="text-sm pr-4 md:pr-12">{t("tagLine")}</p>

                <div className="flex items-center gap-2">
                  <a
                    href="https://github.com/stack-junkie"
                    target="_blank"
                    rel="noreferrer nofollow noopener"
                    aria-label="GitHub"
                    title="View on GitHub"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
                  >
                    <GithubIcon className="size-4" aria-hidden="true" />
                  </a>
                  <a
                    href="https://www.reddit.com/user/Stack-Junkie/"
                    target="_blank"
                    rel="noreferrer nofollow noopener"
                    aria-label="Reddit"
                    title="View on Reddit"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
                  >
                    <SiReddit className="w-4 h-4" aria-hidden="true" />
                  </a>
                  <a
                    href="https://x.com/Stack_Junkie"
                    target="_blank"
                    rel="noreferrer nofollow noopener"
                    aria-label="Twitter"
                    title="View on Twitter"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
                  >
                    <SiX className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            {footerLinks.map((section) => (
              <div key={section.title}>
                <h3 className="text-white text-lg font-semibold mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-2 text-sm">
                  {section.links.map((link, index) => (
                    <li key={`${link.href}-${link.label}-${index}`}>
                      {link.href.startsWith("/") && !link.useA ? (
                        <I18nLink
                          href={link.href}
                          title={link.label}
                          prefetch={false}
                          className="hover:text-white transition-colors"
                          target={link.target || ""}
                          rel={link.rel || ""}
                        >
                          {link.label}
                        </I18nLink>
                      ) : (
                        <a
                          href={link.href}
                          title={link.label}
                          className="hover:text-white transition-colors"
                          target={link.target || ""}
                          rel={link.rel || ""}
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>
      <div className="mt-2 p-4 flex flex-col justify-center items-center border-t border-gray-700 text-center text-sm text-gray-400 space-y-2">
        <div className="space-y-1">
          <div>Created by Stack-Junkie</div>
          <div>
            <a
              href="https://stack-junkie.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Visit Stack-Junkie.com
            </a>
          </div>
        </div>
        <span>
          {tFooter("Copyright", { year: new Date().getFullYear() })}
        </span>
      </div>
    </div>
  );
}

type FooterLink = {
  title: string;
  links: Link[];
};

type Link = {
  href: string;
  label: string;
  target?: string;
  rel?: string;
  useA?: boolean;
};

const footerLinks: FooterLink[] = [
  {
    title: "Features",
    links: [
      { href: "/budget", label: "Budget Tracker" },
      { href: "/budget", label: "Smart Categories" },
      { href: "/budget", label: "Export Data" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "https://github.com/stack-junkie/budget-spreadsheet-app", label: "Source Code", target: "_blank", rel: "noopener noreferrer" },
      { href: "https://stack-junkie.com", label: "Stack-Junkie.com", target: "_blank", rel: "noopener noreferrer" },
    ],
  },
];