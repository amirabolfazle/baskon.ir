// app.js
import db from './db.js';

const baskonList = document.getElementById("baskon-list");
const baskonDetail = document.getElementById("baskon-detail");
const baskonContent = document.getElementById("baskon-content");
console.log("db", db);
// Function to slugify the title
function slugify(text) {
  return text.toLowerCase().replace(/[\s]+/g, "-").replace(/[^\w-]/g, "");
}

// Show the detail of a selected baskon
function showBaskonDetail(item) {
  baskonList.style.display = "none"; // Hide the list
  baskonDetail.style.display = "block"; // Show the detail view
  baskonContent.innerHTML = `
    <h2>${item.emoji} ${item.title}</h2>
    <p>${item.description}</p>
  `;

  // Reload Giscus for the new view
  loadGiscus();
}

// Function to load Giscus comments dynamically
function loadGiscus() {
  const giscus = document.querySelector("script[src*='giscus.app']");
  if (giscus) giscus.remove(); // Remove previous Giscus script if any

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

  // Clear the container and append the new script
  giscusContainer.innerHTML = "";
  giscusContainer.appendChild(newScript);
}

// Load all baskons into the list
function loadBaskons() {
  baskonList.innerHTML = ""; // Clear any existing baskon list
  db.forEach((item) => {
    const slug = slugify(item.title); // Create a slug for each item
    const card = document.createElement("div");
    card.className = "baskon-card";
    card.innerHTML = `
      <div class="emoji">${item.emoji}</div>
      <div class="title">${item.title}</div>
    `;
    card.addEventListener("click", () => {
      location.hash = slug; // Update the URL hash
      showBaskonDetail(item); // Show the detail of the clicked baskon
    });
    baskonList.appendChild(card);
  });

  handleHashChange(); // Check if there's a hash in the URL and load corresponding detail
}

// Handle hash changes to show appropriate baskon detail
function handleHashChange() {
  const hash = window.location.hash.slice(1); // Get the hash (slug)
  if (hash) {
    const baskon = db.find((item) => slugify(item.title) === hash);
    if (baskon) {
      showBaskonDetail(baskon); // Show detail if a matching slug is found
    }
  } else {
    // If no hash → show the baskon list
    baskonList.style.display = "grid";
    baskonDetail.style.display = "none";
  }
}

// Event listener for hash changes
window.addEventListener("hashchange", handleHashChange);
// Event listener for the DOM content loaded
window.addEventListener("DOMContentLoaded", loadBaskons);
