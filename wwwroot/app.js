const API_URL = "https://recipes-api-system.infinityfreeapp.com/?i=1";
let userPantry = [];

// Initialize by fetching data
async function fetchAndMatch() {
    const grid = document.getElementById('recipeGrid');
    const status = document.getElementById('matchCount');
    
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        renderMatches(data);
    } catch (error) {
        console.error("API Error:", error);
        status.innerText = "Error connecting to recipe database.";
    }
}

function renderMatches(recipes) {
    const diet = document.getElementById('dietPref').value;
    const maxTime = parseInt(document.getElementById('timePref').value);
    const grid = document.getElementById('recipeGrid');

    const filtered = recipes.filter(r => {
        // Match based on available ingredients in pantry
        const hasIng = userPantry.length === 0 || 
                       r.ingredients.some(i => userPantry.includes(i.toLowerCase()));
        
        const matchDiet = diet === "All" || r.diet === diet;
        const matchTime = r.time <= maxTime;
        
        return hasIng && matchDiet && matchTime;
    });

    document.getElementById('matchCount').innerText = `${filtered.length} Professional Matches`;

    grid.innerHTML = filtered.map(r => `
        <div class="recipe-card">
            <span class="category-tag">${r.diet}</span>
            <h3>${r.name}</h3>
            <p class="qty-text"><strong>Ingredients:</strong> ${r.quantities}</p>
            <div class="card-meta">
                <span>⏱ ${r.time} mins</span>
                <span class="match-indicator">Matching</span>
            </div>
        </div>
    `).join('');
}

function addIngredient() {
    const input = document.getElementById('ingInput');
    const val = input.value.toLowerCase().trim();
    if (val && !userPantry.includes(val)) {
        userPantry.push(val);
        renderPantry();
        fetchAndMatch();
    }
    input.value = '';
}

function renderPantry() {
    const container = document.getElementById('pantryTags');
    container.innerHTML = userPantry.map((ing, i) => `
        <div class="tag">${ing} <button onclick="removeIngredient(${i})">✕</button></div>
    `).join('');
}

function removeIngredient(i) {
    userPantry.splice(i, 1);
    renderPantry();
    fetchAndMatch();
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
}

// Start the app
fetchAndMatch();