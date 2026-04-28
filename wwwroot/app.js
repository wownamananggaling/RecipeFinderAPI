const recipes = [
    { id: 1, title: 'Chicken Mandi', category: 'Chicken', cuisine: 'Indian', time: '60 min', difficulty: 'Medium', steps: ['Marinate chicken with turmeric and oil.', 'Soak basmati rice for 30 minutes.', 'Saute onions and spices.', 'Cook chicken and rice together until tender.'] },
    { id: 2, title: 'Dal Makhani', category: 'Vegetarian', cuisine: 'Indian', time: '90 min', difficulty: 'Easy', steps: ['Boil soaked lentils.', 'Prepare tomato and butter base.', 'Mix and simmer for 20 minutes.', 'Garnish with cream.'] },
    { id: 3, title: 'Beef Rendang', category: 'Beef', cuisine: 'Asian', time: '120 min', difficulty: 'Hard', steps: ['Blend spice paste.', 'Sear beef cubes.', 'Simmer in coconut milk.', 'Cook until liquid reduces and beef is dark.'] }
];

let favorites = [];
let currentFilter = 'All';

function renderGrid(list, containerId = 'recipeGrid') {
    const el = document.getElementById(containerId);
    if (!list.length) { el.innerHTML = '<p style="text-align:center; padding:20px;">No recipes found.</p>'; return; }
    el.innerHTML = list.map(r => `
        <div class="recipe-card" onclick="openDetail(${r.id})">
            <div>
                <div class="recipe-card-title">${r.title}</div>
                <div style="font-size:12px; color:gray;">${r.cuisine} • ${r.time}</div>
            </div>
        </div>
    `).join('');
}

function doSearch() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    let list = recipes;
    if (currentFilter !== 'All') list = list.filter(r => r.category === currentFilter);
    if (q) list = list.filter(r => r.title.toLowerCase().includes(q));
    renderGrid(list);
}

function setFilter(btn, cat) {
    document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = cat;
    doSearch();
}

function openDetail(id) {
    const recipe = recipes.find(r => r.id === id);
    document.getElementById('detailTitle').textContent = recipe.title;
    document.getElementById('detailSteps').innerHTML = recipe.steps.map(s => `<div class="instruction-step">• ${s}</div>`).join('');
    showPage('detail');
}

function showPage(name) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + (name === 'detail' ? 'detail' : name)).classList.add('active');
    
    document.querySelectorAll('.bottom-nav-item').forEach(b => b.classList.remove('active'));
    const navId = 'bnav-' + (name === 'detail' ? 'search' : name);
    if(document.getElementById(navId)) document.getElementById(navId).classList.add('active');

    if (name === 'favorites') renderGrid(favorites, 'favsGrid');
}

function toggleFav() {
    // Logic for adding current recipe to favorites array
    alert('Recipe saved to favorites');
}

function openNav() { document.getElementById('navDrawer').classList.add('open'); document.getElementById('navOverlay').classList.add('open'); }
function closeNav() { document.getElementById('navDrawer').classList.remove('open'); document.getElementById('navOverlay').classList.remove('open'); }

renderGrid(recipes);