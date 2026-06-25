import { renderSidebar } from "./components/sidebar.js";
import { renderNavbar } from "./components/navbar.js";
import { navigate } from "./router.js";

function mountLayout() {
  document.getElementById("sidebarRoot").innerHTML = renderSidebar();
  document.getElementById("navbarRoot").innerHTML = renderNavbar();
  
  if (!document.getElementById("sidebarOverlay")) {
    const overlay = document.createElement("div");
    overlay.id = "sidebarOverlay";
    overlay.className = "fixed inset-0 z-30 hidden bg-slate-950/40 backdrop-blur-sm lg:hidden";
    document.body.appendChild(overlay);
  }
}

function initSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const toggle = document.getElementById("sidebarToggle");

  const close = () => {
    if (sidebar) sidebar.classList.add("-translate-x-full");
    if (overlay) overlay.classList.add("hidden");
  };

  if (toggle) {
    toggle.addEventListener("click", () => {
      if (sidebar) sidebar.classList.remove("-translate-x-full");
      if (overlay) overlay.classList.remove("hidden");
    });
  }

  if (overlay) {
    overlay.addEventListener("click", close);
  }

  return { close };
}


function initNavigation(sidebar) {
  document.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-page]");
    
    if (button) {
      event.preventDefault();
      const targetPage = button.dataset.page;
      
      try {
        await navigate(targetPage);
        if (window.innerWidth < 1024) sidebar.close();
      } catch (error) {
        console.error("Erreur lors de la navigation :", error);
      }
    }
  });
}

function startApp() {
  mountLayout();
  const sidebar = initSidebar();
  initNavigation(sidebar);
  
  navigate("produits"); 
}

startApp();