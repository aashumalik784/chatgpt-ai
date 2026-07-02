export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <img src="/logo.svg" alt="Logo" width="20" height="20" />
        <span>Aashu Malik GPT © {new Date().getFullYear()}</span> {/* ✅ Yahan change kiya */}
      </div>
      <div className="footer-links">
        <a href="https://github.com/aashumalik784" target="_blank">GitHub</a>
        <a href="/LICENSE" target="_blank">MIT License</a>
        <a href="https://groq.com" target="_blank">Powered by Groq</a> {/* ✅ Wasmer hata ke Groq kar diya */}
      </div>
    </footer>
  )
}
