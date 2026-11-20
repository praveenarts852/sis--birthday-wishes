(() => {
  const ids = ["birthday","question","album","videoPage","letterPage","songPage"];
  const labels = ["Birthday wishes","Secret question","Memory album","Special video","Secret letter","Favourite song"];
  let current = 0;
  const progress = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  window.goToPage = (id) => {
    const index = ids.indexOf(id);
    if (index < 0 || index > current + 1) return;
    document.querySelectorAll(".page").forEach(p => { p.classList.remove("active"); p.hidden = true; });
    const target = document.getElementById(id);
    target.hidden = false;
    requestAnimationFrame(() => target.classList.add("active"));
    current = index;
    progress.style.width = `${(index / (ids.length - 1)) * 100}%`;
    progressText.textContent = labels[index];
    window.scrollTo({top:0,behavior:"smooth"});
  };
  window.unlockAndGo = (id) => {
    const index = ids.indexOf(id);
    if (index !== current + 1) return;
    window.goToPage(id);
  };
})();
