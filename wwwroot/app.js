const recipes = [
    { title: "Gourmet Chicken Mandi", type: "Main Course", time: "60 min" },
    { title: "Artisan Dal Makhani", type: "Vegetarian", time: "45 min" },
    { title: "Pan-Seared Sea Bass", type: "Seafood", time: "30 min" }
];

function renderGrid() {
    const grid = document.getElementById('recipeGrid');
    grid.innerHTML = recipes.map(r => `
        <div class="recipe-card">
            <div class="card-content">
                <span class="card-tag">${r.type}</span>
                <h3 class="card-title">${r.title}</h3>
                <p style="color: #6B7280; font-size: 13px; margin-top: 8px;">⏱ ${r.time}</p>
            </div>
        </div>
    `).join('');
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('open');
}

function executeSearch() {
    const query = document.getElementById('recipeInput').value;
    console.log("Searching for:", query);
}

// Initialize
renderGrid();