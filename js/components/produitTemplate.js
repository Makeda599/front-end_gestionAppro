import { escapeHtml } from "../utils/html.js";

export function renderProduitRow(produit) {
  const nomCategorie = produit.categorie && produit.categorie.libelle 
    ? produit.categorie.libelle 
    : "Sans catégorie";
  
  return `
    <tr class="border-b border-slate-100 hover:bg-slate-50/50 transition">
      <td class="p-4">
        <img src="${produit.imageUrl}" alt="${escapeHtml(produit.libelle)}" class="h-12 w-12 rounded-xl object-cover border border-slate-200">
      </td>
      <td class="p-4 font-bold text-slate-900">${escapeHtml(produit.libelle)}</td>
      <td class="p-4 text-slate-600">${escapeHtml(nomCategorie)}</td>
      <td class="p-4 font-extrabold text-indigo-600">${Number(produit.prix).toLocaleString()} FCFA</td>
      <td class="p-4 text-right">
        <button data-delete-id="${produit.id}" class="h-9 w-9 inline-flex items-center justify-center rounded-xl text-rose-600 hover:bg-rose-50 transition" aria-label="Supprimer">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    </tr>
  `;
}

export function renderProduitCard(produit) {
  const nomCategorie = produit.categorie && produit.categorie.libelle 
    ? produit.categorie.libelle 
    : "Sans catégorie";

  return `
    <div class="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md">
      <div class="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
        <img src="${produit.imageUrl}" alt="${escapeHtml(produit.libelle)}" class="h-full w-full object-cover transition duration-300 group-hover:scale-105">
        <span class="absolute top-2 left-2 rounded-xl bg-slate-950/70 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
          ${escapeHtml(nomCategorie)}
        </span>
      </div>
      
      <div class="flex flex-1 flex-col pt-3 px-1">
        <h3 class="font-bold text-slate-950 line-clamp-1">${escapeHtml(produit.libelle)}</h3>
        <div class="mt-2 flex items-center justify-between">
          <span class="text-base font-black text-indigo-600">${Number(produit.prix).toLocaleString()} F</span>
          <button data-delete-id="${produit.id}" class="h-8 w-8 inline-flex items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition">
            <i class="fa-solid fa-trash text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}