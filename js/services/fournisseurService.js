import { ENDPOINTS } from "../config/api.js";
import { apiRequest } from "./apiClient.js";

export function normalizeFournisseur(data) {
    return {
        id: data.id,
        nom: String(data.nom).trim(),
        telephone: String(data.telephone).trim(),
        adresse: data.adresse ? String(data.adresse).trim() : "Non spécifiée",
        email: String(data.email).trim().toLowerCase(),
        type: data.type ? String(data.type).trim() : "Non spécifié", 
        dateInscription: data.dateInscription || "Non spécifiée",     
        userId: data.userId || null 
    };
}
export async function getFournisseurs() {
    const url = ENDPOINTS.fournisseurs || "http://localhost:3000/fournisseurs";
    const data = await apiRequest(url, { method: "GET" }, "Impossible de charger les fournisseurs.");
    return Array.isArray(data) ? data.map(normalizeFournisseur) : [];
}

export async function createFournisseurs(fournisseurData) {
    const url = ENDPOINTS.fournisseurs || "http://localhost:3000/fournisseurs";
    
    const newFournisseur = {
        id: Math.random().toString(36).substr(2, 9), 
        ...fournisseurData
    };

    const data = await apiRequest(
        url,
        {
            method: "POST",
            body: JSON.stringify(newFournisseur),
        },
        "Impossible de créer le fournisseur."
    );
    return normalizeFournisseur(data);
}

export async function updateFournisseurs(id, fournisseurData) {
    const baseUrl = ENDPOINTS.fournisseurs || "http://localhost:3000/fournisseurs";
    const url = `${baseUrl}/${id}`;

    const data = await apiRequest(
        url,
        {
            method: "PUT",
            body: JSON.stringify(fournisseurData),
        },
        "Impossible de modifier le fournisseur."
    );
    return normalizeFournisseur(data);
}

export async function deleteFournisseurs(id) {
    const baseUrl = ENDPOINTS.fournisseurs || "http://localhost:3000/fournisseurs";
    const url = `${baseUrl}/${id}`;

    return apiRequest(
        url,
        {
            method: "DELETE",
        },
        "Impossible de supprimer le fournisseur."
    );
}