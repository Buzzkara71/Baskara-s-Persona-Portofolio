const CONFIG = window.CONFIG;

/* ---------- Utilities ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const wrap = (i, n) => (i + n) % n;
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const REDUCED_MOTION = matchMedia("(prefers-reduced-motion: reduce)").matches;
const SCENES = ["experience", "skills", "about", "contact"];

const store = {
  get(key, fallback) {
    try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); } catch { /* storage unavailable */ }
  }
};

const state = { scene: "menu", menu: 0, exp: 0, tab: 0, mail: 0, busy: false, started: false };

/* ---------- Sound effects (synthesized, no audio files) ---------- */
const sfx = (() => {
  const SEQUENCES = {
    move: [[1320, 0.035]],
    ok: [[880, 0.05], [1760, 0.08]],
    back: [[990, 0.04], [520, 0.07]],
    tab: [[1100, 0.03]]
  };
  const btn = $("#sfxBtn");
  let ctx = null;
  let enabled = store.get("p-sfx", "on") === "on";

  function play(kind) {
    if (!enabled || !state.started) return;
    try {
      ctx ??= new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === "suspended") ctx.resume();
      let t = ctx.currentTime;
      for (const [freq, dur] of SEQUENCES[kind]) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + dur + 0.01);
        t += dur * 0.8;
      }
    } catch { /* Web Audio unavailable */ }
  }

  function sync() {
    btn.textContent = enabled ? "SFX ON" : "SFX OFF";
    btn.setAttribute("aria-pressed", enabled);
  }

  btn.addEventListener("click", () => {
    enabled = !enabled;
    store.set("p-sfx", enabled ? "on" : "off");
    sync();
    play("ok");
  });
  sync();
  return { play };
})();
const blip = sfx.play;

/* ---------- Background music ---------- */
const bgm = (() => {
  const audio = $("#bgm");
  const btn = $("#bgmBtn");
  const music = CONFIG.music || {};
  const volume = Math.min(1, Math.max(0, music.volume ?? 0.45));
  let enabled = store.get("p-bgm", "on") === "on";
  let armed = false;
  let resumeOnShow = false;
  let fadeFrame = 0;

  if (music.title) $("#bgmTitle").textContent = music.title;
  audio.volume = 0;

  function fade(to, ms, onDone) {
    cancelAnimationFrame(fadeFrame);
    const from = audio.volume;
    const start = performance.now();
    (function step(now) {
      const p = Math.min(1, (now - start) / ms);
      audio.volume = Math.min(1, Math.max(0, from + (to - from) * p));
      if (p < 1) fadeFrame = requestAnimationFrame(step);
      else onDone?.();
    })(start);
  }

  function sync() {
    btn.setAttribute("aria-pressed", enabled);
    btn.classList.toggle("playing", enabled && !audio.paused);
    btn.title = `${enabled ? "Mute" : "Play"} background music (M)${music.credit ? "\n" + music.credit : ""}`;
  }

  function play() {
    if (!enabled || !armed) return;
    audio.preload = "auto";
    audio.play().then(() => fade(volume, 1500)).catch(sync);
  }

  function toggle() {
    enabled = !enabled;
    store.set("p-bgm", enabled ? "on" : "off");
    if (enabled) {
      armed = true;
      play();
    } else {
      fade(0, 450, () => audio.pause());
    }
    sync();
    blip("tab");
  }

  audio.addEventListener("play", sync);
  audio.addEventListener("pause", sync);
  btn.addEventListener("click", toggle);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (!audio.paused) { resumeOnShow = true; audio.pause(); }
    } else if (resumeOnShow) {
      resumeOnShow = false;
      if (enabled) audio.play().catch(() => {});
    }
  });
  sync();

  return {
    start() { armed = true; play(); },
    toggle
  };
})();

/* ---------- HUD: date, time of day and moon phase ---------- */
(function renderHud() {
  const now = new Date();
  const hour = now.getHours();
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][now.getDay()];
  const pad = (n) => String(n).padStart(2, "0");
  const timeOfDay =
    hour === 0 ? "Dark Hour" : hour < 6 ? "Late Night" : hour < 11 ? "Morning" :
    hour < 13 ? "Lunchtime" : hour < 17 ? "Afternoon" : hour < 19 ? "After School" : "Evening";

  const SYNODIC_MONTH = 29.530588853;
  const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);
  const phase = ((((now - KNOWN_NEW_MOON) / 864e5 / SYNODIC_MONTH) % 1) + 1) % 1;
  const phaseName =
    phase < 0.03 || phase > 0.97 ? "New Moon" : phase < 0.22 ? "Waxing Crescent" :
    phase < 0.28 ? "First Quarter" : phase < 0.47 ? "Waxing Gibbous" :
    phase < 0.53 ? "Full Moon" : phase < 0.72 ? "Waning Gibbous" :
    phase < 0.78 ? "Last Quarter" : "Waning Crescent";

  $("#hudDate").textContent = `${pad(now.getMonth() + 1)}/${pad(now.getDate())} ${day}`;
  $("#hudPhase").textContent = `${timeOfDay} · ${phaseName}`;

  const c = $("#moonIcon").getContext("2d");
  const r = 26, lit = "#f4f8ff", dark = "#0b1a5a";
  const k = Math.cos(2 * Math.PI * phase);
  c.translate(30, 30);
  c.fillStyle = dark;
  c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.fill();
  c.fillStyle = lit;
  c.beginPath(); c.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, phase >= 0.5); c.fill();
  c.fillStyle = k > 0 ? dark : lit;
  c.beginPath(); c.ellipse(0, 0, Math.abs(k) * r, r, 0, 0, Math.PI * 2); c.fill();
  c.strokeStyle = "rgba(198,246,255,.8)";
  c.lineWidth = 2;
  c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.stroke();
})();

/* ---------- Content ---------- */
$("#topName").textContent = CONFIG.name;
$$("[data-name]").forEach((el) => (el.textContent = CONFIG.name));

const experience = CONFIG.experience || [];
const expList = $("#expList");
const expDetail = $("#expDetail");

expList.innerHTML = experience.map((item, i) => `
  <li style="--i:${i}"><button type="button" class="exp-item${item.soon ? " soon" : ""}" data-i="${i}">
    <span class="num">${ROMAN[i] || i + 1}</span>
    <span class="txt"><b>${item.soon ? "Coming Soon" : esc(item.title)}</b><i>${item.soon ? "Next chapter in progress" : esc(item.sub)}</i></span>
  </button></li>`).join("");

function renderExperience(i) {
  const item = experience[i];
  const no = `<span>No. ${ROMAN[i] || i + 1}</span>`;
  expDetail.innerHTML = item.soon ? `
    <div class="meta">${no}<span>Locked</span></div>
    <h3>Coming Soon</h3>
    <p>This slot is reserved for the next experience. Check back later.</p>` : `
    <div class="meta">${no}<span>${esc(item.period || "")}</span><span>${esc(item.type || "")}</span></div>
    <h3>${esc(item.title)}</h3>
    <p class="role">${esc(item.sub)}</p>
    <p>${esc(item.desc)}</p>
    ${item.tags?.length ? `<span class="tags-label">Skills used</span><div class="tags">${item.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>` : ""}
    ${item.url ? `<a class="go" href="${esc(item.url)}" target="_blank" rel="noopener">VIEW DETAILS <span aria-hidden="true">→</span></a>` : ""}`;
  expDetail.style.animation = "none";
  void expDetail.offsetWidth;
  expDetail.style.animation = "";
}

const tabs = $("#tabs");
tabs.innerHTML = CONFIG.skills
  .map((s, i) => `<button type="button" class="tab" role="tab" data-i="${i}"><em>0${i + 1}</em>${esc(s.tab)}</button>`)
  .join("");

function renderSkills(i) {
  const group = CONFIG.skills[i];
  $$(".tab").forEach((t, j) => {
    t.classList.toggle("on", j === i);
    t.setAttribute("aria-selected", j === i);
  });
  $("#skHead").textContent = group.heading;
  $("#skList").innerHTML = group.items.map(([name, desc], j) => `
    <li class="sk-card" style="--i:${j}">
      <span class="sk-num">${String(j + 1).padStart(2, "0")}</span>
      <h4>${esc(name)}</h4>
      <p>${esc(desc)}</p>
    </li>`).join("");
}

const initials = CONFIG.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("");
const credits = [CONFIG.music?.credit && `♪ ${CONFIG.music.credit}`, ...(CONFIG.credits || [])].filter(Boolean);
$("#aboutCard").innerHTML = `
  <div class="who"><div class="avatar" aria-hidden="true">${esc(initials)}</div>
    <div><h3>${esc(CONFIG.name)}</h3><small>${esc(CONFIG.role)}</small></div></div>
  ${CONFIG.about.bio.map((p) => `<p>${esc(p)}</p>`).join("")}
  <dl class="facts">${CONFIG.about.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
  <blockquote>“${esc(CONFIG.about.quote)}”<cite>${esc(CONFIG.about.quoteBy)}</cite></blockquote>
  ${credits.length ? `<div class="credits"><b>Credits</b>${credits.map((c) => `<p>${esc(c)}</p>`).join("")}</div>` : ""}`;

const ICONS = {
  mail: '<path d="M3 6h18v12H3z M3 6l9 7 9-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  brief: '<path d="M3 8h18v11H3zM9 8V5h6v3M3 13h18" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  camera: '<path d="M4 8h4l2-3h4l2 3h4v11H4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" stroke-width="2"/>'
};
const mailBox = $("#mailBox");
mailBox.innerHTML = CONFIG.contact.map((c, i) => {
  const inner = `<span class="ico"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[c.icon] || ICONS.mail}</svg></span>
    <span class="lbl"><small>${esc(c.service)}</small><b>${esc(c.value)}</b></span>
    <span class="act">${c.copy ? "COPY" : "OPEN ↗"}</span>`;
  return c.href
    ? `<a class="mrow" data-i="${i}" href="${esc(c.href)}" target="_blank" rel="noopener">${inner}</a>`
    : `<button type="button" class="mrow" data-i="${i}">${inner}</button>`;
}).join("") + `<div class="mrow empty">No Message</div>`.repeat(2);
const mailRows = $$(".mrow:not(.empty)");

/* ---------- Toast & clipboard ---------- */
let toastTimer;
function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 1300);
}

function copyContact(i) {
  const selectText = () => {
    const range = document.createRange();
    range.selectNodeContents(mailRows[i].querySelector("b"));
    const sel = getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    toast("SELECTED — PRESS CTRL+C");
  };
  try {
    navigator.clipboard.writeText(CONFIG.contact[i].value).then(() => { toast("COPIED"); blip("ok"); }, selectText);
  } catch {
    selectText();
  }
}

function activateContact(i) {
  if (CONFIG.contact[i].copy) copyContact(i);
  else mailRows[i].click();
}

/* ---------- Selection ---------- */
function setMenu(i, sound) {
  state.menu = wrap(i, SCENES.length);
  $$("#menuNav button").forEach((b, j) => b.classList.toggle("on", j === state.menu));
  if (sound) blip("move");
}

function setExperience(i, sound) {
  state.exp = wrap(i, experience.length);
  $$(".exp-item").forEach((b, j) => b.classList.toggle("on", j === state.exp));
  renderExperience(state.exp);
  if (sound) blip("move");
}

function setTab(i, sound) {
  state.tab = wrap(i, CONFIG.skills.length);
  renderSkills(state.tab);
  if (sound) blip("tab");
}

function setMail(i, sound) {
  state.mail = wrap(i, mailRows.length);
  mailRows.forEach((row, j) => row.classList.toggle("on", j === state.mail));
  if (sound) blip("move");
}

/* ---------- Scene navigation ---------- */
const HINTS = {
  menu: [["↑↓", "Select"], ["ENTER", "Confirm"]],
  experience: [["↑↓", "Select"], ["ESC", "Back", true]],
  skills: [["◀ ▶", "Category"], ["ESC", "Back", true]],
  about: [["ESC", "Back", true]],
  contact: [["↑↓", "Select"], ["ENTER", "Confirm"], ["ESC", "Close", true]]
};

function renderHints() {
  $("#hints").innerHTML = HINTS[state.scene].map(([key, label, isBack]) => isBack
    ? `<button type="button" class="hint back" data-back><kbd>${key}</kbd>${label}</button>`
    : `<span class="hint"><kbd>${key}</kbd>${label}</span>`).join("");
  $("[data-back]")?.addEventListener("click", () => go("menu"));
}

function swap(id) {
  $$(".scene").forEach((s) => s.classList.toggle("active", s.id === id));
  state.scene = id;
  document.body.dataset.scene = id;
  background.setScene(id);

  const video = $("#menuVideo");
  if (id === "menu" && !REDUCED_MOTION) video.play().catch(() => {});
  else video.pause();

  if (id === "experience") renderExperience(state.exp);
  if (id === "skills") renderSkills(state.tab);
  renderHints();
  $("#" + id).scrollTop = 0;
  try {
    history.replaceState(null, "", id === "menu" ? location.pathname + location.search : "#" + id);
  } catch { /* file:// or sandboxed */ }
}

function go(id) {
  if (state.busy || id === state.scene) return;
  blip(id === "menu" ? "back" : "ok");
  if (id !== "menu") setMenu(SCENES.indexOf(id));
  if (REDUCED_MOTION) return swap(id);

  state.busy = true;
  const wipe = $("#wipe").animate([
    { transform: "translateX(-110%) skewX(-22deg)" },
    { transform: "translateX(0%) skewX(-22deg)", offset: 0.5 },
    { transform: "translateX(110%) skewX(-22deg)" }
  ], { duration: 560, easing: "cubic-bezier(.6,0,.4,1)" });
  setTimeout(() => swap(id), 280);
  wipe.onfinish = () => (state.busy = false);
}

/* ---------- Pointer input ---------- */
const indexOf = (e, sel) => {
  const el = e.target.closest(sel);
  return el ? Number(el.dataset.i) : -1;
};

$$("#menuNav button").forEach((b, i) => {
  b.addEventListener("mouseenter", () => state.menu !== i && setMenu(i, true));
  b.addEventListener("focus", () => setMenu(i));
  b.addEventListener("click", () => go(b.dataset.go));
});

expList.addEventListener("click", (e) => {
  const i = indexOf(e, ".exp-item");
  if (i >= 0) setExperience(i, true);
});
expList.addEventListener("mouseover", (e) => {
  const i = indexOf(e, ".exp-item");
  if (i >= 0 && i !== state.exp) setExperience(i, true);
});

tabs.addEventListener("click", (e) => {
  const i = indexOf(e, ".tab");
  if (i >= 0) setTab(i, true);
});

mailBox.addEventListener("mouseover", (e) => {
  const i = indexOf(e, ".mrow:not(.empty)");
  if (i >= 0 && i !== state.mail) setMail(i, true);
});
mailBox.addEventListener("click", (e) => {
  const i = indexOf(e, ".mrow:not(.empty)");
  if (i < 0) return;
  setMail(i);
  if (CONFIG.contact[i].copy) {
    e.preventDefault();
    copyContact(i);
  } else {
    blip("ok");
  }
});

/* ---------- Keyboard input ---------- */
addEventListener("keydown", (e) => {
  if (!state.started) return;
  const key = e.key;
  const scene = state.scene;

  if ((key === "m" || key === "M") && !e.ctrlKey && !e.metaKey && !e.altKey) return bgm.toggle();
  if (state.busy) return;

  const up = key === "ArrowUp" || key === "w";
  const down = key === "ArrowDown" || key === "s";
  const left = key === "ArrowLeft" || key === "q";
  const right = key === "ArrowRight" || key === "e";
  const enter = key === "Enter" && !e.target.closest("button, a");
  const step = up ? -1 : down ? 1 : 0;

  if ((key === "Escape" || key === "Backspace") && scene !== "menu") {
    e.preventDefault();
    return go("menu");
  }

  if (scene === "menu") {
    if (step) { e.preventDefault(); setMenu(state.menu + step, true); }
    else if (enter) { e.preventDefault(); go(SCENES[state.menu]); }
  } else if (scene === "experience") {
    if (step) { e.preventDefault(); setExperience(state.exp + step, true); }
    else if (enter) expDetail.querySelector("a.go")?.click();
  } else if (scene === "skills") {
    if (left || right) { e.preventDefault(); setTab(state.tab + (left ? -1 : 1), true); }
  } else if (scene === "contact") {
    if (step) { e.preventDefault(); setMail(state.mail + step, true); }
    else if (enter) { e.preventDefault(); activateContact(state.mail); }
  }
});

/* ---------- Animated canvas background ---------- */
const background = (() => {
  const canvas = $("#bg");
  const cx = canvas.getContext("2d");
  const PALETTES = {
    menu:       { top: "#2aa8ff", bot: "#0a22b0", caus: 1,    moon: 1,    glow: 0.9, grid: 0, shard: 1 },
    experience: { top: "#1a44d6", bot: "#06115c", caus: 0.55, moon: 0.25, glow: 0.2, grid: 0, shard: 1 },
    skills:     { top: "#38cbea", bot: "#0f7fc2", caus: 0.8,  moon: 0.2,  glow: 0,   grid: 0, shard: 0.4 },
    about:      { top: "#45d6ee", bot: "#1293c9", caus: 0.7,  moon: 0.55, glow: 0,   grid: 0, shard: 0.3 },
    contact:    { top: "#0b1d55", bot: "#040a24", caus: 0.15, moon: 0.35, glow: 0,   grid: 1, shard: 0 }
  };
  const NUMERIC = ["caus", "moon", "glow", "grid", "shard"];
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const toState = (p) => ({ ...p, top: hex(p.top), bot: hex(p.bot) });
  const lerp = (a, b, t) => a + (b - a) * t;
  const rgb = (c) => `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;
  const rand = Math.random;

  let current = toState(PALETTES.menu);
  let target = current;
  let W = 0, H = 0, dpr = 1, maxDpr = 1.5;
  let running = false, covered = false, slowFrames = 0, resizeFrame = 0;

  const bubbles = Array.from({ length: 46 }, () => ({ x: rand(), y: rand(), r: 1 + rand() * 4, speed: 0.02 + rand() * 0.05, wobble: rand() * 6 }));
  const shards = Array.from({ length: 9 }, () => ({ x: 0.05 + rand() * 0.9, y: rand(), speed: 0.006 + rand() * 0.014, rot: rand() * 6, len: 30 + rand() * 70, spin: (rand() - 0.5) * 0.6 }));

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, maxDpr);
    W = innerWidth;
    H = innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (REDUCED_MOTION) start();
  }

  function start() {
    if (running || covered) return;
    running = true;
    requestAnimationFrame(frame);
  }

  function drawGlow() {
    const g = cx.createLinearGradient(0, 0, W * 0.32, 0);
    g.addColorStop(0, `rgba(255,255,255,${0.85 * current.glow})`);
    g.addColorStop(1, "rgba(255,255,255,0)");
    cx.fillStyle = g;
    cx.fillRect(0, 0, W * 0.32, H);
  }

  function drawGrid(t) {
    cx.save();
    cx.globalAlpha = current.grid;
    cx.strokeStyle = "rgba(90,140,255,.12)";
    cx.lineWidth = 1;
    for (let x = (t * 8) % 28; x < W; x += 28) { cx.beginPath(); cx.moveTo(x, 0); cx.lineTo(x, H); cx.stroke(); }
    for (let y = 0; y < H; y += 28) { cx.beginPath(); cx.moveTo(0, y); cx.lineTo(W, y); cx.stroke(); }
    cx.font = `italic 900 ${Math.max(120, W * 0.2)}px "Barlow Condensed", Impact, sans-serif`;
    cx.strokeStyle = "rgba(120,170,255,.16)";
    cx.lineWidth = 2;
    cx.strokeText("CONTACT", -W * 0.02, H * 0.3);
    cx.translate(W * 0.97, H * 0.05);
    cx.rotate(Math.PI / 2);
    cx.strokeText("MAIL", 0, 0);
    cx.restore();
  }

  function drawMoon() {
    const mx = W * 0.2, my = H * 0.34, mr = Math.min(W, H) * 0.16;
    cx.save();
    cx.globalAlpha = current.moon;
    const halo = cx.createRadialGradient(mx, my, mr * 0.6, mx, my, mr * 2.6);
    halo.addColorStop(0, "rgba(220,250,255,.55)");
    halo.addColorStop(1, "rgba(220,250,255,0)");
    cx.fillStyle = halo;
    cx.beginPath(); cx.arc(mx, my, mr * 2.6, 0, 7); cx.fill();
    cx.fillStyle = "rgba(244,250,255,.92)";
    cx.beginPath(); cx.arc(mx, my, mr, 0, 7); cx.fill();
    cx.fillStyle = "rgba(170,215,240,.35)";
    for (const [a, b, r] of [[-0.3, -0.2, 0.18], [0.25, 0.1, 0.12], [-0.05, 0.35, 0.1], [0.3, -0.35, 0.07]]) {
      cx.beginPath(); cx.arc(mx + a * mr, my + b * mr, r * mr, 0, 7); cx.fill();
    }
    cx.strokeStyle = "rgba(255,255,255,.35)";
    cx.lineWidth = 1.5;
    cx.beginPath(); cx.ellipse(mx, my, mr * 1.5, mr * 0.32, -0.35, 0, 7); cx.stroke();
    cx.restore();
  }

  function drawWater(t) {
    cx.save();
    cx.globalCompositeOperation = "screen";
    for (let i = 0; i < 6; i++) {
      const x = W * (0.1 + i * 0.17) + Math.sin(t * 0.3 + i) * 40;
      const w = 40 + (i % 3) * 50;
      const ray = cx.createLinearGradient(0, 0, 0, H * 0.9);
      ray.addColorStop(0, `rgba(200,245,255,${0.13 * current.caus})`);
      ray.addColorStop(1, "rgba(200,245,255,0)");
      cx.fillStyle = ray;
      cx.beginPath();
      cx.moveTo(x, 0); cx.lineTo(x + w, 0); cx.lineTo(x + w * 2.2 - H * 0.25, H * 0.9); cx.lineTo(x - H * 0.25, H * 0.9);
      cx.fill();
    }
    const cell = Math.max(46, W / 26);
    for (let row = 0; row < 7; row++) {
      const depth = row / 7;
      for (let col = -1; col < W / cell + 1; col++) {
        const seed = col * 12.9898 + row * 78.233;
        const alpha = (0.28 - depth * 0.26) * current.caus * (0.6 + 0.4 * Math.sin(t * 1.3 + seed));
        if (alpha <= 0.005) continue;
        const x = col * cell + Math.sin(t * 0.7 + seed) * cell * 0.35 + (row % 2) * cell * 0.5;
        const y = row * cell * 0.42 + Math.cos(t * 0.55 + seed * 1.3) * 8 + 4;
        cx.fillStyle = `rgba(220,252,255,${alpha})`;
        cx.beginPath();
        cx.ellipse(x, y, cell * (0.42 - depth * 0.2), cell * (0.13 - depth * 0.05), Math.sin(seed) * 0.4, 0, 7);
        cx.fill();
      }
    }
    cx.restore();
  }

  function drawBubbles(t) {
    cx.strokeStyle = "rgba(230,250,255,.55)";
    cx.lineWidth = 1;
    for (const b of bubbles) {
      if (!REDUCED_MOTION) {
        b.y -= b.speed / 60;
        if (b.y < -0.05) { b.y = 1.05; b.x = rand(); }
      }
      cx.beginPath();
      cx.arc(b.x * W + Math.sin(t * 1.2 + b.wobble) * 6, b.y * H, b.r, 0, 7);
      cx.stroke();
    }
  }

  function drawShards() {
    cx.save();
    cx.globalAlpha = current.shard;
    cx.fillStyle = "rgba(240,252,255,.75)";
    for (const s of shards) {
      if (!REDUCED_MOTION) {
        s.y += s.speed / 60;
        s.rot += s.spin / 60;
        if (s.y > 1.1) { s.y = -0.1; s.x = rand(); }
      }
      cx.save();
      cx.translate(s.x * W, s.y * H);
      cx.rotate(s.rot);
      cx.beginPath();
      cx.moveTo(0, -s.len / 2); cx.lineTo(s.len * 0.12, 0); cx.lineTo(0, s.len / 2); cx.lineTo(-s.len * 0.05, 0);
      cx.fill();
      cx.restore();
    }
    cx.restore();
  }

  function drawOverlays() {
    cx.save();
    cx.globalAlpha = 0.1 + 0.08 * current.shard;
    cx.fillStyle = "#fff";
    cx.beginPath();
    cx.moveTo(W * 0.55, H); cx.lineTo(W * 0.98, 0); cx.lineTo(W, 0); cx.lineTo(W * 0.58, H);
    cx.fill();
    cx.restore();

    const vignette = cx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.4, W / 2, H / 2, Math.max(W, H) * 0.8);
    vignette.addColorStop(0, "rgba(3,6,30,0)");
    vignette.addColorStop(1, "rgba(3,6,30,.45)");
    cx.fillStyle = vignette;
    cx.fillRect(0, 0, W, H);
  }

  function frame(ms) {
    if (covered) { running = false; return; }
    const frameStart = performance.now();
    const t = REDUCED_MOTION ? 4 : ms / 1000;
    const ease = REDUCED_MOTION ? 1 : 0.06;

    for (const key of NUMERIC) current[key] = lerp(current[key], target[key], ease);
    current.top = current.top.map((v, i) => lerp(v, target.top[i], ease));
    current.bot = current.bot.map((v, i) => lerp(v, target.bot[i], ease));

    const base = cx.createLinearGradient(0, 0, W * 0.25, H);
    base.addColorStop(0, rgb(current.top));
    base.addColorStop(1, rgb(current.bot));
    cx.fillStyle = base;
    cx.fillRect(0, 0, W, H);

    if (current.glow > 0.01) drawGlow();
    if (current.grid > 0.01) drawGrid(t);
    if (current.moon > 0.01) drawMoon();
    drawWater(t);
    drawBubbles(t);
    if (current.shard > 0.01) drawShards();
    drawOverlays();

    // Drop to 1x resolution on devices that consistently can't keep up.
    if (performance.now() - frameStart > 12) {
      if (++slowFrames > 45 && maxDpr > 1) { maxDpr = 1; slowFrames = 0; resize(); }
    } else {
      slowFrames = Math.max(0, slowFrames - 1);
    }

    if (REDUCED_MOTION) running = false;
    else requestAnimationFrame(frame);
  }

  addEventListener("resize", () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(resize);
  });
  resize();

  return {
    setScene(id) {
      target = toState(PALETTES[id] || PALETTES.menu);
      // The menu video fully covers the canvas, so skip drawing there.
      covered = id === "menu";
      if (!covered) start();
    }
  };
})();

/* ---------- Boot ---------- */
setMenu(0);
setExperience(0);
setTab(0);
setMail(0);

const initialScene = location.hash.slice(1);
swap(SCENES.includes(initialScene) ? initialScene : "menu");

(function boot() {
  const loader = $("#loader");
  const fill = $("#loadFill");
  const pct = $("#loadPct");
  const press = $("#pressStart");
  const video = $("#menuVideo");
  const timeout = (ms) => new Promise((r) => setTimeout(r, ms));

  const tasks = [
    document.fonts?.ready ?? Promise.resolve(),
    new Promise((r) => {
      if (REDUCED_MOTION || video.readyState >= 3) return r();
      video.addEventListener("canplay", r, { once: true });
      video.addEventListener("error", r, { once: true });
    }),
    new Promise((r) => {
      const img = new Image();
      img.onload = img.onerror = r;
      img.src = "assets/img/menu-bg-poster.webp";
    })
  ].map((p) => Promise.race([p, timeout(5000)]));

  const MIN_DURATION = REDUCED_MOTION ? 150 : 900;
  const startTime = performance.now();
  let loaded = 0;
  let shown = 0;
  tasks.forEach((p) => p.then(() => loaded++));

  (function step(now) {
    const goal = Math.min(loaded / tasks.length, (now - startTime) / MIN_DURATION);
    shown += (goal - shown) * (REDUCED_MOTION ? 1 : 0.18);
    if (goal >= 1 && shown > 0.995) shown = 1;
    fill.style.width = `${(shown * 100).toFixed(1)}%`;
    pct.textContent = `${Math.round(shown * 100)}%`;
    if (shown < 1) requestAnimationFrame(step);
    else ready();
  })(startTime);

  function ready() {
    loader.classList.add("ready");
    $("#loadText").textContent = "READY";
    press.textContent = matchMedia("(pointer: coarse)").matches ? "TAP TO START" : "PRESS ANY KEY";
    press.hidden = false;
    addEventListener("keydown", begin, true);
    loader.addEventListener("pointerdown", begin);
  }

  function begin(e) {
    if (e.type === "keydown" && ["Shift", "Control", "Alt", "Meta", "Tab"].includes(e.key)) return;
    e.preventDefault();
    e.stopPropagation();
    removeEventListener("keydown", begin, true);
    loader.removeEventListener("pointerdown", begin);
    loader.classList.add("done");
    state.started = true;
    bgm.start();
    blip("ok");
    if (state.scene === "menu" && !REDUCED_MOTION) video.play().catch(() => {});
    setTimeout(() => (loader.hidden = true), 700);
  }
})();
