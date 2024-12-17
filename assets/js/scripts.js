const recipesUrl = 'https://script.google.com/macros/s/AKfycbw1XLFMwxp9ZY2pVapInLGBnpSZVNHU8nw1dPbKnO-AGgObD0aoDhey-AKm3J6yj0cBrQ/exec';

// Fetch recipe data from Apps Script
function fetchRecipes() {
    fetch(recipesUrl)
        .then(response => response.json())
        .then(recipes => {
            window.recipes = recipes;  // Store the recipes globally for filtering
            displayRecipes(recipes);   // Display all recipes initially
            populateCategoryFilter(recipes); // Populate the category dropdown
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
        
        // Create recipe card content (only title and author)
        recipeCard.innerHTML = `
            <h3>${recipe.title}</h3>
            <p><strong>By:</strong> ${recipe.name}</p>
        `;
        
        recipeList.appendChild(recipeCard);
    });
}

// Function to filter recipes based on search input and category filter
function filterRecipes() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const selectedCategory = document.getElementById('category-filter').value;
    
    const filteredRecipes = window.recipes.filter(recipe => {
        const matchesSearch = recipe.title.toLowerCase().includes(searchTerm) || recipe.name.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory ? recipe.category === selectedCategory : true;

        return matchesSearch && matchesCategory;
    });

    // Display the filtered recipes
    displayRecipes(filteredRecipes);
}

// Function to populate the category dropdown
function populateCategoryFilter(recipes) {
    const categories = [...new Set(recipes.map(recipe => recipe.category))]; // Get unique categories
    const categoryFilter = document.getElementById('category-filter');
    
    // Clear the existing options
    categoryFilter.innerHTML = '<option value="">All Categories</option>';
    
    // Add category options to the dropdown
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Add event listeners for the search input and category filter
document.getElementById('search-input').addEventListener('input', filterRecipes);
document.getElementById('category-filter').addEventListener('change', filterRecipes);

// Call the fetchRecipes function to load the data when the page is ready
document.addEventListener('DOMContentLoaded', fetchRecipes);