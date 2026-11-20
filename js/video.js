(() => {
  const video=document.getElementById("memoryVideo"), placeholder=document.getElementById("videoPlaceholder");
  const complete=document.getElementById("videoComplete"), feedback=document.getElementById("videoFeedback");
  video.addEventListener("loadedmetadata",()=>{placeholder.hidden=true;});
  video.addEventListener("error",()=>{placeholder.hidden=false;feedback.textContent="Add your video file to assets/video/birthday-memory.mp4";});
  video.addEventListener("play",()=>{placeholder.hidden=true;feedback.textContent="Enjoy your little memory ♡";});
  video.addEventListener("ended",()=>{complete.hidden=false;feedback.textContent="A memory, now saved forever.";complete.scrollIntoView({behavior:"smooth",block:"center"});});
  document.getElementById("toVideo").addEventListener("click",()=>window.unlockAndGo("videoPage"));
  document.getElementById("toLetter").addEventListener("click",()=>window.unlockAndGo("letterPage"));
  document.getElementById("toLetter").disabled=false;
})();
