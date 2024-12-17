const recipesUrl = 'https://script.google.com/macros/s/AKfycbw1XLFMwxp9ZY2pVapInLGBnpSZVNHU8nw1dPbKnO-AGgObD0aoDhey-AKm3J6yj0cBrQ/exec';

// Fetch recipe data from Apps Script
function fetchRecipes() {
    fetch(recipesUrl)
        .then(response => response.json())
        .then(recipes => {
            console.log(recipes);
            displayRecipes(recipes);
        })
        .catch(error => console.error('Error fetching recipes:', error));
}

// Display recipes in card on the page
function displayRecipes(recipes) {
    const recipeList = document.getElementById('recipe-list');
    
    // Clear any previous content
    recipeList.innerHTML = '';
    
    recipes.forEach(recipe => {
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

// Call the fetchRecipes function to load the data when the page is ready
document.addEventListener('DOMContentLoaded', fetchRecipes);