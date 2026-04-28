const API = 'https://recipe-finder-api-ds4e.onrender.com/api';
let token = localStorage.getItem('token') || '';
let userId = parseInt(localStorage.getItem('userId') || '0');

function showNav(visible) {
  document.getElementById('nav-links').style.display = visible ? 'flex' : 'none';
}

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  if (name === 'favorites') loadFavorites();
  if (name === 'preferences') loadPreferences();
}

function logout() {
  token = ''; userId = 0;
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  showNav(false);
  showPage('login');
}

async function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    document.getElementById('login-error').textContent = 'Invalid email or password.';
    return;
  }
  const data = await res.json();
  token = data.token;
  userId = data.userId || 1;
  localStorage.setItem('token', token);
  localStorage.setItem('userId', userId);
  showNav(true);
  showPage('search');
}

async function register() {
  const username = document.getElementById('reg-username').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ username, email, password })
  });
  if (!res.ok) {
    document.getElementById('reg-error').textContent = 'Registration failed.';
    return;
  }
  alert('Registered successfully! Please login.');
  showPage('login');
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

async function getRandom() {
  const res = await fetch(`${API}/recipe/random`);
  const meal = await res.json();
  showDetail(meal);
}

function renderRecipes(meals) {
  const grid = document.getElementById('recipe-results');
  if (!meals || meals.length === 0) {
    grid.innerHTML = '<p>No recipes found.</p>'; return;
  }
  grid.innerHTML = meals.map(m => `
    <div class="recipe-card" onclick="viewDetail('${m.idMeal}')">
      <img src="${m.strMealThumb}" alt="${m.strMeal}" />
      <div class="recipe-card-body">
        <h3>${m.strMeal}</h3>
        <p>${m.strCategory} | ${m.strArea}</p>
        <button onclick="event.stopPropagation();addFavorite('${m.idMeal}','${m.strMeal}','${m.strMealThumb}')">
          Save
        </button>
      </div>
    </div>`).join('');
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
    <p>${meal.strInstructions}</p>
    <button onclick="addFavorite('${meal.idMeal}','${meal.strMeal}','${meal.strMealThumb}')">
      Save to Favorites
    </button>`;
  showPage('detail');
}

async function addFavorite(mealId, mealName, mealThumb) {
  const res = await fetch(`${API}/favorites`, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ userId, mealId, mealName, mealThumb })
  });
  if (res.ok) alert('Saved to favorites!');
  else alert('Already in favorites or error saving.');
}

async function loadFavorites() {
  const res = await fetch(`${API}/favorites/${userId}`);
  const favs = await res.json();
  const list = document.getElementById('favorites-list');
  if (!favs || favs.length === 0) {
    list.innerHTML = '<p>No favorites yet.</p>'; return;
  }
  list.innerHTML = favs.map(f => `
    <div class="recipe-card">
      <img src="${f.mealThumb}" alt="${f.mealName}" />
      <div class="recipe-card-body">
        <h3>${f.mealName}</h3>
        <button onclick="removeFavorite('${f.mealId}')">Remove</button>
      </div>
    </div>`).join('');
}

async function removeFavorite(mealId) {
  await fetch(`${API}/favorites/${userId}/${mealId}`, { method: 'DELETE' });
  loadFavorites();
}

async function loadPreferences() {
  const res = await fetch(`${API}/preferences/${userId}`);
  if (!res.ok) return;
  const pref = await res.json();
  document.getElementById('pref-dietary').value = pref.dietaryType || '';
  document.getElementById('pref-excluded').value = pref.excludedIngredients || '';
  document.getElementById('pref-cuisine').value = pref.preferredCuisine || '';
  document.getElementById('pref-time').value = pref.maxCookingTime || '';
}

async function savePreferences() {
  const pref = {
    userId,
    dietaryType: document.getElementById('pref-dietary').value,
    excludedIngredients: document.getElementById('pref-excluded').value,
    preferredCuisine: document.getElementById('pref-cuisine').value,
    maxCookingTime: parseInt(document.getElementById('pref-time').value) || 60
  };
  const res = await fetch(`${API}/preferences`, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify(pref)
  });
  if (res.ok) document.getElementById('pref-msg').textContent = 'Preferences saved!';
}

window.onload = () => {
  if (token) {
    showNav(true);
    showPage('search');
  } else {
    showNav(false);
    showPage('login');
  }
};