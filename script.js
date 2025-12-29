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

  function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function renderQr() {
  const qrWrap = document.getElementById("qrcode");
  const qrUrlText = document.getElementById("qrUrl");
  if (!qrWrap || typeof QRCode === "undefined") return;

  const url = getSiteUrlForQr();
  if (qrUrlText) qrUrlText.textContent = url;

  qrWrap.innerHTML = "";

  // Bigger QR = better scanning (especially with a watermark)
  const size = 220;

  new QRCode(qrWrap, {
    text: url,
    width: size,
    height: size,
    colorDark: "#111111",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H // ✅ important for watermark
  });

  // Wait a tick so the canvas/img exists
  setTimeout(() => {
    const canvas = qrWrap.querySelector("canvas");
    const img = qrWrap.querySelector("img");

    // If the lib produced an <img>, draw it to a canvas so we can watermark it
    let targetCanvas = canvas;
    if (!targetCanvas && img) {
      targetCanvas = document.createElement("canvas");
      targetCanvas.width = size;
      targetCanvas.height = size;
      const ctx = targetCanvas.getContext("2d");
      const tempImg = new Image();
      tempImg.onload = () => {
        ctx.drawImage(tempImg, 0, 0, size, size);
        // replace content with canvas
        qrWrap.innerHTML = "";
        qrWrap.appendChild(targetCanvas);
        applyWatermark(targetCanvas);
      };
      tempImg.src = img.src;
      return;
    }

    if (targetCanvas) applyWatermark(targetCanvas);
  }, 0);

    function applyWatermark(c) {
      const ctx = c.getContext("2d");
      if (!ctx) return;
  
      const w = c.width;
      const h = c.height;
  
      // Watermark box size (keep it modest for scannability)
      const box = Math.round(w * 0.22); // ~26% of width
      const x = Math.round((w - box) / 2);
      const y = Math.round((h - box) / 2);
      const radius = Math.round(box * 0.18);
  
      // White rounded background so text is readable
      ctx.save();
      ctx.globalAlpha = 0.92;
      ctx.fillStyle = "#ffffff";
      roundRect(ctx, x, y, box, box, radius);
      ctx.fill();
      ctx.restore();
  
      // Border (optional, looks clean)
      ctx.save();
      ctx.strokeStyle = "rgba(17,17,17,0.18)";
      ctx.lineWidth = Math.max(2, Math.round(w * 0.008));
      roundRect(ctx, x, y, box, box, radius);
      ctx.stroke();
      ctx.restore();
  
      // “LH” text
      ctx.save();
      ctx.fillStyle = "#111111";
      ctx.globalAlpha = 0.88;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `800 ${Math.round(box * 0.44)}px system-ui, -apple-system, Segoe UI, Roboto, Arial`;
      ctx.fillText("LH", w / 2, h / 2 + 1);
      ctx.restore();
    }
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
