# anothermountainman × stanley wong — :NOW · review build

Static build of the website for review: the site plus its content, no server, no CMS.
Open it from any static host (GitHub Pages, Cloudflare Pages, a local http server).
Portrait / square viewports (phones) switch to the mobile layout automatically.

```
index.html        the page
css/  js/         the site (identical to the main project; only js/config.js differs)
assets/           fonts, opening stills, journey / biography / canvas demo pictures
content/          exported content: manifest.json (works + home sets), timeline.json,
                  biography.json, canvas.json, works/<slug>/*.jpg, home/, video/ (poster frames)
```

## run locally

Double-clicking `index.html` shows the built-in demo data only (browsers block `fetch` under `file://`).
Serve the folder instead:

```
cd amm-x-sw-web
python3 -m http.server 8000        # then open http://localhost:8000/
```

## publish on GitHub Pages

```
git init -b main
git add -A && git commit -m "review build"
git remote add origin git@github.com:<you>/amm-x-sw-web.git
git push -u origin main
```

GitHub → repository **Settings → Pages → Build and deployment**: Source *Deploy from a branch*,
branch `main`, folder `/ (root)`. The site appears at `https://<you>.github.io/amm-x-sw-web/` after a minute.
Every later `git push` redeploys.

## update the content

Content is edited in the main project's CMS (PocketBase, `cms/admin.html`) — this folder is a snapshot.
To refresh: re-run the export in the main project (copies `cms/import/*` into `content/`) and push again.

## notes

- Pictures in this folder are compressed for the web (long edge 1920 for covers, 1600 for other work pictures, 1000 for canvas tiles; progressive jpeg ≈ q72–78). The full-size originals stay in the main project (`cms/import/`, `assets/`); `export-review.sh` re-copies and re-compresses them on every sync (`tools/compress-review.py`).

- `js/config.js`: `PB_URL = ""` (no CMS) and `CONTENT_URL = "content/"`; with a PocketBase address in `PB_URL` the same files read from the CMS instead.
- The two hong kong palace museum films (`content/video/x001-*.mp4`) are kept out of git (`.gitignore`) — they play only when this folder is served locally; the published site shows their poster frames.
- Videos play from Vimeo (`video_url` in `content/manifest.json`); only the poster frames live in `content/video/`.
- `.nojekyll` keeps GitHub Pages from processing the folder.
# 84000
