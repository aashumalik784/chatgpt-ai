import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import Footer from './components/Footer.jsx'

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Error: API key check karo' }])
    }
    setLoading(false)
  }

  return (
    <>
      <div className="container">
        <header className="header">
          <img src="/logo.svg" alt="Logo" width="32" height="32" />
          <h1>Aashu Malik GPT © 2026</h1> {/* ✅ Yahan change kiya */}
        </header>
        <div className="chat-box">
          {messages.length === 0 && <div className="empty">Namaste! Kya puchna hai?</div>}
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              <ReactMarkdown>{m.text}</ReactMarkdown>
            </div>
          ))}
          {loading && <div className="msg ai">Soch raha hun...</div>}
          <div ref={chatEndRef} />
        </div>
        <div className="input-area">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' &&!e.shiftKey && sendMessage()}
            placeholder="Message bhejo..."
            disabled={loading}
          />
          <button onClick={sendMessage} disabled={loading}>➤</button>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default App
