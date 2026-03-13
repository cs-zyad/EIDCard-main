const templates = (window.APP_CONFIG && window.APP_CONFIG.cardTemplates) || ["", "", ""];
const logoPathCard = (window.APP_CONFIG && window.APP_CONFIG.logoPath) || "assets/logo.png";
const grid = document.getElementById("templateGrid");
const nameInput = document.getElementById("nameInput");
const preview = document.getElementById("cardPreview");
const previewName = document.getElementById("previewName");
const downloadCardBtn = document.getElementById("downloadCardBtn");
const canvasCard = document.getElementById("cardCanvas");
let selectedIndex = 0;

function renderTemplates() {
  grid.innerHTML = "";
  templates.forEach((src, index) => {
    const btn = document.createElement("button");
    btn.className = "template-tile" + (index === 0 ? " selected" : "");
    btn.type = "button";

    const frame = document.createElement("div");
    frame.className = "template-visual";
    if (src) {
      frame.style.backgroundImage = `url('${src}')`;
      frame.classList.add("has-image");
    }

    const label = document.createElement("span");
    label.textContent = `القالب ${index + 1}`;

    btn.appendChild(frame);
    btn.appendChild(label);

    btn.addEventListener("click", () => {
      document.querySelectorAll(".template-tile").forEach(t => t.classList.remove("selected"));
      btn.classList.add("selected");
      selectedIndex = index;
      updatePreview();
    });

    grid.appendChild(btn);
  });
}

function updatePreview() {
  const src = templates[selectedIndex];
  preview.style.backgroundImage = src ? `url('${src}')` : "none";
  preview.classList.toggle("with-image", !!src);
  previewName.textContent = nameInput.value.trim() || "اسمك هنا";
}

nameInput?.addEventListener("input", updatePreview);

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function downloadCard() {
  const w = 1080;
  const h = 1350;
  canvasCard.width = w;
  canvasCard.height = h;
  const ctx = canvasCard.getContext("2d");

  // Premium Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);

  const src = templates[selectedIndex];
  if (src) {
    try {
      const img = await loadImage(src);
      ctx.drawImage(img, 0, 0, w, h);
    } catch (e) {}
  } else {
    // Default gradient if no template
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(1, "#f9f6ef");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  // Draw a premium double border
  ctx.strokeStyle = "#dca83b";
  ctx.lineWidth = 12;
  ctx.strokeRect(40, 40, w - 80, h - 80);
  
  ctx.strokeStyle = "#f1c96a";
  ctx.lineWidth = 4;
  ctx.strokeRect(60, 60, w - 120, h - 120);

  try {
    const logo = await loadImage(logoPathCard);
    // Draw logo with shadow
    ctx.shadowColor = "rgba(0,0,0,0.1)";
    ctx.shadowBlur = 20;
    ctx.drawImage(logo, w - 250, 80, 160, 160);
    ctx.shadowBlur = 0;
  } catch (e) {}

  // Wait for font to be ready (ensure Tajawal is used)
  await document.fonts.load('bold 64px Tajawal');

  ctx.fillStyle = "#1a2245";
  ctx.textAlign = "center";
  ctx.font = "bold 64px Tajawal, sans-serif";
  ctx.fillText("عيدكم فرح ونجاح", w / 2, h - 240);

  ctx.fillStyle = "#a67c27";
  ctx.font = "900 86px Tajawal, sans-serif";
  const finalName = nameInput.value.trim() || "اسمك هنا";
  ctx.fillText(finalName, w / 2, h - 130);

  const link = document.createElement("a");
  link.href = canvasCard.toDataURL("image/png", 1.0);
  link.download = `eid-card-${finalName}.png`;
  link.click();
}

const downloadButtons = document.querySelectorAll(".download-btn");

downloadButtons.forEach(btn => {
  btn?.addEventListener("click", downloadCard);
});
renderTemplates();
updatePreview();