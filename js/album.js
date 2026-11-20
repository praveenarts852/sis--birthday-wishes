(() => {
  const cfg = window.BIRTHDAY_CONFIG;
  const grid = document.getElementById("albumGrid");
  const lightbox = document.getElementById("lightbox");
  const image = document.getElementById("lightboxImage");
  const caption = document.getElementById("lightboxCaption");
  let active = 0;
  cfg.memories.forEach(([src,text,date],i) => {
    const card = document.createElement("button");
    card.type = "button"; card.className = "memory-card"; card.setAttribute("aria-label",`Open memory ${i+1}: ${text}`);
    const img = document.createElement("img"); img.src = src; img.alt = text; img.loading = "lazy";
    img.onerror = () => { img.src = `https://placehold.co/600x700/f4dfe6/8c6070?text=Memory+${String(i+1).padStart(2,"0")}`; };
    const cap = document.createElement("p"); cap.className="caption"; cap.textContent=text;
    const d = document.createElement("p"); d.className="date"; d.textContent=date;
    card.append(img,cap,d); card.addEventListener("click",()=>open(i)); grid.append(card);
  });
  function open(i){active=i;render();lightbox.hidden=false;document.body.style.overflow="hidden";document.getElementById("closeLightbox").focus();}
  function close(){lightbox.hidden=true;document.body.style.overflow="";}
  function render(){const item=cfg.memories[active];image.src=item[0];image.alt=item[1];caption.textContent=item[1];}
  function move(n){active=(active+n+cfg.memories.length)%cfg.memories.length;render();}
  document.getElementById("closeLightbox").addEventListener("click",close);
  document.getElementById("prevPhoto").addEventListener("click",()=>move(-1));
  document.getElementById("nextPhoto").addEventListener("click",()=>move(1));
  lightbox.addEventListener("click",e=>{if(e.target===lightbox)close();});
  document.addEventListener("keydown",e=>{if(lightbox.hidden)return;if(e.key==="Escape")close();if(e.key==="ArrowLeft")move(-1);if(e.key==="ArrowRight")move(1);});
})();
