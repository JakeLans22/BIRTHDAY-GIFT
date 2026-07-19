// Floating Background (hearts, petals, sparkles, butterflies)

const bg = document.querySelector(".background-hearts");
const decorSymbols = [
  { symbol: "❤", className: "heart" },
  { symbol: "🌸", className: "petal" },
  { symbol: "✨", className: "sparkle" },
  { symbol: "🦋", className: "butterfly" },
  { symbol: "🍃", className: "leaf" },
];

for (let i = 0; i < 35; i++) {
  const pick = decorSymbols[Math.floor(Math.random() * decorSymbols.length)];
  const heart = document.createElement("div");
  heart.className = "heart " + pick.className;
  heart.innerHTML = pick.symbol;
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = 15 + Math.random() * 25 + "px";
  heart.style.animationDuration = 5 + Math.random() * 8 + "s";
  heart.style.animationDelay = Math.random() * 6 + "s";
  bg.appendChild(heart);
}

// Gift

const gift = document.getElementById("giftBox");
const menu = document.getElementById("menu");

gift.onclick = () => {
  gift.style.transform = "scale(.85) rotate(12deg)";
  gift.style.display = "none";

  confetti({
    particleCount: 250,
    spread: 180,
    origin: { y: 0.6 },
    colors: ["#dceaf5", "#9cc3e0", "#6fa3cc", "#3f6f95", "#fdf9ee"],
  });

  setTimeout(() => {
    menu.style.display = "grid";
    const firstCard = menu.querySelector(".card");
    if (firstCard) firstCard.focus({ preventScroll: true });
  }, 500);
};

// Touch-friendly hover alternative for the menu cards
const cards = document.querySelectorAll(".card");
cards.forEach((card) => {
  card.addEventListener(
    "touchstart",
    () => {
      cards.forEach((c) => {
        if (c !== card) c.classList.remove("touch-active");
      });
      card.classList.add("touch-active");
    },
    { passive: true }
  );
});
