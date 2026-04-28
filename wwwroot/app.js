// Database of recipes with ingredients, quantities, and cooking time
const recipes = [
    { 
        name: "Classic Chicken Mandi", 
        ingredients: ["chicken", "rice", "saffron"], 
        quantities: "500g Chicken, 2 cups Rice",
        time: 60, 
        type: "Non-Veg" 
    },
    { 
        name: "Garden Vegetable Stir-fry", 
        ingredients: ["broccoli", "carrot", "soy sauce"], 
        quantities: "1 head Broccoli, 2 Carrots",
        time: 20, 
        type: "Vegetarian" 
    },
    { 
        name: "Garlic Butter Shrimp", 
        ingredients: ["shrimp", "garlic", "butter"], 
        quantities: "300g Shrimp, 4 cloves Garlic",
        time: 15, 
        type: "Non-Veg" 
    }
];

// User preferences (can be modified in settings)
let userPrefs = { diet: "All" }; 
let myIngredients = [];

function addIngredient() {
    const input = document.getElementById('ingredientInput');
    const value = input.value.trim().toLowerCase();
    if (value && !myIngredients.includes(value)) {
        myIngredients.push(value);
        renderIngredients();
        runMatching();
    }
    input.value = '';
}

function renderIngredients() {
    const container = document.getElementById('myIngredients');
    container.innerHTML = myIngredients.map((ing, idx) => `
        <span class="tag">${ing} <button onclick="removeIng(${idx})">✕</button></span>
    `).join('');
}

function removeIng(idx) {
    myIngredients.splice(idx, 1);
    renderIngredients();
    runMatching();
}

function runMatching() {
    const timeLimit = document.getElementById('timeFilter').value;
    const grid = document.getElementById('recipeGrid');
    
    const matches = recipes.filter(recipe => {
        // Ingredient Match: Check if any of user's ingredients are in the recipe
        const hasIngredient = myIngredients.length === 0 || 
            recipe.ingredients.some(ing => myIngredients.includes(ing));
        
        // Time Filter
        const matchesTime = timeLimit === "all" || recipe.time <= parseInt(timeLimit);
        
        // Preference Filter
        const matchesPref = userPrefs.diet === "All" || recipe.type === userPrefs.diet;

        return hasIngredient && matchesTime && matchesPref;
    });

    grid.innerHTML = matches.map(r => `
        <div class="recipe-card">
            <h4 style="color: #C0392B; text-transform: uppercase; font-size: 11px;">${r.type}</h4>
            <h3 style="margin: 8px 0;">${r.name}</h3>
            <p style="font-size: 13px; color: #4B5563;"><strong>Needs:</strong> ${r.quantities}</p>
            <div class="meta-row">
                <span>⏱ ${r.time} mins</span>
                <span style="color: green;">Match Found</span>
            </div>
        </div>
    `).join('');
}

// Initial Run
runMatching();