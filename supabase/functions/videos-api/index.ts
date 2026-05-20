import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!
)

Deno.serve(async (req) => {
  const url = new URL(req.url)
  const id = url.searchParams.get("id")
  const search = url.searchParams.get("search")
  const sort = url.searchParams.get("sort") || "downloads"
  const page = parseInt(url.searchParams.get("page") ?? "1")
  const limit = 20
  const offset = (page - 1) * limit

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  }

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers })
  }

  try {
    // Single video
    if (id) {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("id", id)
        .single()

      return new Response(
        JSON.stringify({ data, error }),
        { headers }
      )
    }

    // Search or list
    let query = supabase
      .from("videos")
      .select("id, title, thumb_url, creator, downloads, stream_url, description, metadata, created_at", {
        count: "exact",
      })

    // Apply sorting
    switch (sort) {
      case "downloads":
        query = query.order("downloads", { ascending: false })
        break
      case "created_at":
        query = query.order("created_at", { ascending: false })
        break
      case "title":
        query = query.order("title", { ascending: true })
        break
      default:
        query = query.order("downloads", { ascending: false })
    }

    // Apply search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,creator.ilike.%${search}%`)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    return new Response(
      JSON.stringify({
        data,
        error,
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      }),
      { headers }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers }
    )
  }
})