
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.6";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Request received:', req.method, req.url);
    
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

    // Create Supabase client with authorization header
    const authHeader = req.headers.get('Authorization');
    console.log('Auth header present:', !!authHeader);
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {}
      }
    });

    // Verify user authentication
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      console.log('Authentication failed:', error?.message);
      return new Response(JSON.stringify({
        error: "Unauthorized",
        detail: error?.message || "No user found"
      }), {
        status: 401,
        headers: {
          ...corsHeaders,
          'content-type': 'application/json'
        }
      });
    }

    console.log('User authenticated:', user.id);

    // Get content type and prepare headers for N8N
    const contentType = req.headers.get('content-type') || 'application/octet-stream';
    
    // Forward the request to N8N with user context
    const n8nHeaders: Record<string, string> = {
      'content-type': contentType,
      'x-user-id': user.id,
    };

    // Include authorization if present
    if (authHeader) {
      n8nHeaders['authorization'] = authHeader;
    }

    console.log('Forwarding to N8N with headers:', Object.keys(n8nHeaders));

    const result = await fetch("https://n8n.sof.to/webhook/0f7663d6-f5a2-4471-9136-18f2c6303fc8", {
      method: "POST",
      headers: n8nHeaders,
      body: req.body
    });

    console.log('N8N response status:', result.status);
    
    const responseBody = await result.text();
    
    return new Response(responseBody, {
      status: result.status,
      headers: {
        ...corsHeaders,
        'content-type': result.headers.get('content-type') || 'text/plain'
      }
    });

  } catch (error) {
    console.error('Error in edge function:', error);
    
    return new Response(JSON.stringify({
      error: "Internal error",
      detail: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'content-type': 'application/json'
      }
    });
  }
});
