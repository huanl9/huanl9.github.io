(() => {
  const root = document.documentElement;
  const btn = document.getElementById("themeBtn");
  const icon = document.getElementById("themeIcon");
  const year = document.getElementById("year");

  if (year) year.textContent = new Date().getFullYear();

  function systemPrefersLight() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  }

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (icon) icon.textContent = theme === "light" ? "☀️" : "🌙";
    try { localStorage.setItem("theme", theme); } catch {}
  }

  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem("theme"); } catch {}
    if (saved === "light" || saved === "dark") return setTheme(saved);
    setTheme(systemPrefersLight() ? "light" : "dark");
  }
  function getSiteUrlForQr() {
  return "https://huanl9.github.io/";
  }
  initTheme();

  if (btn) {
    btn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || "dark";
      setTheme(current === "dark" ? "light" : "dark");
    });
  }
})();
