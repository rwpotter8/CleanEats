document.addEventListener("DOMContentLoaded", () => {
    const API_KEY = "redacted";
    const recipeListContainer = document.getElementById("recipe-list");
    const searchInput = document.getElementById("search-input");
    const recipeModal = document.getElementById("recipe-modal");
    const closeModal = document.getElementById("close-modal");
    const dropdownContent = document.querySelector(".dropdown-content");
    const categoryButton = document.querySelector(".dropbtn");

    let currentPage = 1;
    let isLoading = false;
    let currentQuery = "";
    let currentCategory = "all";

    // Fetch recipes based on the query and category
    async function fetchRecipes(query = "", category = "", page = 1) {
        if (isLoading) return;
        isLoading = true;

        try {
            const offset = (page - 1) * 12;
            const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${query}&type=${category}&diet=vegan&number=12&offset=${offset}`;
            const response = await fetch(url);
            const data = await response.json();
            displayRecipes(data.results);
        } catch (error) {
            console.error("Error fetching recipes:", error);
        } finally {
            isLoading = false;
        }
    }

    // Display recipes on the page
    function displayRecipes(recipes) {
        if (recipes.length === 0 && currentPage === 1) {
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

    // Fetch and display recipe details in a modal
    async function openRecipeModal(recipe) {
        try {
            const response = await fetch(`https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${API_KEY}`);
            const data = await response.json();

            document.getElementById("modal-title").textContent = data.title;
            document.getElementById("modal-chef").textContent = `Chef: ${data.sourceName || "N/A"}`;
            document.getElementById("modal-summary").textContent = data.summary.replace(/<[^>]+>/g, "") || "No summary available.";

            const ingredientsList = data.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join("");
            document.getElementById("modal-ingredients").innerHTML = `<ul>${ingredientsList}</ul>`;                

            const modalInstructions = document.getElementById("modal-instructions");
            modalInstructions.innerHTML = ''; // Clear previous content
            
            if (data.analyzedInstructions && data.analyzedInstructions.length > 0) {
                const ol = document.createElement('ol');
            
                data.analyzedInstructions[0].steps.forEach(step => {
                    const li = document.createElement('li');
                    li.textContent = step.step.trim();
                    ol.appendChild(li);
                });
            
                modalInstructions.appendChild(ol);
            } else {
                modalInstructions.innerHTML = '<p>No instructions available.</p>';
            }                                

            recipeModal.style.display = "block";
        } catch (error) {
            console.error("Error fetching recipe details:", error);
        }
    }

    // Close modal
    closeModal.addEventListener("click", () => {
        recipeModal.style.display = "none";
    });

    // Handle search input
    searchInput.addEventListener("input", () => {
        currentQuery = searchInput.value;
        currentPage = 1;
        recipeListContainer.innerHTML = "";
        fetchRecipes(currentQuery, currentCategory, currentPage);
    });

    // Handle category selection from the dropdown
    document.querySelectorAll(".dropdown-content a").forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            
            // Reset selected category visually
            document.querySelectorAll(".dropdown-content a").forEach(a => a.classList.remove("selected"));
            link.classList.add("selected");
            
            currentCategory = link.dataset.category || "all"; 
            currentPage = 1;
            recipeListContainer.innerHTML = ""; 
            fetchRecipes(currentQuery, currentCategory, currentPage);

            // Close dropdown after selection
            dropdownContent.classList.remove("show");
        });
    });

    // Close dropdown if user clicks outside of it
    window.addEventListener("click", (event) => {
        if (!dropdownContent.contains(event.target) && event.target !== categoryButton) {
            dropdownContent.classList.remove("show");
        }
    });

    // Toggle dropdown visibility
    categoryButton.addEventListener("click", () => {
        dropdownContent.classList.toggle("show");
    });

    // Infinite scroll functionality
    window.addEventListener("scroll", () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100 && !isLoading) {
            currentPage++;
            fetchRecipes(currentQuery, currentCategory, currentPage);
        }
    });

    // Initial fetch
    fetchRecipes();
});