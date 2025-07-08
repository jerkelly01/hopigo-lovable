import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const path = url.pathname.split('/').slice(-1)[0]
    const apiKey = req.headers.get('x-api-key')

    // Verify API key for protected endpoints
    if (!apiKey && path !== 'status') {
      return new Response(
        JSON.stringify({ error: 'API key required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify API key exists in dashboard_connections
    if (apiKey) {
      const { data: connection } = await supabaseClient
        .from('dashboard_connections')
        .select('*')
        .eq('api_key', apiKey)
        .eq('is_active', true)
        .single()

      if (!connection) {
        return new Response(
          JSON.stringify({ error: 'Invalid API key' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    switch (path) {
      case 'status':
        return new Response(
          JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'users':
        if (req.method === 'GET') {
          const { data, error } = await supabaseClient
            .from('users')
            .select('id, email, full_name, user_type, is_active, created_at')
            .order('created_at', { ascending: false })

          if (error) throw error

          return new Response(
            JSON.stringify({ users: data }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        break

      case 'sync-user':
        if (req.method === 'POST') {
          const userData = await req.json()
          
          const { data, error } = await supabaseClient
            .from('users')
            .upsert({
              id: userData.id,
              email: userData.email,
              full_name: userData.full_name,
              user_type: userData.user_type || 'customer',
              is_active: userData.is_active ?? true,
              updated_at: new Date().toISOString()
            })
            .select()

          if (error) throw error

          return new Response(
            JSON.stringify({ success: true, user: data[0] }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        break

      default:
        return new Response(
          JSON.stringify({ error: 'Endpoint not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})