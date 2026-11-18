// Add your 30 photos to the images folder as photo01.jpg ... photo30.jpg.
// Change each caption below to a real memory or a personal message.
const memories = Array.from({ length: 30 }, (_, i) => ({
  src: `images/photo${String(i + 1).padStart(2, "0")}.jpg`,
  title: [
    "A moment worth keeping", "A little happy memory", "That unforgettable day",
    "A smile to remember", "One for the memory book", "Good times, always"
  ][i % 6],
  note: "A small moment, a lovely memory. Add your own story for this photo in script.js."
}));

const gallery = document.getElementById("gallery");
const modal = document.getElementById("photoModal");
let activeIndex = 0;

function renderGallery() {
  gallery.innerHTML = "";
  memories.forEach((memory, index) => {
    const button = document.createElement("button");
    button.className = "memory";
    button.style.setProperty("--tilt", `${(index % 5 - 2) * 1.1}deg`);
    button.setAttribute("aria-label", `Open memory ${index + 1}`);
    button.innerHTML = `
      <img src="${memory.src}" alt="Memory ${index + 1}" loading="lazy"
        onerror="this.style.visibility='hidden';this.parentElement.classList.add('photo-missing')">
      <span class="memory-label">${memory.title}</span>
      <span class="memory-no">MEMORY ${String(index + 1).padStart(2, "0")}</span>`;
    button.addEventListener("click", () => openMemory(index));
    gallery.appendChild(button);
  });
}

function openMemory(index) {
  activeIndex = (index + memories.length) % memories.length;
  const memory = memories[activeIndex];
  document.getElementById("modalImage").src = memory.src;
  document.getElementById("modalTitle").textContent = memory.title;
  document.getElementById("modalText").textContent = memory.note;
  document.getElementById("modalNumber").textContent =
    `MEMORY ${String(activeIndex + 1).padStart(2, "0")} / 30`;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeMemory() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
function moveMemory(step) { openMemory(activeIndex + step); }

document.getElementById("openGift").addEventListener("click", () =>
  document.getElementById("surprises").scrollIntoView({ behavior: "smooth" }));
document.getElementById("navGift").addEventListener("click", () =>
  document.getElementById("surprises").scrollIntoView({ behavior: "smooth" }));
document.getElementById("scrollNote").addEventListener("click", () =>
  document.getElementById("note").scrollIntoView({ behavior: "smooth" }));
document.getElementById("randomMemory").addEventListener("click", () =>
  openMemory(Math.floor(Math.random() * memories.length)));
document.getElementById("closeModal").addEventListener("click", closeMemory);
document.getElementById("prevPhoto").addEventListener("click", () => moveMemory(-1));
document.getElementById("nextPhoto").addEventListener("click", () => moveMemory(1));
modal.addEventListener("click", event => {
  if (event.target.dataset.close) closeMemory();
});
document.addEventListener("keydown", event => {
  if (!modal.classList.contains("open")) return;
  if (event.key === "Escape") closeMemory();
  if (event.key === "ArrowLeft") moveMemory(-1);
  if (event.key === "ArrowRight") moveMemory(1);
});

// Countdown to the birthday in India time.
function updateCountdown() {
  const birthday = new Date("2026-11-20T00:00:00+05:30");
  const now = new Date();
  const diff = birthday - now;
  const target = document.getElementById("countdown");
  if (diff <= 0) {
    target.textContent = "Today is your day — make it beautiful! ♡";
    return;
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  target.textContent = days > 0
    ? `${days} day${days === 1 ? "" : "s"} and ${hours} hours until your birthday ✨`
    : `${hours} hours until your birthday ✨`;
}
renderGallery();
updateCountdown();
