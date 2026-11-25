# National Cursillo Movement — Website v3-20261125 (production web root)

**Status: preview for review — not deployed anywhere.** cursillousa.org belongs to the National Cursillo Movement. Going live needs the Movement's approval and their webmaster. Nothing in this package contacts anyone or uploads anything.

## What is in this folder
```
index.html, espanol/, tieng-viet/   Home pages (English, Spanish, Vietnamese)
<section>/index.html               about, bonnin, prayer, centers, events, library, bookstore, give (+ kept sub-pages)
assets/css/site.7432927185.css   Minified, content-hashed stylesheet (self-hosted fonts included)
assets/js/site.42893a4734.js     Minified, content-hashed interactions (no libraries)
assets/js/data.ab75e48e67.js     Affiliated centers + bookstore shelf data
assets/fonts/        Cormorant Garamond + Inter (SIL OFL 1.1, see LICENSE.txt) — no Google Fonts requests
assets/brand/        Vectorized Movement marks used on the site + favicons/app icons
assets/img/          WebP artwork, book covers and video thumbnails
404.html             Not-found page (root-absolute links, noindex)
sw.js                Service worker (network-first pages, cache-first hashed assets, no update pop-ups)
manifest.webmanifest, sitemap.xml (with hreflang), robots.txt, favicon.ico
.htaccess            Apache: caching, gzip/brotli, security headers, 404, 301 redirects
nginx.conf           Example nginx server block with the same rules
_headers, _redirects Netlify / Cloudflare Pages equivalents
```

83 pages + 404. Every page exists in the languages the original site had it in; hreflang links only connect real equivalents.

## Deploying (when approved)

1. Serve this folder as the **web root of the domain** (paths like `/404.html` and `/sw.js` are root-absolute). HTTPS is required for the service worker.
2. Apache: upload everything including `.htaccess`. Needs mod_rewrite, mod_headers, mod_deflate (mod_brotli optional). Uncomment the HTTPS rule.
3. nginx: adapt `nginx.conf` (server_name, root, certificates). Netlify / Cloudflare Pages: `_headers` and `_redirects` are picked up automatically.
4. Do **not** upload `nginx.conf`/`README-DEPLOY.md` if you prefer them private (they contain no secrets).
5. After deploying, submit `sitemap.xml` in Google Search Console / Bing Webmaster Tools.

### What must stay on the existing WordPress server

The redesign is static. These functions are **linked, not rebuilt**, so the current WordPress install (or a copy on a subdomain) must keep serving them:

- **Store checkout** — every catalog item links to its `/product/...` page; cart and account stay in WooCommerce.
- **Donation forms** — `/donate-to-cursillo/`, `/espanol/donar-a-cursillos/`, `/tieng-viet/ung-ho-pt-cursillo/`.
- **Newsletter signup** — `/national-newsletter/`, `/espanol/boletin-nacional/`.
- **Files** — `/wp-content/uploads/` (PDFs, Word files, audio, images), `/pdf/`, `/resources/`, `/viet/`.
- **Other cursillousa.org folders linked from the content** (diocesan/regional sub-sites and old files): `/albany/`, `/encounter/`, `/espanol/encuentro/`, `/espanol/recursos/`, `/greenbay/`, `/hartford/`, `/houston/`, `/laredo/`, `/milwaukee/`, `/newyork/`, `/pen-tall/`, `/portland/`, `/rapidcity/`, `/region12/`, `/region6/`, `/regionxi/`, `/rockford/`, `/sanbernardino/`, `/sandiegofilgroup/`, `/stlouis/`, `/wichita/`, `/yakima/`.

For that reason the redirects for those URLs are generated but **commented out** ("held back") in `.htaccess`, `nginx.conf` and `_redirects`. If the static site and WordPress share one Apache docroot, keep WordPress's own rewrite block **after** the rules here; real files and folders of the static site win, and WordPress keeps answering everything else. Enable the held-back redirects only once the store, forms and files have moved (and change their links in `_source/build_v3.py` → `EXT`).

## Rebuilding
```bash
pip install markdown beautifulsoup4          # Python 3.10+
python3 _source/build_v3.py                  # regenerate the 83 source pages from the crawl + strings
python3 _source/build_web.py --out /path/to/web-root   # minify, hash, sitemap, headers, redirects, this README (needs node/npx for esbuild)
python3 _source/preview_server.py /path/to/web-root 8813  # local preview that applies _headers/_redirects/404 (127.0.0.1 only)
```
`_source/` lives in the project folder (`cursillo-site-v3/`), not in this web root. Text for every language is in `_source/strings_v3.py` (new UI) and the v2 string files; page content comes from the cursillousa.org crawl of 2026-11-25. The Content-Security-Policy contains SHA-256 hashes of the small inline scripts; `build_web.py` recalculates them on every build.

## Readability and accessibility

- Text-size control (A− / 100% / A+) in the header on wide screens, an **Aa** pop-over on narrow screens and a copy in the menu drawer. Five steps: 90, 100, 115, 130, 150%. Saved on the device (`localStorage` key `ncm-ts`) and applied by a tiny inline script before the first paint, so there is no jump. Works in all three languages; changes are announced to screen readers.
- Layout uses container queries in rem, so menus and grids re-flow as text grows. Checked with no horizontal overflow at 150% on all pages at 360 px and on the hub pages at 390/768/1024/1440 px.
- Body text 18 px / line-height 1.6 at 100%; nothing below 14 px; colours meet WCAG AA. Decorative watermark words (ULTREYA, DE COLORES, ECCLESIA, PALANCA, AMEN) are `aria-hidden`, very faint and do not scale.
- Moving ticker has a pause button, pauses on hover/focus and is static with reduced motion. Scroll-reveal starts early and never hides content without JavaScript.

## Privacy
No cookies, analytics or trackers. Fonts are self-hosted. Videos are click-to-load facades; YouTube plays from youtube-nocookie.com and Vimeo with `dnt=1`. Palanca candles, text size and language choice are stored only on the visitor's device.

## Security headers
`Content-Security-Policy`, `Strict-Transport-Security` (1 year, no preload), `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`, `Cross-Origin-Opener-Policy`. CSP allows only this origin, images/media from cursillousa.org, and video frames from youtube-nocookie.com and player.vimeo.com.

## Logos

Faithful vectorizations of the Movement's own marks (same likeness; no elements added or changed). Masters, PNG @1x/@2x/@4x, light/dark versions and the untouched originals are in the separate brand kit (`Cursillo-Logos-v3.zip`, folder `cursillo-logos/`).

| Mark | Source file on cursillousa.org | What it is | Vector files |
|---|---|---|---|
| National Cursillo Movement emblem + wordmark | `/wp-content/uploads/2026/07/logo4.webp` (site header logo) and `/wp-content/uploads/fbrfg/` favicons | The Movement's header logo: gold cross-and-ring emblem with "National Cursillo Movement" wordmark | `ncm-emblem-{gold,black,white}.svg`, `ncm-lockup-{color,reverse,black,white}.svg`, favicon set |
| OMCC / MCC | `/wp-content/uploads/2026/07/mcc.webp` (footer, links to omcc-cursillos.org) | Mark of the Organismo Mundial de Cursillos de Cristiandad (World Body of Cursillos in Christianity) | `omcc-mcc-{color,black,white}.svg` |
| Fundación Eduardo Bonnín Aguiló | `/wp-content/uploads/2026/07/fundacaion.webp` (footer, links to feba.info) | Mark of the foundation for the founder's legacy | `fundacion-bonnin-{color,color-on-dark,black,white}.svg` |

"Cursillo® and the Cursillo logo are registered trademarks of the National Cursillo Movement" (from the original footer) — kept in the footer. New original identity **proposals** are in the brand kit under `proposals/` and are **not used on the site**; they need the Movement's approval.

## Videos (all kept, click-to-load)

| Provider | ID | Title | Status | Shown on |
|---|---|---|---|---|
| Youtube | `KvCyOqNUJSg` | The Church Universal - Cursillo: Its Origins, Mentality and Purpose | plays | /about/, /espanol/about/, /espanol/library/, /espanol/library/ewtn/, /library/, /library/ewtn/, /tieng-viet/about/, /tieng-viet/library/, /tieng-viet/library/ewtn/ |
| Youtube | `PPOhxwuHaVs` | The Church Universal - Cursillo - Part II | plays | /about/, /espanol/about/, /espanol/library/, /espanol/library/ewtn/, /library/, /library/ewtn/, /tieng-viet/about/, /tieng-viet/library/, /tieng-viet/library/ewtn/ |
| Vimeo | `134657584` | Cursillo – Origins, Mentality, and Purpose (EWTN, The Church Universal, 2015) | could not be confirmed public on 2026-11-25 — check | /about/, /espanol/about/, /espanol/library/, /espanol/library/ewtn/, /library/, /library/ewtn/, /tieng-viet/about/, /tieng-viet/library/, /tieng-viet/library/ewtn/ |
| Vimeo | `167983246` | Cursillo video linked on “¿Qué es el Cursillo?” / “Cursillo là gì?” (title not given on the page) | could not be confirmed public on 2026-11-25 — check | /about/, /espanol/about/, /espanol/library/, /library/, /tieng-viet/about/, /tieng-viet/library/ |
| Youtube | `sfBv6gSJDEM` | Meeting with the Cursillo Movement - 2015.04.30 | plays | /espanol/library/, /espanol/library/pope-iii-european-ultreya/, /library/, /library/pope-iii-european-ultreya/, /tieng-viet/library/, /tieng-viet/library/pope-iii-european-ultreya/ |
| Vimeo | `182600976` | Friendship with Christ; Key to Evangelization — Dr. Ralph Martin (25th National Encounter, 2015) | could not be confirmed public on 2026-11-25 — check | /espanol/library/, /espanol/library/2015/, /library/, /library/2015/, /tieng-viet/library/, /tieng-viet/library/2015/ |
| Vimeo | `189054402` | Attitudes and Reactions — Maribel Gómez (25th National Encounter, 2015) | plays | /espanol/library/, /espanol/library/2015/, /library/, /library/2015/, /tieng-viet/library/, /tieng-viet/library/2015/ |
| Youtube | `oLmzAk-GstY` | Bishop Elizondo's Friday Mass Homily - July 28, 2017 | plays | /espanol/library/, /espanol/library/2017/, /library/, /library/2017/, /tieng-viet/library/, /tieng-viet/library/2017/ |
| Youtube | `C6MzXjc3iYM` | Evangelization in the Environments - 27th National Cursillo Encounter | plays | /espanol/library/, /espanol/library/2017/, /library/, /library/2017/, /tieng-viet/library/, /tieng-viet/library/2017/ |
| Youtube | `D5ntvAQa5VM` | Why We Have Cursillo | plays | /espanol/library/, /espanol/library/2017/, /library/, /library/2017/, /tieng-viet/library/, /tieng-viet/library/2017/ |
| Youtube | `MlDgCVIAST8` | Historia Del Primer Cursillo en Estados Unidos | plays | /espanol/library/, /espanol/library/2017/, /library/, /library/2017/, /tieng-viet/library/, /tieng-viet/library/2017/ |
| Youtube | `-gXZngrP6P8` | Historia Del Primer Cursillo en Estados Unidos | plays | /espanol/library/, /espanol/library/2017/, /library/, /library/2017/, /tieng-viet/library/, /tieng-viet/library/2017/ |
| Youtube | `VInTCMUcvSA` | Bishop Eusebio Elizondo's Homily - August 16, 2018 | plays | /espanol/library/, /espanol/library/2018/, /library/, /library/2018/, /tieng-viet/library/, /tieng-viet/library/2018/ |
| Youtube | `ggChSNWtkOg` | Bishop Daniel H.  Mueggenborg's Homily - August 17, 2018 | plays | /espanol/library/, /espanol/library/2018/, /library/, /library/2018/, /tieng-viet/library/, /tieng-viet/library/2018/ |
| Youtube | `8Z0hnHFjSSc` | Bishop Carlos A. Sevilla, S.J. - Homily - August 18, 2018 | plays | /espanol/library/, /espanol/library/2018/, /library/, /library/2018/, /tieng-viet/library/, /tieng-viet/library/2018/ |
| Youtube | `wGpeY8WbnDM` | Eucharist - The Central Theme of Cursillo -   Bishop Nevares - 29th National Encounter | plays | /espanol/library/, /espanol/library/2019/, /library/, /library/2019/, /tieng-viet/library/ |
| Vimeo | `74939314` | Cursillos in Christianity Foundational Charism — Juan Ruiz (23rd National Encounter, 2013) | could not be confirmed public on 2026-11-25 — check | /espanol/library/, /library/, /library/2013/, /tieng-viet/library/ |
| Youtube | `0tQSprOCVDU` | 29th National Cursillo Encounter - Mass Homily July 18. 2019 - Most Rev. Joseph Bambera | plays | /espanol/library/, /library/, /library/2019/, /tieng-viet/library/ |
| Youtube | `c9UR_za92fI` | 29th National Cursillo Encounter - Holy Mass July 19. 2019 - Most Rev. Eusebio Elizondo | plays | /espanol/library/, /library/, /library/2019/, /tieng-viet/library/ |
| Youtube | `_l_VpIJQCvQ` | 29th National Cursillo Encounter - Mass Homily July 20. 2019 - Most Rev. Eduardo Nevares | plays | /espanol/library/, /library/, /library/2019/, /tieng-viet/library/ |
| Youtube | `e46aPsdobtE` | The Life of Eduardo Bonnin - 29th National Cursillo Encounter  - July 19, 2019 | plays | /espanol/library/, /library/, /library/2019/, /tieng-viet/library/ |
| Youtube | `nnn28OXEBs0` | 29th National Cursillo Encounter - PreCursillo by Miguel Sureda | plays | /espanol/library/, /library/, /library/2019/, /tieng-viet/library/ |
| Youtube | `hDfWl3fgtIU` | 29th National Cursillo Encounter - PostCursillo by Miguel Sureda | plays | /espanol/library/, /library/, /library/2019/, /tieng-viet/library/ |
| Youtube | `sWr8-4ia2ic` | 29th National Cursillo Encounter - PreCursillo by Ramon Rosello | plays | /espanol/library/, /library/, /library/2019/, /tieng-viet/library/ |
| Youtube | `MWAaOs1PtoA` | 29th National Cursillo Encounter- PostCursillo by Ramon Rosello | plays | /espanol/library/, /library/, /library/2019/, /tieng-viet/library/ |

Removed: one unrelated placeholder YouTube video (`dQw4w9WgXcQ`) that appears on the original Spanish National Encounter 2026 page.

## Old URL → new location

Every one of the 173 non-product URLs in the original sitemaps, the 110 product pages, the 24 media categories and the WordPress attachment pages has a destination. Active 301s: 256. Held back (store, forms, newsletter, products): 117. Hub = content embedded in a redesigned section page; page = kept as its own page; merge = duplicate folded into the target; omit = expired form or empty post, redirected to the closest useful page.

| Old URL | New location | How | Note |
|---|---|---|---|
| `/` | `/` | hub | Home |
| `/espanol/` | `/espanol/` | merge | Spanish landing (403 to crawler); Spanish home |
| `/espanol/inicio/` | `/espanol/` | hub | Spanish home |
| `/tieng-viet/` | `/tieng-viet/` | merge | Vietnamese landing duplicates Trang Nhà |
| `/tieng-viet/trang-nha/` | `/tieng-viet/` | hub | Vietnamese home |
| `/what-is-cursillo/` | `/about/` | hub | What is Cursillo |
| `/espanol/que-es-el-cursillo/` | `/espanol/about/` | hub | Qué es el Cursillo |
| `/tieng-viet/cursillo-la-gi/` | `/tieng-viet/about/` | hub | Cursillo là gì |
| `/what-is-cursillo/cursillo-de-cursillos-opportunities-benefits/` | `/about/cursillo-de-cursillos/` | page | Cursillo de Cursillos |
| `/espanol/que-es-el-cursillo/cursillo-de-cursillos-oportunidades-y-ventajas/` | `/espanol/about/cursillo-de-cursillos/` | page | Cursillo de Cursillos (ES) |
| `/eduardo-bonnin-aguilo/` | `/bonnin/` | hub | Biography |
| `/eduardo-bonnin-aguilo/eduardo-bonnins-address-at-the-iii-world-ultreya-rome/` | `/bonnin/address-iii-world-ultreya-rome/` | page |  |
| `/eduardo-bonnin-aguilo/encounter-with-oneself/` | `/bonnin/encounter-with-oneself/` | page |  |
| `/eduardo-bonnin-aguilo/essential-important-accidental-elements/` | `/bonnin/essential-important-accidental-elements/` | page |  |
| `/eduardo-bonnin-aguilo/evangelization-through-conversion/` | `/bonnin/evangelization-through-conversion/` | page |  |
| `/eduardo-bonnin-aguilo/foundational-charism-of-the-cursillo-movement/` | `/bonnin/foundational-charism/` | page |  |
| `/eduardo-bonnin-aguilo/signs-of-hope/` | `/bonnin/signs-of-hope/` | page |  |
| `/eduardo-bonnin-aguilo/what-is-fundamental-for-being-christian/` | `/bonnin/what-is-fundamental/` | page |  |
| `/espanol/biografia-de-eduardo-bonnin-aguilo/` | `/espanol/bonnin/` | hub | Biografía |
| `/espanol/biografia-de-eduardo-bonnin-aguilo/discurso-de-eduardo-bonnin-en-la-iii-ultreya-mundial-en-roma/` | `/espanol/bonnin/discurso-iii-ultreya-mundial-roma/` | page |  |
| `/espanol/biografia-de-eduardo-bonnin-aguilo/el-carisma-fundacional-del-movimiento-de-cursillos/` | `/espanol/bonnin/carisma-fundacional/` | page |  |
| `/espanol/biografia-de-eduardo-bonnin-aguilo/signos-de-esperanza/` | `/espanol/bonnin/signos-de-esperanza/` | page |  |
| `/happy-birthday-eduardo-bonnin/` | `/bonnin/` | omit | Empty slider post (no body text); founder content lives on the Founder page |
| `/palanca-requests/` | `/prayer/` | hub | Palanca requests |
| `/espanol/palanca-perpetua/` | `/espanol/prayer/` | hub |  |
| `/tieng-viet/xin-goi-palancas/` | `/tieng-viet/prayer/` | hub |  |
| `/palanca-test/` | `/prayer/` | omit | Test copy of Palanca Requests (duplicate) |
| `/affiliated-cursillo-centers/` | `/centers/` | merge | All 247 centers are in the searchable directory |
| `/links-contacts/` | `/centers/` | hub | Diocesan websites & contacts |
| `/espanol/links-y-contactos/` | `/espanol/centers/` | hub |  |
| `/tieng-viet/noi-ket-lien-lac/` | `/tieng-viet/centers/` | hub |  |
| `/national-directory-update-form/` | `/centers/` | omit | Embedded form with no text; contact the National Center instead |
| `/actualizacion-del-directorio-nacional/` | `/espanol/centers/` | omit | Embedded form with no text |
| `/upcoming-events/` | `/events/` | merge | "Coming soon" + duplicate diocesan links list (kept once on Centers) |
| `/espanol/calendario-cursillo/` | `/espanol/events/` | omit | Placeholder text only ("google calendar app here") |
| `/tieng-viet/cursillo-lich/` | `/tieng-viet/events/` | omit | Placeholder text only |
| `/national-encounter-2026/` | `/events/national-encounter-2026/` | page | 36th National Encounter (EN) |
| `/national-encounter-2026-sp/` | `/espanol/events/national-encounter-2026/` | page | 36th National Encounter (ES) |
| `/national-encounter-2026-vi-2/` | `/tieng-viet/events/national-encounter-2026/` | page | 36th National Encounter (VI) |
| `/encounter2024-2/` | `/events/#archive` | hub | Encounter archive |
| `/encounter2022/` | `/events/#archive` | hub | Encounter archive |
| `/encounter2019/` | `/events/#archive` | hub | Encounter archive |
| `/espanol/encuentros/` | `/espanol/events/#archive` | hub | Encounter archive |
| `/espanol/encuentro-nacional-de-cursillo-2019/` | `/espanol/events/#archive` | hub |  |
| `/espanol/encuentro-nacional-de-cursillo-2018/` | `/espanol/events/#archive` | hub |  |
| `/espanol/encuentros-2017/` | `/espanol/events/#archive` | hub |  |
| `/tieng-viet/dai-hoi-cursillo-toan-quoc-2019/` | `/tieng-viet/events/#archive` | hub |  |
| `/tieng-viet/dai-hoi-cursillo-toan-quoc-2018/` | `/tieng-viet/events/#archive` | hub |  |
| `/tieng-viet/don-ghi-danh-dai-hoi-cursillo-toan-quoc-2017/` | `/tieng-viet/events/#archive` | hub |  |
| `/tieng-viet/mau-dang-ky-encounter/` | `/tieng-viet/events/#archive` | hub | 2016 Encounter (registration closed) |
| `/2017-seattle-national-secretariat-meeting/` | `/events/#archive` | hub |  |
| `/national-newsletter/` | `/events/#newsletters` | hub *(held)* | Newsletter archive |
| `/espanol/boletin-nacional/` | `/espanol/events/#newsletters` | hub *(held)* |  |
| `/tieng-viet/ban-tin-trung-uong/` | `/tieng-viet/events/#newsletters` | hub |  |
| `/resource-center/` | `/library/` | hub |  |
| `/espanol/centro-de-recursos/` | `/espanol/library/` | hub |  |
| `/tieng-viet/trung-tam-hoc-lieu/` | `/tieng-viet/library/` | hub |  |
| `/workshops/` | `/library/workshops/` | page |  |
| `/forms-reports/` | `/library/forms-reports/` | page |  |
| `/espanol/formularios-e-informes/` | `/espanol/library/forms-reports/` | page |  |
| `/tieng-viet/mau-don-va-tuong-trinh/` | `/tieng-viet/library/forms-reports/` | page |  |
| `/bylaws/` | `/library/forms-reports/` | merge | Empty page; the Bylaws PDF is listed in Forms & Reports |
| `/diocesan-report/` | `/library/forms-reports/` | merge | Embedded form; listed in Forms & Reports |
| `/regional-coordinators-annual-report-form/` | `/library/forms-reports/` | merge | Embedded form |
| `/reporte-annual-del-coordinador-regional/` | `/espanol/library/forms-reports/` | merge | Embedded form |
| `/ban-phuc-trinh-cua-dhv-mien/` | `/tieng-viet/library/forms-reports/` | merge | Embedded form |
| `/resource-center/2012-national-cursillo-encounter-workshop-sessions/` | `/library/2012/` | page |  |
| `/resource-center/2012-north-american-and-caribbean-group-encounter/` | `/library/2012-north-america-caribbean/` | page |  |
| `/resource-center/2013-national-cursillo-encounter-workshop-sessions/` | `/library/2013/` | page |  |
| `/resource-center/2014-national-cursillo-encounter-workshop-sessions/` | `/library/2014/` | page |  |
| `/resource-center/2014-region-xi-encounter/` | `/library/2014-region-xi/` | page |  |
| `/resource-center/2015-national-cursillo-encounter-workshop-sessions/` | `/library/2015/` | page |  |
| `/resource-center/2016-national-cursillo-encounter/` | `/library/2016/` | page |  |
| `/resource-center/2017-national-cursillo-encounter-workshop-sessions/` | `/library/2017/` | page |  |
| `/resource-center/2018-national-cursillo-encounter-sessions/` | `/library/2018/` | page |  |
| `/resource-center/2019-national-cursillo-encounter-sessions/` | `/library/2019/` | page |  |
| `/resource-center/2020-national-cursillo-encounter-sessions-2/` | `/library/2020/` | page |  |
| `/resource-center/cursillo-on-ewtn/` | `/library/ewtn/` | page |  |
| `/resource-center/pope-speaks-attendees-iii-european-ultreya-rome/` | `/library/pope-iii-european-ultreya/` | page |  |
| `/resource-center/spiritual-advisor-workshop/` | `/library/spiritual-advisor-workshop/` | page |  |
| `/espanol/centro-de-recursos/2012-encuentro-internacional-del-grupo-norte-america-y-caribe/` | `/espanol/library/2012-north-america-caribbean/` | page |  |
| `/espanol/centro-de-recursos/cursillo-en-ewtn/` | `/espanol/library/ewtn/` | page |  |
| `/espanol/centro-de-recursos/eduardo-bonnin-aguilo-1917-2008-del-fundador/` | `/espanol/library/bonnin-del-fundador/` | page |  |
| `/espanol/centro-de-recursos/el-papa-habla-a-los-asistentes-a-la-iii-ultreya-europea-en-roma/` | `/espanol/library/pope-iii-european-ultreya/` | page |  |
| `/espanol/centro-de-recursos/region-xi-encuentro-de-cursillo-2014/` | `/espanol/library/2014-region-xi/` | page |  |
| `/espanol/centro-de-recursos/sesiones-de-talleres-del-2012-encuentro-nacional-de-cursillo/` | `/espanol/library/2012/` | page |  |
| `/espanol/centro-de-recursos/sesiones-de-talleres-del-2013-encuentro-nacional-de-cursillo/` | `/espanol/library/2013/` | page |  |
| `/espanol/centro-de-recursos/sesiones-de-talleres-del-2014-encuentro-nacional-de-cursillo/` | `/espanol/library/2014/` | page |  |
| `/espanol/centro-de-recursos/sesiones-de-talleres-del-2015-encuentro-nacional-de-cursillo/` | `/espanol/library/2015/` | page |  |
| `/espanol/centro-de-recursos/sesiones-de-talleres-del-2016-encuentro-nacional-de-cursillo/` | `/espanol/library/2016/` | page |  |
| `/espanol/centro-de-recursos/sesiones-de-talleres-del-2017-encuentro-nacional-de-cursillo/` | `/espanol/library/2017/` | page |  |
| `/espanol/centro-de-recursos/sesiones-de-talleres-del-2018-encuentro-nacional-de-cursillo/` | `/espanol/library/2018/` | page |  |
| `/espanol/centro-de-recursos/sesiones-de-talleres-del-2019-encuentro-nacional-de-cursillo/` | `/espanol/library/2019/` | page |  |
| `/tieng-viet/trung-tam-hoc-lieu/2012-cac-de-tai-họi-thảo-trong-dại-họi-cursillo-toan-quoc/` | `/tieng-viet/library/2012/` | page |  |
| `/tieng-viet/trung-tam-hoc-lieu/2013-cac-de-tai-họi-thảo-trong-dại-họi-cursillo-toan-quoc/` | `/tieng-viet/library/2013/` | page |  |
| `/tieng-viet/trung-tam-hoc-lieu/2014-cac-de-tai-họi-thảo-trong-dại-họi-cursillo-toan-quoc/` | `/tieng-viet/library/2014/` | page |  |
| `/tieng-viet/trung-tam-hoc-lieu/2015-cac-de-tai-họi-thảo-trong-dại-họi-cursillo-toan-quoc/` | `/tieng-viet/library/2015/` | page |  |
| `/tieng-viet/trung-tam-hoc-lieu/2016-cac-de-tai-họi-thảo-trong-dại-họi-cursillo-toan-quoc/` | `/tieng-viet/library/2016/` | page |  |
| `/tieng-viet/trung-tam-hoc-lieu/2017-cac-de-tai-họi-thảo-trong-dại-họi-cursillo-toan-quoc/` | `/tieng-viet/library/2017/` | page |  |
| `/tieng-viet/trung-tam-hoc-lieu/2018-cac-de-tai-hoi-thao-trong-dai-hoi-cursillo-toan-quoc/` | `/tieng-viet/library/2018/` | page |  |
| `/tieng-viet/trung-tam-hoc-lieu/dgh-noi-chuyẹn-trong-buoi-ultreya-iii-của-pt-cursillo-au-chau-tại-roma/` | `/tieng-viet/library/pope-iii-european-ultreya/` | page |  |
| `/tieng-viet/trung-tam-hoc-lieu/lap-vien-eduardo-bonnin-aguilo-1917-2009/` | `/tieng-viet/library/bonnin-sang-lap-vien/` | page |  |
| `/tieng-viet/trung-tam-hoc-lieu/pt-cursillo-tren-dai-ewtn/` | `/tieng-viet/library/ewtn/` | page |  |
| `/donate-to-cursillo/` | `/give/` | hub *(held)* |  |
| `/donation-frequently-asked-questions/` | `/give/#faq` | hub | Donation FAQ |
| `/espanol/donar-a-cursillos/` | `/espanol/give/` | hub *(held)* |  |
| `/tieng-viet/ung-ho-pt-cursillo/` | `/tieng-viet/give/` | hub *(held)* |  |
| `/cursillo-literature/` | `/bookstore/` | merge | Catalog rebuilt from the 111 product pages |
| `/cursillo-literature-spanish/` | `/espanol/bookstore/` | merge | Catalog rebuilt from product pages |
| `/cursillo-literature-vietnamese/` | `/tieng-viet/bookstore/` | merge | Catalog rebuilt from product pages |
| `/espanol/literatura-cursillo/` | `/espanol/bookstore/` | hub | Ordering notes kept; product list rebuilt |
| `/tieng-viet/tai-lieu-cursillo/` | `/tieng-viet/bookstore/` | hub | Ordering notes kept; product list rebuilt |
| `/shop/` | `/bookstore/` | merge | Store landing duplicate |
| `/cart/` | `/bookstore/` | omit *(held)* | WooCommerce cart (checkout stays on the live store) |
| `/my-account/` | `/bookstore/` | omit *(held)* | WooCommerce account page (stays on the live store) |
| `/product-category/vietnamese/testing/` | `/tieng-viet/bookstore/` | omit | Internal "testing" category |
| `/online-registration/` | `/events/` | omit | Closed registration |
| `/encounter-registration-form-2019/` | `/events/` | omit | Expired registration form |
| `/encounter-registration-form-2022/` | `/events/` | omit | Expired registration form |
| `/encounter2017/arrival-departure-info/` | `/events/` | omit | Expired travel form |
| `/encounter2017/arrival-departure-info-scranton-2018/` | `/events/` | omit | Expired travel form |
| `/encounter2018/arrival-departure-info/` | `/events/` | omit | Expired travel form |
| `/encounter2019/arrival-departure-info/` | `/events/` | omit | Expired travel form |
| `/encounter2022/arrival-departure-info-chapman-2022/` | `/events/` | omit | Expired travel form |
| `/espanol/encuentros/formulario-de-registro-de-encuentro/` | `/espanol/events/` | omit | Expired registration form |
| `/espanol/encuentros/formulario-de-registro-de-encuentro-2019/` | `/espanol/events/` | omit | Expired registration form |
| `/espanol/encuentros/informacion-de-llegadapartida/` | `/espanol/events/` | omit | Expired travel form |
| `/tieng-viet/mau-dang-ky-encounter/arrival-departure-info/` | `/tieng-viet/events/` | omit | Expired travel form |
| `/tieng-viet/mau-dang-ky-encounter/mau-encounter/` | `/tieng-viet/events/` | omit | Expired registration form |
| `/26th/` | `/events/` | omit | Expired 2016 evaluation form |
| `/forma-de-evaluacion/` | `/espanol/events/` | omit | Expired 2016 evaluation form |
| `/luong-gia/` | `/tieng-viet/events/` | omit | Expired 2016 evaluation form |
| `/search-this-site/` | `/` | omit | Site search widget (new site is small and fully linked; sitemap.xml provided) |
| `/sitemap/` | `/` | omit | HTML sitemap replaced by the new navigation + sitemap.xml |
| `/author/admin/` | `/` | omit | WordPress author archive |
| `/category/encounter/` | `/events/` | omit | Archive of empty slider posts |
| `/category/homepage-banner/` | `/` | omit | Archive of empty slider posts |
| `/category/uncategorized/` | `/` | omit | Archive of empty slider posts |
| `/26th-national-encounter-fiesta/` | `/events/` | omit | Homepage slider post with a headline only (no body text) |
| `/26th-national-encounter-space-limited-register-online-now/` | `/events/` | omit | Homepage slider post with a headline only (no body text) |
| `/26th-ne-keynote-kerygma-and-cursillo/` | `/events/` | omit | Homepage slider post with a headline only (no body text) |
| `/27th-national-encounter-july-27-30-2017-register-now/` | `/events/` | omit | Homepage slider post with a headline only (no body text) |
| `/60th-cursillo-anniversary-usa-july-27-30-2017/` | `/events/` | omit | Homepage slider post with a headline only (no body text) |
| `/celebrate-60th-cursillo-anniversary-1st-cursillo-bell/` | `/events/` | omit | Homepage slider post with a headline only (no body text) |
| `/de/` | `/` | omit | Homepage slider post with a headline only (no body text) |
| `/evangelization-through-friendship/` | `/` | omit | Homepage slider post with a headline only (no body text) |
| `/friendship/` | `/` | omit | Homepage slider post with a headline only (no body text) |
| `/intimate/` | `/` | omit | Homepage slider post with a headline only (no body text) |
| `/kerygma/` | `/events/` | omit | Homepage slider post with a headline only (no body text) |
| `/kerygmatic-26th-national-encounter/` | `/events/` | omit | Homepage slider post with a headline only (no body text) |
| `/lets-celebrate-and-rejoice-in-christ-2/` | `/` | omit | Homepage slider post with a headline only (no body text) |
| `/lets-celebrate-and-rejoice-in-christ/` | `/` | omit | Homepage slider post with a headline only (no body text) |
| `/multi-cultural-fiesta/` | `/events/` | omit | Homepage slider post with a headline only (no body text) |
| `/national-encounter-fiesta-2/` | `/events/` | omit | Homepage slider post with a headline only (no body text) |
| `/national-encounter-fiesta/` | `/events/` | omit | Homepage slider post with a headline only (no body text) |
| `/no-one-left-behind-experiencing-gods-love/` | `/` | omit | Homepage slider post with a headline only (no body text) |
| `/second-slide-test/` | `/` | omit | Homepage slider post with a headline only (no body text) |
| `/slide-title/` | `/` | omit | Homepage slider post with a headline only (no body text) |
| `/title-goes-here/` | `/` | omit | Homepage slider post with a headline only (no body text) |
| `/triple-encounters-self-christ-an-others-2/` | `/events/` | omit | Homepage slider post with a headline only (no body text) |
| `/were-one-in-christ/` | `/` | omit | Homepage slider post with a headline only (no body text) |
| `/product-category/english/` | `/bookstore/` | merge | Category filter in the rebuilt catalog |
| `/product-category/english/cursillo-booklets/` | `/bookstore/#cat-cursillo-booklets` | merge | Category filter in the rebuilt catalog |
| `/product-category/english/gifts/` | `/bookstore/#cat-gifts` | merge | Category filter in the rebuilt catalog |
| `/product-category/english/recommended-reading/` | `/bookstore/#cat-recommended-reading` | merge | Category filter in the rebuilt catalog |
| `/product-category/english/team-formation/` | `/bookstore/#cat-team-formation` | merge | Category filter in the rebuilt catalog |
| `/product-category/english/weekend-materials/` | `/bookstore/#cat-weekend-materials` | merge | Category filter in the rebuilt catalog |
| `/product-category/spanish/` | `/espanol/bookstore/` | merge | Category filter in the rebuilt catalog |
| `/product-category/spanish/formacion-del-equipo/` | `/espanol/bookstore/#cat-formacion-del-equipo` | merge | Category filter in the rebuilt catalog |
| `/product-category/spanish/lectura-recomendada/` | `/espanol/bookstore/#cat-lectura-recomendada` | merge | Category filter in the rebuilt catalog |
| `/product-category/spanish/material-para-cursillo/` | `/espanol/bookstore/#cat-material-para-cursillo` | merge | Category filter in the rebuilt catalog |
| `/product-category/spanish/panfletos/` | `/espanol/bookstore/#cat-panfletos` | merge | Category filter in the rebuilt catalog |
| `/product-category/vietnamese/` | `/tieng-viet/bookstore/` | merge | Category filter in the rebuilt catalog |

### Product pages (held back while the store runs on WordPress)

| Old URL | Catalog anchor |
|---|---|
| `/product/247-v-conversaciones-de-cala-figuera/` | `/espanol/bookstore/#p-247-v-conversaciones-de-cala-figuera` |
| `/product/5th-conversations-of-cala-figuera/` | `/bookstore/#p-5th-conversations-of-cala-figuera` |
| `/product/7615/` | `/bookstore/#p-7615` |
| `/product/a-quien-enviare-por-rev-frank-salmani/` | `/espanol/bookstore/#p-a-quien-enviare-por-rev-frank-salmani` |
| `/product/bookmark-with-magnifier-and-ruler/` | `/bookstore/#p-bookmark-with-magnifier-and-ruler` |
| `/product/bumper-sticker-de-colores/` | `/bookstore/#p-bumper-sticker-de-colores` |
| `/product/bumper-sticker-to-make-a-friend-be-a-friend-bring-your-friend-to-christ/` | `/bookstore/#p-bumper-sticker-to-make-a-friend-be-a-friend-bring-your-friend-to-christ` |
| `/product/cam-nang-linh-huong/` | `/tieng-viet/bookstore/#p-cam-nang-linh-huong` |
| `/product/cap-cursillos-in-christianity-cursillos-de-cristiandad/` | `/bookstore/#p-cap-cursillos-in-christianity-cursillos-de-cristiandad` |
| `/product/cap-de-colores/` | `/bookstore/#p-cap-de-colores` |
| `/product/carnet-50/` | `/espanol/bookstore/#p-carnet-50` |
| `/product/carnets-package-of-50/` | `/bookstore/#p-carnets-package-of-50` |
| `/product/chi-nam-2016-dung-trong-khoa-hoc/` | `/tieng-viet/bookstore/#p-chi-nam-2016-dung-trong-khoa-hoc` |
| `/product/cm-nang-khoa-cursillo/` | `/tieng-viet/bookstore/#p-cm-nang-khoa-cursillo` |
| `/product/cm-nang-lanh-o/` | `/tieng-viet/bookstore/#p-cm-nang-lanh-o` |
| `/product/cm-nang-ngi-bo-tr/` | `/tieng-viet/bookstore/#p-cm-nang-ngi-bo-tr` |
| `/product/como-programar-una-escuela-de-dirigentes/` | `/espanol/bookstore/#p-como-programar-una-escuela-de-dirigentes` |
| `/product/cristianos-en-rodaje-por-valentin-galindo/` | `/espanol/bookstore/#p-cristianos-en-rodaje-por-valentin-galindo` |
| `/product/crucifijo-moderno-color-plateado-2-christ-iscounting-on-you/` | `/espanol/bookstore/#p-crucifijo-moderno-color-plateado-2-christ-iscounting-on-you` |
| `/product/crucifijo-tradicional-3-cursillo-de-cristiandad/` | `/espanol/bookstore/#p-crucifijo-tradicional-3-cursillo-de-cristiandad` |
| `/product/crucifix-nickel-plated-2/` | `/bookstore/#p-crucifix-nickel-plated-2` |
| `/product/crucifix-traditional-3/` | `/bookstore/#p-crucifix-traditional-3` |
| `/product/cursillo-brochure-package-of-50/` | `/bookstore/#p-cursillo-brochure-package-of-50` |
| `/product/cursillo-history-memory/` | `/bookstore/#p-cursillo-history-memory` |
| `/product/cursillo-lapel-pin-silver/` | `/bookstore/#p-cursillo-lapel-pin-silver` |
| `/product/cursillo-pendant/` | `/bookstore/#p-cursillo-pendant` |
| `/product/cursillo-que-es/` | `/espanol/bookstore/#p-cursillo-que-es` |
| `/product/cursillo-what-is-it-for-candidates-before-weekend/` | `/bookstore/#p-cursillo-what-is-it-for-candidates-before-weekend` |
| `/product/desarrollo/` | `/bookstore/#p-desarrollo` |
| `/product/echad-vuestras-redes-por-rev-juan-capo/` | `/espanol/bookstore/#p-echad-vuestras-redes-por-rev-juan-capo` |
| `/product/eduardo-bonnin--un-aprendiz-de-cristiano/` | `/espanol/bookstore/#p-eduardo-bonnin-%c2%96-un-aprendiz-de-cristiano` |
| `/product/eduardo-bonnin-aguilo-100-anos-biografia-pensamiento/` | `/espanol/bookstore/#p-eduardo-bonnin-aguilo-100-anos-biografia-pensamiento` |
| `/product/eduardo-bonnin-aguilo-100-years-biography-mentality/` | `/bookstore/#p-eduardo-bonnin-aguilo-100-years-biography-mentality` |
| `/product/eduardo-bonnin-an-apprentice-christian/` | `/bookstore/#p-eduardo-bonnin-an-apprentice-christian` |
| `/product/eduardo-bonnin-prayer-card-package-50/` | `/bookstore/#p-eduardo-bonnin-prayer-card-package-50` |
| `/product/el-como-y-el-porque/` | `/espanol/bookstore/#p-el-como-y-el-porque` |
| `/product/el-libro-del-padrino/` | `/espanol/bookstore/#p-el-libro-del-padrino` |
| `/product/empezando-el-4-dia/` | `/espanol/bookstore/#p-empezando-el-4-dia` |
| `/product/estudio-del-carisma-por-omcc/` | `/espanol/bookstore/#p-estudio-del-carisma-por-omcc` |
| `/product/evidencias-olvidadas-por-eduardo-bonnin/` | `/espanol/bookstore/#p-evidencias-olvidadas-por-eduardo-bonnin` |
| `/product/first-conversations-of-cala-figuera/` | `/bookstore/#p-first-conversations-of-cala-figuera` |
| `/product/folletos-del-cursillo-50/` | `/espanol/bookstore/#p-folletos-del-cursillo-50` |
| `/product/fundamental-ideas-3rd-edition/` | `/bookstore/#p-fundamental-ideas-3rd-edition` |
| `/product/fundamentals-of-christianity-by-fr-frank-salmani/` | `/bookstore/#p-fundamentals-of-christianity-by-fr-frank-salmani` |
| `/product/gods-plan-salvation-fr-frank-salmani/` | `/bookstore/#p-gods-plan-salvation-fr-frank-salmani` |
| `/product/group-reunion-sheets-package-of-50/` | `/bookstore/#p-group-reunion-sheets-package-of-50` |
| `/product/guia-del-peregrino/` | `/espanol/bookstore/#p-guia-del-peregrino` |
| `/product/guia-del-rector/` | `/espanol/bookstore/#p-guia-del-rector` |
| `/product/historia-de-un-carisma/` | `/espanol/bookstore/#p-historia-de-un-carisma` |
| `/product/historica-y-memoria-de-cursillos/` | `/espanol/bookstore/#p-historica-y-memoria-de-cursillos` |
| `/product/history-of-a-charism-foundation-eduardo-bonnin-aguilo/` | `/bookstore/#p-history-of-a-charism-foundation-eduardo-bonnin-aguilo` |
| `/product/hoja-de-reunion-de-dirigentes-50/` | `/espanol/bookstore/#p-hoja-de-reunion-de-dirigentes-50` |
| `/product/hoja-de-reunion-de-grupo-50/` | `/espanol/bookstore/#p-hoja-de-reunion-de-grupo-50` |
| `/product/hoja-de-servicio-50/` | `/espanol/bookstore/#p-hoja-de-servicio-50` |
| `/product/ideas-fundamentales-2/` | `/espanol/bookstore/#p-ideas-fundamentales-2` |
| `/product/ii-conversaciones-de-cala-figuera/` | `/espanol/bookstore/#p-ii-conversaciones-de-cala-figuera` |
| `/product/iii-conversaciones-de-cala-figuera/` | `/espanol/bookstore/#p-iii-conversaciones-de-cala-figuera` |
| `/product/iv-conversaciones-de-cala-figuera/` | `/espanol/bookstore/#p-iv-conversaciones-de-cala-figuera` |
| `/product/joy-of-the-gospel-by-pope-francis/` | `/bookstore/#p-joy-of-the-gospel-by-pope-francis` |
| `/product/kahki-cotton-twill-visor/` | `/bookstore/#p-kahki-cotton-twill-visor` |
| `/product/lam-th-nao-hinh-thanh-mt-trng-lanh-o/` | `/tieng-viet/bookstore/#p-lam-th-nao-hinh-thanh-mt-trng-lanh-o` |
| `/product/leaders-manual/` | `/bookstore/#p-leaders-manual` |
| `/product/leaders-order-of-reunion-package-of-50/` | `/bookstore/#p-leaders-order-of-reunion-package-of-50` |
| `/product/leaders-prayer-card-package-of-50/` | `/bookstore/#p-leaders-prayer-card-package-of-50` |
| `/product/lets-keep-the-fourth-day-simple/` | `/bookstore/#p-lets-keep-the-fourth-day-simple` |
| `/product/los-origenes-mallorquines-de-los-cursillos-decristiandad-en-ee-uu-texas-1957-1959/` | `/espanol/bookstore/#p-los-origenes-mallorquines-de-los-cursillos-decristiandad-en-ee-uu-texas-1957-1959` |
| `/product/lower-your-nets/` | `/bookstore/#p-lower-your-nets` |
| `/product/manifesto/` | `/bookstore/#p-manifesto` |
| `/product/manifiesto/` | `/espanol/bookstore/#p-manifiesto` |
| `/product/mantengamos-el-plan-pastoral-sencillo/` | `/espanol/bookstore/#p-mantengamos-el-plan-pastoral-sencillo` |
| `/product/manual-de-dirigentes/` | `/espanol/bookstore/#p-manual-de-dirigentes` |
| `/product/manual-del-asesor-espiritual/` | `/espanol/bookstore/#p-manual-del-asesor-espiritual` |
| `/product/mens-polo-shirt/` | `/bookstore/#p-mens-polo-shirt` |
| `/product/mi-testamento-espiritual-por-eduardo-bonnin/` | `/espanol/bookstore/#p-mi-testamento-espiritual-por-eduardo-bonnin` |
| `/product/my-spiritual-testament-by-eduardo-bonnin/` | `/bookstore/#p-my-spiritual-testament-by-eduardo-bonnin` |
| `/product/nhng-ngi-mon-chua-sai-i/` | `/tieng-viet/bookstore/#p-nhng-ngi-mon-chua-sai-i` |
| `/product/nhng-t-tng-nn-tng-pt-cursillo/` | `/tieng-viet/bookstore/#p-nhng-t-tng-nn-tng-pt-cursillo` |
| `/product/nhung-tu-tuong-nen-tang-pt-cursillo/` | `/tieng-viet/bookstore/#p-nhung-tu-tuong-nen-tang-pt-cursillo` |
| `/product/nuestro-cuarto-dia/` | `/espanol/bookstore/#p-nuestro-cuarto-dia` |
| `/product/on-evangelization-in-the-modern-world/` | `/bookstore/#p-on-evangelization-in-the-modern-world` |
| `/product/oracion-del-dirigente-50/` | `/espanol/bookstore/#p-oracion-del-dirigente-50` |
| `/product/origins-and-development-of-cursillo/` | `/bookstore/#p-origins-and-development-of-cursillo` |
| `/product/picture-of-jesus-recreation-of-shroud/` | `/bookstore/#p-picture-of-jesus-recreation-of-shroud` |
| `/product/pilgrims-guide-6th-edition/` | `/bookstore/#p-pilgrims-guide-6th-edition` |
| `/product/polo-shirt-2/` | `/bookstore/#p-polo-shirt-2` |
| `/product/post-cursillo-group-reunion-and-ultreya/` | `/bookstore/#p-post-cursillo-group-reunion-and-ultreya` |
| `/product/primeras-conversaciones-de-cala-figuera/` | `/espanol/bookstore/#p-primeras-conversaciones-de-cala-figuera` |
| `/product/rectors-guide/` | `/bookstore/#p-rectors-guide` |
| `/product/reflections-ii-search-oneself/` | `/bookstore/#p-reflections-ii-search-oneself` |
| `/product/reflexiones-ii-por-eduardo-bonnin/` | `/espanol/bookstore/#p-reflexiones-ii-por-eduardo-bonnin` |
| `/product/reflexiones-por-eduardo-bonnin/` | `/espanol/bookstore/#p-reflexiones-por-eduardo-bonnin` |
| `/product/retrato-de-jesus-tomado-del-manto-de-turin/` | `/espanol/bookstore/#p-retrato-de-jesus-tomado-del-manto-de-turin` |
| `/product/reunion-de-grupo-teoria-de-su-practica/` | `/espanol/bookstore/#p-reunion-de-grupo-teoria-de-su-practica` |
| `/product/reunion-of-the-group-by-eduardo-bonnin/` | `/bookstore/#p-reunion-of-the-group-by-eduardo-bonnin` |
| `/product/service-sheets-package-of-50/` | `/bookstore/#p-service-sheets-package-of-50` |
| `/product/spiritual-advisors-manual/` | `/bookstore/#p-spiritual-advisor%c2%92s-manual` |
| `/product/sponsors-booklet/` | `/bookstore/#p-sponsors-booklet` |
| `/product/starting-the-4th-day-give-to-new-cursillistas/` | `/bookstore/#p-starting-the-4th-day-give-to-new-cursillistas` |
| `/product/structure-of-ideas-by-eduardo-bonnin/` | `/bookstore/#p-structure-of-ideas-by-eduardo-bonnin` |
| `/product/study-of-the-charism-by-omcc/` | `/bookstore/#p-study-of-the-charism-by-omcc` |
| `/product/stylus-paragon-pen/` | `/bookstore/#p-stylus-paragon-pen` |
| `/product/the-group-reunion-by-fr-juan-capo/` | `/bookstore/#p-the-group-reunion-by-fr-juan-capo` |
| `/product/the-thinking-of-eduardo-bonnin-i/` | `/bookstore/#p-the-thinking-of-eduardo-bonnin-i` |
| `/product/tim-hiu-pt-cursilllo/` | `/tieng-viet/bookstore/#p-tim-hiu-pt-cursilllo` |
| `/product/tote-bag/` | `/bookstore/#p-tote-bag` |
| `/product/unity-prayer-card-3/` | `/bookstore/#p-unity-prayer-card-3` |
| `/product/vamos-a-mantener-el-cuarto-dia-sencillo/` | `/espanol/bookstore/#p-vamos-a-mantener-el-cuarto-dia-sencillo` |
| `/product/vertebracion-de-ideas/` | `/espanol/bookstore/#p-vertebracion-de-ideas` |
| `/product/whom-shall-i-send-by-fr-frank-salmani/` | `/bookstore/#p-whom-shall-i-send-by-fr-frank-salmani` |
| `/product/womens-polo-shirts/` | `/bookstore/#p-womens-polo-shirts` |

### Attachment and media-category pages

| Old URL | New location |
|---|---|
| `/forms-reports/memo-091515-en/` | `/library/forms-reports/` |
| `/cursillo-literature/orderform/` | `/bookstore/` |
| `/home-page/co1-1/` | `/` |
| `/cursillo-literature/books/` | `/bookstore/` |
| `/tieng-viet/xin-goi-palancas/rosarys/` | `/tieng-viet/prayer/` |
| `/home-page/co1-2/` | `/` |
| `/resource-center/2014-national-cursillo-encounter-workshop-sessions/agustin/` | `/library/2014/` |
| `/resource-center/2014-region-xi-encounter/cef2a/` | `/library/2014-region-xi/` |
| `/resource-center/2013-national-cursillo-encounter-workshop-sessions/smith/` | `/library/2013/` |
| `/resource-center/2013-national-cursillo-encounter-workshop-sessions/santos/` | `/library/2013/` |
| `/resource-center/2013-national-cursillo-encounter-workshop-sessions/sa_workshop/` | `/library/2013/` |
| `/resource-center/2013-national-cursillo-encounter-workshop-sessions/rosazza/` | `/library/2013/` |
| `/resource-center/2013-national-cursillo-encounter-workshop-sessions/michael/` | `/library/2013/` |
| `/resource-center/2013-national-cursillo-encounter-workshop-sessions/marisela/` | `/library/2013/` |
| `/resource-center/2013-national-cursillo-encounter-workshop-sessions/juan1/` | `/library/2013/` |
| `/resource-center/2013-national-cursillo-encounter-workshop-sessions/hoang/` | `/library/2013/` |
| `/resource-center/2012-north-american-and-caribbean-group-encounter/juan2012/` | `/library/2012-north-america-caribbean/` |
| `/resource-center/2012-national-cursillo-encounter-workshop-sessions/ruiz/` | `/library/2012/` |
| `/resource-center/2012-national-cursillo-encounter-workshop-sessions/perez/` | `/library/2012/` |
| `/resource-center/2012-national-cursillo-encounter-workshop-sessions/fela/` | `/library/2012/` |
| `/resource-center/2012-national-cursillo-encounter-workshop-sessions/cuddeback/` | `/library/2012/` |
| `/resource-center/2012-national-cursillo-encounter-workshop-sessions/angel/` | `/library/2012/` |
| `/resource-center/2012-national-cursillo-encounter-workshop-sessions/aguillon/` | `/library/2012/` |
| `/home-page/co1/` | `/` |
| `/home-page/co2/` | `/` |
| `/home-page/co3/` | `/` |
| `/home-page/eduardo/` | `/` |
| `/home-page/encounter-pic/` | `/` |
| `/home-page/cdc-pic/` | `/` |
| `/resource-center/martin/` | `/library/` |
| `/resource-center/benavides/` | `/library/` |
| `/resource-center/gomez/` | `/library/` |
| `/resource-center/myers/` | `/library/` |
| `/resource-center/sevilla/` | `/library/` |
| `/resource-center/terrana/` | `/library/` |
| `/resource-center/tran2015/` | `/library/` |
| `/resource-center/waraksa/` | `/library/` |
| `/resource-center/ewtn1/` | `/library/` |
| `/resource-center/ewtn2/` | `/library/` |
| `/resource-center/popefrancis/` | `/library/` |
| `/home-page/trinity-3/` | `/` |
| `/resource-center/2017-national-cursillo-encounter-workshop-sessions/vincent/` | `/library/2017/` |
| `/tieng-viet/trang-nha/viet-flyer/` | `/tieng-viet/` |
| `/tieng-viet/trang-nha/viet-flyer-1/` | `/tieng-viet/` |
| `/tieng-viet/trang-nha/viet-flyer-2/` | `/tieng-viet/` |
| `/espanol/inicio/span-flyer/` | `/espanol/` |
| `/home-page/eng-flyer/` | `/` |
| `/bylaws/bylaws-united-states-national-cursillo-movement-2024-nov-2024/` | `/library/forms-reports/` |
| `/bylaws/ban-_ieu-le-hoat-do-ng-2024-articles-of-operation/` | `/library/forms-reports/` |
| `/no-one-left-behind-experiencing-gods-love/ncca-job-posting-and-application-2-10-25/` | `/` |
| `/no-one-left-behind-experiencing-gods-love/ncca-job-posting-2/` | `/` |
| `/home-page/nsa-announcement-071625-3/` | `/` |
| `/home-page/fr-lalo-bio/` | `/` |
| `/home-page/nsa-announcement-071625-tabloid/` | `/` |
| `/bylaws/united-states-national-cursillo-movement-operational-bylaws-11-16-2024-final-edit-2/` | `/library/forms-reports/` |
| `/home-page/nw/` | `/` |
| `/home-page/n2/` | `/` |
| `/espanol/inicio/s1/` | `/espanol/` |
| `/tieng-viet/trang-nha/v1/` | `/tieng-viet/` |
| `/home-page/ccn/` | `/` |
| `/home-page/ccnn/` | `/` |
| `/home-page/mmm/` | `/` |
| `/home-page/attachment/1/` | `/` |
| `/home-page/attachment/2/` | `/` |
| `/home-page/encounter-3/` | `/` |
| `/home-page/final-cnn_0426_enf-1-2/` | `/` |
| `/home-page/cnn_0626_esf-2-2/` | `/` |
| `/home-page/cnn_0626_enf-2-2/` | `/` |
| `/home-page/cnn_0626_enf-2-3/` | `/` |
| `/media_category/26th-ne/` | `/library/` |
| `/media_category/banner/` | `/library/` |
| `/media_category/bookstore/` | `/library/` |
| `/media_category/cdc/` | `/library/` |
| `/media_category/donation/` | `/library/` |
| `/media_category/eduardo-bio/` | `/library/` |
| `/media_category/encounters/` | `/library/` |
| `/media_category/engish-encounters/` | `/library/` |
| `/media_category/english-resource-center/` | `/library/` |
| `/media_category/engish-fr/` | `/library/` |
| `/media_category/engish-newsletter/` | `/library/` |
| `/media_category/espanol-encounters/` | `/library/` |
| `/media_category/espanol-fr/` | `/library/` |
| `/media_category/espanol-newsletter/` | `/library/` |
| `/media_category/forms-and-reports/` | `/library/` |
| `/media_category/gifts/` | `/library/` |
| `/media_category/memo/` | `/library/` |
| `/media_category/newsletter/` | `/library/` |
| `/media_category/resource-center/` | `/library/` |
| `/media_category/spanish-resource-center/` | `/library/` |
| `/media_category/viet-encounters/` | `/library/` |
| `/media_category/viet-fr/` | `/library/` |
| `/media_category/viet-newsletter/` | `/library/` |
| `/media_category/vietnamese-resource-center/` | `/library/` |

About 100 more attachment URLs in the original sitemap are `/?attachment_id=…` links; they land on the home page.

## Please confirm before launch

- Spanish and Vietnamese interface text written for the redesign needs review by native speakers (page content itself is the original text).
- Bookstore prices and stock are a snapshot of 2026-11-25.
- Four Vimeo videos could not be confirmed public (listed above); their links are kept with a notice.
- Fixed while rebuilding: Amy Dang's email was a broken relative link on the original page (now `mailto:`); several original library pages carried the wrong year in their title (the page heading is used instead).
- Approval of the Movement for launch, for the redirects, and for any use of the logo proposals.
