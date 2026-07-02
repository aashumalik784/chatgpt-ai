export default async function handler(req) {
  if (req.method!== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const { message } = await req.json()
  const GEMINI_KEY = process.env.GEMINI_API_KEY

  if (!GEMINI_KEY) {
    return new Response(JSON.stringify({ reply: 'API Key set nahi hai Wasmer Secrets me' }), {
      headers: { 'Content-Type': 'application/json' }, status: 500
    })
  }
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }],
        generationConfig: { maxOutputTokens: 2048 }
      })
    })
    
    const data = await response.json()
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Kuch gadbad hai'
    
    return new Response(JSON.stringify({ reply }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (e) {
    return new Response(JSON.stringify({ reply: 'Error: ' + e.message }), {
      headers: { 'Content-Type': 'application/json' }, status: 500
    })
  }
}
