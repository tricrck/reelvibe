export interface Video {
  id: string
  title: string
  description: string
  creator: string
  downloads: number
  thumb_url: string
  stream_url: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface VideosResponse {
  data: Video[]
  error: any
  total: number
  page: number
  limit: number
}

export const useVideos = () => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const supabaseAnonKey = config.public.supabaseAnonKey
  const FUNCTION_URL = `${supabaseUrl}/functions/v1`

  // console.log('Supabase URL:', supabaseUrl)
  // console.log('Supabase Anon Key:', supabaseAnonKey ? '***' : 'Not set')
  // console.log('Function URL:', FUNCTION_URL)

  const fetchVideos = async (page = 1, search = '', sort = 'downloads'): Promise<VideosResponse> => {
    if (!supabaseUrl || !supabaseAnonKey) {
      return { data: [], error: null, total: 0, page, limit: 20 }
    }

    const params = new URLSearchParams({
      page: String(page),
      sort
    })
    if (search) params.set('search', search)

    try {
      const res = await fetch(`${FUNCTION_URL}/videos-api?${params}`)
      return res.json()
    } catch (error) {
      console.error('Error fetching videos:', error)
      return { data: [], error, total: 0, page, limit: 20 }
    }
  }

  const fetchVideo = async (id: string): Promise<{ data: Video | null; error: any }> => {
    if (!supabaseUrl || !supabaseAnonKey) {
      return { data: null, error: null }
    }

    try {
      const res = await fetch(`${FUNCTION_URL}/videos-api?id=${id}`)
      const result = await res.json()
      return { data: result.data, error: result.error }
    } catch (error) {
      console.error('Error fetching video:', error)
      return { data: null, error }
    }
  }

  return { fetchVideos, fetchVideo }
}