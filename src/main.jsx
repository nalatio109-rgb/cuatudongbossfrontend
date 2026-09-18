import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
window.addEventListener("error", (e) => {
  if (document.body) {
    document.body.innerHTML = "<div style=\"color:red;padding:20px;font-size:16px;z-index:9999;position:fixed;top:0;left:0;background:white;width:100%;height:100%;overflow:auto;\">" + (e.error ? e.error.stack : e.message) + "</div>";
  }
});  