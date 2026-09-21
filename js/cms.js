/* ————————————————————————————————————————————
   CMS bridge — PocketBase → site data
   loads published works; when PocketBase is unreachable or empty the
   site keeps running on the built-in demo data.
   ———————————————————————————————————————————— */
/* ————— static content mode (no PocketBase) —————
   when config.js sets PB_URL = "" and CONTENT_URL = "content/", the site reads the
   same json the importer reads (manifest / timeline / biography / canvas) straight
   from that folder, files included — a review build on GitHub Pages or any static
   host, no server. Missing files fall through to the built-in demo data. */
const STATIC = {
  base: (typeof CONTENT_URL !== "undefined" && CONTENT_URL) || "",
  on() { return !PB_URL && !!STATIC.base; },
  async json(name) {
    try { const r = await fetch(STATIC.base + name); return r.ok ? await r.json() : null; } catch (e) { return null; }
  },
  async works() {
    const m = await STATIC.json("manifest.json");
    if (!m || !Array.isArray(m.works)) return null;
    const br = (t) => String(t || "").replace(/\n/g, "<br>");
    const list = await Promise.all(m.works.filter((w) => w.published !== false).map(async (w) => {
      const dir = `${STATIC.base}works/${w.slug}/`;
      const cover = await CMS.measure(dir + w.cover);
      const extras = (w.images || []).map((f) => ({ src: dir + f, full: dir + f, w: 4, h: 3, cap_en: "", cap_cn: "", canvas: false }));
      const rec = Object.assign({}, w, { statement_en: br(w.statement_en), statement_cn: br(w.statement_cn) });
      return {
        id: w.slug, who: w.who, rec,
        img: cover, images: [cover, ...extras],
        tags: (w.tags || "").split(/[,，]/).map((t) => t.trim().toLowerCase()).filter(Boolean),
        year: w.year, yearText: w.year_text || String(w.year || ""),
        cat: w.category_en || (w.categories || []).join(" / "), cats: w.categories || [],
        video: w.video ? `${STATIC.base}video/${w.video}` : "",
        videoUrl: w.video_url || "",
        poster: w.video_poster ? `${STATIC.base}video/${w.video_poster}` : "",
        credits: Array.isArray(w.credits) ? w.credits : [],
        layout: Array.isArray(w.layout) && w.layout.length ? w.layout : null,
        featured: !!w.featured_home, sort: w.sort || 0,
      };
    }));
    return list.sort((a, b) => (a.sort - b.sort) || (b.year - a.year));
  },
  async home() {
    const m = await STATIC.json("manifest.json");
    if (!m || !Array.isArray(m.home) || !m.home.length) return null;
    return m.home.map((h) => ({ sw: `${STATIC.base}home/${h.sw}`, amm: `${STATIC.base}home/${h.amm}`, xsw: `${STATIC.base}home/${h.xsw}` }));
  },
  async journey() {
    const t = await STATIC.json("timeline.json");
    if (!t || !Array.isArray(t.rows)) return null;
    const out = [];
    t.rows.forEach((row) => [["l", "above"], ["r", "below"]].forEach(([col, slot]) => (row[col] || []).forEach((par) => out.push({
      year: row.year, rec: { text_en: par.en, text_cn: par.cn || "" },
      image: par.image ? { src: par.image, full: par.image } : null, size: par.size || "", slot,
    }))));
    return out.length ? out : null;
  },
  async biography() {
    const b = await STATIC.json("biography.json");
    if (!b) return null;
    const rows = Array.isArray(b.entries) && b.entries.length
      ? b.entries.map((e) => ({ section: e.section, date: e.date, rec: e }))          /* cv rows exported in the json (bilingual) */
      : typeof DEMO_BIO !== "undefined" ? DEMO_BIO.entries : [];
    return { rec: { body_en: b.body_en || "", body_cn: b.body_cn || "" }, portrait: b.portrait || "", portraitFull: b.portrait || "", entries: rows };
  },
  async canvas() {
    const c = await STATIC.json("canvas.json");
    if (!c) return null;
    const out = [];
    ["sw", "amm", "xsw"].forEach((who) => (c[who] || []).forEach((im) => out.push({ who, src: im.src, full: im.src, w: im.w, h: im.h, slug: im.work || "" })));
    return out;
  },
  /* media page: media.json items (newest first) → the shape of a media_items row */
  async media() {
    const m = await STATIC.json("media.json");
    if (!m || !Array.isArray(m.items)) return null;
    return m.items.map((it, i) => ({ rec: it, date: it.date || "", url: it.url || "", image: it.image || "", frame: !!it.frame, sort: i }));
  },
  /* contact / acknowledgments: <key>.json → pages[key] (body newlines → <br>, as the admin stores them) */
  async page(key) {
    const p = await STATIC.json(`${key}.json`);
    if (!p) return null;
    const br = (t) => String(t || "").replace(/\n/g, "<br>");
    return { rec: { key, title_en: p.title_en || key, title_cn: p.title_cn || "", body_en: br(p.body_en), body_cn: br(p.body_cn) }, images: [] };
  },
};

const CMS = {
  fileUrl(rec, name, thumb) {
    return `${PB_URL}/api/files/${rec.collectionId}/${rec.id}/${name}${thumb ? `?thumb=${thumb}` : ""}`;
  },

  /* read natural size (needed for the infinite-canvas layout) */
  measure(src) {
    return new Promise((res) => {
      const im = new Image();
      im.onload = () => res({ src, w: im.naturalWidth || 4, h: im.naturalHeight || 3 });
      im.onerror = () => res({ src, w: 4, h: 3 });
      im.src = src;
    });
  },

  async fetchAll(collection, query) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 5000);
    try {
      const r = await fetch(
        `${PB_URL}/api/collections/${collection}/records?perPage=500&${query}`,
        { signal: ctrl.signal }
      );
      if (!r.ok) return null;
      return (await r.json()).items || null;
    } catch (e) {
      return null;
    } finally {
      clearTimeout(t);
    }
  },

  async mapWork(rec) {
    const cover = await CMS.measure(CMS.fileUrl(rec, rec.cover, "1600x0"));
    const caps = Array.isArray(rec.image_captions) ? rec.image_captions : [];   /* aligned with images by index */
    const extras = (Array.isArray(rec.images) ? rec.images : rec.images ? [rec.images] : []).map((f, i) => ({
      src: CMS.fileUrl(rec, f, "1600x0"),
      full: CMS.fileUrl(rec, f),
      w: 4, h: 3,
      cap_en: (caps[i] && caps[i].en) || "",
      cap_cn: (caps[i] && caps[i].cn) || "",
      canvas: !!(caps[i] && caps[i].canvas),   /* ticked “canvas” in the cms → also shows on the infinite canvas */
    }));
    return {
      id: rec.id,
      who: rec.who,
      rec,                                  /* raw record: bilingual fields live here */
      img: cover,
      images: [cover, ...extras],
      tags: (rec.tags || "").split(/[,，]/).map((s) => s.trim().toLowerCase()).filter(Boolean),
      year: rec.year,
      yearText: rec.year_text || String(rec.year || ""),
      cat: rec.category_en || (rec.categories || []).join(" / "),
      cats: rec.categories || [],
      video: rec.video ? CMS.fileUrl(rec, rec.video) : "",
      videoUrl: rec.video_url || "",          /* vimeo link — preferred over the file */
      poster: rec.video_poster ? CMS.fileUrl(rec, rec.video_poster, "1600x0") : "",
      credits: Array.isArray(rec.credits) ? rec.credits : [],
      layout: Array.isArray(rec.layout) && rec.layout.length ? rec.layout : null,
      featured: !!rec.featured_home,
      sort: rec.sort || 0,
    };
  },

  async loadWorks() {
    if (STATIC.on()) return STATIC.works();
    if (!PB_URL) return null;
    const items = await CMS.fetchAll(
      "works",
      `filter=${encodeURIComponent("published=true")}&sort=sort,-year`
    );
    if (!items || !items.length) return null;
    return Promise.all(items.map(CMS.mapWork));
  },

  /* home: synchronised triplets (one image per zone, shown together) */
  async loadHomeSets() {
    if (STATIC.on()) return STATIC.home();
    if (!PB_URL) return null;
    const items = await CMS.fetchAll("home_sets", `filter=${encodeURIComponent("published=true")}&sort=sort`);
    if (!items || !items.length) return null;
    return items.map((r) => ({
      sw: CMS.fileUrl(r, r.sw, "1600x0"),
      amm: CMS.fileUrl(r, r.amm, "1600x0"),
      xsw: CMS.fileUrl(r, r.xsw, "1600x0"),
    }));
  },

  /* canvas_items: pictures for the infinite canvas that are not a work's cover
     → { who, src, full, w, h, slug } (slug = the work a click should open, may be empty).
     an empty collection is a valid answer ([]): the demo pool is then dropped */
  async loadCanvas() {
    if (STATIC.on()) return STATIC.canvas();
    if (!PB_URL) return null;
    const items = await CMS.fetchAll("canvas_items", `filter=${encodeURIComponent("published=true")}&sort=sort`);
    if (!items) return null;
    return Promise.all(items.map(async (r) => {
      const m = await CMS.measure(CMS.fileUrl(r, r.image, "1600x0"));
      return { who: r.who, src: m.src, w: m.w, h: m.h, full: CMS.fileUrl(r, r.image), slug: (r.work || "").trim() };
    }));
  },

  async loadPage(key) {
    const items = await CMS.fetchAll("pages", `filter=${encodeURIComponent(`key="${key}"`)}`);
    return items && items[0] ? items[0] : null;
  },

  /* media: press / video items, newest first → { rec, date, url, image, frame }
     (url falls back to the older youtube_url field; frame = logo on white in a hairline box) */
  async loadMedia() {
    if (STATIC.on()) return STATIC.media();
    if (!PB_URL) return null;
    const items = await CMS.fetchAll("media_items", "sort=-date,sort");
    if (!items || !items.length) return null;
    return items.map((r) => ({
      rec: r, date: r.date || "", url: r.url || r.youtube_url || "",
      image: r.image ? CMS.fileUrl(r, r.image, "800x0") : "", frame: !!r.frame, sort: r.sort || 0,
    }));
  },

  /* contact / acknowledgments: pages[key] → { rec, images } (body_en/cn read through txt()) */
  async loadTextPage(key) {
    if (STATIC.on()) return STATIC.page(key);
    if (!PB_URL) return null;
    const page = await CMS.loadPage(key);
    if (!page) return null;
    const files = Array.isArray(page.images) ? page.images : page.images ? [page.images] : [];
    return { rec: page, images: files.map((f) => CMS.fileUrl(page, f, "1600x0")) };
  },

  /* journey: events in year order → {year, rec, image, size, slot} */
  async loadJourney() {
    if (STATIC.on()) return STATIC.journey();
    if (!PB_URL) return null;
    const items = await CMS.fetchAll("journey_events", "sort=year,sort");
    if (!items || !items.length) return null;
    return items.map((r) => ({
      year: r.year,
      rec: r,
      image: r.image ? { src: CMS.fileUrl(r, r.image, "1600x0"), full: CMS.fileUrl(r, r.image) } : null,
      size: r.image_size || "",           /* s | l — empty: large */
      slot: r.slot || "above",            /* above = personal column · below = professional column */
    }));
  },

  /* biography: pages[biography] (statement + portrait) and the cv entries */
  async loadBiography() {
    if (STATIC.on()) return STATIC.biography();
    if (!PB_URL) return null;
    const [page, items] = await Promise.all([
      CMS.loadPage("biography"),
      CMS.fetchAll("biography_entries", "sort=section,-date,sort"),
    ]);
    if (!page && !(items && items.length)) return null;
    const portrait = page && page.images && page.images[0];
    return {
      rec: page || {},
      portrait: portrait ? CMS.fileUrl(page, portrait, "1600x0") : "",
      portraitFull: portrait ? CMS.fileUrl(page, portrait) : "",
      entries: (items || []).map((r) => ({ rec: r, section: r.section, date: r.date })),
    };
  },
};

/* bilingual text accessor: CMS record → <key>_<lang> (falls back to en);
   demo work → plain key */
function txt(w, key) {
  if (w && w.rec) return w.rec[`${key}_${LANG}`] || w.rec[`${key}_en`] || "";
  return (w && w[key]) || "";
}
