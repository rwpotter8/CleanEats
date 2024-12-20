document.addEventListener("DOMContentLoaded", () => {
    const API_KEY = "redacted";
    const recipeListContainer = document.getElementById("recipe-list");
    const searchInput = document.getElementById("search-input");
    const recipeModal = document.getElementById("recipe-modal");
    const closeModal = document.getElementById("close-modal");

    // Fetch recipes from Spoonacular API
    async function fetchRecipes(query = "", category = "") {
        try {
            // Change the 'cuisine' filter to 'type' (category) filter
            const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${query}&type=${category}&number=12`;
            const response = await fetch(url);
            const data = await response.json();
            displayRecipes(data.results);
        } catch (error) {
            console.error("Error fetching recipes:", error);
        }
    }

    // Display recipes as cards
    function displayRecipes(recipes) {
        recipeListContainer.innerHTML = ""; // Clear existing recipes
        if (recipes.length === 0) {
            recipeListContainer.innerHTML = "<p>No recipes found. Try a different search or category.</p>";
            return;
        }

        recipes.forEach(recipe => {
            const recipeCard = document.createElement("div");
            recipeCard.classList.add("recipe-card");
            recipeCard.innerHTML = `
                <img src="https://spoonacular.com/recipeImages/${recipe.id}-312x231.jpg" alt="${recipe.title}" />
                <h3>${recipe.title}</h3>
            `;
            recipeCard.addEventListener("click", () => openRecipeModal(recipe));
            recipeListContainer.appendChild(recipeCard);
        });
    }

    // Open recipe modal with detailed information
    async function openRecipeModal(recipe) {
        try {
            const response = await fetch(`https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${API_KEY}`);
            const data = await response.json();
            document.getElementById("modal-title").textContent = data.title;
            document.getElementById("modal-chef").textContent = `Chef: ${data.sourceName || "N/A"}`;
            document.getElementById("modal-summary").textContent = data.summary || "No summary available.";
            document.getElementById("modal-prepTime").textContent = `Prep time: ${data.preparationMinutes} minutes`;
            document.getElementById("modal-cookTime").textContent = `Cook time: ${data.cookingMinutes} minutes`;

            // Display ingredients
            const ingredientsList = data.extendedIngredients.map(ingredient => ingredient.original).join(", ");
            document.getElementById("modal-ingredients").textContent = ingredientsList;

            // Display instructions
            document.getElementById("modal-instructions").textContent = data.instructions || "No instructions available.";

            // Open modal
            recipeModal.style.display = "block";
        } catch (error) {
            console.error("Error fetching recipe details:", error);
        }
    }

    // Close the modal
    closeModal.addEventListener("click", () => {
        recipeModal.style.display = "none";
    });

    // Event listener for search input
    searchInput.addEventListener("input", () => {
        const category = document.querySelector(".dropdown-content a.selected")?.dataset.category || ""; // Get selected category
        fetchRecipes(searchInput.value, category); // Fetch based on search query and selected category
    });

    // Event listener for category filter links (dropdown)
    document.querySelectorAll(".dropdown-content a").forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent default link behavior
            document.querySelectorAll(".dropdown-content a").forEach(a => a.classList.remove("selected")); // Remove 'selected' class from all
            link.classList.add("selected"); // Add 'selected' class to the clicked link
            const category = link.dataset.category || "";
            fetchRecipes(searchInput.value, category); // Fetch based on selected category
        });
    });

    fetchRecipes();
});