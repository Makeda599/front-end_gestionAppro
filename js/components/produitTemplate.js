export function renderProduitRow(produit) {
  const roleActuel = localStorage.getItem("userRole");
  const estFournisseur = roleActuel === "fournisseur";

  const actionsHtml = !estFournisseur 
    ? `<td class="p-4 text-right space-x-2">
         <button data-edit-id="${produit.id}" class="text-indigo-600 hover:text-indigo-900"><i class="fa-solid fa-pen"></i></button>
         <button data-delete-id="${produit.id}" class="text-rose-600 hover:text-rose-900"><i class="fa-solid fa-trash"></i></button>
       </td>`
    : "";

  return `
    <tr class="border-b border-slate-200 hover:bg-slate-50/50">
      <td class="p-4"><img src="${produit.imageUrl}" class="h-10 w-10 rounded-xl object-cover border" /></td>
      <td class="p-4 font-semibold text-slate-900">${produit.libelle}</td>
      <td class="p-4">${produit.categorieId}</td>
      <td class="p-4 font-medium">${produit.prix} FCFA</td>
      ${actionsHtml}
    </tr>
  `;
}

export function renderProduitCard(produit) {
  const roleActuel = localStorage.getItem("userRole");
  const estFournisseur = roleActuel === "fournisseur";

  const actionsCardHtml = !estFournisseur 
    ? `<div class="absolute right-3 top-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
         <button data-edit-id="${produit.id}" class="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm border hover:bg-slate-50">
           <i class="fa-solid fa-pen text-xs"></i>
         </button>
         <button data-delete-id="${produit.id}" class="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-rose-600 shadow-sm border hover:bg-slate-50">
           <i class="fa-solid fa-trash text-xs"></i>
         </button>
       </div>`
    : "";

  return `
    <div class="group relative rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div class="relative aspect-video w-full overflow-hidden rounded-2xl border bg-slate-50">
        <img src="${produit.imageUrl}" class="h-full w-full object-cover" />
        ${actionsCardHtml}
      </div>
      <div class="mt-4">
        <h3 class="font-bold text-slate-950">${produit.libelle}</h3>
        <p class="mt-1 text-lg font-black text-indigo-600">${produit.prix} FCFA</p>
      </div>
    </div>
  `;
}