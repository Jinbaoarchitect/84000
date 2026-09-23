/* ————————————————————————————————————————————
   amm × sw — :NOW   demo build
   views: intro → home (3 panels) → section (list / canvas) → detail
   ———————————————————————————————————————————— */

/* ————— demo data ————— */
const WHO = {
  sw:  { name: "stanley wong",                       period: "1980 - present" },
  amm: { name: "anothermountainman",                 period: "2000 - present" },
  xsw: { name: "anothermountainman × stanley wong",  period: "2000 - present" },
};

/* ————— en · cn — the site's own words —————
   t(label) gives the traditional-chinese (hong kong usage) form of an interface
   label while LANG is "cn", the english label otherwise; labels not in the
   dictionary stay as they are. work content (titles, categories, statements,
   credits) is not translated here — it comes from the cms `_cn` fields via txt(). */
const UI_CN = {
  "stanley wong": "黃炳培", "anothermountainman": "又一山人", "anothermountainman × stanley wong": "又一山人 × 黃炳培",
  "1980 - present": "1980 - 至今", "2000 - present": "2000 - 至今",
  "search": "搜尋", "filter": "篩選", "journey": "歷程", "biography": "簡歷", "media": "媒體",
  "contact": "聯絡", "shop": "商店", "acknowledgments": "鳴謝",
  "year": "年份", "category": "類別", "all": "全部", "not found": "找不到結果",
  "advertising": "廣告", "tv commercial": "電視廣告", "branding": "品牌", "book": "書籍", "poster": "海報", "space": "空間",
  "exhibition": "展覽", "curation": "策展", "photography": "攝影", "video": "影片", "product": "產品", "installation": "裝置",
  "fashion": "時裝", "packaging": "包裝", "painting": "繪畫", "object": "物件", "education": "教育",
  "client": "客戶", "collaboration": "合作", "agency": "廣告公司", "award": "獎項", "collection": "收藏", "material": "物料",
  "producer": "監製", "special thanks": "特別鳴謝",
  "solo exhibition": "個展", "group exhibition": "聯展", "talk": "講座",
};
const t = (label) => (LANG === "cn" && UI_CN[String(label).trim().toLowerCase()]) || label;

const CATS = [
  "photography", "poster / photography", "installation / product / photography",
  "typography", "video", "curation / exhibition", "packaging", "book",
  "art / design", "film", "curation / space / film", "installation",
];

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* demo tag pool — searchable; real data will replace these */
const DEMO_TAGS = [
  "hong kong", "red white blue", "city", "people", "words",
  "heritage", "landscape", "memory", "time", "craft",
];

/* demo stage: all three periods share the full image pool, randomised.
   each work carries several images (hover cycles through them) + tags */
const WORKS = {};
let ALL_WORKS = [];
(function buildWorks() {
  const yearsFor = (who) =>
    who === "sw" ? 1980 + Math.floor(Math.random() * 46)
                 : 2000 + Math.floor(Math.random() * 27);
  for (const who of Object.keys(WHO)) {
    WORKS[who] = shuffle(IMAGES).slice(0, 14).map((img, i) => {
      const images = [img, ...shuffle(IMAGES.filter((x) => x !== img)).slice(0, 3)];
      const tags = shuffle(DEMO_TAGS).slice(0, 2 + Math.floor(Math.random() * 2));
      return {
        who,
        img,                      /* main image */
        images,                   /* hover / entrance cycle */
        tags,
        title: `work ${String(i + 1).padStart(2, "0")} / demo title`,
        year: yearsFor(who),
        cat: CATS[Math.floor(Math.random() * CATS.length)],
      };
    });
    ALL_WORKS = ALL_WORKS.concat(WORKS[who]);
  }
})();

/* swap the demo data for CMS content (called once PocketBase answers) */
function applyWorks(list) {
  for (const who of Object.keys(WHO)) {
    WORKS[who] = list.filter((w) => w.who === who);
  }
  ALL_WORKS = list;
}

/* ————— clock ————— */
let t0 = Date.now();
const pad = (n) => String(n).padStart(2, "0");
function clockText() {
  const s = Math.floor((Date.now() - t0) / 1000);
  return `${pad(Math.floor(s / 3600))} : ${pad(Math.floor((s % 3600) / 60))} : ${pad(s % 60)}`;
}
/* a temporary word in place of the time (e.g. "back home" while a zone fades in) */
let clockLabel = null, clockLabelTimer = null;
const clockDisplay = () => clockLabel || clockText();
function setClockLabel(text, ms) {
  clearTimeout(clockLabelTimer);
  clockLabel = text;
  document.querySelectorAll("[data-clock]").forEach((el) => { if (!el.matches(":hover")) el.textContent = clockDisplay(); });
  clockLabelTimer = setTimeout(() => { clockLabel = null; }, ms);
}
setInterval(() => {
  document.querySelectorAll("[data-clock]").forEach((el) => {
    if (!el.matches(":hover")) el.textContent = clockDisplay();
  });
}, 250);

document.querySelectorAll("[data-clock]").forEach((el) => {
  el.addEventListener("mouseenter", () => (el.textContent = ": now"));
  el.addEventListener("mouseleave", () => (el.textContent = clockDisplay()));
  el.addEventListener("click", restart);
});

/* ————— view helpers ————— */
const $ = (sel) => document.querySelector(sel);

/* mobile = portrait or square viewport (aspect ≤ 1:1) — phones, and any window
   squeezed past 1:1. the layout swaps in css/style.css (@media max-aspect-ratio);
   here the pointer behaviours give way to touch ones */
const MOBILE_MQ = matchMedia("(max-aspect-ratio: 1/1)");
const isMobile = () => MOBILE_MQ.matches;
const views = ["#intro", "#home", "#section", "#page", "#detail"];
function show(sel) {
  views.forEach((v) => $(v).classList.toggle("hidden", v !== sel));
}

/* ————————————————————————————————————————————
   intro — :NOW  split-flap board
   cards: blank (black) → still 1 → still 2, each change a mechanical
   flap over the seam; then the board dissolves and the panels emerge
   ———————————————————————————————————————————— */
let introTimers = [];
let introRun = 0;                       /* guards against an overlapping restart */
/* the stills: full size on desktop, a 960-wide copy on phones (the board is a few hundred px there) */
const INTRO_CARDS = [null, "assets/intro/opening-1.jpg", "assets/intro/opening-2.jpg"];
const INTRO_CARDS_M = [null, "assets/intro/opening-1-m.jpg", "assets/intro/opening-2-m.jpg"];
const introCards = () => (isMobile() ? INTRO_CARDS_M : INTRO_CARDS);
const FLIP_MS = 560;
let introPreload = null;

function preloadIntro() {
  if (introPreload) return introPreload;
  /* load AND decode, so the flap never waits for a decode mid-animation */
  const load = (src) => new Promise((res) => {
    const im = new Image();
    im.onload = () => (im.decode ? im.decode().catch(() => {}).then(res) : res());
    im.onerror = () => res();
    im.src = src;
  });
  /* never hold the intro hostage to a slow image: cap the wait (phones get a little longer on cellular) */
  const cap = new Promise((res) => setTimeout(res, isMobile() ? 2500 : 1500));
  introPreload = Promise.race([Promise.all(introCards().filter(Boolean).map(load)), cap]);
  return introPreload;
}

/* phones: heavy content (works, canvas pool, journey …) waits until the intro has played,
   so decoding a few hundred pictures never competes with the flap animation.
   desktop: unchanged — everything loads in parallel with the intro */
const INTRO_TOTAL_MS = 3300;
function afterIntro(fn) { if (isMobile()) setTimeout(fn, INTRO_TOTAL_MS); else fn(); }

/* paint one card (or blank) into a set of .img windows */
function setCard(els, src) {
  els.forEach((el) => { el.style.backgroundImage = src ? `url("${src}")` : "none"; });
}

/* show a card at rest: all four windows carry the same still */
function restCard(flip, src) {
  setCard(flip.querySelectorAll(".img"), src);
  flip.querySelector(".flap").style.transform = "";
}

/* flap from the card at rest to `next`: gravity-fed drop with a small
   settle at the end, light following the flap */
function flipTo(flip, cur, next) {
  const flap = flip.querySelector(".flap");
  setCard([flip.querySelector(".top .img")],   next);   /* revealed behind the flap  */
  setCard([flip.querySelector(".bot .img")],   cur);    /* still the current card    */
  setCard([flip.querySelector(".front .img")], cur);    /* flap face                 */
  setCard([flip.querySelector(".back .img")],  next);   /* flap back                 */

  const drop = flap.animate(
    [
      { transform: "rotateX(0deg)",    offset: 0,    easing: "cubic-bezier(0.55, 0, 0.85, 0.4)" },
      { transform: "rotateX(-90deg)",  offset: 0.42, easing: "cubic-bezier(0.2, 0.6, 0.4, 1)" },
      { transform: "rotateX(-180deg)", offset: 0.80, easing: "ease-out" },
      { transform: "rotateX(-171deg)", offset: 0.90, easing: "ease-in" },
      { transform: "rotateX(-180deg)", offset: 1 }
    ],
    { duration: FLIP_MS, fill: "forwards" }
  );
  const shadeTop = flip.querySelector(".top .shade").animate(
    [{ opacity: 1, offset: 0 }, { opacity: 1, offset: 0.2 }, { opacity: 0, offset: 0.5 }, { opacity: 0, offset: 1 }],
    { duration: FLIP_MS, fill: "forwards" }
  );
  const shadeBack = flip.querySelector(".back .shade").animate(
    [{ opacity: 0, offset: 0 }, { opacity: 0.9, offset: 0.42 }, { opacity: 0, offset: 0.85 }, { opacity: 0, offset: 1 }],
    { duration: FLIP_MS, fill: "forwards" }
  );
  drop.onfinish = () => {
    /* commit: next card at rest, flap back up (invisible: same picture) */
    [drop, shadeTop, shadeBack].forEach((a) => a.cancel());
    restCard(flip, next);
  };
}

function playIntro(done) {
  const intro = $("#intro");
  const flip = intro.querySelector(".flip");
  introTimers.forEach(clearTimeout);
  introTimers = [];
  intro.classList.remove("reveal", "fadeword", "hidden");
  flip.getAnimations({ subtree: true }).forEach((a) => a.cancel());
  const CARDS = introCards();
  restCard(flip, CARDS[1]);

  /* whole opening ≤ 3 s: still 1 (1.1 s) → flap (0.56 s) → still 2 → 1 s dissolve */
  const T = {
    flip2:  1100,    /* still 1 → still 2                        */
    reveal: 2000,    /* home appears beneath, intro dissolves    */
    end:    3000     /* intro layer removed                      */
  };

  const run = ++introRun;
  preloadIntro().then(() => {
    if (run !== introRun) return;        /* a newer intro has taken over */
    restCard(flip, CARDS[1]);            /* open directly on still 1 — no blank card first */
    introTimers.push(setTimeout(() => flipTo(flip, CARDS[1], CARDS[2]), T.flip2));
    introTimers.push(setTimeout(() => {
      done();                              /* home becomes visible underneath */
      /* the whole black layer (board + letterbox) dissolves as one — no light edges */
      intro.classList.add("reveal", "fadeword");
    }, T.reveal));
    introTimers.push(setTimeout(() => intro.classList.add("hidden"), T.end));
  });
}

/* ————————————————————————————————————————————
   home — three panels, 3 s crossfade rotation
   ———————————————————————————————————————————— */
let homeTimers = [];
let HOME_SETS = [];
let homeRun = 0;                         /* startHome generation: a stale warm-up never paints into a newer home */

/* ————— picture warm-up —————
   a panel never starts its crossfade until the next picture is fetched AND decoded,
   otherwise the incoming layer fades in empty and the picture pops in a moment later
   (the “flash” seen on first visits). warmImage() caches one promise per url;
   warmHomeSets() walks the whole rotation in the background, staggered, so by the
   time a set comes round its three pictures are already in memory. */
const warmed = new Map();
function warmImage(src) {
  if (!src) return Promise.resolve();
  if (!warmed.has(src)) warmed.set(src, new Promise((res) => {
    const im = new Image();
    im.onload = () => (im.decode ? im.decode().catch(() => {}).then(res) : res());
    im.onerror = () => res();
    im.src = src;
  }));
  return warmed.get(src);
}
const homePick = (set, who) => (isMobile() && set[who + "_m"]) || set[who];
function warmHomeSets(delay = 0) {
  HOME_SETS.forEach((set, i) => {
    homeTimers.push(setTimeout(() => ["sw", "amm", "xsw"].forEach((z) => warmImage(homePick(set, z))), delay + i * 350));
  });
}

/* ————— label tone from the image behind it —————
   the label / clock colour follows each panel's current image:
   the strip of image under the text is sampled on a small grid and the
   candidate (white · black · grey) with the best WORST-CASE contrast wins —
   so a uniformly dark image gets white, a bright one black, and a busy
   region mixing both extremes falls back to grey, which reads against both.
   fails silently (tainted canvas under file://, cross-origin CMS files):
   the caller keeps the default white-on-image. */
const TONE_LUM = { white: 1, black: 0, grey: 0.44 };          /* #b1b1b1 ≈ 0.44 */
const TONE_BIAS = { white: 1, black: 1, grey: 0.85 };         /* prefer the extremes */
const TONE_NATIVE = { sw: "black", amm: "white", xsw: "black" };   /* each zone's own text colour */
const TONE_SWITCH = 1.6;                                      /* another tone must beat the native one by this much */
const toneCache = new Map();
const toneImages = new Map();

function loadToneImage(src, cors) {
  const key = src + (cors ? "#cors" : "");
  if (toneImages.has(key)) return toneImages.get(key);
  const pr = new Promise((res, rej) => {
    const im = new Image();
    if (cors) im.crossOrigin = "anonymous";
    im.onload = () => res(im);
    im.onerror = () => rej(new Error("load"));
    im.src = src;
  });
  toneImages.set(key, pr);
  return pr;
}

/* opts.overlay = { lum, alpha }: a flat scrim composited over the image
   (detail hero); opts.tones: candidate subset, default all three;
   opts.prefer: the zone's native tone — kept unless another tone reads
   TONE_SWITCH times better (a near-tie no longer flips a coin) */
function toneFor(src, panel, el, opts = {}) {
  const pr = panel.getBoundingClientRect(), er = el.getBoundingClientRect();
  if (!pr.width || !er.width) return Promise.resolve(null);
  const ov = opts.overlay || null;
  const tones = opts.tones || Object.keys(TONE_LUM);
  /* text strip in panel space, padded a little */
  const pad = er.height * 0.6;
  const x0 = Math.max(0, er.left - pr.left - pad), x1 = Math.min(pr.width, er.right - pr.left + pad);
  const y0 = Math.max(0, er.top - pr.top - pad),  y1 = Math.min(pr.height, er.bottom - pr.top + pad);
  const prefer = opts.prefer || "";
  const key = `${src}|${Math.round(pr.width)}x${Math.round(pr.height)}|${Math.round(x0)},${Math.round(y0)}|${ov ? ov.lum + "@" + ov.alpha : ""}|${tones.join()}|${prefer}`;
  if (toneCache.has(key)) return Promise.resolve(toneCache.get(key));

  const sample = (im) => {
    /* background-size: cover · background-position: center → image space */
    const sc = Math.max(pr.width / im.naturalWidth, pr.height / im.naturalHeight);
    const ox = (pr.width - im.naturalWidth * sc) / 2, oy = (pr.height - im.naturalHeight * sc) / 2;
    const sx = (x0 - ox) / sc, sy = (y0 - oy) / sc, sw = (x1 - x0) / sc, sh = (y1 - y0) / sc;
    const cols = 16, rows = 4;
    const c = document.createElement("canvas"); c.width = cols; c.height = rows;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(im, sx, sy, sw, sh, 0, 0, cols, rows);
    const d = ctx.getImageData(0, 0, cols, rows).data;      /* throws if tainted */
    const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    const lums = [];
    for (let i = 0; i < d.length; i += 4) {
      let l = 0.2126 * lin(d[i]) + 0.7152 * lin(d[i + 1]) + 0.0722 * lin(d[i + 2]);
      if (ov) l = ov.lum * ov.alpha + l * (1 - ov.alpha);     /* what the eye sees through the scrim */
      lums.push(l);
    }
    let best = null, bestScore = -1;
    const scores = {};
    for (const tone of tones) {
      const lt = TONE_LUM[tone];
      let worst = Infinity;
      for (const lp of lums) {
        const cr = (Math.max(lt, lp) + 0.05) / (Math.min(lt, lp) + 0.05);
        if (cr < worst) worst = cr;
      }
      const score = worst * TONE_BIAS[tone];
      scores[tone] = score;
      if (score > bestScore) { bestScore = score; best = tone; }
    }
    if (prefer && tones.includes(prefer) && best !== prefer && bestScore < scores[prefer] * TONE_SWITCH) best = prefer;
    toneCache.set(key, best);
    return best;
  };

  return loadToneImage(src, false).then(sample)
    .catch(() => loadToneImage(src, true).then(sample))
    .catch(() => null);
}

function startHome() {
  /* reveal home without touching the intro layer (it fades out on top) */
  ["#section", "#page", "#detail"].forEach((v) => $(v).classList.add("hidden"));
  $("#home").classList.remove("hidden");
  setBodyTheme("home");                    /* three bands: the ground goes back to black */
  stopHome();

  const panels = document.querySelectorAll(".panel");
  panels.forEach((p) => {
    p.querySelectorAll(".panel-img").forEach((l) => { l.classList.remove("on"); l.style.zIndex = ""; });
    p.classList.remove("lit");
    delete p.dataset.tone; delete p.dataset.clockTone;
    p._front = null;
  });

  /* each panel runs on its own clock: its own image sequence and its own
     hold rhythm (seconds), crossfading 0.6 s between images and never
     returning to the bare colour. first image fades in once. */
  const RHYTHM = { sw: [3, 4, 5, 5, 3], amm: [5, 3, 3, 4, 3], xsw: [4, 3, 3, 5, 5] };
  const current = {};
  const run = ++homeRun;
  warmHomeSets(1200);                                /* the whole rotation, staggered, behind the first pictures */

  panels.forEach((p, pi) => {
    const who = p.dataset.who;
    let idx = 0, step = 0, first = true;

    const nextImage = () => {
      if (HOME_SETS.length) return homePick(HOME_SETS[idx++ % HOME_SETS.length], who);   /* phones: the landscape band picture when supplied */
      const featured = WORKS[who].filter((w) => w.featured);
      const pool = featured.length ? featured : WORKS[who];
      if (!pool.length) return null;
      let pick;
      do { pick = pool[Math.floor(Math.random() * pool.length)].img.src; }
      while (Object.values(current).includes(pick) && pool.length > 3);
      current[who] = pick;
      return pick;
    };

    /* the picture after `pick` in this panel's sequence — warmed while `pick` is on screen */
    const peekNext = () => (HOME_SETS.length ? homePick(HOME_SETS[idx % HOME_SETS.length], who) : null);

    const tick = () => {
      const pick = nextImage();
      const hold = RHYTHM[who][step++ % RHYTHM[who].length] * 1000;
      if (!pick) { homeTimers.push(setTimeout(tick, hold + 600)); return; }
      /* wait for the picture to be decoded (instant once warmed), then crossfade; the hold
         counts from the moment the fade starts, so a slow fetch delays but never shortens it */
      warmImage(pick).then(() => {
        if (run !== homeRun) return;
        const a = p.querySelector(".panel-img.a"), b = p.querySelector(".panel-img.b");
        const front = p._front || null, back = front === a ? b : a;
        back.style.transitionDuration = first ? "0.9s" : "0.6s";
        back.style.backgroundImage = `url("${pick}")`;
        back.style.zIndex = 2;
        if (front) front.style.zIndex = 1;
        back.classList.add("on");
        p.classList.add("lit");
        /* recolour label (and clock) for this image — per panel, per switch */
        const label = p.querySelector(".panel-label"), clock = p.querySelector(".home-clock");
        toneFor(pick, p, label, { prefer: TONE_NATIVE[who] }).then((tn) => { if (p._front === back && tn) p.dataset.tone = tn; });
        if (clock) toneFor(pick, p, clock, { prefer: TONE_NATIVE[who] }).then((tn) => { if (p._front === back && tn) p.dataset.clockTone = tn; });
        if (front) {
          front.style.transitionDuration = "0.6s";
          homeTimers.push(setTimeout(() => front.classList.remove("on"), 650));
        }
        p._front = back;
        first = false;
        warmImage(peekNext());                       /* next one fetches during this hold */
        homeTimers.push(setTimeout(tick, hold + 600));
      });
    };

    /* staggered start so the three panels never move together */
    homeTimers.push(setTimeout(tick, 2000 + pi * 700));
  });
}
function stopHome() {
  homeTimers.forEach((t) => (typeof t === "number" ? clearTimeout(t) : t.clear && t.clear()));
  if (homeTimers._iv) clearInterval(homeTimers._iv);
  homeTimers = [];
}

/* hover → period text
   only the middle band of each panel (HOME_HOVER_BAND of its height,
   centred on the label line) swaps the name for the period;
   the areas above and below leave the name untouched */
const HOME_HOVER_BAND = 0.35;
document.querySelectorAll(".panel").forEach((p) => {
  const label = p.querySelector(".panel-label");
  const setPeriod = (on) => {
    const s = t(on ? label.dataset.period : label.dataset.name);
    if (label.textContent !== s) label.textContent = s;
  };
  p.addEventListener("mousemove", (e) => {
    if (isMobile()) return;                          /* a tap opens the zone; no period swap */
    const r = p.getBoundingClientRect();
    const y = (e.clientY - r.top) / r.height;          /* 0 = top, 1 = bottom */
    const half = HOME_HOVER_BAND / 2;
    setPeriod(y >= 0.5 - half && y <= 0.5 + half);
  });
  p.addEventListener("mouseleave", () => setPeriod(false));
  p.addEventListener("click", () => openSection(p.dataset.who));
});

/* ————————————————————————————————————————————
   section — work list
   ———————————————————————————————————————————— */
let currentWho = "amm";
let canvasOn = false;

const SECTION_IN_MS = 2000;   /* home → zone: 2 s fade-in, clock reads "back home" meanwhile */
let sectionInTimer = null;

function openSection(who) {
  const fromHome = !$("#home").classList.contains("hidden");
  currentWho = who;
  canvasOn = false;
  stopHome();

  const sec = $("#section");
  sec.className = `view theme-${who}`;
  currentPage = null;
  setBodyTheme(who);
  $("#section-name").textContent = t(WHO[who].name);

  renderRows($("#worklist-scroll"), WORKS[who]);
  $("#worklist").scrollTop = 0;

  $("#worklist").classList.remove("hidden");
  $("#canvas-mode").classList.add("hidden");
  setToggleGlyph();
  closeMenu();
  clearTimeout(sectionInTimer);
  if (fromHome) {
    /* keep the three panels underneath while the zone fades in over them */
    ["#intro", "#page", "#detail"].forEach((v) => $(v).classList.add("hidden"));
    sec.classList.add("entering");
    sec.classList.remove("hidden");
    setClockLabel("back home", SECTION_IN_MS);
    sectionInTimer = setTimeout(() => {
      sec.classList.remove("entering");
      $("#home").classList.add("hidden");
      /* colour is in — now the rows, top to bottom */
      sec.classList.add("rows-in");
      const n = Math.min(12, $("#worklist-scroll").children.length);
      sectionInTimer = setTimeout(() => sec.classList.remove("rows-in"), n * 110 + 800);
    }, SECTION_IN_MS);
  } else {
    sec.classList.remove("entering", "rows-in");
    show("#section");
  }
}

/* ————— shared list rows: scrub through the work's images —————
   the thumb is split into equal horizontal bands, left → right =
   first → last image; hold still and it holds, leave → cover     */
function attachThumbCycle(el, w) {
  let cur = 0;
  const line = document.createElement("div");
  line.className = "scrub-line";
  el.appendChild(line);
  const set = (i) => {
    if (i === cur) return;
    cur = i;
    el.style.backgroundImage = `url("${w.images[i].src}")`;
  };
  el.addEventListener("mouseenter", () => { if (!isMobile()) el.classList.add("scrubbing"); });
  el.addEventListener("mousemove", (e) => {
    if (isMobile()) return;                          /* touch: a tap opens the work, no scrub */
    const r = el.getBoundingClientRect();
    const px = e.clientX - r.left;
    line.style.left = `${px}px`;                     /* progress line follows the cursor */
    const n = w.images.length;
    set(Math.min(n - 1, Math.max(0, Math.floor((px / r.width) * n))));
  });
  el.addEventListener("mouseleave", () => {
    el.classList.remove("scrubbing");                /* back to cover, cropped */
    set(0);
  });
}

function renderRows(container, works) {
  container.innerHTML = "";
  works.forEach((w, i) => {
    const row = document.createElement("div");
    row.className = "work-row";
    row.style.setProperty("--i", Math.min(i, 12));      /* stagger index for the top → bottom entrance */
    row.innerHTML = `
      <div class="work-thumb"></div>
      <div class="work-caption">
        <span class="w-title">${txt(w, "title")}</span>
        <span class="w-sub">${w.yearText || w.year}</span>
        <span class="w-sub">${txt(w, "category") || w.cat}</span>
      </div>`;
    row._work = w;
    const thumb = row.querySelector(".work-thumb");
    thumb.dataset.who = w.who;                     /* letterbox colour = the work's zone */
    thumb.style.backgroundImage = `url("${w.images[0].src}")`;
    thumb.addEventListener("click", () => openDetail(w));
    attachThumbCycle(thumb, w);
    container.appendChild(row);
  });
}

/* ————— mode toggle ————— */
function setToggleGlyph() {
  const b = $("#mode-toggle");
  b.classList.toggle("glyph-grid", !canvasOn);
  b.classList.toggle("glyph-lines", canvasOn);
}
$("#mode-toggle").addEventListener("click", () => {
  canvasOn = !canvasOn;
  $("#section").classList.toggle("canvas-on", canvasOn);
  $("#worklist").classList.toggle("hidden", canvasOn);
  $("#canvas-mode").classList.toggle("hidden", !canvasOn);
  if (canvasOn) buildCanvas();
  setToggleGlyph();
});

/* ————————————————————————————————————————————
   banner menu (hover left third)
   ———————————————————————————————————————————— */
let menuOpen = false;

const sectionVisible = () => !$("#section").classList.contains("hidden");
const detailVisible  = () => !$("#detail").classList.contains("hidden");
const pageVisible    = () => !$("#page").classList.contains("hidden");
const lightboxVisible = () => !$("#lightbox").classList.contains("hidden");

/* menu groups — rebuilt on open: the group holding the current item moves
   to the top, the current item first (on the centre line), rest flow down */
const MENU_GROUPS = [
  [
    { key: "amm", label: "anothermountainman", goto: "amm" },
    { key: "sw",  label: "stanley wong", goto: "sw" },
    { key: "xsw", label: "anothermountainman × stanley wong", goto: "xsw" },
  ],
  [
    { key: "search", label: "search", page: "search" },
    { key: "filter", label: "filter", page: "filter" },
  ],
  [
    { key: "journey",   label: "journey",   page: "journey" },
    { key: "biography", label: "biography", page: "biography" },
    { key: "media",     label: "media",     page: "media" },
  ],
];

function currentMenuKey() {
  if (pageVisible() && currentPage) return currentPage;
  return currentWho;
}

function renderMenu() {
  const cur = currentMenuKey();
  let groups = MENU_GROUPS.map((g) => g.slice());
  const gi = groups.findIndex((g) => g.some((it) => it.key === cur));
  if (gi > -1) {
    const g = groups[gi];
    g.sort((a, b) => (a.key === cur ? -1 : b.key === cur ? 1 : 0));
    groups.splice(gi, 1);
    groups.unshift(g);
  }
  const html = groups
    .map(
      (g) =>
        `<div class="menu-block">` +
        g
          .map(
            (it) =>
              `<a class="menu-item${it.key === cur ? " active" : ""}"` +
              (it.goto ? ` data-goto="${it.goto}"` : "") +
              (it.page ? ` data-page="${it.page}"` : "") +
              `>${t(it.label)}</a>`
          )
          .join("") +
        `</div>`
    )
    .join("");
  document.querySelectorAll("#menu-bottom .menu-item").forEach((a) => { a.textContent = t(a.dataset.page); a.classList.toggle("active", a.dataset.page === cur); });
  $("#menu").innerHTML =
    html +
    `<div class="menu-block" id="menu-lang">
       <a class="menu-item lang${LANG === "en" ? " active" : ""}" data-lang="en">en</a><span class="lang-dot">·</span><a class="menu-item lang${LANG === "cn" ? " active" : ""}" data-lang="cn">cn</a>
     </div>`;
}

function openMenu() {
  if ((!sectionVisible() && !detailVisible() && !pageVisible()) || lightboxVisible()) return;
  menuOpen = true;
  renderMenu();
  $("#menu").classList.remove("hidden");
  $("#menu-bottom").classList.remove("hidden");
  document.body.classList.add("menu-open");
  $("#section-name").style.opacity = 0;
  $("#detail-name").style.opacity = 0;
}
function closeMenu() {
  menuOpen = false;
  $("#menu").classList.add("hidden");
  $("#menu-bottom").classList.add("hidden");
  document.body.classList.remove("menu-open");
  $("#section-name").style.opacity = 1;
  $("#detail-name").style.opacity = 1;
}
/* hover opens the menu — the left third, but only from the same height the
   home labels react at (top edge of HOME_HOVER_BAND) down to the bottom, so the
   top-left corner is quiet, as on the home page. tracked on mousemove so nothing
   sits over the page and every click / drag passes through naturally.
   on search / filter pages (whose controls live in the left third)
   only the "search" / "filter" word itself opens it, and moving off
   the menu closes it again so the input / dropdowns stay usable */
function overEl(el, pad, x, y) {
  if (!el || el.classList.contains("hidden")) return false;
  const r = el.getBoundingClientRect();
  return x > r.left - pad && x < r.right + pad && y > r.top - pad && y < r.bottom + pad;
}
addEventListener("mousemove", (e) => {
  if (isMobile()) return;                            /* touch: the name / page word toggles the menu (bindMobile) */
  const third = innerWidth / 3;
  const x = e.clientX, y = e.clientY;
  const inZone = x < third && y >= innerHeight * (0.5 - HOME_HOVER_BAND / 2);
  const labelTrigger =
    pageVisible() && ["search", "filter", "journey"].includes(currentPage);
  if (labelTrigger) {
    const lbl = $("#page-bar .bar-label");
    if (!menuOpen && overEl(lbl, 12, x, y)) openMenu();
    else if (
      menuOpen &&
      !overEl(lbl, 16, x, y) &&
      !overEl($("#menu"), 24, x, y) &&
      !overEl($("#menu-bottom"), 24, x, y)
    ) closeMenu();
  } else {
    if (inZone && !menuOpen && !dragging) openMenu();
    else if (!inZone && menuOpen) closeMenu();
  }
});

/* menu clicks — delegated (menu is rebuilt on every open) */
function handleMenuClick(e) {
  const it = e.target.closest(".menu-item");
  if (!it) return;
  if (it.dataset.goto) openSection(it.dataset.goto);
  else if (it.dataset.page) openPage(it.dataset.page);
  else if (it.dataset.lang) {
    LANG = it.dataset.lang;
    applyLang();
  }
}
/* en · cn: relabel whatever is on screen in place (the detail page keeps its scroll) */
function applyLang() {
  document.documentElement.lang = LANG === "cn" ? "zh-Hant-HK" : "en";
  renderMenu();
  document.querySelectorAll(".panel-label").forEach((l) => { l.textContent = t(l.dataset.name); });
  $("#section-name").textContent = t(WHO[currentWho].name);
  $("#detail-name").textContent = t(WHO[currentWho].name);
  if (sectionVisible()) renderRows($("#worklist-scroll"), WORKS[currentWho]);
  if (detailVisible() && currentWork) { const top = $("#detail").scrollTop; openDetail(currentWork); $("#detail").scrollTop = top; }
  if (pageVisible() && (currentPage === "search" || currentPage === "filter")) {
    const bar = $("#page-bar");
    bar.querySelector(".bar-label").textContent = t(currentPage);
    const note = bar.querySelector(".bar-note"); if (note && note.textContent) note.textContent = t("not found");
    bar.querySelectorAll(".dd").forEach((dd) => {
      dd.querySelector(".dd-title").textContent = t(dd.dataset.dd === "year" ? "year" : "category");
      const val = dd.querySelector(".val"); val.textContent = t(val.dataset.v || val.textContent);
      dd.querySelectorAll(".dd-option").forEach((o) => { o.textContent = t(o.dataset.v); });
    });
    const cur = [...$("#page-rows").children].map((r) => r._work).filter(Boolean);
    if (cur.length) renderRows($("#page-rows"), cur);
  }
  if (typeof PAGES !== "undefined") PAGES.refresh();
}
$("#menu").addEventListener("click", handleMenuClick);
$("#menu-bottom").addEventListener("click", handleMenuClick);

/* ————————————————————————————————————————————
   infinite canvas — drag / wheel pan, wraps in both axes
   ———————————————————————————————————————————— */
let cvW = 0, cvH = 0, offX = 0, offY = 0;
let dragging = false, dragMoved = 0;
let vx = 0, vy = 0, momentumId = null;

/* what the canvas shows for a zone — every entry { src, w, h, full, work }:
   · the cover of every work in the zone (click → the work)
   · the work's other images ticked “canvas” in the cms (click → the work)
   · the zone's canvas_items records — pictures that belong to no work, or to one
     named by slug (click → that work, else the picture enlarges)
   demo (no cms): covers + js/canvas.js (Update Request 0919/7 - website 多图界面 - 素材), whose
   entries may name the work they belong to (`work: "a003"`, matched to the uploaded images).
   a picture that belongs to no work: CANVAS_ORPHAN = "random" → a random work of the same
   zone opens (the demo stage — only a few works are in yet); "lightbox" → the picture enlarges */
const CANVAS_ORPHAN = "random";
let CANVAS_ITEMS = null;                         /* from the cms; null = demo pool */
const workBySlug = (slug) => (slug ? ALL_WORKS.find((w) => w.rec && w.rec.slug === slug) || null : null);
const randomWork = (who) => { const l = WORKS[who] || []; return l.length ? l[Math.floor(Math.random() * l.length)] : null; };
function canvasPool(who) {
  const works = WORKS[who] || [];
  const pool = works.map((w) => ({ src: w.img.src, w: w.img.w, h: w.img.h, full: w.img.full || w.img.src, work: w }));
  if (CANVAS_ITEMS) {
    works.forEach((w) => (w.images || []).slice(1).forEach((im) => { if (im.canvas) pool.push({ src: im.src, w: im.w, h: im.h, full: im.full || im.src, work: w }); }));
    CANVAS_ITEMS.filter((it) => it.who === who).forEach((it) => pool.push({ src: it.src, w: it.w, h: it.h, full: it.full, work: workBySlug(it.slug) }));
  } else if (typeof CANVAS_DEMO !== "undefined" && CANVAS_DEMO[who]) {
    CANVAS_DEMO[who].forEach((im) => pool.push({ src: im.src, w: im.w, h: im.h, full: im.src, work: workBySlug(im.work) }));
  }
  return pool;
}
/* what a click on a canvas picture opens: its work, else (demo) a random work of the zone, else the picture */
function canvasClick(item) {
  const w = item.work || (CANVAS_ORPHAN === "random" ? randomWork(currentWho) : null);
  if (w) openDetail(w); else openLightbox(item.full);
}

function buildCanvas() {
  const stage = $("#canvas-stage");
  stage.innerHTML = "";
  const vw = innerWidth, vh = innerHeight;
  const mobile = isMobile();
  cvH = Math.max(2200, vh * 2);
  const gap = mobile ? vw * 0.0185 : Math.max(6, vw * 0.004);
  const pool = canvasPool(currentWho);
  if (!pool.length) return;
  /* deal the pool like a deck: every picture once before any repeats */
  let deck = shuffle(pool), di = 0;
  const next = () => { if (di >= deck.length) { deck = shuffle(pool); di = 0; } return deck[di++]; };

  /* columns of varying width, each filled to exactly cvH
     (mobile: two columns across the screen, as drawn, still wrapping both ways) */
  const cols = [];
  let x = 0;
  while (x < Math.max(3400, vw * 1.9)) {
    const w = mobile ? vw * (0.38 + Math.random() * 0.1) : vw * (0.12 + Math.random() * 0.14);
    cols.push({ x, w });
    x += w + gap;
  }
  cvW = x;

  const frag = document.createDocumentFragment();
  const tiles = [[0, 0], [cvW, 0], [0, cvH], [cvW, cvH]];

  cols.forEach((col) => {
    let y = 0;
    const items = [];
    while (y < cvH) {
      const w = next();
      let h = col.w * ((w.h || 3) / (w.w || 4));
      h = Math.max(90, Math.min(h, cvH * 0.42));
      if (y + h > cvH) h = cvH - y - (y > 0 ? gap : 0); /* crop last to fill */
      if (h < 60) { items.length && (items[items.length - 1].h += h + gap); break; }
      items.push({ w, y, h });
      y += h + gap;
    }
    tiles.forEach(([tx, ty]) => {
      items.forEach((it) => {
        const d = document.createElement("div");
        d.className = "cv-item";
        d.style.cssText = `left:${col.x + tx}px;top:${it.y + ty}px;width:${col.w}px;height:${it.h}px;background-image:url('${it.w.src}')`;
        d.addEventListener("click", () => { if (dragMoved >= 6) return; canvasClick(it.w); });
        frag.appendChild(d);
      });
    });
  });
  stage.appendChild(frag);
  offX = Math.random() * cvW; offY = Math.random() * cvH;
  renderCanvas();
}

function renderCanvas() {
  const x = ((offX % cvW) + cvW) % cvW;
  const y = ((offY % cvH) + cvH) % cvH;
  $("#canvas-stage").style.transform = `translate(${-x}px, ${-y}px)`;
}
function panBy(dx, dy) { offX += dx; offY += dy; renderCanvas(); }

function startDrag(e) {
  dragging = true; dragMoved = 0; vx = vy = 0;
  if (momentumId) cancelAnimationFrame(momentumId);
  $("#canvas-mode").classList.add("dragging");
  let lx = e.clientX, ly = e.clientY;
  const move = (ev) => {
    const dx = ev.clientX - lx, dy = ev.clientY - ly;
    dragMoved += Math.abs(dx) + Math.abs(dy);
    vx = -dx; vy = -dy;
    panBy(-dx, -dy);
    lx = ev.clientX; ly = ev.clientY;
  };
  const up = () => {
    dragging = false;
    $("#canvas-mode").classList.remove("dragging");
    removeEventListener("pointermove", move);
    removeEventListener("pointerup", up);
    /* momentum */
    (function glide() {
      vx *= 0.94; vy *= 0.94;
      if (Math.abs(vx) + Math.abs(vy) < 0.4) return;
      panBy(vx, vy);
      momentumId = requestAnimationFrame(glide);
    })();
    setTimeout(() => (dragMoved = 0), 50);
  };
  addEventListener("pointermove", move);
  addEventListener("pointerup", up);
}
$("#canvas-mode").addEventListener("pointerdown", startDrag);
$("#canvas-mode").addEventListener("wheel", (e) => panBy(e.deltaX, e.deltaY), { passive: true });

let rsTimer = null;
addEventListener("resize", () => {
  clearTimeout(rsTimer);
  rsTimer = setTimeout(() => { if (canvasOn) buildCanvas(); }, 250);
});

/* ————————————————————————————————————————————
   function pages — search / filter (grey), rest placeholders
   ———————————————————————————————————————————— */
let currentPage = null;
let LANG = "en";

const THEME_BG = { sw: "#ffffff", amm: "#000000", xsw: "#b1b1b1", page: "#e9e9e9" };
function setBodyTheme(name) {
  document.body.classList.remove("theme-sw", "theme-amm", "theme-xsw", "theme-page");
  if (THEME_BG[name]) document.body.classList.add(`theme-${name}`);
  /* browser chrome (safari toolbar / android status bar) takes the zone colour too */
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = THEME_BG[name] || "#000000";
}

const FILTER_CATS = [
  "all", "advertising", "tv commercial", "branding", "media", "book",
  "poster", "space", "exhibition", "curation", "photography", "video",
  "product", "installation", "fashion", "packaging", "painting",
  "object", "education",
];

function workMatches(w, q) {
  const r = w.rec || {};
  const hay = [
    txt(w, "title"), r.title_en, r.title_cn, w.year, w.cat, w.tags.join(" "),
    r.statement_en, r.statement_cn, r.description_en, r.description_cn,
    r.material_en, r.collection_en, r.exhibition_en,
  ].filter(Boolean).join(" ").toLowerCase();
  return hay.includes(q);
}

function openPage(name) {
  currentPage = name;
  setBodyTheme("page");
  const bar = $("#page-bar");
  const rows = $("#page-rows");
  bar.innerHTML = "";
  rows.innerHTML = "";
  $("#page-body").innerHTML = "";
  $("#page-stage").innerHTML = "";

  if (name === "search") {
    bar.innerHTML = `
      <span class="bar-label">${t("search")}</span>
      <input class="search-input" type="text" autocomplete="off" spellcheck="false">
      <span class="bar-note"></span>`;
    const input = bar.querySelector(".search-input");
    const note = bar.querySelector(".bar-note");
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      if (!q) { rows.innerHTML = ""; note.textContent = ""; return; }
      const hits = ALL_WORKS.filter((w) => workMatches(w, q));
      note.textContent = hits.length ? "" : t("not found");
      renderRows(rows, hits, false);
    });
    setTimeout(() => input.focus(), 50);
  } else if (name === "filter") {
    const years = ["all", ...[...new Set(ALL_WORKS.map((w) => w.year))].sort((a, b) => b - a)];
    const state = { year: "all", cat: "all" };

    const dd = (id, title, options, wide) => `
      <div class="dd${wide ? " wide" : ""}" data-dd="${id}">
        <span class="dd-title">${t(title)}</span>
        <span class="dd-value"><span class="val" data-v="all">${t("all")}</span><span class="chev">⌄</span></span>
        <div class="dd-options hidden">
          ${options.map((o) => `<span class="dd-option" data-v="${o}">${t(o)}</span>`).join("")}
        </div>
      </div>`;
    bar.innerHTML = `<span class="bar-label">${t("filter")}</span>` +
      dd("year", "year", years) + dd("cat", "category", FILTER_CATS, true);

    const apply = () => {
      const hits = ALL_WORKS.filter((w) =>
        (state.year === "all" || w.year === Number(state.year)) &&
        (state.cat === "all" || (w.cats || [w.cat]).join(" ").includes(state.cat))
      );
      renderRows(rows, hits, false);
    };
    bar.querySelectorAll(".dd").forEach((el) => {
      const opts = el.querySelector(".dd-options");
      el.querySelector(".dd-value").addEventListener("click", () => {
        bar.querySelectorAll(".dd-options").forEach((o) => o !== opts && o.classList.add("hidden"));
        opts.classList.toggle("hidden");
      });
      opts.addEventListener("click", (e) => {
        const o = e.target.closest(".dd-option");
        if (!o) return;
        state[el.dataset.dd] = o.dataset.v;
        el.querySelector(".val").textContent = t(o.dataset.v); el.querySelector(".val").dataset.v = o.dataset.v;
        opts.classList.add("hidden");
        apply();
      });
    });
    apply();
  } else if (typeof PAGES !== "undefined" && PAGES[name]) {
    PAGES[name].open(bar);                       /* journey / biography — js/pages.js */
  } else {
    /* shop: still a placeholder */
    bar.innerHTML = `<span class="bar-label">${t(name)}</span>
      <span class="bar-note">demo — ${name} page in progress</span>`;
  }

  /* journey runs on its own full-screen stage; every other page scrolls */
  const staged = name === "journey" && !isMobile();  /* mobile: journey scrolls as a list */
  $("#page-stage").classList.toggle("hidden", !staged);
  $("#page-scroll").classList.toggle("hidden", staged);
  $("#page").dataset.page = name;

  $("#page-scroll").scrollTop = 0;
  closeMenu();
  show("#page");
}

function closePage() {
  currentPage = null;
  setBodyTheme(currentWho);
  show("#section");
}
$("[data-close-page]").addEventListener("click", closePage);

/* ————————————————————————————————————————————
   work detail — scrolling project page
   ———————————————————————————————————————————— */
const DEMO_STATEMENT =
  "project statement / demo\nplaceholder text for this work.\n\nreal copy, credits and\ncaptions will replace this\nwhen the project data is in.";
const DEMO_PARAGRAPH =
  "demo paragraph — this block stands in for the long project description. " +
  "it sits beside the images the way the final text will, so the rhythm of " +
  "reading and looking can be judged before the real content arrives. " +
  "materials, process and context notes all live in text blocks like this one.";

function pickOthers(who, exclude, n) {
  return shuffle(WORKS[who].filter((x) => x !== exclude)).slice(0, n);
}

/* ————— layout engine —————
   blocks: {type:"row", span:[a,b], cells:[{imgs:[i,…], w:0.5}]}   (cell imgs stack vertically)
           {type:"grid", span:[a,b], imgs:[…], cols:2}
           {type:"video", span:[a,b]}                          (vimeo link `video_url`, else the mp4 file)
           {type:"caption", span:[a,b], text:"…"}            (dim, --sub colour)
           {type:"par",     span:[a,b], text_en:"…", text_cn:"…"}  (body paragraph)
   span = start / end on the 6-column grid (0 = left inset, 6 = right inset).
   image indices are 1-based (= order of the work's extra images).
   a cell may also carry  span:[a,b]  (absolute position on the grid, for rows whose
   cells are not evenly spaced),  text_en / text_cn  (a paragraph beside an image)
   or  blocks:[…]  (nested rows / grids stacked inside the cell, spans in grid units) */
function autoLayout(imgs, hasVideo) {
  const blocks = []; let i = 0, toggle = 0;
  const ori = imgs.map((im) => (im.h > im.w * 1.05 ? "p" : "l"));
  while (i < imgs.length) {
    if (ori[i] === "p") {
      const grp = []; for (let j = i; j < Math.min(i + 3, imgs.length); j++) if (ori[j] === "p") grp.push(j + 1); else break;
      if (grp.length === 1) blocks.push({ type: "row", span: [2.05, 3.85], cells: [{ imgs: [i + 1] }] });
      else blocks.push({ type: "row", span: grp.length === 3 ? [0, 6] : [2.05, 6], cells: grp.map((g) => ({ imgs: [g] })) });
      i += grp.length;
    } else {
      if (toggle % 3 === 1 && i + 1 < imgs.length && ori[i + 1] === "l") { blocks.push({ type: "row", span: [0, 6], cells: [{ imgs: [i + 1], w: 0.5 }, { imgs: [i + 2], w: 0.5 }] }); i += 2; }
      else if (toggle % 3 === 2 && i + 3 < imgs.length && ori.slice(i, i + 4).every((o) => o === "l")) { blocks.push({ type: "grid", span: [0, 6], imgs: [i + 1, i + 2, i + 3, i + 4], cols: 2 }); i += 4; }
      else { blocks.push({ type: "row", span: [2.05, 6], cells: [{ imgs: [i + 1] }] }); i += 1; }
      toggle++;
    }
  }
  if (hasVideo) blocks.splice(Math.min(2, blocks.length), 0, { type: "video", span: [0, 3.9] });
  return blocks;
}

/* mobile re-flow of a desktop layout (design p.17–23): one narrow column, so the
   grid gives way to a plain sequence of single pictures and pairs —
   · a picture from a wide cell (> half the grid) stands alone at full width
   · pictures from narrow cells go two to a line, equal halves, in reading order;
     an odd one out keeps its place on the grid (left / centre / right) at half width
   · nested rows and grids are flattened into that sequence; a paragraph beside a
     picture follows the pictures at full width; `top` offsets are dropped */
function mobileBlocks(blocks) {
  const out = [];
  const NARROW = 3.05;                                 /* cell width (grid units) at or under which pictures pair up */
  const place = (span) => {                            /* half width, aligned as the cell was */
    const [a, b] = span || [0, 3];
    const w = 3, c = (a + b) / 2;
    const l = Math.min(Math.max(c - w / 2, 0), 6 - w);
    return [l, l + w];
  };
  const flush = (units) => {
    for (let i = 0; i < units.length;) {
      const u = units[i];
      if (u.width > NARROW) { out.push({ type: "row", span: [0, 6], cells: [{ imgs: u.imgs }] }); i++; continue; }
      const v = units[i + 1];
      if (v && v.width <= NARROW) { out.push({ type: "row", span: [0, 6], cells: [{ imgs: u.imgs, w: 0.5 }, { imgs: v.imgs, w: 0.5 }] }); i += 2; }
      else { out.push({ type: "row", span: place(u.span), cells: [{ imgs: u.imgs }] }); i++; }
    }
  };
  blocks.forEach((b) => {
    if (b.type === "grid") {
      const cols = b.cols || 2, cw = 6 / cols;
      flush((b.imgs || []).map((i, k) => ({ imgs: [i], width: cw, span: [(k % cols) * cw, (k % cols + 1) * cw] })));
      return;
    }
    if (b.type !== "row") { out.push(Object.assign({}, b, { span: [0, 6], top: 0 })); return; }
    const units = [], texts = [];
    const collect = (cells, rowSpan) => {
      const [A, B] = rowSpan || [0, 6], W = B - A;
      cells.forEach((c) => {
        const span = c.span || (cells.length === 1 ? [A, B] : null);
        const width = span ? span[1] - span[0] : (c.w || 1 / cells.length) * W;
        if (c.imgs && c.imgs.length) units.push({ imgs: c.imgs, span, width });
        if (c.text || c.text_en || c.text_cn) texts.push({ type: "par", text: c.text, text_en: c.text_en, text_cn: c.text_cn });
        (c.blocks || []).forEach((n) => {
          if (n.type === "row") collect(n.cells || [], n.span || span || [A, B]);
          else if (n.type === "grid") { const cols = n.cols || 2, cw = (span ? span[1] - span[0] : W) / cols; (n.imgs || []).forEach((i) => units.push({ imgs: [i], span: null, width: cw })); }
          else texts.push(Object.assign({}, n));
        });
      });
    };
    collect(b.cells || [], b.span);
    flush(units);
    texts.forEach((t) => out.push(Object.assign(t, { span: [0, 6], top: 0 })));
  });
  return out;
}

/* vimeo.com/<id> (or player.vimeo.com/video/<id>, with or without a hash) → id */
function vimeoId(url) {
  const m = String(url || "").match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : "";
}

function renderLayout(body, blocks, imgs, w) {
  if (isMobile()) blocks = mobileBlocks(blocks);
  const full = (im) => im.full || im.src;
  const pic = (i) => {
    const im = imgs[i - 1]; if (!im) return null;
    const el = document.createElement("div");
    el.className = "l-img";
    el.innerHTML = `<img src="${im.src}" alt="" loading="lazy">`;
    el.addEventListener("click", () => openLightbox(full(im), im));
    return el;
  };
  /* text of a caption / par block or a text cell: text_en / text_cn (en · cn switch), else text */
  const btxt = (o) => (LANG === "cn" && o.text_cn ? o.text_cn : o.text_en || o.text || "");
  const textEl = (cls, s) => {
    const el = document.createElement("div");
    el.className = cls;
    el.innerHTML = String(s).split("\n").map((x) => `<span>${x}</span>`).join("<br>");
    return el;
  };
  /* span → geometry. Top level: absolute on the page grid (inset … 100vw − inset).
     Nested (inside a cell): percentages of the parent range [ra, rb] in the same grid units. */
  const spanStyle = (span, range) => {
    const [a, b] = span || range || [0, 6];
    if (!range) return `margin-left:calc(var(--inset) + (100vw - 2 * var(--inset)) * ${a / 6});width:calc((100vw - 2 * var(--inset)) * ${(b - a) / 6})`;
    const [ra, rb] = range, W = rb - ra || 1;
    return `margin-left:${((a - ra) / W) * 100}%;width:${((b - a) / W) * 100}%`;
  };
  /* optional `top` (grid units = same scale as span): exact vertical distance from the previous
     block's bottom edge — the container's own gap (--bgap between page blocks, --lgap inside a
     cell) is subtracted so the distance is what the design file measures */
  const topStyle = (top, range) => {
    if (!(top > 0 || top < 0)) return "";
    if (!range) return `;margin-top:calc((100vw - 2 * var(--inset)) * ${top / 6} - var(--bgap))`;
    const [ra, rb] = range, W = rb - ra || 1;
    return `;margin-top:calc(${(top / W) * 100}% - var(--lgap))`;
  };
  const renderBlocks = (container, list, range) => (list || []).forEach((b) => {
    const el = document.createElement("div");
    el.className = `l-block l-${b.type}`;
    el.style.cssText = spanStyle(b.span, range) + topStyle(b.top, range);
    if (b.type === "row") {
      const cells = b.cells || [];
      const hasW = cells.some((c) => c.w);
      const [A, B] = b.span || range || [0, 6], W = B - A || 1;
      let prevEnd = A;
      cells.forEach((c, k) => {
        const cell = document.createElement("div");
        cell.className = "l-cell";
        if (Array.isArray(c.span)) {
          /* absolute cell: [a, b] on the grid — width exact, gap to the previous cell exact
             (the flex gap --lgap is part of that distance) */
          const [ca, cb] = c.span;
          cell.style.flex = `0 0 ${((cb - ca) / W) * 100}%`;
          cell.style.marginLeft = k ? `calc(${((ca - prevEnd) / W) * 100}% - var(--lgap))` : `${((ca - A) / W) * 100}%`;
          prevEnd = cb;
          if (c.top > 0) cell.style.marginTop = `${(c.top / W) * 100}%`;   /* offset below the row's top edge */
        } else cell.style.flex = hasW ? `0 0 calc(${(c.w || 1 / cells.length) * 100}% - var(--lgap) * ${(cells.length - 1) / cells.length})` : "1 1 0";
        (c.imgs || []).forEach((i) => { const p = pic(i); if (p) cell.appendChild(p); });
        if (c.text || c.text_en || c.text_cn) cell.appendChild(textEl("l-par", btxt(c)));
        if (c.blocks) renderBlocks(cell, c.blocks, c.span || [A, B]);
        if (cell.children.length) el.appendChild(cell);
      });
    } else if (b.type === "grid") {
      el.style.gridTemplateColumns = `repeat(${b.cols || 2}, 1fr)`;
      (b.imgs || []).forEach((i) => { const p = pic(i); if (p) el.appendChild(p); });
    } else if (b.type === "video") {
      const vimeo = vimeoId(w.videoUrl);
      if (!vimeo && !w.video) return;
      el.innerHTML = `<div class="l-video-box"${w.poster ? ` style="background-image:url('${w.poster}')"` : ""}><span class="play"></span></div>`;
      el.querySelector(".l-video-box").addEventListener("click", function () {
        if (vimeo) this.innerHTML = `<iframe class="l-video-frame" src="https://player.vimeo.com/video/${vimeo}?autoplay=1&title=0&byline=0&portrait=0&dnt=1" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
        else this.outerHTML = `<video class="l-video-el" src="${w.video}" controls autoplay playsinline></video>`;
      });
    } else if (b.type === "caption" || b.type === "par") {
      el.innerHTML = textEl(b.type === "par" ? "l-par" : "l-caption", btxt(b)).innerHTML;
    }
    if (el.children.length || el.textContent) container.appendChild(el);
  });
  /* a block flagged  aside: "statement"  sits beside the statement text (left of it, in the
     columns the statement leaves free): it is lifted into a flex row together with the text */
  const aside = isMobile() ? null : blocks.find((b) => b.aside === "statement");   /* mobile: it follows the statement */
  const text = body.querySelector(".d-text");
  if (aside && text) {
    const head = document.createElement("div"); head.className = "d-head";
    body.insertBefore(head, text); head.appendChild(text);
    renderBlocks(head, [Object.assign({}, aside, { top: 0 })]);
    const asideEl = head.lastElementChild;
    if (asideEl !== text) { head.insertBefore(asideEl, text); const [, b] = aside.span || [0, 6]; text.style.marginLeft = `calc(var(--col) * 2 + clamp(10px, 1vw, 26px) - var(--inset) - (100vw - 2 * var(--inset)) * ${b / 6} - var(--lgap))`; }
  }
  renderBlocks(body, blocks.filter((b) => b !== aside));
}

let currentWork = null;
function openDetail(w) {
  const d = $("#detail");
  currentWork = w;
  currentPage = null;
  setBodyTheme(currentWho);
  d.className = `view theme-${currentWho}`;
  $("#detail-name").textContent = t(WHO[currentWho].name);
  $("#detail-hero-img").style.backgroundImage = `url("${w.img.src}")`;
  $("#detail-hero .d-title").textContent = txt(w, "title");
  $("#detail-hero .d-year").textContent = w.yearText || w.year;
  $("#detail-hero .d-cat").textContent = txt(w, "category") || w.cat;

  const body = $("#detail-body");
  body.innerHTML = "";
  const fromCms = !!w.rec;
  const imgs = fromCms ? w.images.slice(1) : pickOthers(currentWho, w, 9).map((o) => o.img);

  /* statement */
  const statement = fromCms ? txt(w, "statement") : DEMO_STATEMENT;
  if (statement) {
    const text = document.createElement("div");
    text.className = "d-text";
    if (fromCms) text.innerHTML = statement; else text.textContent = statement;
    body.appendChild(text);
  }

  /* images / video — from the work's layout, else auto */
  renderLayout(body, w.layout || autoLayout(imgs, !!(w.video || vimeoId(w.videoUrl))), imgs, w);

  /* optional long description */
  const description = fromCms ? txt(w, "description") : "";
  if (description) {
    const par = document.createElement("div");
    par.className = "d-par";
    par.innerHTML = description;
    body.appendChild(par);
  }

  /* colophon — free list of label / value pairs */
  const html = (s) => String(s || "").replace(/\n/g, "<br>");
  const credits = fromCms
    ? (w.credits || []).map((c) => ({ label: c.label, value: LANG === "cn" && c.value_cn ? c.value_cn : c.value_en }))
        .concat(["material", "collection", "exhibition"].map((k) => ({ label: k, value: txt(w, k) })))
        .filter((c) => c.value)
    : [{ label: "client", value: "demo client /" }, { label: "collaboration", value: "demo collaborator [role]" }, { label: "award", value: `demo award ${w.year} /` }];
  const colo = document.createElement("div");
  colo.className = "d-colophon";
  colo.innerHTML = `
    <span class="c-title">${txt(w, "title")}</span>
    <div class="c-meta">${credits.map((c) => `<span><span class="label">${t(c.label)}</span>${html(c.value)}</span>`).join("")}</div>`;
  body.appendChild(colo);

  d.scrollTop = 0;
  $("#detail-hero-scrim").style.opacity = 0.7;
  show("#detail");

  /* hero row colour: title and year / category are read against the image
     seen through the 70 % section-colour scrim; black or white per element.
     (name and clock stay in the section colour — they outlive the hero) */
  const heroTones = () => {
    const pin = $("#detail-hero-pin");
    const overlay = { lum: { sw: 1, amm: 0, xsw: 0.44 }[currentWho], alpha: 0.7 };
    [".d-title", ".d-meta"].forEach((sel) => {
      const el = $("#detail-hero " + sel);
      delete el.dataset.tone;
      toneFor(w.img.src, pin, el, { overlay, tones: ["white", "black"], prefer: TONE_NATIVE[currentWho] })
        .then((tn) => { if (tn && $("#detail-hero .d-title").textContent === txt(w, "title")) el.dataset.tone = tn; });
    });
  };
  requestAnimationFrame(heroTones);
}
$("[data-close-detail]").addEventListener("click", () => show("#section"));

/* hero scrim: 70 % section colour → 0 over the first viewport of scroll
   (text scrolls away meanwhile; the pinned image then follows) */
$("#detail").addEventListener("scroll", () => {
  /* mobile: the hero is one screen and scrolls away, so the scrim is gone by half a screen */
  const p = Math.min(1, $("#detail").scrollTop / (innerHeight * (isMobile() ? 0.5 : 1)));
  $("#detail-hero-scrim").style.opacity = (0.7 * (1 - p)).toFixed(3);
}, { passive: true });

/* ————— lightbox ————— */
function openLightbox(src, im) {
  const lb = $("#lightbox");
  lb.className = `theme-${currentWho}`;            /* single image view follows the section colour */
  $("#lightbox-img").src = src;
  /* one-line description from the CMS (per image); empty → nothing shown */
  const cap = im ? (LANG === "cn" && im.cap_cn ? im.cap_cn : im.cap_en || "") : "";
  $("#lightbox-cap").textContent = cap;
  closeMenu();
}
$("[data-close-lightbox]").addEventListener("click", () =>
  $("#lightbox").classList.add("hidden")
);

/* ————————————————————————————————————————————
   restart (click on the clock)
   ———————————————————————————————————————————— */
function restart() {
  t0 = Date.now();
  stopHome();
  closeMenu();
  $("#lightbox").classList.add("hidden");
  playIntro(startHome);
}

addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (lightboxVisible()) $("#lightbox").classList.add("hidden");
  else if (detailVisible()) show("#section");
  else if (pageVisible()) closePage();
});

/* ————————————————————————————————————————————
   mobile (aspect ≤ 1:1) — touch behaviours
   · the name (section / detail) or the page word (search / filter / …)
     toggles the menu; a tap anywhere else closes it
   · swipe left / right on a zone moves to the next / previous identity
     (white → black → grey, the home order), the lists sliding across
   · crossing 1:1 while a view is open re-lays it out
   ———————————————————————————————————————————— */
const WHO_ORDER = ["sw", "amm", "xsw"];

function toggleMenu() { menuOpen ? closeMenu() : openMenu(); }

function swipeSection(who, dir) {
  const sec = $("#section");
  const live = sec.querySelector(".section-mode:not(.hidden)");
  /* ghost: the leaving list, frozen at its scroll position, on its own zone colour */
  const ghost = document.createElement("div");
  ghost.className = "swipe-ghost";
  ghost.style.background = getComputedStyle($("#section-bg")).backgroundColor;
  const clone = live.cloneNode(true);
  clone.removeAttribute("id");
  clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
  if (clone.firstElementChild) clone.firstElementChild.style.transform = `translateY(${-live.scrollTop}px)`;
  ghost.appendChild(clone);
  sec.appendChild(ghost);

  openSection(who);
  const next = sec.querySelector(".section-mode:not(.hidden)");
  const opts = { duration: 420, easing: "cubic-bezier(0.3, 0.7, 0.3, 1)" };
  ghost.animate([{ transform: "translateX(0)" }, { transform: `translateX(${dir * 100}%)` }], opts).onfinish = () => ghost.remove();
  next.animate([{ transform: `translateX(${-dir * 100}%)` }, { transform: "translateX(0)" }], opts);
}

(function bindMobile() {
  /* menu toggles from the name / page word */
  ["#section-name", "#detail-name"].forEach((sel) => $(sel).addEventListener("click", () => { if (isMobile()) toggleMenu(); }));
  $("#page-bar").addEventListener("click", (e) => { if (isMobile() && e.target.closest(".bar-label")) toggleMenu(); });
  document.addEventListener("click", (e) => {
    if (!isMobile() || !menuOpen) return;
    if (e.target.closest("#menu, #menu-bottom, .side-label, .bar-label")) return;
    closeMenu();
  });

  /* horizontal swipe on a zone → neighbouring identity */
  let sx = 0, sy = 0, swiping = false;
  const sec = $("#section");
  sec.addEventListener("touchstart", (e) => {
    swiping = isMobile() && !menuOpen && !canvasOn && e.touches.length === 1;   /* the canvas is dragged, not swiped */
    if (!swiping) return;
    sx = e.touches[0].clientX; sy = e.touches[0].clientY;
  }, { passive: true });
  sec.addEventListener("touchend", (e) => {
    if (!swiping) return;
    swiping = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    const i = WHO_ORDER.indexOf(currentWho), j = i + (dx < 0 ? 1 : -1);
    if (j < 0 || j >= WHO_ORDER.length) return;
    swipeSection(WHO_ORDER[j], dx < 0 ? -1 : 1);
  }, { passive: true });

  /* crossing the 1:1 line: re-lay out whatever is open */
  MOBILE_MQ.addEventListener("change", () => {
    closeMenu();
    if (sectionVisible()) { renderRows($("#worklist-scroll"), WORKS[currentWho]); if (canvasOn) buildCanvas(); }
    if (detailVisible() && currentWork) openDetail(currentWork);
    if (pageVisible() && currentPage) openPage(currentPage);
    if (!$("#home").classList.contains("hidden") && $("#intro").classList.contains("hidden")) startHome();   /* bands ↔ panels: swap to the right picture set */
  });
})();

/* ————— boot ————— */
playIntro(startHome);
/* content loads in parallel with the intro (desktop) / after it (phones — afterIntro); swaps in silently when it arrives.
   the home sets are small and needed first, so they always load at once */
CMS.loadHomeSets().then((sets) => {
  if (!sets) return;
  HOME_SETS = sets; console.info(`cms: ${sets.length} home sets`);
  /* first three pictures at once (the panels' first ticks are 2–3.4 s in), the rest staggered */
  ["sw", "amm", "xsw"].forEach((z) => warmImage(homePick(sets[0], z)));
  if (!$("#home").classList.contains("hidden")) warmHomeSets(800);
});
afterIntro(() => {
  CMS.loadWorks().then((list) => {
    if (list) { applyWorks(list); console.info(`cms: ${list.length} works loaded`); }
    else console.info("cms: offline or empty — demo data in use");
  });
  CMS.loadCanvas().then((items) => {
    if (!items) return;                              /* cms unreachable: the demo pool stays */
    CANVAS_ITEMS = items;
    console.info(`cms: ${items.length} canvas items`);
    if (canvasOn) buildCanvas();
  });
});
