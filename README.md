# PlainTube

**Your YouTube subscriptions, in order—without the home feed, recommendations, or extra noise.**

PlainTube is a free, open-source web app that turns the channels you follow into a simple **inbox**: newest videos first, like an email client instead of a social feed. Videos still play through **YouTube’s own player**; PlainTube is a calmer way to catch up, not a replacement for YouTube itself.

---

## Try it

If a public instance is available, open **[plaintube.tv](https://plaintube.tv)** and sign in with Google.

**What you need**

- A Google account
- Channels you’re subscribed to on YouTube (that’s what fills your inbox)

**What you’ll see**

- **Inbox** — New uploads from all your subscriptions, newest first  
- **Archived** — Videos you’ve marked as done (they leave the inbox)  
- **Saved** — A personal list for videos you want to come back to  
- **Channels & playlists** — Browse one channel or one of your YouTube playlists at a time  

**Keyboard shortcuts** (in the app, use the help icon in the sidebar for the full list)

| Key | Action |
|-----|--------|
| **J** / **K** | Next / previous video in the list |
| **Space** | Play the selected video |
| **E** | Archive or unarchive the current video |
| **S** | Save or remove from Saved |

---

## Privacy in plain language

- **No “PlainTube account” database** — There’s no server-side stash of your watch history or saved list.  
- **Archived and saved videos live in your browser** — They stay on your device (like local storage). Clearing site data removes them; they aren’t synced to another computer or phone automatically.  
- **Google sign-in** — PlainTube uses Google to prove it’s you and to read your subscriptions and playlists through YouTube’s official tools. Google knows you authorized the app.  
- **Playback** — Watching a video uses YouTube’s embedded player, so YouTube’s normal rules and policies apply there.  

For the detailed policy, see the **Privacy** link on the app (e.g. [plaintube.tv/privacy](https://plaintube.tv/privacy)).

---

## For developers

### Setup

Requirements: **Node.js 20+** and **pnpm** (v9+).

```bash
pnpm install
cp apps/web/.env.example apps/web/.env
# Fill in AUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET (see below)
pnpm dev
```

The dev server runs the **web** app from the monorepo root (`pnpm dev` → `apps/web`).

Configure **Google OAuth** in [Google Cloud Console](https://console.cloud.google.com/): create OAuth client credentials, enable the **YouTube Data API v3**, and add authorized redirect URIs that match Auth.js (for local Vite dev, commonly `http://localhost:5173/auth/callback/google`). For production, set `AUTH_URL` in `.env` to your public origin so redirects stay correct.

`AUTH_SECRET` can be generated with: `openssl rand -base64 32`.

### Stack

| Area | Choice |
|------|--------|
| App framework | [SvelteKit](https://kit.svelte.dev/) (Svelte 5) |
| Language | TypeScript |
| UI | Tailwind CSS, [shadcn-svelte](https://www.shadcn-svelte.com/)-style components |
| Data fetching | [TanStack Query](https://tanstack.com/query) |
| Auth | [Auth.js](https://authjs.dev/) for SvelteKit (`@auth/sveltekit`) — Google provider, JWT session |
| Deployment target | [Vercel](https://vercel.com/) (`@sveltejs/adapter-vercel`) |

### Architecture (short)

- **Three-column layout**: sidebar (navigation), scrollable video list, embedded YouTube viewer.  
- **YouTube Data API** is called from **SvelteKit server routes** under `apps/web/src/routes/api/`, so tokens stay server-side; the client talks to your app, not directly to Google.  
- **Watched / saved state** is persisted in the browser (`localStorage`), not in an app database.  
- Product direction and feature scope are summarized in [`PRD.md`](./PRD.md).

### License

[GNU Affero General Public License v3.0](https://www.gnu.org/licenses/agpl-3.0.en.html) (AGPL-3.0), as described in [`PRD.md`](./PRD.md).

**Repository:** [github.com/rzoleta/plaintube](https://github.com/rzoleta/plaintube)
