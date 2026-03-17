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
  
  // Add template specific class for positioning
  preview.classList.remove("t1", "t2", "t3");
  if (selectedIndex === 0) preview.classList.add("t1");
  if (selectedIndex === 1) preview.classList.add("t2");
  if (selectedIndex === 2) preview.classList.add("t3");

  const logo = document.getElementById("previewLogo");
  const greeting = document.querySelector(".preview-greeting");
  
  if (src) {
    if (logo) logo.style.display = "none";
    if (greeting) greeting.style.display = "none";
  } else {
    if (logo) logo.style.display = "block";
    if (greeting) greeting.style.display = "block";
  }

  previewName.textContent = nameInput.value.trim() || "الاسم هنا";
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
  const h = 1080; // Templates are square
  canvasCard.width = w;
  canvasCard.height = h;
  const ctx = canvasCard.getContext("2d");

  const src = templates[selectedIndex];
  if (src) {
    try {
      const img = await loadImage(src);
      ctx.drawImage(img, 0, 0, w, h);
    } catch (e) {
      console.error("Error loading template:", e);
    }
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
  }

  // Define positioning and style per template
  let nameX = w / 2;
  let nameY = h - 150;
  let nameColor = "#ffffff";
  let fontSize = "70px";

  if (selectedIndex === 0) { // Blue Template
    nameY = 935;
    nameColor = "#ffffff";
    fontSize = "58px";
    ctx.textAlign = "center";
  } else if (selectedIndex === 1) { // Green/Beige Grid Template
    nameY = 775;
    nameColor = "#1a4d2e"; // Dark green matched from image
    fontSize = "58px";
    ctx.textAlign = "center";
  } else if (selectedIndex === 2) { // Striped Template
    nameY = 930;
    nameColor = "#1a2245"; // Dark navy
    fontSize = "58px";
    ctx.textAlign = "center";
  }

  // Wait for font
  await document.fonts.load(`bold ${fontSize} Tajawal`);

  ctx.fillStyle = nameColor;
  ctx.font = `bold ${fontSize} Tajawal, sans-serif`;
  const finalName = nameInput.value.trim() || "الاسم هنا";
  ctx.fillText(finalName, nameX, nameY);

  const link = document.createElement("a");
  link.href = canvasCard.toDataURL("image/png", 1.0);
  link.download = `عيد-سعيد-${finalName}.png`;
  link.click();
}

const downloadButtons = document.querySelectorAll(".download-btn");

downloadButtons.forEach(btn => {
  btn?.addEventListener("click", downloadCard);
});
renderTemplates();
updatePreview();
