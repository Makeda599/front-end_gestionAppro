import { CLOUDINARY_CONFIG, CLOUDINARY_UPLOAD_URL } from "../config/cloudinary.js";

export async function uploadProductImage(file) {
  if (!file) return { imageUrl: null, imagePublicId: null };

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Format d'image non supporté. Utilisez du JPG, PNG, WEBP ou GIF.");
  }

  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("L'image est trop lourde (maximum 2 Mo).");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);

  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Erreur lors de l'envoi vers Cloudinary.");
  }

  return {
    imageUrl: data.secure_url,
    imagePublicId: data.public_id,
  };
}