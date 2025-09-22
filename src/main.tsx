import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { commonWord } from "./assets/CommonWord.tsx";
import { images } from "./assets/Images/Images.tsx";

// Initialize theme before React renders (default to dark if not set)
(() => {
  try {
    const saved = localStorage.getItem("theme");
    const initial = saved === "light" || saved === "dark" ? saved : "dark";
    document.documentElement.setAttribute("data-theme", initial);
  } catch {}
})();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

const titleEl = document.getElementById("title") as HTMLElement | null;
if (titleEl) {
  titleEl.textContent = commonWord.title;
}

const link = document.getElementById("favicon") as HTMLLinkElement | null;
if (link) {
  link.href = images.favicon;
}

const meta = document.querySelector(
  'meta[name="theme-color"]'
) as HTMLMetaElement | null;
if (meta) {
  meta.content = "var(--primary)";
}
