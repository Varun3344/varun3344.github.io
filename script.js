// ---- Edit these to update links site-wide ----
const LINKEDIN = ""; // e.g. "https://www.linkedin.com/in/your-handle/"; links hide while empty

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let paused = reduceMotion;

// LinkedIn links
document.querySelectorAll('[data-link="linkedin"]').forEach((a) => {
  if (LINKEDIN) { a.href = LINKEDIN; a.target = "_blank"; a.rel = "noopener"; }
  else a.remove();
});
document.getElementById("year").textContent = new Date().getFullYear();

// ---- Header colour over dark sections ----
const nav = document.getElementById("nav");
const darkSections = [...document.querySelectorAll(".dark")];
function updateNav() {
  const y = 30;
  nav.classList.toggle("on-dark", darkSections.some((s) => {
    const r = s.getBoundingClientRect();
    return r.top <= y && r.bottom > y;
  }));
}

// ---- Hero rotating fact card ----
const facts = [
  ["AI VIDEO PIPELINE", "2,600+", "videos published. one pipeline."],
  ["EVERY MORNING", "08:00", "IST. content ships itself."],
  ["PRODUCT FILM", "2:42", "explainer. built by code."],
];
const card = document.getElementById("heroCard");
const [hcLabel, hcValue, hcSub] = ["hcLabel", "hcValue", "hcSub"].map((id) => document.getElementById(id));
let factIdx = 0;
setInterval(() => {
  if (paused) return;
  card.classList.add("swap");
  setTimeout(() => {
    factIdx = (factIdx + 1) % facts.length;
    [hcLabel.textContent, hcValue.textContent, hcSub.textContent] = facts[factIdx];
    card.classList.remove("swap");
  }, 350);
}, 3200);

// ---- Pause motion ----
const motionBtn = document.getElementById("motionBtn");
function setPaused(p) {
  paused = p;
  document.body.classList.toggle("paused", p);
  motionBtn.setAttribute("aria-pressed", String(p));
  motionBtn.innerHTML = p ? "Play motion <b>▶</b>" : "Pause motion <b>Ⅱ</b>";
}
motionBtn.addEventListener("click", () => setPaused(!paused));
if (reduceMotion) setPaused(true);

// ---- Intro words light up as they scroll in ----
const words = [...document.querySelectorAll("#introTitle .w")];
function updateWords() {
  const vh = innerHeight;
  words.forEach((w, i) => {
    const r = w.getBoundingClientRect();
    w.classList.toggle("lit", paused || r.top < vh * (0.78 - i * 0.035));
  });
}

// ---- Connected stack ----
const layers = [
  { num: "01 / Interface", title: "It starts with<br><em>a click.</em>",
    text: "Thoughtful interfaces. Fast interactions. Every detail connected to what comes next.",
    tech: "React · Next.js · React Native" },
  { num: "02 / Systems", title: "Services that<br><em>hold together.</em>",
    text: "APIs, queues and data models designed to stay dependable as the product grows.",
    tech: "Node.js · Express · MongoDB" },
  { num: "03 / Intelligence", title: "Context in.<br><em>Intelligence out.</em>",
    text: "Generative models wired into real workflows: scripts, voice, video and text, with checks on every output.",
    tech: "OpenAI · Claude · Gemini · Veo" },
  { num: "04 / Production", title: "One connected<br><em>working system.</em>",
    text: "From the first interaction to the cloud. Built to scale, and built to last.",
    tech: "Azure · Kubernetes · Docker · Vercel" },
];
const stack = document.getElementById("stack");
const stackCopy = document.getElementById("stackCopy");
const [sNum, sTitle, sText, sTech] = ["stackNum", "stackTitle", "stackText", "stackTech"].map((id) => document.getElementById(id));
const plates = [...document.querySelectorAll(".plate")];
const tabs = [...document.querySelectorAll("#stackTabs button")];
const tabBar = document.getElementById("tabBar");
let activeLayer = -1;

function setLayer(i) {
  if (i === activeLayer) return;
  const first = activeLayer === -1;
  activeLayer = i;
  const L = layers[i];
  const apply = () => {
    sNum.textContent = L.num; sTitle.innerHTML = L.title; sText.textContent = L.text; sTech.textContent = L.tech;
    stackCopy.classList.remove("swap");
  };
  if (first) apply(); else { stackCopy.classList.add("swap"); setTimeout(apply, 250); }

  plates.forEach((p) => {
    const k = +p.dataset.i;
    // spread plates apart, lift the active one
    const z = k * 62 + (k === i ? 34 : 0) + (k > i ? 26 : 0);
    p.style.transform = `translateZ(${z}px)`;
    p.classList.toggle("active", k === i);
  });
  tabs.forEach((t, k) => { t.classList.toggle("active", k === i); t.setAttribute("aria-selected", k === i); });
  tabBar.style.setProperty("--i", i);
}
function updateStack() {
  const r = stack.getBoundingClientRect();
  const span = stack.offsetHeight - innerHeight;
  const p = Math.min(0.999, Math.max(0, -r.top / span));
  setLayer(Math.floor(p * layers.length));
}
// scale the 3D stack to whatever room the layout gives it (phones, tablets, sideways phones)
const stackVisual = document.querySelector(".stack-visual");
function fitStack() {
  const s = Math.max(0.3, Math.min(1, stackVisual.clientHeight / 640, stackVisual.clientWidth / 470));
  stackVisual.style.setProperty("--s", s.toFixed(3));
}
fitStack();
addEventListener("resize", fitStack);
if (window.ResizeObserver) new ResizeObserver(fitStack).observe(stackVisual);

tabs.forEach((t, i) => t.addEventListener("click", () => {
  const span = stack.offsetHeight - innerHeight;
  scrollTo({ top: stack.offsetTop + span * ((i + 0.5) / layers.length), behavior: reduceMotion ? "auto" : "smooth" });
}));

// ---- Hero parallax + principles marquee ----
const heroBg = document.querySelector(".hero-bg");
const prTrack = document.getElementById("prTrack");
const marquee = document.getElementById("marquee");
function updateMotion() {
  const y = scrollY;
  if (y < innerHeight) heroBg.style.transform = `translateY(${y * 0.12}px)`;
  const r = prTrack.getBoundingClientRect();
  const p = Math.min(1, Math.max(0, -r.top / (prTrack.offsetHeight - innerHeight)));
  const overflow = marquee.scrollWidth - innerWidth;
  marquee.style.transform = `translateX(${innerWidth * 0.35 - p * (overflow + innerWidth * 0.45)}px)`;
}

// ---- Scroll loop ----
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateNav(); updateWords(); updateStack(); updateMotion();
    ticking = false;
  });
}
addEventListener("scroll", onScroll, { passive: true });
addEventListener("resize", onScroll);
onScroll();

// ---- Reveal on scroll ----
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const siblings = [...e.target.parentElement.children].filter((c) => c.classList.contains("reveal"));
    e.target.style.transitionDelay = `${siblings.indexOf(e.target) % 2 * 0.08 + (e.target.tagName === "LI" ? siblings.indexOf(e.target) * 0.08 : 0)}s`;
    e.target.classList.add("in");
    io.unobserve(e.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ---- Copy email ----
const copyBtn = document.getElementById("copyBtn");
copyBtn.addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(copyBtn.dataset.email); copyBtn.textContent = "Copied ✓"; }
  catch { copyBtn.textContent = copyBtn.dataset.email; }
  setTimeout(() => (copyBtn.textContent = "Copy email"), 2000);
});

// ---- Palette switcher (choice is remembered per visitor) ----
const palette = document.getElementById("palette");
const paletteToggle = document.getElementById("paletteToggle");
const paletteBtns = [...palette.querySelectorAll("button[data-theme]")];
function setTheme(name, save) {
  document.documentElement.dataset.theme = name;
  paletteBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.theme === name)));
  if (save) { try { localStorage.setItem("vk-theme", name); } catch {} }
}
function setPaletteOpen(open) {
  palette.classList.toggle("open", open);
  paletteToggle.setAttribute("aria-expanded", String(open));
}
paletteToggle.addEventListener("click", () => setPaletteOpen(!palette.classList.contains("open")));
paletteBtns.forEach((b) => b.addEventListener("click", () => { setTheme(b.dataset.theme, true); setPaletteOpen(false); }));
setTheme(document.documentElement.dataset.theme || "midnight", false);
