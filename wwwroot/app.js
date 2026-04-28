const recipeData = [
    { name: "Saffron Infused Mandi", category: "Main Course", time: "55m" },
    { name: "Velvet Dal Makhani", category: "Vegetarian", time: "40m" },
    { name: "Citrus Glazed Bass", category: "Seafood", time: "30m" }
];

function render() {
    const grid = document.getElementById('recipeGrid');
    grid.innerHTML = recipeData.map(r => `
        <div class="recipe-card">
            <span style="font-size: 11px; font-weight: 700; color: #C0392B; text-transform: uppercase; letter-spacing: 0.05em;">${r.category}</span>
            <h3 style="margin: 8px 0; font-size: 20px; font-weight: 700;">${r.name}</h3>
            <p style="color: #6B7280; font-size: 14px;">Preparation: ${r.time}</p>
        </div>
    `).join('');
}

function switchView(view) {
    console.log("Navigating to: " + view);
    // Add logic to hide/show specific sections if needed
}

render();