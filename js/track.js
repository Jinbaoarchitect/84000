/* ————————————————————————————————————————————
   visit timing — how long each visit lasts, and where the time goes
   one record per visit in the PocketBase collection `visits` (write-only for the public:
   anyone can create one, only the page that holds the visit's random `sid` can update it,
   nobody but the admin can read). no cookies, no IP, no personal data: a random id per
   page load, the seconds the page was VISIBLE (hidden tabs / locked phones do not count),
   and how those seconds split over home / zones / works / pages.
   sending: created after 5 visible seconds (bounces and bots stay out), then updated every
   20 s and whenever the page is hidden or left (visibilitychange / pagehide, fetch keepalive —
   mobile safari rarely fires unload, so the heartbeat is the safety net: at most ~20 s lost).
   off when there is no PocketBase (static review build) or the browser asks not to be tracked.
   the on-screen clock is separate: it is decoration and resets on click; this counts on.
   ———————————————————————————————————————————— */
(function () {
  const dnt = navigator.globalPrivacyControl === true || navigator.doNotTrack === "1" || window.doNotTrack === "1";
  if (!PB_URL || (typeof STATIC !== "undefined" && STATIC.on()) || dnt) return;

  const MIN_SEC = 5, BEAT_SEC = 20;
  const rnd = (n) => { const a = "abcdefghijklmnopqrstuvwxyz0123456789"; let s = ""; const b = crypto.getRandomValues(new Uint8Array(n)); b.forEach((x) => (s += a[x % 36])); return s; };
  const V = {
    id: rnd(15), sid: rnd(24), started: new Date().toISOString(),
    duration: 0, views: {}, device: isMobile() ? "mobile" : "desktop",
    lang: "en", referrer: (() => { try { return document.referrer ? new URL(document.referrer).host : ""; } catch (e) { return ""; } })(),
    screen: `${screen.width}x${screen.height}`,
  };
  let created = null, dirty = false, lastSent = 0;

  /* where the visitor is right now — one key per place, seconds accumulate per key */
  const where = () => {
    if (!$("#intro").classList.contains("hidden")) return "intro";
    if (detailVisible() && currentWork) return "work:" + ((currentWork.rec && currentWork.rec.slug) || currentWork.id || currentWork.title || "?");
    if (pageVisible() && currentPage) return "page:" + currentPage;
    if (sectionVisible()) return "zone:" + currentWho + (canvasOn ? ":canvas" : "");
    return "home";
  };

  const url = `${PB_URL}/api/collections/visits/records`;
  const body = () => JSON.stringify({ sid: V.sid, duration: V.duration, views: V.views, lang: LANG, device: V.device });
  const send = (final) => {
    if (V.duration < MIN_SEC) return;
    if (!created) {
      created = fetch(url, {
        method: "POST", keepalive: !!final, headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.assign({}, V, { lang: LANG })),
      }).then((r) => r.ok).catch(() => false);
      lastSent = V.duration; dirty = false;
      return;
    }
    if (!dirty) return;
    dirty = false; lastSent = V.duration;
    created.then((ok) => {
      if (!ok) return;
      fetch(`${url}/${V.id}`, { method: "PATCH", keepalive: !!final, headers: { "Content-Type": "application/json" }, body: body() }).catch(() => {});
    });
  };

  /* one tick a second while the page is visible */
  setInterval(() => {
    if (document.visibilityState !== "visible") return;
    V.duration++; const k = where(); V.views[k] = (V.views[k] || 0) + 1; dirty = true;
    if (V.duration === MIN_SEC || V.duration - lastSent >= BEAT_SEC) send(false);
  }, 1000);

  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") send(true); });
  addEventListener("pagehide", () => send(true));
})();
