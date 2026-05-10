# PlainTube — Product Requirements Document

## Overview

**PlainTube** (`plaintube.tv`) is a free, open-source YouTube subscription viewer that strips away algorithmic recommendations, home feeds, and suggested content. Users log in with their Google account, and the app presents their YouTube subscriptions as a clean, chronological inbox — like an email client, not a social media feed.

Videos are played via the official YouTube iframe embed. No video data is hosted or proxied. No user data is retained server-side.

**License:** AGPL-3.0

---

## Problem

YouTube's interface is optimized for engagement and watch time, not for users who want to stay current with channels they've deliberately chosen to follow. The recommendation engine, home feed, and autoplay features make it difficult to use YouTube as a simple subscription reader.

---

## Solution

A minimal, no-nonsense web interface that treats YouTube subscriptions like an inbox:

- Chronological feed of new videos from subscribed channels
- Mark videos as watched (they leave the inbox)
- Save videos to an internal Watch Later list
- Browse by channel or playlist
- No algorithmic noise

---

## Design Direction

- **Aesthetic:** Deliberately boring — like an enterprise email client (think Outlook or a 2005 webmail app)
- **Primary color:** Blue (`#0078d4` or similar Outlook-blue)
- **Typography:** Clean, utilitarian — no decorative fonts
- **Layout:** 3-column, fixed — sidebar / list / viewer
- **Quirk:** The contrast between "boring business app" shell and actual YouTube content is intentional and part of the identity

---

## Layout

```
┌─────────────┬──────────────────────┬────────────────────────────┐
│   Sidebar   │     Video List       │       Video Viewer         │
│             │                      │                            │
│  ● Inbox    │  [Thumbnail] Title   │   ┌────────────────────┐  │
│  ● Watched  │  Channel · 2h ago    │   │                    │  │
│  ─────────  │                      │   │  YouTube Embed     │  │
│  Playlists  │  [Thumbnail] Title   │   │                    │  │
│  · My List  │  Channel · 5h ago    │   └────────────────────┘  │
│  · Liked    │                      │                            │
│  ─────────  │  [Thumbnail] Title   │   Title                    │
│  Channels   │  Channel · 1d ago    │   Channel name · Date      │
│  · Channel1 │                      │                            │
│  · Channel2 │  [Thumbnail] Title   │   [Mark Watched] [Save]    │
│  · Channel3 │  Channel · 2d ago    │                            │
└─────────────┴──────────────────────┴────────────────────────────┘
```

### Sidebar (Column 1)
- **Inbox** — chronological feed of unwatched videos from all subscribed channels
- **Watched** — videos the user has marked as watched (stored locally)
- **Saved** — internal Watch Later list (stored locally)
- **Playlists** — all user playlists fetched from YouTube API; clicking loads playlist videos into column 2
- **Channels** — all subscribed channels; clicking loads that channel's recent videos into column 2

### Video List (Column 2)
- Thumbnail, title, channel name, publish date
- Infinite scroll (paginated API calls via TanStack Query)
- Active/selected state highlights the currently playing video
- Watched videos are absent from Inbox but visible under Watched

### Video Viewer (Column 3)
- YouTube iframe embed (official IFrame Player API)
- Video title, channel, publish date
- **Mark as Watched** button — removes from Inbox, adds to Watched list
- **Save** button — adds to internal Saved list
- Empty state when nothing is selected

---

## Features

### MVP

| Feature | Description |
|---|---|
| Google OAuth login | Sign in with Google, scoped to YouTube read access |
| Subscription inbox | Chronological feed from all subscribed channels |
| Infinite scroll | Paginated video loading via TanStack Query |
| Video playback | YouTube iframe embed in third column |
| Mark as watched | Removes video from Inbox, adds to Watched list |
| Save video | Adds to internal Saved/Watch Later list |
| Channel browser | View recent videos by channel |
| Playlist browser | View videos in user's YouTube playlists |
| Watched list | Persistent (localStorage) list of watched videos |
| Saved list | Persistent (localStorage) Watch Later list |
| Sign out | Clears session and local state |

### Out of Scope (MVP)
- Search
- Comments
- Likes / ratings
- Cross-device sync
- Notifications
- Mobile app (architecture supports it; not built yet)
- Dark mode (can be added post-MVP)

---

## Technical Requirements

### Stack

| Layer | Choice |
|---|---|
| Framework | SvelteKit (Svelte 5) |
| Language | TypeScript (strict) |
| UI Components | shadcn-svelte |
| Styling | Tailwind CSS (all styling via Tailwind classes; `<style>` blocks only as last resort) |
| Data fetching | TanStack Query (`@tanstack/svelte-query`) |
| Auth | `@auth/sveltekit` — Google OAuth, JWT session strategy (no DB) |
| Persistence | Browser only — `localStorage` / `IndexedDB` |
| Deployment | Vercel |

### Repository Structure

```
plaintube/
├── apps/
│   └── web/                  # SvelteKit app
│       ├── src/
│       │   ├── lib/
│       │   │   ├── components/
│       │   │   ├── stores/    # Svelte stores for local state
│       │   │   ├── api/       # YouTube API client wrappers
│       │   │   └── auth/      # Auth helpers
│       │   ├── routes/
│       │   │   ├── +layout.svelte
│       │   │   ├── +page.svelte       # Main app shell (3-col layout)
│       │   │   ├── auth/
│       │   │   │   └── [...]/+server.ts  # Auth.js handler
│       │   │   └── api/               # SvelteKit API routes (proxy YouTube API calls)
│       │   └── app.html
│       ├── package.json
│       └── svelte.config.js
├── package.json               # Monorepo root
└── turbo.json (or pnpm-workspace.yaml)
```

### Auth

- **Provider:** Google OAuth via `@auth/sveltekit`
- **Strategy:** JWT (no database, no server-side session store)
- **Scopes requested:**
  - `https://www.googleapis.com/auth/youtube.readonly`
  - `openid`, `email`, `profile`
- **Token storage:** Encrypted HTTP-only cookie (managed by Auth.js)
- **No user data is stored server-side.** The access token and refresh token live in the cookie only.

### YouTube API Usage

| Data | API Endpoint | Cost |
|---|---|---|
| Subscription list | `subscriptions.list?mine=true` | 1 unit/page |
| Channel uploads playlist ID | `channels.list?part=contentDetails` | 1 unit/page |
| Videos from a channel | `playlistItems.list?playlistId={uploadsId}` | 1 unit/page |
| User playlists | `playlists.list?mine=true` | 1 unit/page |
| Playlist videos | `playlistItems.list?playlistId={id}` | 1 unit/page |

**Quota strategy:**
- Use `playlistItems.list` on each channel's uploads playlist (1 unit each) instead of `search.list` (100 units each)
- Fetch subscription list once per session, cache in `sessionStorage`
- Paginate via infinite scroll — only fetch more when the user scrolls
- Default quota: 10,000 units/day (sufficient for normal single-user usage; may need a quota increase request for high-traffic)

### Local Persistence (Browser)

All user-specific app state is stored in the browser only. No data is sent to or stored on PlainTube's servers.

| Data | Storage | Key |
|---|---|---|
| Watched video IDs | `localStorage` | `plaintube:watched` |
| Saved (Watch Later) video objects | `localStorage` | `plaintube:saved` |
| Subscription list cache | `sessionStorage` | `plaintube:subscriptions` |

### YouTube Embed Compliance

- Videos are played via the official YouTube IFrame Player API
- Ads are not blocked or bypassed
- Player controls are not overridden
- YouTube branding is visible within the embed
- No video content is downloaded, cached, or re-hosted

---

## Non-Goals

- PlainTube does not compete with YouTube — it is a complementary viewer
- PlainTube does not remove or circumvent ads
- PlainTube does not store, proxy, or re-serve any YouTube content
- PlainTube does not track user behavior or analytics

---

## Open Questions / Post-MVP Considerations

- **Quota scaling:** If the app grows in users, each user deploys with their own Google Cloud project + API key (self-hosted model), or PlainTube applies for quota increases
- **Mobile app:** Monorepo structured to support `apps/mobile` (e.g., Capacitor or React Native) later
- **Dark mode:** Tailwind `dark:` classes can be added post-MVP
- **Cross-device sync:** Would require a DB + auth persistence layer (better-auth + Turso as the lightest option)
- **Search:** YouTube Data API supports `search.list` but at 100 units/call — expensive; defer until quota strategy is clearer
