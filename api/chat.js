export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method!== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) return res.status(500).json({ error: 'API key set nahi hai' });
    if (!message) return res.status(400).json({ error: 'Message khali hai' });

    // ✅ FIX: Model ka naam change kiya + v1 use kiya v1beta ki jagah
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-001:generateContent?key=${apiKey}`;
    
    const geminiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }],
      }),
    });

    const data = await geminiResponse.json();
    if (!geminiResponse.ok) {
      console.error('Gemini Error:', data);
      return res.status(500).json({ error: data.error?.message || 'Gemini error' });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Reply nahi mila';
    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
}
