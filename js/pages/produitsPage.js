import { pageHeader } from "../components/pageHeader.js";
import { renderProduitRow, renderProduitCard } from "../components/produitTemplate.js";
import { getProduits, deleteProduit, createProduit } from "../services/produitService.js";
import { uploadProductImage } from "../services/cloudinaryService.js";
import { openModal } from "../components/modal.js";
import { showToast } from "../components/toast.js";
import { getCategories } from "../services/categorieService.js";
import { validateProduitForm } from "../utils/validators.js"; 
import { escapeHtml } from "../utils/html.js";
import { navigate } from "../router.js";

let currentView = "card"; 


export async function renderProduitsPage() {
  const container = document.getElementById("app");
  if (!container) return;
  
  container.innerHTML = `
    ${pageHeader({
      kicker: "Stock",
      title: "Produits",
      subtitle: "Gérez votre catalogue d'articles et leurs images en temps réel.",
      actionLabel: "Nouveau Produit",
      actionId: "addProduitBtn",
      actionIcon: "fa-plus"
    })}

    <div class="mb-6 flex justify-end gap-2 bg-slate-200/60 p-1 rounded-2xl w-fit ml-auto">
      <button id="viewCardBtn" class="flex h-9 w-9 items-center justify-center rounded-xl transition ${currentView === "card" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-950"}">
        <i class="fa-solid fa-border-all"></i>
      </button>
      <button id="viewListBtn" class="flex h-9 w-9 items-center justify-center rounded-xl transition ${currentView === "list" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-950"}">
        <i class="fa-solid fa-list"></i>
      </button>
    </div>

    <div id="produitsContainer">
      <div class="flex items-center justify-center py-12">
        <i class="fa-solid fa-spinner fa-spin text-2xl text-slate-400"></i>
      </div>
    </div>
  `;

  document.getElementById("viewCardBtn")?.addEventListener("click", () => switchView("card"));
  document.getElementById("viewListBtn")?.addEventListener("click", () => switchView("list"));
  
  document.getElementById("addProduitBtn")?.addEventListener("click", () => {
    openProduitForm();
  });

  await loadProduits();
}

async function switchView(view) {
  currentView = view;
  await renderProduitsPage();
}

async function loadProduits() {
  const target = document.getElementById("produitsContainer");
  if (!target) return;

  try {
    const produits = await getProduits();

    if (!produits || produits.length === 0) {
      target.innerHTML = `<p class="text-center py-12 text-slate-500 bg-white rounded-3xl border border-slate-200">Aucun produit trouvé.</p>`;
      return;
    }

    if (currentView === "list") {
      target.innerHTML = `
        <div class="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table class="w-full border-collapse text-left text-sm">
            <thead>
              <tr class="border-b border-slate-200 bg-slate-50 font-bold text-slate-700">
                <th class="p-4 w-20">Image</th>
                <th class="p-4">Libellé</th>
                <th class="p-4">Catégorie</th>
                <th class="p-4">Prix</th>
                <th class="p-4 text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody id="produitsListBody">
              ${produits.map(renderProduitRow).join("")}
            </tbody>
          </table>
        </div>
      `;
    } else {
      target.innerHTML = `
        <div class="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          ${produits.map(renderProduitCard).join("")}
        </div>
      `;
    }

    target.querySelectorAll("[data-delete-id]").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (confirm("Supprimer ce produit ?")) {
          await deleteProduit(btn.dataset.deleteId);
          await loadProduits();
        }
      });
    });

  } catch (error) {
    target.innerHTML = `<p class="text-center py-12 text-rose-600">Erreur : ${error.message}</p>`;
  }
}

function produitFormBody(categories) {
  const options = categories.map(cat => `
    <option value="${cat.id}">${escapeHtml(cat.libelle)}</option>
  `).join("");

  return `
    <div class="space-y-4">
      <div>
        <label class="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500" for="produitLibelle">Libellé *</label>
        <input class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" type="text" id="produitLibelle" placeholder="ex: Jus de Mangue" autocomplete="off" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500" for="produitPrix">Prix (FCFA) *</label>
          <input class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" type="number" id="produitPrix" placeholder="ex: 1500" min="0" />
        </div>
        <div>
          <label class="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500" for="produitCategorie">Catégorie *</label>
          <select class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" id="produitCategorie">
            <option value="">-- Choisir --</option>
            ${options}
          </select>
        </div>
      </div>

      <div>
        <label class="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500" for="produitImage">Image du produit</label>
        <input class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-indigo-500" type="file" id="produitImage" accept="image/*" />
      </div>

      <p id="produitFormError" class="mt-2 hidden text-xs font-semibold text-rose-600"></p>
    </div>
  `;
}

async function openProduitForm() {
  try {
    const categories = await getCategories();

    openModal({
      title: "Nouveau produit",
      icon: "fa-box",
      body: produitFormBody(categories),
      confirmLabel: "Créer le produit",
      onConfirm: async (modal) => {
        const errorText = modal.querySelector("#produitFormError");
        const libelle = modal.querySelector("#produitLibelle").value;
        const prix = modal.querySelector("#produitPrix").value;
        const categorieId = modal.querySelector("#produitCategorie").value;
        const imageInput = modal.querySelector("#produitImage");

        const error = validateProduitForm({ libelle, prix, categorieId });

        if (error) {
          errorText.textContent = error;
          errorText.classList.remove("hidden");
          return false; 
        }

        errorText.classList.add("hidden");

        try {
          let imageUrlFinal = "https://placehold.co/600x400?text=Pas+d+image";
          let imagePublicIdFinal = null;
          
          if (imageInput && imageInput.files.length > 0) {
            errorText.textContent = "Téléchargement de l'image...";
            errorText.classList.remove("hidden");
            
            const file = imageInput.files[0];
            
            const uploadResult = await uploadProductImage(file); 
            imageUrlFinal = uploadResult.imageUrl;
            imagePublicIdFinal = uploadResult.imagePublicId;
          }

          await createProduit({
            libelle,
            prix,
            categorieId,
            imageUrl: imageUrlFinal,
            imagePublicId: imagePublicIdFinal 
          });

          showToast("Produit créé avec succès !");
          await loadProduits();
          return true; 
        } catch (serverError) {
          errorText.textContent = "Erreur : " + serverError.message;
          errorText.classList.remove("hidden");
          return false;
        }
      }
    });
  } catch (err) {
    showToast("Impossible de charger les catégories : " + err.message, "error");
  }
}