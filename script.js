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

  // ✅ Hardcode your homepage for the QR
  function getSiteUrlForQr() {
    return "https://huanl9.github.io/";
  }

  // --- QR Code ---
  function renderQr() {
    const qrWrap = document.getElementById("qrcode");
    const qrUrlText = document.getElementById("qrUrl");

    // If QR library didn't load, don't crash
    if (!qrWrap || typeof QRCode === "undefined") return;

    const url = getSiteUrlForQr();

    if (qrUrlText) qrUrlText.textContent = url;

    // Clear any existing QR
    qrWrap.innerHTML = "";

    new QRCode(qrWrap, {
      text: url,
      width: 160,
      height: 160,
      colorDark: "#111111",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M
    });
  }

  function downloadQrPng() {
    const qrWrap = document.getElementById("qrcode");
    if (!qrWrap) return;

    const canvas = qrWrap.querySelector("canvas");
    const img = qrWrap.querySelector("img");

    let dataUrl = "";
    if (canvas) dataUrl = canvas.toDataURL("image/png");
    else if (img) dataUrl = img.src;

    if (!dataUrl) return;

    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "LukeHuang-QR.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // Init
  initTheme();

  if (btn) {
    btn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || "dark";
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  // Render QR + hook download button
  renderQr();
  const downloadBtn = document.getElementById("downloadQr");
  if (downloadBtn) downloadBtn.addEventListener("click", downloadQrPng);
})();
