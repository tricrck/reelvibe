import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const ARCHIVE_API = "https://archive.org/advancedsearch.php"
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
)

Deno.serve(async (req) => {
  try {
    // Fetch video list from archive.org
    const params = new URLSearchParams({
      q: 'mediatype:movies AND format:(mp4)',
      "fl[]": "identifier,title,description,creator,downloads",
      "sort[]": "downloads desc",
      rows: "50",
      page: "1",
      output: "json",
    })

    const res = await fetch(`${ARCHIVE_API}?${params}`)
    const data = await res.json()
    const docs = data.response?.docs ?? []

    const videos = await Promise.all(
      docs.map(async (doc: any) => {
        try {
          // Get the actual streaming URL for each item
          const metaRes = await fetch(
            `https://archive.org/metadata/${doc.identifier}`
          )
          const meta = await metaRes.json()
          const mp4File = meta.files?.find(
            (f: any) => f.name?.endsWith(".mp4") && f.source === "original"
          )

          return {
            id: doc.identifier,
            title: doc.title ?? doc.identifier,
            description: doc.description ?? "",
            creator: doc.creator ?? "Unknown",
            downloads: doc.downloads ?? 0,
            thumb_url: `https://archive.org/services/img/${doc.identifier}`,
            stream_url: mp4File
              ? `https://archive.org/download/${doc.identifier}/${mp4File.name}`
              : null,
            metadata: meta.metadata ?? {},
            updated_at: new Date().toISOString(),
          }
        } catch (err) {
          console.error(`Error fetching metadata for ${doc.identifier}:`, err)
          return null
        }
      })
    )

    const validVideos = videos.filter((v) => v && v.stream_url)

    if (validVideos.length > 0) {
      const { error } = await supabase
        .from("videos")
        .upsert(validVideos, { onConflict: 'id' })

      if (error) {
        console.error('Supabase upsert error:', error)
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        })
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        synced: validVideos.length,
        total: docs.length
      }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error('Sync error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
})