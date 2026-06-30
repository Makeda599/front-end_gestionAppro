const NAV_LINKS = [
  { page: "categories", label: "Catégories", icon: "fa-tags" },
  { page: "produits", label: "Produits", icon: "fa-box-open" }, 
  { page: "fournisseur", label: "Fournisseurs", icon: "fa-users" },
];
export function renderSidebar() {
  const roleActuel = localStorage.getItem("userRole");

  let links = [
    { page: "categories", label: "Catégories", icon: "fa-tags" },
    { page: "produits", label: "Produits", icon: "fa-box-open" }, 
    { page: "fournisseur", label: "Fournisseurs", icon: "fa-users" },
  ];

  if (roleActuel === "fournisseur") {
    links = [    { page: "produits", label: "Produits", icon: "fa-box-open" },
      
    ];
  }

  const items = links.map((link) => `
    <button class="nav-link flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950" data-page="${link.page}">
      <i class="fa-solid ${link.icon} w-5 text-center"></i>
      <span>${link.label}</span>
    </button>
  `).join("");

  return `
    <aside id="sidebar" class="fixed inset-y-0 left-0 z-40 w-72 -translate-x-full border-r border-slate-200 bg-white p-6 transition-transform duration-300 lg:translate-x-0">
      <div class="flex h-full flex-col justify-between">
        <div>
          <div class="flex items-center gap-3 px-2 py-4">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <i class="fa-solid fa-layer-group text-lg"></i>
            </div>
            <span class="text-lg font-black tracking-tight text-slate-950">Gestion Appro</span>
          </div>
          
          <nav class="mt-8 flex flex-col gap-1">
            ${items}
          </nav>
        </div>

        <button id="logoutBtn" class="flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50">
          <i class="fa-solid fa-right-from-bracket w-5 text-center"></i>
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
    <div id="sidebarOverlay" class="fixed inset-0 z-30 bg-slate-950/20 opacity-0 transition-opacity duration-300 lg:hidden hidden"></div>
  `;
}

export function bindSidebarEvents() {
  document.querySelectorAll(".nav-link").forEach(btn => {
    btn.addEventListener("click", () => {
      const page = btn.dataset.page;
      if (page) {
        import("../router.js").then(router => router.navigate(page));
      }
    });
  });

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (event) => {
      event.preventDefault();

      localStorage.removeItem("userRole");
      localStorage.removeItem("userEmail");

     
      window.location.reload();
    });
  }
}