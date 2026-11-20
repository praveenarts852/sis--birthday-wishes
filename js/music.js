(() => {
  const cfg=window.BIRTHDAY_CONFIG,audio=document.getElementById("birthdayAudio"),play=document.getElementById("playPause");
  const visual=document.getElementById("visualizer"),seek=document.getElementById("seekBar");
  document.getElementById("songName").textContent=cfg.songTitle;
  document.getElementById("songArtist").textContent=cfg.songArtist;
  const fmt=s=>{if(!Number.isFinite(s))return "0:00";return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;};
  play.addEventListener("click",async()=>{
    if(audio.paused){try{await audio.play();}catch(e){document.getElementById("audioStatus").textContent="Please check that favourite-song.mp3 is in assets/audio.";}}
    else audio.pause();
  });
  audio.addEventListener("play",()=>{play.textContent="Ⅱ";play.setAttribute("aria-label","Pause song");visual.classList.add("playing");document.getElementById("audioStatus").textContent="Playing a little song for you ♡";});
  audio.addEventListener("pause",()=>{play.textContent="▶";play.setAttribute("aria-label","Play song");visual.classList.remove("playing");});
  audio.addEventListener("loadedmetadata",()=>document.getElementById("duration").textContent=fmt(audio.duration));
  audio.addEventListener("timeupdate",()=>{document.getElementById("currentTime").textContent=fmt(audio.currentTime);seek.value=audio.duration?(audio.currentTime/audio.duration)*100:0;});
  seek.addEventListener("input",()=>{if(audio.duration)audio.currentTime=(Number(seek.value)/100)*audio.duration;});
  audio.addEventListener("error",()=>document.getElementById("audioStatus").textContent="Add your MP3 file as assets/audio/favourite-song.mp3.");
  document.getElementById("toSong").addEventListener("click",()=>window.unlockAndGo("songPage"));
})();
