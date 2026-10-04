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
  // Each skill: [name, short description of what you do with it].
  skills: [
    { tab: "HARDWARE", heading: "Hardware & Peripherals", items: [
      ["PC & Laptop Troubleshooting", "Diagnose boot, performance and component faults, then repair or replace parts to get users working again."],
      ["Workstation Setup", "Assemble, upgrade and deploy desktops and laptops ready for daily operations."],
      ["Printer & Peripheral Setup", "Install, configure and maintain printers, scanners, monitors and input devices."],
      ["CCTV & Device Maintenance", "Run routine checks and first-line fixes on cameras and operational devices."]
    ] },
    { tab: "NETWORK", heading: "Networking", items: [
      ["LAN & Wi-Fi Troubleshooting", "Trace connectivity issues across cables, switches and access points."],
      ["Network Cabling", "Crimp, test and organize UTP cabling for workstations and devices."],
      ["IP Configuration", "Set up IP addressing and check DHCP and DNS when devices can't connect."]
    ] },
    { tab: "SYSTEMS", heading: "Systems & User Support", items: [
      ["Helpdesk Support", "Handle user tickets, explain fixes clearly and follow issues through to resolution."],
      ["Windows Installation & Setup", "Install, update and configure Windows and the software users need."],
      ["User Account Management", "Create and maintain user accounts, access and passwords."],
      ["Microsoft Office", "Support Word, Excel and Outlook for everyday office work."]
    ] },
    { tab: "PROFESSIONAL", heading: "Professional Skills", items: [
      ["Communication & Presentation", "Explain technical and business topics clearly to different audiences."],
      ["Market Research", "Gather and summarize market and prospect information to support decisions."],
      ["Client Outreach", "Reach out to potential partners and prepare proposals and follow-ups."],
      ["Teamwork", "Work across teams with integrity and take responsibility for shared goals."]
    ] }
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
