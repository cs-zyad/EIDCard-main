const greetings = [
  "عيدكم أجمل مع نادي ريادة الأعمال",
  "Happy Eid from Entrepreneurship Club",
  "Selamat Hari Raya",
  "Bayramınız Kutlu Olsun",
  "イード・ムバラク ✨",
  "Eid Mubarak ✨"
];

window.addEventListener("load", () => {
  const greetingEl = document.getElementById("greetingLang");
  let idx = 0;

  if (greetingEl) {
    // Keep animating the text indefinitely
    setInterval(() => {
      greetingEl.style.opacity = 0;
      setTimeout(() => {
        idx = (idx + 1) % greetings.length;
        greetingEl.textContent = greetings[idx];
        greetingEl.style.opacity = 1;
      }, 300);
    }, 1200);
  }

  // Handle closing splash screen on click
  const splash = document.getElementById("splash");
  const main = document.getElementById("mainContent");
  
  if (splash) {
    // Change cursor to indicate clickability
    splash.style.cursor = "pointer";
    
    splash.addEventListener("click", () => {
      splash.classList.add("hide");
      if (main) main.classList.remove("hidden");
    });
  }
});