# ReelVibe - Archive Video Streaming

A modern video streaming platform powered by the Internet Archive.

## Features

- Browse and search videos from archive.org
- Stream videos directly from Internet Archive
- Modern, responsive UI with Tailwind CSS
- Full-text search and filtering
- Paginated video browsing
- Video detail pages with related content

## Tech Stack

- **Frontend**: Nuxt 3 + Vue 3
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Edge Functions + PostgreSQL)
- **Video Source**: Internet Archive

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Supabase**:
   - Create a Supabase project
   - Run the SQL schema from `supabase/schema.sql`
   - Deploy the Edge Functions
   - Copy `.env.example` to `.env` and fill in your credentials

3. **Deploy Edge Functions**:
   ```bash
   supabase functions deploy sync-archive-videos
   supabase functions deploy videos-api
   ```

4. **Sync videos** (optional):
   ```bash
   curl -X POST https://<project>.supabase.co/functions/v1/sync-archive-videos \
     -H "Authorization: Bearer <service-role-key>"
   ```

5. **Run locally**:
   ```bash
   npm run dev
   ```

## Project Structure

```
ReelVibe/
├── app/
│   └── app.vue           # Main app component
├── assets/
│   └── css/
│       └── main.css      # Global styles
├── components/
│   ├── VideoCard.vue     # Video card component
│   ├── VideoGrid.vue     # Video grid with pagination
│   └── VideoPlayer.vue   # Video player component
├── composables/
│   └── useVideos.ts      # Video fetching composable
├── layouts/
│   └── default.vue       # Default layout
├── pages/
│   ├── index.vue         # Home page
│   └── watch/
│       └── [id].vue      # Video watch page
├── public/
│   └── favicon.svg       # App favicon
├── supabase/
│   ├── functions/
│   │   ├── sync-archive-videos/
│   │   │   └── index.ts  # Sync function
│   │   └── videos-api/
│   │       └── index.ts  # API function
│   └── schema.sql        # Database schema
├── nuxt.config.ts        # Nuxt configuration
├── package.json          # Dependencies
├── tailwind.config.js    # Tailwind config
└── .env.example          # Environment variables example
```

## API Endpoints

### Videos API

- `GET /functions/v1/videos-api` - List videos with pagination
  - Query params: `page`, `sort`, `search`
- `GET /functions/v1/videos-api?id={id}` - Get single video

### Sync Function

- `POST /functions/v1/sync-archive-videos` - Sync videos from archive.org

## License

MIT