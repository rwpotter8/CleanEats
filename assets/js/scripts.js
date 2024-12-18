const recipesUrl = 'https://script.google.com/macros/s/AKfycbxTDfmlJO7CqYQHHY8rKq_0S2rzD8ojLfbISs0V42TkkIddpJLbCY6ti3rpuQfjTVf9nA/exec';

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

    document.getElementById('modal-title').textContent = recipe.title;
    document.getElementById('modal-author').textContent = `By: ${recipe.name}`;
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