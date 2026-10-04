# Baskara Persona's Portfolio

A personal portfolio styled after a JRPG pause menu, inspired by the user interface of *Persona 3 Reload*. Navigate it like a game menu with the keyboard, mouse or touch.

Built with plain HTML, CSS and JavaScript. No framework, no runtime dependencies.

---

## Features

- **Game-style navigation.** Main menu with an animated selection blade, diagonal scene transitions, and keyboard, mouse and touch support.
- **Four sections.** Experience, Skills, About and Contact.
- **Title screen.** The loader waits for fonts, video and images to be ready, then shows *Press Any Key*.
- **Background music** with fade in/out and a toggle, plus synthesized menu sound effects (no audio files needed).
- **Live HUD** showing today's date, time of day and the actual moon phase.
- **Content in one file.** All text lives in `assets/js/config.js`, so updates don't need a rebuild.
- **Responsive and accessible.** Works on mobile, supports keyboard focus, and respects `prefers-reduced-motion`.

## Quick start

No installation is required. Choose one option:

| Option | How |
| --- | --- |
| VS Code | Install the **Live Server** extension, right-click `index.html` and choose **Open with Live Server**. |
| Windows | Double-click `start.bat`. It serves the site at `http://localhost:5500` using Python or Node.js, if either is installed. |
| Node.js | `npx serve -l 5500 .` |
| No server | Open `index.html` directly in a browser. |

> Browsers only allow audio after user interaction, so music starts after the first key press or tap on the title screen.

## Controls

| Key | Action |
| --- | --- |
| `↑` `↓` / `W` `S` | Move selection |
| `Enter` | Confirm |
| `Esc` / `Backspace` | Back to main menu |
| `←` `→` / `Q` `E` | Switch skill category |
| `M` | Toggle background music |

The **BGM** and **SFX** buttons in the bottom-left corner can also be clicked. Preferences are saved in the browser.

## Customizing content

Edit `assets/js/config.js`, save, and refresh the page.

| Key | Description |
| --- | --- |
| `name`, `role` | Shown in the header and About card |
| `experience` | Entries listed as I, II, III…; use `{ soon: true }` for a locked "Coming Soon" slot |
| `skills` | Skill categories; each item is `[label, rank]`, where rank is 1–10 and 10 shows as **MAX** |
| `about` | Bio paragraphs, facts and quote |
| `contact` | `copy: true` copies the value on click; `href` opens a link in a new tab |
| `music`, `credits` | Track title, default volume and attribution lines |

Example experience entry:

```js
{
  title: "Company Name",
  sub: "Job Title",
  period: "Jan 2026 – Present",
  type: "Full-time",
  desc: "What you did and the impact it had.",
  tags: ["Skill A", "Skill B"],
  url: null // optional link
}
```

To change the music, replace `assets/audio/color-your-night.ogg` and `.m4a` with new files of the same names, then update `music.title` and `music.credit`.

## Development

Readable source files are in `src/`. The site loads the minified builds in `assets/`. After editing anything in `src/`, rebuild:

```bash
npm install
npm run build
```

| Script | Description |
| --- | --- |
| `npm run build` | Minify `src/style.css` and `src/main.js` into `assets/` |
| `npm start` | Serve the site locally on port 5500 |

## Project structure

```
.
├── index.html
├── assets/
│   ├── audio/        Background music (Opus + AAC fallback)
│   ├── css/          Minified stylesheet (build output)
│   ├── img/          Favicon and video poster
│   ├── js/
│   │   ├── config.js Site content (edit this)
│   │   └── main.js   Minified script (build output)
│   └── video/        Main menu background (VP9 + H.264 fallback)
├── src/
│   ├── main.js       Application source
│   └── style.css     Stylesheet source
├── package.json
├── start.bat
└── vercel.json
```

## Performance

- Minified CSS and JS (about 17 KB each before gzip); scripts are loaded with `defer`.
- Google Fonts are loaded asynchronously with only the weights in use and `font-display: swap`. Offline, the site falls back to system fonts (Bahnschrift on Windows).
- The menu video is 0.9 MB VP9 with an H.264 fallback, and its WebP poster is preloaded.
- The music track is Opus at 96 kbps (2.8 MB, down from a 9 MB MP3), trimmed and faded for a clean loop.
- The canvas background stops rendering while hidden behind the menu video, and lowers its resolution automatically on slow devices.
- Audio and video pause when the tab is hidden.

## Deployment

This is a static site, so any static host works.

**Vercel:** push the project to GitHub, import the repository in Vercel, choose the **Other** framework preset and deploy. The included `vercel.json` skips the build step and adds long-term caching for media files. The Vercel CLI also works: run `npx vercel --prod` from the project folder.

**GitHub Pages / Netlify:** publish the project root as-is. No build command is needed.

## Credits

- **Music:** "Color Your Night", from the *Persona 3 Reload* Original Soundtrack. Music by Atsushi Kitajoh, vocals by Lotus Juice & Azumi Takahashi. © ATLUS © SEGA. All rights reserved.
- **Visual inspiration and background video:** *Persona 3 Reload*. © ATLUS © SEGA. All rights reserved.
- **Fonts:** [Barlow and Barlow Condensed](https://fonts.google.com/specimen/Barlow) by Jeremy Tribby, SIL Open Font License.

This is a non-commercial fan-made portfolio and is not affiliated with or endorsed by ATLUS or SEGA. All game-related assets belong to their respective owners. Replace them with your own or licensed assets before publishing publicly.

## Author

**Baskara Dwipa Raharja**, IT Technician Support (Tanjungpinang – Batam, Indonesia)

- Email: [buzzkara3011@gmail.com](mailto:buzzkara3011@gmail.com)
- GitHub: [@Buzzkara71](https://github.com/Buzzkara71)
- LinkedIn: [linkedin.com/in/buzzkara](https://www.linkedin.com/in/buzzkara)
- Instagram: [@ba_skraaa](https://www.instagram.com/ba_skraaa/)
# Baskara-s-Persona-Portofolio
