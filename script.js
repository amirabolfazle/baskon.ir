const baskonList = document.getElementById("baskon-list");
const baskonView = document.getElementById("baskon-view");
const baskonDetail = document.getElementById("baskon-detail");
const baskonContent = document.getElementById("baskon-content");

function slugify(text) {
  return text.toLowerCase().replace(/[\s]+/g, "-").replace(/[^\w-]/g, "");
}

function loadBaskons() {
  db.forEach((item) => {
    const slug = slugify(item.title);
    const card = document.createElement("div");
    card.className = "baskon-card";
    card.innerHTML = `
      <div class="emoji">${item.emoji}</div>
      <div class="title">${item.title}</div>
    `;
    card.addEventListener("click", () => {
      history.pushState({}, "", `/baskon/${slug}`);
      showBaskonDetail(item);
    });
    baskonList.appendChild(card);
  });

  // اگر مسیر به‌صورت مستقیم به یک مورد اشاره داره
  const path = window.location.pathname;
  const match = path.match(/\/baskon\/(.+)/);
  if (match) {
    const slug = match[1];
    const baskon = db.find((item) => slugify(item.title) === slug);
    if (baskon) showBaskonDetail(baskon);
  }
}

function showBaskonDetail(item) {
  baskonList.style.display = "none";
  baskonDetail.style.display = "block";
  baskonContent.innerHTML = `
    <h2>${item.emoji} ${item.title}</h2>
    <p>${item.description}</p>
  `;

  // ری‌لود گیسکاس برای مسیر جدید
  const giscus = document.querySelector("script[src*='giscus.app']");
  if (giscus) giscus.remove();
  const giscusContainer = document.getElementById("giscus-container");
  const newScript = document.createElement("script");
  newScript.src = "https://giscus.app/client.js";
  newScript.setAttribute("data-repo", "Mahdi-Hazrati/baskon.ir");
  newScript.setAttribute("data-repo-id", "R_kgDOOhNjpw");
  newScript.setAttribute("data-category", "General");
  newScript.setAttribute("data-category-id", "DIC_kwDOOhNjp84Cpjyv");
  newScript.setAttribute("data-mapping", "pathname");
  newScript.setAttribute("data-strict", "1");
  newScript.setAttribute("data-reactions-enabled", "1");
  newScript.setAttribute("data-emit-metadata", "0");
  newScript.setAttribute("data-input-position", "top");
  newScript.setAttribute("data-theme", "noborder_light");
  newScript.setAttribute("data-lang", "fa");
  newScript.setAttribute("data-loading", "lazy");
  newScript.async = true;
  newScript.crossOrigin = "anonymous";
  giscusContainer.innerHTML = "";
  giscusContainer.appendChild(newScript);
}

window.addEventListener("popstate", () => {
  location.reload(); // بازگشت به لیست یا آیتم قبلی
});

loadBaskons();
