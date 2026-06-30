import { ENDPOINTS } from "../config/api.js";
import { apiRequest } from "./apiClient.js";
import { createId } from "../utils/id.js";

export async function createUser(userData) {
  const newUser = {
    id: createId("user"),
    email: userData.email,
    password: userData.motDePasse, 
    role: userData.role || "fournisseur",
    nom: userData.nom,
    fournisseurId: userData.fournisseurId || null
  };

  return apiRequest(
    ENDPOINTS.users || "http://localhost:3000/users",
    {
      method: "POST",
      body: JSON.stringify(newUser),
    },
    "Impossible de créer le compte utilisateur."
  );
}