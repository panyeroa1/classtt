
const SUPABASE_URL = 'https://byhmacidmneojdtwxcgz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_HFKWsOjJ1dQJ1kpqAURvVA_Kvo6NIwx';

export interface ClassTranslateEntry {
  session_id: string;
  speaker_name: string;
  speaker_role: string;
  original_text: string;
  translated_text: string;
  timestamp: string;
}

export const saveTranscriptToSupabase = async (entry: ClassTranslateEntry) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/classtranslate`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(entry)
    });

    if (!response.ok) {
      console.warn('Supabase save failed:', await response.text());
    }
  } catch (error) {
    console.error('Error saving to Supabase:', error);
  }
};
