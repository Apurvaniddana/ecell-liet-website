# E-Cell LIET — React Website

A production-ready, responsive React + Vite website for E-Cell LIET.

## Included
- Home page
- About page
- Members page with search and role/group filters
- Blogs page with category filtering and date sorting
- Individual blog article pages
- Mobile navigation
- Structured JSON content files
- No member/blog content hardcoded inside page components

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Production build

```bash
npm run build
npm run preview
```

The deployable output is `dist/`.

## Deploy
This is compatible with Vercel, Netlify, GitHub Pages (with SPA configuration), and other static hosts.

### Vercel
- Import the repository.
- Framework preset: Vite.
- Build command: `npm run build`.
- Output directory: `dist`.

## Updating members

Edit:

`public/content/members.json`

Each member follows this structure:

```json
{
  "id": "m01",
  "name": "Full Name",
  "role": "Role",
  "group": "Department / Group",
  "bio": "Short bio.",
  "image": "/content/images/photo.jpg"
}
```

Put photos in `public/content/images/` and set the `image` value to `/content/images/filename.jpg`.

No React code needs to change.

## Updating blogs

Edit:

`public/content/blogs.json`

Each article follows:

```json
{
  "id": "b05",
  "slug": "my-new-article",
  "title": "My New Article",
  "author": "Author Name",
  "date": "2026-10-03",
  "category": "Startups",
  "excerpt": "Short summary.",
  "content": [
    "First paragraph.",
    "Second paragraph."
  ]
}
```

The Blogs page automatically picks up new categories and supports newest/oldest sorting.

## Updating About content

Edit:

`public/content/about.json`

This keeps organizational copy separate from the React components.

## Important source-content notes

The latest supplied roles PDF says `Total Members: 25`, but the detailed entries contain a count mismatch: it lists three Vice Presidents while the summary says two, and the role counts therefore do not reconcile cleanly. Two associate names are also missing from the document:
- Associate Branding & Social Media Lead
- Associate Marketing & Outreach Lead

The site therefore marks those two names as `TBD` rather than inventing names. The supplied PDF also contains no member photo files in the available project files, so initials placeholders are used until the photo folder is added.

The current `members.json` preserves every explicitly named person in the supplied updated PDF. Before public launch, confirm the official roster count and the two missing names.

## Content management approach

This build intentionally uses a simple document-based content layer instead of hardcoding entries in JSX. A future CMS can replace the JSON files without redesigning the UI: the UI expects the same member/blog fields.

For a non-technical editorial workflow later, the recommended next step is connecting these JSON collections to a Git-based CMS or headless CMS while keeping the same schema.


## Member photos
The provided Google Drive ZIP has been integrated. Photos with an unambiguous match are stored under `public/content/images/` using stable member IDs. A few source photos were kept in `public/content/images/unmatched-from-drive/` because their filenames do not match the current member roster closely enough to assign them safely.

### Roles & Responsibilities source
Member roles and responsibilities were updated from the provided `E-Cell LIET - Roles & Responsibilities.pdf`. The source states 25 total members, while its named-member entries plus two unnamed roles result in a roster inconsistency; the website does not invent the two missing names.


## Online Admin Blog Management (Supabase)

The Admin page at `/admin` now uses Supabase instead of browser localStorage.

### 1. Environment variables

Copy `.env.example` to `.env` and add your Supabase Project URL and Publishable/anon key:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
```

Never put a `service_role` or secret key in the React/Vite frontend.

### 2. Supabase table

The current React code uses the `blogs` table with these columns:

- `id` — uuid, primary key, default `gen_random_uuid()`
- `title` — text
- `slug` — text
- `author` — text
- `category` — text
- `content` — text
- `cover_image` — text, nullable
- `published` — boolean
- `created_at` — timestamptz, default `now()`

The `content` text stores the article paragraphs, excerpt and chosen date as JSON, so no extra columns are required.

### 3. Security

Enable RLS and use the policies created in Supabase SQL Editor. The public can read published blogs; the configured admin email can insert, update and delete.

### 4. Admin

Open `/admin`, sign in with the Supabase Authentication user you created, and publish or edit articles. Changes are stored online in Supabase and are visible from other devices.


## Comments
The blog detail page now loads and posts comments through the Supabase `comments` table. The table uses `blog_id` to connect each comment to its blog.
