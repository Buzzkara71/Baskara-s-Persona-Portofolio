/*
 * Site content. Edit this file to update the portfolio — no build step required.
 */
window.CONFIG = {
  // Background music shown on the BGM button. Volume: 0–1.
  music: {
    title: "Color Your Night",
    volume: 0.45,
    credit: "“Color Your Night” — Persona 3 Reload Original Soundtrack. Music by Atsushi Kitajoh, vocals by Lotus Juice & Azumi Takahashi. © ATLUS © SEGA. All rights reserved."
  },
  // Extra lines shown under "Credits" on the About page.
  credits: [
    "Background video & visual style inspired by Persona 3 Reload. © ATLUS © SEGA. All rights reserved.",
    "Fan-made portfolio. Not affiliated with or endorsed by ATLUS or SEGA."
  ],

  name: "BASKARA DWIPA RAHARJA",
  role: "IT Technician Support",

  // Listed top to bottom as I, II, III... Use { soon: true } for a locked "Coming Soon" slot.
  experience: [
    { title: "PT Arus Digital Sinergi", sub: "Business Development Intern", period: "Jan 2026 – Mar 2026", type: "Internship",
      desc: "Supported the business development team with market research, prospect lists and client outreach, and helped prepare proposals and presentation materials for potential partners.",
      tags: ["Market Research", "Client Outreach", "Proposal Writing", "Presentation", "Teamwork"], url: null },
    { title: "Batu Ampar Container Terminal", sub: "IT Technician Support", period: "Apr 2026 – Present", type: "Full-time",
      desc: "Keep the terminal's IT running day to day: troubleshoot PCs, printers and peripherals, maintain the office network, handle user support tickets, and help keep operational devices and systems online so container handling is not interrupted.",
      tags: ["Hardware Troubleshooting", "Network & LAN/Wi-Fi", "Helpdesk Support", "Windows & User Accounts", "Printer & Peripheral Setup", "CCTV & Device Maintenance"], url: null },
    { soon: true },
    { soon: true },
    { soon: true }
  ],
  // Rank is 1–10; 10 displays as MAX.
  skills: [
    { tab: "FRONTEND", heading: "Frontend & Web Engineering", items: [
      ["JavaScript / TypeScript", 9], ["React · Next.js", 8], ["HTML5 · Modern CSS · Tailwind", 10],
      ["Svelte · Vue 3", 7], ["Canvas · WebGL", 6], ["UI/UX Design · Figma", 8] ] },
    { tab: "BACKEND", heading: "Backend & Data", items: [
      ["Node.js · Express", 7], ["REST & GraphQL APIs", 7], ["PostgreSQL · Prisma", 6], ["Firebase · Supabase", 7] ] },
    { tab: "TOOLS", heading: "Workflow & Tools", items: [
      ["Git · GitHub Actions", 8], ["Vite · Webpack", 7], ["Testing · Vitest · Playwright", 6], ["Linux & Terminal", 7] ] },
    { tab: "LANGUAGES", heading: "Language Proficiency", items: [
      ["Bahasa Indonesia (Native)", 10], ["English (Professional Working)", 8], ["English (Technical Writing)", 8], ["Japanese (Basic)", 4] ] }
  ],
  about: {
    bio: [
      "Hi, I'm Baskara Dwipa Raharja. I believe that every challenge is an opportunity to improve, and every role is a chance to develop both technical and interpersonal skills.",
      "I am eager to take on responsibilities, work with integrity, and become part of a team that values innovation and collaboration."
    ],
    facts: [["Based in", "Tanjungpinang – Batam"], ["Status", "Working"], ["Focus", "IT Technician"]],
    quote: "Make it work, make it right, make it fast.",
    quoteBy: "Kent Beck"
  },
  // copy: true copies the value on click; href opens a link in a new tab.
  contact: [
    { service: "Email", value: "buzzkara3011@gmail.com", copy: true, icon: "mail" },
    { service: "GitHub", value: "github.com/Buzzkara71", href: "https://github.com/Buzzkara71", icon: "code" },
    { service: "LinkedIn", value: "linkedin.com/in/buzzkara", href: "https://www.linkedin.com/in/buzzkara", icon: "brief" },
    { service: "Instagram", value: "@ba_skraaa", href: "https://www.instagram.com/ba_skraaa/", icon: "camera" }
  ]
};
