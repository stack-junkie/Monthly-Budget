import { SiteConfig } from "@/types/siteConfig";

export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const SOURCE_CODE_URL = "https://github.com/stack-junkie/budget-spreadsheet-app";

const GITHUB_URL = 'https://github.com/stack-junkie'

export const siteConfig: SiteConfig = {
  name: "Monthly Budget",
  tagLine: 'Smart Personal Finance Tracker',
  description:
    "Take control of your finances with our intuitive monthly budget tracker. Create custom categories, track expenses, and export your data with enterprise-level security.",
  url: BASE_URL,
  authors: [
    {
      name: "stack-junkie",
      url: "https://github.com/stack-junkie",
    }
  ],
  creator: '@stack-junkie',
  socialLinks: {
    github: GITHUB_URL,
  },
  themeColors: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  defaultNextTheme: 'system', // next-theme option: system | dark | light
  icons: {
    icon: "/favicon.ico",
    shortcut: "/logo.png",
    apple: "/logo.png", // apple-touch-icon.png
  },
}
