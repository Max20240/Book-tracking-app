// Supabase configuration
// Note: In production, these should be loaded from environment variables
// For development, you can set them here or use a build tool
const SUPABASE_URL = window.ENV?.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = window.ENV?.SUPABASE_ANON_KEY || '';

// Check if environment variables are set
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Supabase environment variables are not set. Please configure SUPABASE_URL and SUPABASE_ANON_KEY.');
}

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
