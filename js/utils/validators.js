
export function required(value, message) {
  if (!String(value ?? "").trim()) {
    throw new Error(message);
  }
}


export function minLength(value, min, message) {
  if (String(value ?? "").trim().length < min) {
    throw new Error(message);
  }
}


export function minNumber(value, min, message) {
  const num = parseFloat(value);
  if (isNaN(num) || num <= min) {
    throw new Error(message);
  }
}


export function validateCategorieForm(libelle) {
  try {
    required(libelle, "Le libellé de la catégorie est obligatoire.");
    minLength(libelle, 3, "Le libellé doit contenir au moins 3 caractères.");
    return null;
  } catch (error) {
    return error.message;
  }
}


export function validateProduitForm(data) {
  try {
    required(data.libelle, "Le libellé du produit est obligatoire.");
    required(data.categorieId, "Veuillez sélectionner une catégorie.");
    required(data.prix, "Le prix du produit est obligatoire.");
    minNumber(data.prix, 0, "Le prix doit être un montant valide et supérieur à 0.");
    return null;
  } catch (error) {
    return error.message;
  }
}