# Nila Prem — Portfolio + Admin Panel

Two parts, both free:

1. **Website + admin panel** — static files on **GitHub Pages**.
2. **Admin API** (`/api` folder) — runs on **Vercel**. It checks the PIN and saves changes to GitHub.

## What you can manage from `/admin/`

| Section | You can |
|---|---|
| Home | Name, headline, tagline, status line ("Open to new roles"), skill tags, profile photo, **resume PDF**, SEO |
| About | Bio, location, **number cards** (years, platforms…), the **"Currently" card** |
| Skills | Add or remove skills |
| Experience | Add, edit, duplicate, reorder, delete jobs, with bullet points |
| Projects | Add projects with description, **technology tags**, optional link and screenshot |
| Education | Add, edit, reorder, delete |
| Certifications / Highlights / Career Gallery | Ready to use, hidden for now (turn on under *Page layout*) |
| Contact | Phone, email, location, social links, floating WhatsApp / Call / Email buttons |
| Page layout | Show/hide and reorder whole sections |
| **Fonts** | Choose the typeface for headings, your name/logo and body text, with a live preview |
| Media library | See and delete uploaded images and PDFs |

New items are added at the **top**, so the most recent always shows first.
Nothing goes live until you press **Publish changes**. Unpublished edits are also saved in your browser,
so a closed tab or crash won't lose them.

## Fonts

Open **Admin → Fonts**. Three parts of the site can each have their own font:

| Part | Used for | Original |
|---|---|---|
| Headings | Section titles, role and project names | Playfair Display |
| Name & logo | Your name on the home page, the logo in the menu, the small labels above headings | Dancing Script |
| Body text | Paragraphs, buttons, menu links | Quicksand |

- 35 Google Fonts to pick from (serif, sans-serif, script, monospace). Use the filter chips to narrow the list.
- The preview at the top changes instantly. **Preview** shows the entire site with your choice. **Publish changes** makes it live.
- If you pick a non-script font for *Name & logo*, the site automatically re-sizes it (small spaced capitals for the labels, a clean bold name) so it still looks right.
- The chosen fonts are remembered in the visitor's browser, so repeat visits show them on the very first paint.
- Only fonts from the built-in list can be used (`js/fonts.js`). To add another Google Font, add one line to `CATALOG` there. List only the weights that font really has.

## First-time setup

1. **GitHub** — create a repository named `nila-portfolio` under the `Nilaprem` account and upload every file in this folder (keep the folder structure). Settings → Pages → deploy from branch `main`, folder `/ (root)`.
2. **Vercel** — import the same repository as a new project (no build settings needed). It serves the `api/` folder.
3. Vercel → project → Settings → Environment Variables. You need all of these:

   | Key | Value |
   |---|---|
   | `GITHUB_TOKEN` | fine-grained token, **Contents: Read and write** on this repo only |
   | `GITHUB_OWNER` | `Nilaprem` |
   | `GITHUB_REPO` | `nila-portfolio` |
   | `GITHUB_BRANCH` | `main` |
   | `ADMIN_PIN` | choose a PIN |
   | `SESSION_SECRET` | a long random string |
   | `SITE_URL` | `https://nilaprem.github.io` |

   If you change a variable, redeploy afterwards.
4. Put your Vercel address in `config.js`, commit, and wait for GitHub Pages to update:

   ```js
   window.SITE_CONFIG = {
     API_BASE_URL: "https://YOUR-VERCEL-PROJECT.vercel.app",
     GITHUB_REPO: "Nilaprem/nila-portfolio"
   };
   ```
5. Open `https://nilaprem.github.io/nila-portfolio/admin/` and sign in with the PIN.
6. In **Home**, upload your profile photo and resume PDF. Until then the site shows your initial in the photo frame and hides the resume button.

### Login troubleshooting
- **"Incorrect PIN"**: the API is reachable and the PIN differs from `ADMIN_PIN`. Spaces before or after are ignored.
- **"Could not reach the admin API"**: `API_BASE_URL` is wrong, or `SITE_URL` doesn't match the site's address.
- **"…did not return a session"**: Vercel is still running old `api/` code. Redeploy.

## Photo and file limits
- Photos are shrunk automatically in the browser before upload (large phone photos are fine).
- Resume PDF: up to **3 MB**.
- After publishing, GitHub Pages takes about 1–2 minutes to show the changes.

## Site features
- Light / dark theme button (remembers the choice, follows the device setting at first visit).
- Subtle animations that switch off automatically for visitors who prefer reduced motion.
- Click any project, certificate, highlight or gallery photo to view it full size.
- Colours are variables at the top of `css/style.css` if you ever want to re-theme the site.
