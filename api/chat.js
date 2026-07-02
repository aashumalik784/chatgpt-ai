export default async function handler(req, res) {
  // CORS headers - warna frontend se call nahi hoga
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS request handle karo
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Sirf POST allow karo
  if (req.method!== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // ✅ Vercel me body aise read karte hain, req.json() nahi
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // API Key check
    if (!apiKey) {
      return res.status(500).json({ error: 'API key check karo' });
    }

    // Message check
    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message khali hai' });
    }

    // Gemini API call karo
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    const data = await geminiResponse.json();

    // Gemini se error aaya to
    if (!geminiResponse.ok) {
      console.error('Gemini API Error:', data);
      return res.status(500).json({ 
        error: data.error?.message || 'Gemini API se error aa gaya' 
      });
    }

    // Reply extract karo
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Koi reply nahi mila';

    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: 'Server me kuch gadbad ho gayi' });
  }
}
