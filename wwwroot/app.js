const recipeDatabase = [
    { name: "Saffron Chicken Mandi", ingredients: ["chicken", "rice", "saffron"], time: 60, diet: "Non-Veg", qty: "500g Chicken, 2 Cups Rice" },
    { name: "Velvet Dal Makhani", ingredients: ["lentils", "butter"], time: 45, diet: "Vegetarian", qty: "1 Cup Lentils, 50g Butter" },
    { name: "Garlic Butter Shrimp", ingredients: ["shrimp", "garlic", "butter"], time: 15, diet: "Non-Veg", qty: "300g Shrimp, 4 cloves Garlic" },
    { name: "Roasted Root Veggies", ingredients: ["carrot", "potato"], time: 30, diet: "Vegetarian", qty: "2 Carrots, 2 Potatoes" }
];

let userPantry = [];

function addIngredient() {
    const input = document.getElementById('ingInput');
    const val = input.value.toLowerCase().trim();
    if (val && !userPantry.includes(val)) {
        userPantry.push(val);
        renderPantry();
        updateRecipes();
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
    updateRecipes();
}

function updateRecipes() {
    const diet = document.getElementById('dietPref').value;
    const maxTime = parseInt(document.getElementById('timePref').value);
    const grid = document.getElementById('recipeGrid');

    const filtered = recipeDatabase.filter(r => {
        const matchIng = userPantry.length === 0 || r.ingredients.some(i => userPantry.includes(i));
        const matchDiet = diet === "All" || r.diet === diet;
        const matchTime = r.time <= maxTime;
        return matchIng && matchDiet && matchTime;
    });

    document.getElementById('matchCount').innerText = `${filtered.length} Matches Found`;

    grid.innerHTML = filtered.map(r => `
        <div class="recipe-card">
            <span style="font-size: 10px; font-weight: 800; color: #C0392B; text-transform: uppercase;">${r.diet}</span>
            <h3 style="margin: 8px 0;">${r.name}</h3>
            <p style="font-size: 13px; color: #636E72;">Requires: ${r.qty}</p>
            <div class="recipe-meta">
                <span>⏱ ${r.time} mins</span>
                <span style="color: #27AE60;">Ready to Cook</span>
            </div>
        </div>
    `).join('');
}

function toggleSidebar() {
    const sb = document.getElementById('sidebar');
    const ov = document.getElementById('overlay');
    sb.classList.toggle('active');
    ov.classList.toggle('active');
}

// Initial display
updateRecipes();