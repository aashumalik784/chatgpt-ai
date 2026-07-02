export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method!== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { message } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) return res.status(500).json({ error: 'GROQ_API_KEY set nahi hai' });
    if (!message) return res.status(400).json({ error: 'Message khali hai' });

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { 
            role: 'system', 
            content: `You are Aashu Malik GPT, a helpful Indian AI assistant created by Aashu Malik. 
            Rules:
            1. Always reply in Hinglish - Hindi + English mix. Natural tone use karo.
            2. Seedha point pe aao, bakwas mat karo. User ne jo pucha wahi batao.
            3. Agar code maange to pura working code do with explanation.
            4. Agar latest info nahi pata after April 2024, to bolo "Bhai ye April 2024 ke baad ka hai, exact nahi pata".
            5. Friendly raho but professional bhi. "Bhai", "yaar" use kar sakte ho.
            6. Kabhi mat bolna ki "Main AI model hoon" - Tum Aashu Malik GPT ho.
            Today is 2 July 2026.` 
          },
          { role: 'user', content: message }
        ],
        temperature: 0.8,
        max_tokens: 2048,
      }),
    });

    const data = await groqResponse.json();
    
    if (!groqResponse.ok) {
      console.error('Groq Error:', data);
      return res.status(500).json({ error: data.error?.message || 'Groq API error' });
    }

    const reply = data.choices?.[0]?.message?.content || 'Reply nahi mila';
    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
}
