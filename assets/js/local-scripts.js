document.addEventListener('DOMContentLoaded', () => {
    const recipesUrl = 'redacted';

    // Fetch recipe data from Apps Script
    function fetchLocalRecipes() {
        showLoading();

        fetch(recipesUrl)
            .then(response => response.json())
            .then(recipes => {
                window.recipes = recipes;  // Store the recipes globally for filtering
                displayRecipes(recipes);   // Display all recipes initially
                populateCategoryFilter(recipes); // Populate the category dropdown
                populateChefFilter(recipes); // Populate the "Chef" dropdown
            })
            .catch(error => console.error('Error fetching recipes:', error));
    }

    // Display recipes in card on the page
    function displayRecipes(filteredRecipes) {
        const recipeList = document.getElementById('recipe-list');
        
        // Clear any previous content
        recipeList.innerHTML = '';
        
        filteredRecipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');
            
            // Create recipe card content (only title and chef)
            recipeCard.innerHTML = `
                <h3>${recipe.title}</h3>
                <p><strong>By:</strong> ${recipe.name}</p>
            `;
            
            // Add click event listener to the card to show the modal
            recipeCard.addEventListener('click', () => showModal(recipe));
            
            recipeList.appendChild(recipeCard);
        });
    }

    // Function to show the modal with recipe details
    function showModal(recipe) {
        // Check if prepTime and cookTime are defined, otherwise set them as 'Not available'
        const prepTime = recipe.prepTime ? recipe.prepTime : "Not available";
        const cookTime = recipe.cookTime ? recipe.cookTime : "Not available";
        const notes = recipe.notes ? recipe.notes : "No notes available.";

        document.getElementById('modal-title').textContent = recipe.title;
        document.getElementById('modal-chef').textContent = `By: ${recipe.name}`;
        document.getElementById('modal-notes').textContent = `Notes: ${notes}`;
        document.getElementById('modal-prepTime').textContent = `Prep Time: ${prepTime}`;
        document.getElementById('modal-cookTime').textContent = `Cook Time: ${cookTime}`;

        // Handle ingredients (assuming ingredients are either an array or a string separated by \n)
        let ingredientsList = '';
        if (Array.isArray(recipe.ingredients)) {
            ingredientsList = `<ul>${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}</ul>`;
        } else if (typeof recipe.ingredients === 'string' && recipe.ingredients.trim() !== '') {
            const ingredientArray = recipe.ingredients.split('\n').map(item => item.trim()).filter(item => item !== '');
            ingredientsList = ingredientArray.length > 0
                ? `<ul>${ingredientArray.map(item => `<li>${item}</li>`).join('')}</ul>`
                : "<ul><li>No ingredients listed.</li></ul>";
        } else {
            ingredientsList = "<ul><li>No ingredients listed.</li></ul>";
        }
        document.getElementById('modal-ingredients').innerHTML = ingredientsList;

        // Handle instructions (assuming instructions are either an array or a string separated by \n)
        let instructionsList = '';
        if (Array.isArray(recipe.instructions)) {
            instructionsList = `<ol>${recipe.instructions.map(step => `<li>${step}</li>`).join('')}</ol>`;
        } else if (typeof recipe.instructions === 'string' && recipe.instructions.trim() !== '') {
            const instructionArray = recipe.instructions.split('\n').map(item => item.trim()).filter(item => item !== '');
            instructionsList = instructionArray.length > 0
                ? `<ol>${instructionArray.map(item => `<li>${item}</li>`).join('')}</ol>`
                : "<ol><li>No instructions available.</li></ol>";
        } else {
            instructionsList = "<ol><li>No instructions available.</li></ol>";
        }
        document.getElementById('modal-instructions').innerHTML = instructionsList;
        
        // Show the modal
        document.getElementById('recipe-modal').style.display = 'flex';
    }

    function showLoading() {
        document.getElementById('recipe-list').innerHTML = '<p>Loading...</p>';
    }

    // Function to close the modal
    function closeModal() {
        document.getElementById('recipe-modal').style.display = 'none';
    }

    // Add event listener for closing the modal
    document.getElementById('close-modal').addEventListener('click', closeModal);

    // Function to filter recipes based on search input and category filter
    function filterRecipes() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const selectedCategory = document.getElementById('category-filter').value;
        const selectedChef = document.getElementById('chef-filter').value;
        
        const filteredRecipes = window.recipes.filter(recipe => {
            const matchesSearch = recipe.title.toLowerCase().includes(searchTerm) || recipe.name.toLowerCase().includes(searchTerm);
            const matchesCategory = selectedCategory ? recipe.category === selectedCategory : true;
            const matchesChef = selectedChef ? recipe.name === selectedChef : true;
            
            return matchesSearch && matchesCategory && matchesChef;
        });

        displayRecipes(filteredRecipes);
    }

    // Function to populate the category dropdown
    function populateCategoryFilter(recipes) {
        const categories = [...new Set(recipes.map(recipe => recipe.category))];
        const categoryFilter = document.getElementById('category-filter');
        
        categoryFilter.innerHTML = '<option value="">All Categories</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    // Function to populate the chef dropdown
    function populateChefFilter(recipes) {
        const chefs = [...new Set(recipes.map(recipe => recipe.name))];
        const chefFilter = document.getElementById('chef-filter');
        
        chefFilter.innerHTML = '<option value="">All Chefs</option>';

        chefs.forEach(chef => {
            const option = document.createElement('option');
            option.value = chef;
            option.textContent = chef;
            chefFilter.appendChild(option);
        });
    }

    // Add event listeners for the search input and category filter
    document.getElementById('search-input').addEventListener('input', filterRecipes);
    document.getElementById('category-filter').addEventListener('change', filterRecipes);
    document.getElementById('chef-filter').addEventListener('change', filterRecipes);

    fetchLocalRecipes();
});