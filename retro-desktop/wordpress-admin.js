/* WordPress backend-style portfolio simulator, front-end only.
   Existing portfolio sections are reused directly, without rewriting copy. */
(() => {
  const rootSections = ["top", "featured-work", "skills", "about", "contact"].map(id => document.getElementById(id));
  if (rootSections.some(section => !section)) return;
  const [hero, work, skills, about, contact] = rootSections;
  const footer = document.querySelector("body > .site-footer");
  const nav = document.querySelector("body > .site-nav");
  const app = document.createElement("div");
  app.id = "wp-sim";
  const symbols = {
    dashboard: '<rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/>',
    pages: '<path d="M5 3h10l4 4v14H5z"/><path d="M15 3v5h4M8 12h8M8 16h8"/>',
    posts: '<path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5"/>',
    plugins: '<path d="M8 3v5M16 3v5M6 8h12v5a6 6 0 0 1-12 0zM12 19v3"/>',
    profile: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    contact: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="m4 7 8 6 8-6"/>'
  };
  const icon = key => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + symbols[key] + '</svg>';
  const entries = [
    ["dashboard","Dashboard","dashboard"],
    ["pages","Pages","pages"],
    ["posts","Posts","posts"],
    ["plugins","Plugins","plugins"],
    ["profile","Users → Profile","profile"],
    ["contact","Contact","contact"]
  ];
  app.innerHTML = '<div class="wp-topbar"><div class="wp-top-left"><button class="wp-mobile-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false">☰</button><span class="wp-wp-logo" aria-hidden="true">W</span><span class="wp-site-name">Karen Jasmin · Portfolio</span><span class="wp-hide-mobile">+ New</span></div><div class="wp-top-right"><span class="wp-hide-mobile">Front-end portfolio simulation</span><span>Howdy, Visitor</span></div></div><div class="wp-shell"><nav class="wp-sidebar" aria-label="Portfolio admin navigation"></nav><main class="wp-main" tabindex="-1"><div class="wp-screen-meta"><span>Screen Options</span><span>Help</span></div><div id="wp-view-dashboard" class="wp-view wp-showcase"></div><div id="wp-view-pages" class="wp-view"></div><div id="wp-view-posts" class="wp-view"></div><div id="wp-view-plugins" class="wp-view wp-showcase"></div><div id="wp-view-profile" class="wp-view wp-showcase"></div><div id="wp-view-contact" class="wp-view wp-showcase"></div><div class="wp-bottom-bar"><span>Portfolio simulator · Front-end demo, not a real WordPress administration panel</span><span><a href="https://karenjasmin.github.io/" target="_blank" rel="noopener noreferrer">Original live portfolio ↗</a></span></div></main></div>';
  const sidebar = app.querySelector(".wp-sidebar");
  const main = app.querySelector(".wp-main");
  const view = key => app.querySelector("#wp-view-" + key);
  let active = "dashboard";
  let filter = "all";
  const itemButtons = new Map();
  entries.forEach(([key, label, type], idx) => {
    if (idx === 4) {const divider=document.createElement("div");divider.className="wp-side-divider";sidebar.append(divider);}
    const button = document.createElement("button");
    button.type = "button";
    button.className = "wp-side-link";
    button.innerHTML = icon(type) + "<span></span>";
    button.querySelector("span").textContent = label;
    button.addEventListener("click", () => show(key));
    sidebar.append(button);
    itemButtons.set(key, button);
  });

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function heading(parent, title, description) {
    parent.append(el("h1","wp-heading",title));
    if (description) parent.append(el("p","wp-subtitle",description));
  }
  function panel(title, body) {
    const article = el("section","wp-panel");
    article.append(el("h2","wp-panel-title",title));
    const inside = el("div","wp-panel-body");
    if (typeof body === "string") inside.textContent = body;
    else inside.append(body);
    article.append(inside);
    return article;
  }
  function navButton(title,target) {
    const b = el("button","",title);
    b.type="button";b.addEventListener("click",()=>show(target));
    return b;
  }

  // Dashboard: exact current welcome/hero text and button, relocated unchanged.
  const dash=view("dashboard");
  heading(dash,"Dashboard");
  const dashGrid=el("div","wp-dash-columns");
  const dashWelcome=el("div","wp-dash-welcome");
  dashWelcome.append(panel("Welcome to your portfolio",hero));
  dashGrid.append(dashWelcome);
  const sidePanels=el("div","");
  const quick=el("div","wp-actions-list");
  quick.append(navButton("View website projects","pages"),navButton("Browse SEO projects","posts"),navButton("Explore tools and skills","plugins"),navButton("Read my profile","profile"),navButton("Get in touch","contact"));
  sidePanels.append(panel("Quick Access",quick));
  const overview=el("div","");
  const overviewText=el("p","wp-about-note","Browse my WordPress, Elementor, website management and SEO work using the menu on the left.");
  overview.append(overviewText);
  sidePanels.append(panel("Portfolio Navigation",overview));
  dashGrid.append(sidePanels);
  dash.append(dashGrid);

  // Pages and Posts share the original Selected Work nodes, without cloning or rewriting text.
  const workTitle=work.querySelector("h2");
  const workIntro=work.querySelector(".featured-intro");
  const originalCards=Array.from(work.querySelectorAll(".featured-card"));
  const listView=view("pages");
  heading(listView,"Pages", "Website and SEO portfolio projects");
  const entryHeader=el("h2","wp-entry-intro-title");
  if(workTitle) entryHeader.append(workTitle);
  const entryIntro=el("div","wp-original-intro");
  if(workIntro) entryIntro.append(workIntro);
  listView.append(entryHeader,entryIntro);
  const controls=el("div","wp-table-controls");
  const tabs=el("div","wp-tab-links");
  const tabSpecs=[["all","All"],["web","Website projects"],["seo","SEO projects"]];
  const tabButtons=new Map();
  tabSpecs.forEach(([key,label])=>{
    const b=el("button","",label);b.type="button";
    b.addEventListener("click",()=>{filter=key;setFilter();});
    tabs.append(b);tabButtons.set(key,b);
  });
  controls.append(tabs);
  const count=el("span","wp-subtitle");
  count.style.margin="0";controls.append(count);
  listView.append(controls);
  const tableHead=el("div","wp-table-head");
  ["Title","Category","Status"].forEach(t=>tableHead.append(el("span","",t)));
  listView.append(tableHead);
  const table=el("div","wp-list-table");
  table.setAttribute("role","list");
  const rows=[];
  originalCards.forEach((card,index)=>{
    const seo=(index===1 || /SEO|optimization/i.test(card.querySelector(".featured-index")?.textContent||""));
    const row=el("article","wp-list-row");
    row.setAttribute("role","listitem");
    row.dataset.category=seo?"seo":"web";
    const content=el("div","wp-entry-wrap");
    const img=card.querySelector(".featured-real-preview img");
    if(img){const preview=img.cloneNode(true);preview.className="wp-entry-img";content.append(preview);}
    const data=el("div","");
    const cardTitle=card.querySelector("h3");
    const title=el("h3","wp-entry-title");
    if(cardTitle) title.append(cardTitle);
    data.append(title);
    const body=card.querySelector(".featured-card-body > p:not(.featured-index)");
    if(body){const desc=el("div","wp-entry-desc");desc.append(body);data.append(desc);}
    const note=card.querySelector(".featured-link-note");
    if(note){const noteContainer=el("div","wp-entry-note");noteContainer.append(note);data.append(noteContainer);}
    const actions=el("div","wp-entry-actions");
    const originalLink=card.querySelector("a.card-stretched-link");
    if(originalLink){
      const link=el("a","","View Project");
      link.href=originalLink.getAttribute("href");
      if(originalLink.target)link.target=originalLink.target;
      if(originalLink.rel)link.rel=originalLink.rel;
      actions.append(link);
    }
    data.append(actions);content.append(data);row.append(content);
    const category=card.querySelector(".featured-index");
    row.append(el("div","wp-entry-type",category?category.textContent:"Website project"));
    const status=el("div","wp-entry-status");
    status.innerHTML="<span>Published</span>";row.append(status);
    table.append(row);rows.push(row);
  });
  listView.append(table);
  function setFilter(){
    let shown=0;
    rows.forEach(row=>{const visible=filter==="all" || row.dataset.category===filter;row.hidden=!visible;row.style.display=visible?"grid":"none";if(visible)shown++;});
    count.textContent=shown+" "+(shown===1?"item":"items");
    tabButtons.forEach((b,key)=>b.setAttribute("aria-pressed",String(key===filter)));
  }
  setFilter();
  // The Posts navigation shows SEO only; the physical nodes remain in Pages table.
  const postsView=view("posts");
  heading(postsView,"Posts","SEO projects and content optimization");
  const postsGuide=el("p","wp-original-intro","SEO projects are shown in the Pages list using the SEO projects filter.");
  const postsOpen=el("button","wp-blue-button","View SEO Projects");
  postsOpen.type="button";postsOpen.addEventListener("click",()=>show("pages","seo"));
  postsView.append(postsGuide,postsOpen);

  const pluginsView=view("plugins");
  heading(pluginsView,"Plugins","Skills and tools");
  pluginsView.append(panel("How Can I Help",skills));

  const profileView=view("profile");
  heading(profileView,"Profile","Personal Options");
  const profileCard=el("div","wp-profile-table");
  const profileTop=el("div","wp-profile-top");
  profileTop.innerHTML='<div class="wp-avatar" aria-hidden="true">K</div><div><div class="wp-profile-name">Karen Jasmin</div><div class="wp-profile-job">Web Designer · WordPress · SEO Specialist</div></div>';
  profileCard.append(profileTop,about);
  profileView.append(profileCard);

  const contactView=view("contact");
  heading(contactView,"Contact");
  contactView.append(panel("Let's Work Together",contact));
  if(footer)contactView.append(footer);

  function show(key, chosenFilter){
    if(key==="posts"){filter="seo";setFilter();key="pages";}
    if(key==="pages" && chosenFilter){filter=chosenFilter;setFilter();}
    if(key!=="pages" && key!=="dashboard" && !view(key))return;
    active=key;
    app.querySelectorAll(".wp-view").forEach(v=>v.classList.toggle("is-current",v.id==="wp-view-"+key));
    itemButtons.forEach((b,k)=>{if(k===key)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current")});
    main.scrollTop=0;
    sidebar.classList.remove("is-expanded");
    app.querySelector(".wp-mobile-toggle").setAttribute("aria-expanded","false");
    history.replaceState(null,"",key==="dashboard"?location.pathname:"#"+key);
  }
  app.querySelector(".wp-mobile-toggle").addEventListener("click",()=>{
    const expanded=sidebar.classList.toggle("is-expanded");
    app.querySelector(".wp-mobile-toggle").setAttribute("aria-expanded",String(expanded));
  });
  // Adapt original same-page portfolio actions to this simulator's navigation.
  app.querySelectorAll('a[href^="#"]').forEach(link=>{
    const href=link.getAttribute("href");
    const target={"#featured-work":"pages","#skills":"plugins","#about":"profile","#contact":"contact","#":"dashboard"}[href];
    if(target)link.addEventListener("click",e=>{e.preventDefault();show(target)});
  });
  if(nav)nav.hidden=true;
  document.body.prepend(app);
  document.body.classList.add("wp-sim-ready");
  show(({"#featured-work":"pages","#skills":"plugins","#about":"profile","#contact":"contact","#pages":"pages","#plugins":"plugins","#profile":"profile","#posts":"posts"}[location.hash]||"dashboard"));
})();