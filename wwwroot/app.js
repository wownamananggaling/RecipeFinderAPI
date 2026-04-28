const recipes = [
    { name: "Chicken Mandi", ingredients: ["chicken", "rice"], time: 60, diet: "Non-Veg", qty: "500g Chicken, 2 Cups Rice" },
    { name: "Vegetable Stir Fry", ingredients: ["broccoli", "carrot"], time: 15, diet: "Vegetarian", qty: "1 Broccoli, 2 Carrots" },
    { name: "Garlic Butter Shrimp", ingredients: ["shrimp", "garlic"], time: 20, diet: "Non-Veg", qty: "300g Shrimp, 3 Cloves Garlic" }
];

let myIngredients = [];

function addIng() {
    const val = document.getElementById('ingInput').value.toLowerCase().trim();
    if (val && !myIngredients.includes(val)) {
        myIngredients.push(val);
        render();
    }
    document.getElementById('ingInput').value = '';
}

function render() {
    const list = document.getElementById('ingList');
    list.innerHTML = myIngredients.map((ing, i) => `
        <div class="tag">${ing} <button onclick="removeIng(${i})">✕</button></div>
    `).join('');
    runMatch();
}

function removeIng(i) {
    myIngredients.splice(i, 1);
    render();
}

function runMatch() {
    const diet = document.getElementById('dietPref').value;
    const time = parseInt(document.getElementById('timePref').value);
    const grid = document.getElementById('recipeGrid');

    const matches = recipes.filter(r => {
        const hasIng = myIngredients.length === 0 || r.ingredients.some(i => myIngredients.includes(i));
        const hasTime = r.time <= time;
        const hasDiet = diet === "All" || r.diet === diet;
        return hasIng && hasTime && hasDiet;
    });

    document.getElementById('matchCount').innerText = `${matches.length} Recipes Found`;

    grid.innerHTML = matches.map(r => `
        <div class="recipe-card">
            <span style="font-size: 10px; font-weight: 700; color: #C0392B; text-transform: uppercase;">${r.diet}</span>
            <h3 style="margin: 5px 0 10px 0;">${r.name}</h3>
            <p style="font-size: 13px; color: #636E72;"><strong>Ingredients:</strong> ${r.qty}</p>
            <div style="margin-top: 15px; display: flex; justify-content: space-between; font-size: 12px; font-weight: 600;">
                <span>⏱ ${r.time} mins</span>
                <span style="color: #27AE60;">Perfect Match</span>
            </div>
        </div>
    `).join('');
}

// Initial render
runMatch();