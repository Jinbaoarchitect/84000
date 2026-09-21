/* ————————————————————————————————————————————
   site config — static review build
   PB_URL      PocketBase address; "" = no cms.
   CONTENT_URL folder with the exported content (manifest.json, timeline.json,
               biography.json, canvas.json + works/ home/ video/) — read when
               PB_URL is empty. Missing files fall back to the built-in demo data.
   ———————————————————————————————————————————— */
const PB_URL = "";
const CONTENT_URL = "content/";
