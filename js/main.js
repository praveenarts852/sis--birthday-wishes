(() => {
  const cfg=window.BIRTHDAY_CONFIG;
  document.getElementById("friendName").textContent=cfg.friendName;
  document.getElementById("birthdayDate").textContent=cfg.birthdayDate;
  document.getElementById("mainPhoto").src=cfg.mainPhoto;
  document.getElementById("questionPrompt").textContent=cfg.question;
  document.getElementById("personalLetter").textContent=cfg.letter;
  document.getElementById("startJourney").addEventListener("click",()=>window.unlockAndGo("question"));
  document.getElementById("answerForm").addEventListener("submit",async e=>{
    e.preventDefault();
    const answer=document.getElementById("secretAnswer").value.trim();
    const feedback=document.getElementById("answerFeedback"),button=document.getElementById("answerButton");
    if(!answer)return;
    if(!cfg.workerUrl || cfg.workerUrl.includes("YOUR-WORKER")){
      feedback.textContent="The secret question is not connected yet. Please configure the Worker URL.";feedback.className="feedback error";return;
    }
    button.disabled=true;button.textContent="Checking your memory...";
    feedback.textContent="";
    try{
      const response=await fetch(`${cfg.workerUrl.replace(/\/$/,"")}/verify`,{
        method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({answer})
      });
      const result=await response.json();
      if(!response.ok || !result.ok)throw new Error(result.message||"That doesn't seem quite right. Try again ♡");
      sessionStorage.setItem("birthday_access_token",result.token);
      feedback.textContent="That's it! Your memories are unlocking... ♡";feedback.className="feedback success";
      document.getElementById("secretAnswer").disabled=true;
      setTimeout(()=>window.unlockAndGo("album"),850);
    }catch(err){
      feedback.textContent=err.message||"Something went wrong. Please try again.";
      feedback.className="feedback error";
    }finally{button.disabled=false;button.innerHTML='Unlock my surprises <span>♡</span>';}
  });
  document.getElementById("openEnvelope").addEventListener("click",()=>{
    const envelope=document.getElementById("openEnvelope");
    if(envelope.classList.contains("open"))return;
    envelope.classList.add("open");
    document.getElementById("envelopeHint").textContent="A little note, from me to you...";
    setTimeout(()=>{
      document.getElementById("letterPaper").hidden=false;
      document.getElementById("letterEnding").hidden=false;
      document.getElementById("letterPaper").scrollIntoView({behavior:"smooth",block:"center"});
    },650);
  });
  const sparkles=document.getElementById("sparkles");
  for(let i=0;i<16;i++){const s=document.createElement("span");s.className="sparkle";s.textContent=["✦","♡","✿"][i%3];s.style.left=`${Math.random()*100}%`;s.style.animationDelay=`${Math.random()*12}s`;s.style.animationDuration=`${9+Math.random()*9}s`;s.style.fontSize=`${10+Math.random()*13}px`;sparkles.append(s);}
})();
