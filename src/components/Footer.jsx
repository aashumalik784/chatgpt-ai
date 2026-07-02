export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <img src="/logo.svg" alt="Logo" width="20" height="20" />
        <span>Wasmer GPT © {new Date().getFullYear()}</span>
      </div>
      <div className="footer-links">
        <a href="https://github.com/aashumalik784" target="_blank">GitHub</a>
        <a href="/LICENSE" target="_blank">MIT License</a>
        <a href="https://wasmer.io" target="_blank">Powered by Wasmer</a>
      </div>
    </footer>
  )
}
