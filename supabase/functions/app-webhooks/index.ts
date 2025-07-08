import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const apiKey = req.headers.get('x-api-key')
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify API key and get app_id
    const { data: connection } = await supabaseClient
      .from('dashboard_connections')
      .select('app_id')
      .eq('api_key', apiKey)
      .eq('is_active', true)
      .single()

    if (!connection) {
      return new Response(
        JSON.stringify({ error: 'Invalid API key' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const eventData = await req.json()

    // Store the event
    const { data, error } = await supabaseClient
      .from('dashboard_events')
      .insert({
        app_id: connection.app_id,
        event_type: eventData.event_type,
        event_data: eventData.data || {},
        user_id: eventData.user_id,
        timestamp: eventData.timestamp || new Date().toISOString()
      })
      .select()

    if (error) throw error

    // Update last_sync for the connection
    await supabaseClient
      .from('dashboard_connections')
      .update({ 
        last_sync: new Date().toISOString(),
        sync_status: 'success'
      })
      .eq('app_id', connection.app_id)

    return new Response(
      JSON.stringify({ success: true, event_id: data[0].id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Webhook error:', error)
    
    // Try to update sync status on error
    try {
      const apiKey = req.headers.get('x-api-key')
      if (apiKey) {
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )
        
        await supabaseClient
          .from('dashboard_connections')
          .update({ sync_status: 'error' })
          .eq('api_key', apiKey)
      }
    } catch (updateError) {
      console.error('Failed to update sync status:', updateError)
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})