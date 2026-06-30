import { pageHeader } from "../components/pageHeader.js";
import { renderProduitRow, renderProduitCard } from "../components/produitTemplate.js";
import { getProduits, deleteProduit, createProduit, updateProduit } from "../services/produitService.js";
import { uploadProductImage } from "../services/cloudinaryService.js";
import { openModal, openConfirm } from "../components/modal.js";
import { showToast } from "../components/toast.js";
import { getCategories } from "../services/categorieService.js";
import { validateProduitForm } from "../utils/validators.js"; 
import { escapeHtml } from "../utils/html.js";

let currentView = "card"; 

export async function renderProduitsPage() {
  const container = document.getElementById("app");
  if (!container) return;
  
  const roleActuel = localStorage.getItem("userRole");
  const estFournisseur = roleActuel === "fournisseur";

  container.innerHTML = `
    ${pageHeader({
      kicker: "Stock",
      title: "Produits",
      subtitle: "Gerez votre catalogue d'articles et leurs images en temps reel.",
      actionLabel: estFournisseur ? null : "Nouveau Produit",
      actionId: estFournisseur ? null : "addProduitBtn",
      actionIcon: estFournisseur ? null : "fa-plus"
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
  
  // L'écouteur s'attache uniquement si le bouton existe (donc pas pour le fournisseur)
  document.getElementById("addProduitBtn")?.addEventListener("click", () => openProduitForm());

  await loadProduits();
}

async function switchView(view) {
  currentView = view;
  await renderProduitsPage();
}

async function loadProduits() {
  const target = document.getElementById("produitsContainer");
  if (!target) return;

  const roleActuel = localStorage.getItem("userRole");
  const estFournisseur = roleActuel === "fournisseur";

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
                ${!estFournisseur ? `<th class="p-4 text-right w-24">Actions</th>` : ""}
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

    if (!estFournisseur) {
      bindProduitActions(produits);
    }

  } catch (error) {
    target.innerHTML = `<p class="text-center py-12 text-rose-600">Erreur : ${error.message}</p>`;
  }
}

function bindProduitActions(produits) {
  document.querySelectorAll("[data-edit-id]").forEach(btn => {
    btn.addEventListener("click", () => {
      const prod = produits.find(p => String(p.id) === String(btn.dataset.editId));
      if (prod) openProduitForm(prod);
    });
  });

  document.querySelectorAll("[data-delete-id]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.deleteId;
      openConfirm({
        message: "Voulez-vous vraiment supprimer ce produit ? Cette action est irreversible.",
        confirmLabel: "Supprimer",
        onConfirm: async () => {
          try {
            await deleteProduit(id);
            showToast("Produit supprime avec succes !");
            await loadProduits();
            return true;
          } catch (error) {
            showToast(error.message || "Erreur lors de la suppression", "error");
            return false;
          }
        }
      });
    });
  });
}

function produitFormBody(categories, produit = null) {
  const isEdit = produit !== null;
  const options = categories.map(cat => `
    <option value="${cat.id}" ${produit?.categorieId === cat.id ? "selected" : ""}>${escapeHtml(cat.libelle)}</option>
  `).join("");

  return `
    <div class="space-y-4">
      <div>
        <label class="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500" for="produitLibelle">Libellé *</label>
        <input class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" 
          type="text" id="produitLibelle" value="${escapeHtml(produit?.libelle || "")}" placeholder="ex: Jus de Mangue" autocomplete="off" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500" for="produitPrix">Prix (FCFA) *</label>
          <input class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" 
            type="number" id="produitPrix" value="${produit?.prix || ""}" placeholder="ex: 1500" min="0" />
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
        <label class="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500" for="produitImage">
          ${isEdit ? "Remplacer l'image du produit (Optionnel)" : "Image du produit"}
        </label>
        <input class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-indigo-500" type="file" id="produitImage" accept="image/*" />
      </div>

      <p id="produitFormError" class="mt-2 hidden text-xs font-semibold text-rose-600"></p>
    </div>
  `;
}

async function openProduitForm(produit = null) {
  const isEdit = produit !== null;
  try {
    const categories = await getCategories();

    openModal({
      title: isEdit ? "Modifier le produit" : "Nouveau produit",
      icon: "fa-box",
      body: produitFormBody(categories, produit),
      confirmLabel: isEdit ? "Enregistrer" : "Créer le produit",
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
          let imageUrlFinal = isEdit ? produit.imageUrl : "https://placehold.co/600x400?text=Pas+d+image";
          let imagePublicIdFinal = isEdit ? produit.imagePublicId : null;
          
          if (imageInput && imageInput.files.length > 0) {
            errorText.textContent = "Telechargement de l'image...";
            errorText.classList.remove("hidden");
            
            const file = imageInput.files[0];
            const uploadResult = await uploadProductImage(file); 
            imageUrlFinal = uploadResult.imageUrl;
            imagePublicIdFinal = uploadResult.imagePublicId;
          }

          const produitData = {
            libelle: libelle.trim(),
            prix: Number(prix),
            categorieId,
            imageUrl: imageUrlFinal,
            imagePublicId: imagePublicIdFinal 
          };

          if (isEdit) {
            await updateProduit(produit.id, produitData);
            showToast("Produit modifie avec succes !");
          } else {
            await createProduit(produitData);
            showToast("Produit cree avec succes !");
          }

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
    showToast("Impossible de charger les categories : " + err.message, "error");
  }
}