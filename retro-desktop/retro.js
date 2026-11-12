/* Retro Desktop Portfolio progressive enhancement. Original content is moved, never rewritten. */
(() => {
  const ids = ["top","featured-work","skills","about","contact"];
  const sections = ids.map(id => document.getElementById(id));
  if (sections.some(s => !s)) return;
  const nav = document.querySelector(".site-nav");
  const footer = document.querySelector(".site-footer");
  const desktop = document.createElement("main");
  desktop.className="retro-desktop";
  desktop.setAttribute("aria-label","Retro desktop portfolio");
  const icons = [
    ["projects","My Projects","folder"],
    ["about","About Me","computer"],
    ["skills","My Skills","folder"],
    ["contact","Contact Me","mail"]
  ];
  const folderSVG = '<svg viewBox="0 0 64 64" aria-hidden="true"><path fill="#b57d26" d="M6 16h22l6 7h24v29H6z"/><path fill="#ffe188" stroke="#bb8b31" stroke-width="2" d="M6 25h52l-5 29H7z"/><path fill="#fff2a6" d="M10 28h42l-2 6H9z"/></svg>';
  const computerSVG = '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="9" y="6" width="46" height="36" rx="3" fill="#e7e7dd" stroke="#666" stroke-width="2"/><rect x="14" y="11" width="36" height="25" fill="#53b2d6"/><path d="M24 43h16l3 8H21z" fill="#c8c9c4"/><rect x="16" y="52" width="32" height="4" rx="2" fill="#e1e2d9"/></svg>';
  const mailSVG = '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="8" y="16" width="48" height="32" rx="3" fill="#f7f5e4" stroke="#4678ae" stroke-width="2"/><path d="M9 18l23 19 23-19" fill="none" stroke="#4678ae" stroke-width="3"/></svg>';
  const iconSVG = kind => ({folder:folderSVG,computer:computerSVG,mail:mailSVG})[kind];
  desktop.innerHTML = '<div class="retro-sky-cloud" aria-hidden="true"></div><div class="retro-shortcuts" aria-label="Desktop shortcuts"></div><div class="retro-windows"></div><div class="retro-desktop-sign" aria-hidden="true"><strong>Karen Jasmin</strong><small>Web Designer · SEO Specialist</small></div><div class="retro-start-menu" id="retro-start-menu"><div class="retro-start-header">Karen Jasmin</div></div><div class="retro-taskbar"><button class="retro-start" type="button" aria-expanded="false" aria-controls="retro-start-menu">Start</button><div class="retro-task-items"></div><div class="retro-tray" aria-label="Current time"></div></div>';
  const shortcutBox = desktop.querySelector(".retro-shortcuts");
  const windowsBox = desktop.querySelector(".retro-windows");
  const taskItems = desktop.querySelector(".retro-task-items");
  const menu = desktop.querySelector(".retro-start-menu");
  const start = desktop.querySelector(".retro-start");
  const state = new Map();
  let layer = 4;
  function makeWindow(id,title,content) {
    const win=document.createElement("section");
    win.className="retro-window";
    win.id="retro-"+id;
    win.setAttribute("role","dialog");
    win.setAttribute("aria-label",title);
    win.setAttribute("aria-modal","false");
    win.innerHTML='<div class="retro-titlebar"><div class="retro-title"><span class="mini-icon" aria-hidden="true">▣</span><span></span></div><div class="retro-controls"><button type="button" data-action="min" aria-label="Minimize">−</button><button type="button" data-action="max" aria-label="Maximize">□</button><button type="button" data-action="close" aria-label="Close">×</button></div></div><div class="retro-menubar">File &nbsp;&nbsp; View &nbsp;&nbsp; Help</div><div class="retro-content"></div>';
    win.querySelector(".retro-title span:last-child").textContent=title;
    win.querySelector(".retro-content").append(content);
    windowsBox.append(win);
    const task=document.createElement("button");task.type="button";task.textContent=title;task.hidden=true;taskItems.append(task);
    state.set(id,{win,task});
    task.addEventListener("click",()=>{if(win.classList.contains("is-minimized"))open(id);else if(win.classList.contains("is-open"))minimize(id);else open(id)});
    win.addEventListener("pointerdown",()=>focus(id));
    win.querySelector("[data-action=min]").addEventListener("click",()=>minimize(id));
    win.querySelector("[data-action=max]").addEventListener("click",()=>{win.classList.toggle("is-maximized");focus(id)});
    win.querySelector("[data-action=close]").addEventListener("click",()=>close(id));
  }
  function focus(id){const v=state.get(id);v.win.style.zIndex=++layer;state.forEach(x=>x.task.classList.remove("is-active"));v.task.classList.add("is-active")}
  function open(id){const v=state.get(id);if(!v)return;v.win.classList.add("is-open");v.win.classList.remove("is-minimized");v.task.hidden=false;focus(id);menu.classList.remove("is-open");start.setAttribute("aria-expanded","false")}
  function minimize(id){const v=state.get(id);v.win.classList.add("is-minimized");v.task.classList.remove("is-active")}
  function close(id){const v=state.get(id);v.win.classList.remove("is-open","is-minimized","is-maximized");v.task.hidden=true;v.task.classList.remove("is-active")}
  // Keep each original section and its text exactly as authored in index.html.
  const welcome=document.createElement("div");welcome.append(sections[0]);
  const projects=document.createElement("div");projects.append(sections[1]);
  const skills=document.createElement("div");skills.append(sections[2]);
  const about=document.createElement("div");about.className="retro-profile";
  const tabs=document.createElement("div");tabs.className="retro-profile-tabs";tabs.innerHTML="<span>General</span>";
  const info=document.createElement("div");info.className="retro-profile-head";
  info.innerHTML=computerSVG+'<div><strong>Karen Jasmin</strong><small>Web Designer · WordPress · SEO</small></div>';
  about.append(tabs,info,sections[3]);
  const contact=document.createElement("div");contact.append(sections[4]);if(footer)contact.append(footer);
  makeWindow("welcome","Welcome",welcome);
  makeWindow("projects","My Projects",projects);
  makeWindow("skills","My Skills",skills);
  makeWindow("about","System Profile",about);
  makeWindow("contact","Contact Me",contact);
  icons.forEach(([id,label,kind])=>{
    const b=document.createElement("button");b.className="retro-shortcut";b.type="button";
    b.innerHTML=iconSVG(kind)+"<span></span>";b.querySelector("span").textContent=label;
    b.addEventListener("click",()=>open(id));shortcutBox.append(b);
    const m=document.createElement("button");m.type="button";m.textContent=label;
    m.addEventListener("click",()=>open(id));menu.append(m);
  });
  const welcomeButton=document.createElement("button");welcomeButton.type="button";welcomeButton.textContent="Welcome";welcomeButton.addEventListener("click",()=>open("welcome"));menu.append(welcomeButton);
  start.addEventListener("click",()=>{const shown=menu.classList.toggle("is-open");start.setAttribute("aria-expanded",String(shown))});
  desktop.addEventListener("click",e=>{if(!menu.contains(e.target)&&e.target!==start){menu.classList.remove("is-open");start.setAttribute("aria-expanded","false")}});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){menu.classList.remove("is-open");start.setAttribute("aria-expanded","false")}});
  function clock(){desktop.querySelector(".retro-tray").textContent=new Intl.DateTimeFormat(undefined,{hour:"numeric",minute:"2-digit"}).format(new Date())}
  clock();setInterval(clock,30000);
  document.body.prepend(desktop);
  document.body.classList.add("retro-ready");
  if(nav)nav.setAttribute("hidden","");
  document.querySelectorAll('.retro-content a[href^="#"]').forEach(a=>a.addEventListener("click",e=>{
    const hash=a.getAttribute("href"); const destination={"#featured-work":"projects","#skills":"skills","#about":"about","#contact":"contact"}[hash];
    if(destination){e.preventDefault();open(destination)}else if(hash==="#"){e.preventDefault();open("welcome")}
  }));
  const hash=location.hash;
  const initial={"#featured-work":"projects","#skills":"skills","#about":"about","#contact":"contact"}[hash]||"welcome";
  open(initial);
})();