import { showToast } from "./components/toast.js";
import { renderSidebar } from "./components/sidebar.js";
import { renderNavbar } from "./components/navbar.js";
import { renderCategoriesPage } from "./pages/categoriesPage.js";
import { renderProduitsPage } from "./pages/produitsPage.js"; 
import { renderFournisseurPage } from "./pages/fournisseurPage.js";
import { renderLoginPage } from "./pages/loginPage.js";

const routes = {
  categories: renderCategoriesPage,
  produits: renderProduitsPage, 
  fournisseur: renderFournisseurPage,
  login: renderLoginPage
};

const titles = {
  categories: "Catégories",
  produits: "Produits", 
  fournisseur: "Fournisseurs",
  login: "Connexion"
};

export async function navigate(page = "login") {
  const app = document.getElementById("app");
  if (!app) {
    console.error("Élément #app introuvable dans le DOM !");
    return;
  }
  
  const roleActuel = localStorage.getItem("userRole"); 
  const estConnecte = roleActuel !== null;

  if (!estConnecte && page !== "login") {
    page = "login";
  }

  if (estConnecte && page === "login") {
    page = "categories";
  }

  if (estConnecte && roleActuel === "fournisseur" && page === "fournisseur") {
    showToast("Accès refusé ! Vous n'avez pas accès aux Fournisseurs.", "error");
    page = "categories"; 
  }

  if (page === "fournisseur" && roleActuel !== "admin") {
    showToast("Accès refusé ! Réservé aux Administrateurs.", "error");
    page = "categories"; 
  }

  const sidebarRoot = document.getElementById("sidebarRoot");
  const navbarRoot = document.getElementById("navbarRoot");

  if (page === "login") {
    if (sidebarRoot) sidebarRoot.innerHTML = "";
    if (navbarRoot) navbarRoot.innerHTML = "";
    document.getElementById("mainContent")?.classList.remove("lg:pl-72");
  } else {
    
    if (sidebarRoot) sidebarRoot.innerHTML = renderSidebar();
    if (navbarRoot && navbarRoot.innerHTML === "") navbarRoot.innerHTML = renderNavbar();
    document.getElementById("mainContent")?.classList.add("lg:pl-72");
  }

  document.querySelectorAll("[data-page]").forEach((button) => {
    const isActive = button.dataset.page === page;
    button.classList.toggle("bg-slate-950", isActive);
    button.classList.toggle("text-white", isActive);
    button.classList.toggle("shadow-lg", isActive);
    button.classList.toggle("shadow-slate-200", isActive);
    button.classList.toggle("text-slate-600", !isActive);
    button.classList.toggle("hover:bg-slate-100", !isActive);
    button.classList.toggle("hover:text-slate-950", !isActive);
  });

  const navbarTitle = document.getElementById("navbarTitle");
  if (navbarTitle) {
    navbarTitle.textContent = titles[page] || titles.categories;
  }

  app.innerHTML = `
    <div class="grid min-h-[50vh] place-items-center rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div>
        <div class="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
        <p class="mt-4 text-sm font-bold text-slate-500">Chargement...</p>
      </div>
    </div>
  `;

  const route = routes[page] || routes.categories;
  try {
    setTimeout(async () => {
      await route();
    }, 50);
  } catch (error) {
    app.innerHTML = `
      <section class="rounded-[2rem] border border-rose-200 bg-white p-8 shadow-sm">
        <h1 class="text-2xl font-black text-slate-950">Erreur de chargement</h1>
        <p class="mt-2 text-sm text-slate-600">${error.message}</p>
      </section>
    `;
    showToast(error.message, "error");
  }
}