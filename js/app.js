import { navigate } from "./router.js";

function initSidebarEvents() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const toggle = document.getElementById("sidebarToggle");

  const close = () => {
    const sb = document.getElementById("sidebar");
    const ol = document.getElementById("sidebarOverlay");
    if (sb) sb.classList.add("-translate-x-full");
    if (ol) ol.classList.add("hidden");
  };

  if (toggle) {
    toggle.replaceWith(toggle.cloneNode(true)); 
    document.getElementById("sidebarToggle").addEventListener("click", () => {
      const sb = document.getElementById("sidebar");
      const ol = document.getElementById("sidebarOverlay");
      if (sb) sb.classList.remove("-translate-x-full");
      if (ol) ol.classList.remove("hidden");
    });
  }

  if (overlay) {
    overlay.addEventListener("click", close);
  }

  return { close };
}

function initNavigation() {
  document.addEventListener("click", async (event) => {
    
    const logoutBtn = event.target.closest("#logoutBtn");
    if (logoutBtn) {
      event.preventDefault();
      
      localStorage.removeItem("userRole");
      localStorage.removeItem("userEmail");
      
      navigate("login"); 
      return;
    }

    const button = event.target.closest("[data-page]");
    if (button) {
      event.preventDefault();
      const targetPage = button.dataset.page;
      
      try {
        await navigate(targetPage);
        if (window.innerWidth < 1024) {
          initSidebarEvents().close();
        }
      } catch (error) {
        console.error("Erreur lors de la navigation :", error);
      }
    }
  });
}

function startApp() {
  initNavigation();
  
  const roleActuel = localStorage.getItem("userRole");

  if (roleActuel) {
    if (roleActuel === "fournisseur") {
      navigate("produits"); 
    } else {
      navigate("categories"); 
    }
  } else {
    navigate("login"); 
  }
}

startApp();