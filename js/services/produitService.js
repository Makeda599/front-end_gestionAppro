import { ENDPOINTS } from "../config/api.js";
import { apiRequest } from "./apiClient.js";
import { createId } from "../utils/id.js";

export async function getProduits() {
  try {
    const produits = await apiRequest(ENDPOINTS.produits, {}, "Impossible de charger les produits.");
    
    if (!Array.isArray(produits) || produits.length === 0) {
      return [];
    }

    try {
      const categories = await apiRequest(ENDPOINTS.categories, {}, "Impossible de charger les catégories.");
      
      if (Array.isArray(categories)) {
        return produits.map(produit => ({
          ...produit,
          categorie: categories.find(cat => cat.id === produitIdOuSimilaire(produit.categorieId)) || null
        }));
      }
    } catch (catError) {
      console.warn("Impossible de lier les catégories, affichage des produits bruts :", catError);
    }

    return produits; 

  } catch (error) {
    console.error("Erreur dans getProduits service:", error);
    return []; 
  }
}

function produitIdOuSimilaire(id) {
  return id ? String(id) : null;
}

export async function createProduit(data) {
  const nouveauProduit = {
    id: createId("prod"),
    libelle: data.libelle.trim(),
    prix: parseFloat(data.prix),
    categorieId: data.categorieId,
    imageUrl: data.imageUrl || "https://placehold.co/600x400?text=Pas+d+image",
    imagePublicId: data.imagePublicId || null
  };

  return apiRequest(
    ENDPOINTS.produits,
    {
      method: "POST",
      body: JSON.stringify(nouveauProduit),
    },
    "Impossible de créer le produit."
  );
}

export async function updateProduit(id, data) {
  const produitModifie = {
    id: id, // On conserve le même identifiant
    libelle: data.libelle.trim(),
    prix: parseFloat(data.prix),
    categorieId: data.categorieId,
    imageUrl: data.imageUrl,
    imagePublicId: data.imagePublicId
  };

  return apiRequest(
    `${ENDPOINTS.produits}/${id}`,
    {
      method: "PUT", 
      body: JSON.stringify(produitModifie),
    },
    "Impossible de modifier le produit."
  );
}

export async function deleteProduit(id) {
  return apiRequest(
    `${ENDPOINTS.produits}/${id}`,
    {
      method: "DELETE",
    },
    "Impossible de supprimer le produit."
  );
}