const API = 'https://recipe-finder-api-ds4e.onrender.com/api';
let userId = parseInt(localStorage.getItem('userId') || '1'); // Defaulting to 1 for this demo

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  if (name === 'favorites') loadFavorites();
  if (name === 'preferences') loadPreferences();
}

async function searchRecipes() {
  const q = document.getElementById('search-query').value;
  const res = await fetch(`${API}/recipe/search?q=${q}`);
  const meals = await res.json();
  renderRecipes(meals);
}

async function filterRecipes() {
  const ingredients = document.getElementById('ingredients').value;
  const dietary = document.getElementById('dietary').value;
  const cuisine = document.getElementById('cuisine').value;
  let url = `${API}/recipe/filter-by-ingredients?ingredients=${ingredients}`;
  if (dietary) url += `&dietary=${dietary}`;
  if (cuisine) url += `&cuisine=${cuisine}`;
  const res = await fetch(url);
  const meals = await res.json();
  renderRecipes(meals);
}

function renderRecipes(meals) {
  const grid = document.getElementById('recipe-results');
  if (!meals || meals.length === 0) {
    grid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">No recipes found matching your criteria.</p>'; 
    return;
  }
  grid.innerHTML = meals.map(m => `
    <div class="recipe-card" onclick="viewDetail('${m.idMeal}')">
      <img src="${m.strMealThumb}" alt="${m.strMeal}" />
      <div class="recipe-card-body">
        <h3>${m.strMeal}</h3>
        <p>${m.strCategory} | ${m.strArea}</p>
        <button class="btn-main" style="width:100%; margin-top:10px;" 
                onclick="event.stopPropagation();addFavorite('${m.idMeal}','${m.strMeal}','${m.strMealThumb}')">
          Save to Favorites
        </button>
      </div>
    </div>`).join('');
}

// ... Rest of your Favorites/Detail/Preferences logic from the previous file ...
// Keep the viewDetail, addFavorite, and loadFavorites functions exactly as they were!

async function getRandom() {
  const res = await fetch(`${API}/recipe/random`);
  const meal = await res.json();
  showDetail(meal);
}

async function viewDetail(id) {
  const res = await fetch(`${API}/recipe/${id}`);
  const meal = await res.json();
  showDetail(meal);
}

function showDetail(meal) {
  document.getElementById('recipe-detail').innerHTML = `
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
    <h2>${meal.strMeal}</h2>
    <p><strong>Category:</strong> ${meal.strCategory} | <strong>Cuisine:</strong> ${meal.strArea}</p>
    <p style="margin-top:1rem">${meal.strInstructions}</p>
    <button class="btn-main" style="margin-top:20px" onclick="addFavorite('${meal.idMeal}','${meal.strMeal}','${meal.strMealThumb}')">
      Add to Favorites
    </button>`;
  showPage('detail');
}

window.onload = () => showPage('search');