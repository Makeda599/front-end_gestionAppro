import { showToast } from "../components/toast.js";
import { navigate } from "../router.js"; 

export function renderLoginPage() {
    const mainPage = document.getElementById("app");
    
    mainPage.innerHTML = `
        <div class="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md border border-slate-200 mt-12">
            <h2 class="text-2xl font-black text-indigo-600 mb-6 text-center">Connexion</h2>
            
            <form id="loginForm" class="flex flex-col gap-4">
                <div>
                    <label class="block text-sm font-medium text-slate-700">Adresse Email</label>
                    <input type="email" id="email" class="w-full border border-slate-300 p-2 rounded mt-1" required />
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700">Mot de passe</label>
                    <input type="password" id="password" class="w-full border border-slate-300 p-2 rounded mt-1" required />
                </div>

                <button type="submit" class="bg-indigo-600 text-white font-bold p-3 rounded-lg hover:bg-indigo-700 transition mt-2">
                    Se connecter
                </button>
            </form>
        </div>
    `;

    const form = document.getElementById("loginForm");
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const emailSaisi = document.getElementById("email").value;
        const passwordSaisi = document.getElementById("password").value;

    fetch(`${API_BASE_URL}/users?email=${emailSaisi}&password=${passwordSaisi}`)
            .then(response => response.json())
            .then(users => {
                if (users.length > 0) {
                    const user = users[0];
                    localStorage.setItem("userRole", user.role);
                    localStorage.setItem("userEmail", user.email);
                    
                    showToast(`Connexion réussie ! Bienvenue`, "success");
                    
                    setTimeout(() => {
                        if (user.role === "fournisseur") {
                            navigate("produits");
                        } else {
                            navigate("categories");
                        }
                    }, 500);
                    
                } else {
                    showToast("Identifiants incorrects !", "error");
                }
            })
            .catch(error => {
                console.error("Erreur serveur :", error);
                showToast("Erreur de connexion au serveur", "error");
            });
    });
}