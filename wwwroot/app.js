const API = '/api';

// Safe storage wrapper — never crashes even if storage is blocked
const store = (() => {
  const mem = {};
  try {
    sessionStorage.setItem('_t', '1');
    sessionStorage.removeItem('_t');
    return {
      get: k => sessionStorage.getItem(k),
      set: (k, v) => sessionStorage.setItem(k, v),
      del: k => sessionStorage.removeItem(k)
    };
  } catch (e) {
    return {
      get: k => mem[k] != null ? mem[k] : null,
      set: (k, v) => { mem[k] = v; },
      del: k => { delete mem[k]; }
    };
  }
})();

let token = store.get('token') || '';
let userId = parseInt(store.get('userId') || '0');

// ── Helpers ──────────────────────────────────────────────────────────────────

function authHeaders() {
  return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
}

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showNav(visible) {
  document.getElementById('nav-links').style.display = visible ? 'flex' : 'none';
}

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  if (name === 'favorites') loadFavorites();
  if (name === 'preferences') loadPreferences();
}

function setError(id, msg) {
  document.getElementById(id).textContent = msg;
}

function setLoading(containerId, loading) {
  const el = document.getElementById(containerId);
  if (loading) el.innerHTML = '<p class="loading">Loading…</p>';
}

function logout() {
  token = ''; userId = 0;
  store.del('token');
  store.del('userId');
  showNav(false);
  showPage('login');
}

// ── Auth ─────────────────────────────────────────────────────────────────────

async function login() {
  setError('login-error', '');
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    setError('login-error', 'Please fill in all fields.');
    return;
  }

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      setError('login-error', 'Invalid email or password.');
      return;
    }
    const data = await res.json();
    token = data.token;
    userId = data.userId;
    store.set('token', token);
    store.set('userId', userId);
    showNav(true);
    showPage('search');
  } catch {
    setError('login-error', 'Network error. Please try again.');
  }
}

async function register() {
  setError('reg-error', '');
  const username = document.getElementById('reg-username').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;

  if (!username || !email || !password) {
    setError('reg-error', 'Please fill in all fields.');
    return;
  }
  if (password.length < 8) {
    setError('reg-error', 'Password must be at least 8 characters.');
    return;
  }

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    if (!res.ok) {
      const msg = await res.text();
      setError('reg-error', msg || 'Registration failed.');
      return;
    }
    alert('Registered successfully! Please login.');
    showPage('login');
  } catch {
    setError('reg-error', 'Network error. Please try again.');
  }
}

// ── Recipes ──────────────────────────────────────────────────────────────────

async function searchRecipes() {
  const q = document.getElementById('search-query').value.trim();
  if (!q) return;
  setLoading('recipe-results', true);
  try {
    const res = await fetch(`${API}/recipe/search?q=${encodeURIComponent(q)}`);
    const meals = await res.json();
    renderRecipes(meals);
  } catch {
    document.getElementById('recipe-results').innerHTML = '<p class="error">Failed to load recipes.</p>';
  }
}

async function filterRecipes() {
  const ingredients = document.getElementById('ingredients').value.trim();
  const dietary = document.getElementById('dietary').value.trim();
  const cuisine = document.getElementById('cuisine').value.trim();
  if (!ingredients) { alert('Please enter at least one ingredient.'); return; }

  setLoading('recipe-results', true);
  let url = `${API}/recipe/filter-by-ingredients?ingredients=${encodeURIComponent(ingredients)}`;
  if (dietary) url += `&dietary=${encodeURIComponent(dietary)}`;
  if (cuisine) url += `&cuisine=${encodeURIComponent(cuisine)}`;

  try {
    const res = await fetch(url);
    const meals = await res.json();
    renderRecipes(meals);
  } catch {
    document.getElementById('recipe-results').innerHTML = '<p class="error">Failed to load recipes.</p>';
  }
}

async function getRandom() {
  try {
    const res = await fetch(`${API}/recipe/random`);
    const meal = await res.json();
    showDetail(meal);
  } catch {
    alert('Failed to load random recipe.');
  }
}

function renderRecipes(meals) {
  const grid = document.getElementById('recipe-results');
  if (!meals || meals.length === 0) {
    grid.innerHTML = '<p>No recipes found.</p>';
    return;
  }
  grid.innerHTML = meals.map(m => `
    <div class="recipe-card" onclick="viewDetail('${esc(m.idMeal)}')">
      <img src="${esc(m.strMealThumb)}" alt="${esc(m.strMeal)}" loading="lazy" />
      <div class="recipe-card-body">
        <h3>${esc(m.strMeal)}</h3>
        <p>${esc(m.strCategory)} | ${esc(m.strArea)}</p>
        <button onclick="event.stopPropagation();addFavorite('${esc(m.idMeal)}','${esc(m.strMeal)}','${esc(m.strMealThumb)}')">
          ♥ Save
        </button>
      </div>
    </div>`).join('');
}

async function viewDetail(id) {
  try {
    const res = await fetch(`${API}/recipe/${encodeURIComponent(id)}`);
    const meal = await res.json();
    showDetail(meal);
  } catch {
    alert('Failed to load recipe.');
  }
}

function showDetail(meal) {
  const youtubeLink = meal.strYoutube
    ? `<a href="${esc(meal.strYoutube)}" target="_blank" rel="noopener">▶ Watch on YouTube</a>`
    : '';
  document.getElementById('recipe-detail').innerHTML = `
    <img src="${esc(meal.strMealThumb)}" alt="${esc(meal.strMeal)}" />
    <h2>${esc(meal.strMeal)}</h2>
    <p><strong>Category:</strong> ${esc(meal.strCategory)} &nbsp;|&nbsp; <strong>Cuisine:</strong> ${esc(meal.strArea)}</p>
    <p>${esc(meal.strInstructions)}</p>
    ${youtubeLink}
    <br/><br/>
    <button onclick="addFavorite('${esc(meal.idMeal)}','${esc(meal.strMeal)}','${esc(meal.strMealThumb)}')">
      ♥ Save to Favorites
    </button>`;
  showPage('detail');
}

// ── Favorites ─────────────────────────────────────────────────────────────────

async function addFavorite(mealId, mealName, mealThumb) {
  if (!token) { alert('Please log in to save favorites.'); return; }
  try {
    const res = await fetch(`${API}/favorites`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ mealId, mealName, mealThumb })
    });
    if (res.ok) alert('Saved to favorites!');
    else if (res.status === 409) alert('Already in favorites.');
    else alert('Could not save favorite.');
  } catch {
    alert('Network error.');
  }
}

async function loadFavorites() {
  if (!token) return;
  setLoading('favorites-list', true);
  try {
    const res = await fetch(`${API}/favorites`, { headers: authHeaders() });
    const favs = await res.json();
    const list = document.getElementById('favorites-list');
    if (!favs || favs.length === 0) {
      list.innerHTML = '<p>No favorites yet.</p>';
      return;
    }
    list.innerHTML = favs.map(f => `
      <div class="recipe-card">
        <img src="${esc(f.mealThumb)}" alt="${esc(f.mealName)}" loading="lazy" />
        <div class="recipe-card-body">
          <h3>${esc(f.mealName)}</h3>
          <button onclick="viewDetail('${esc(f.mealId)}')">View</button>
          <button onclick="removeFavorite('${esc(f.mealId)}')" class="btn-remove">Remove</button>
        </div>
      </div>`).join('');
  } catch {
    document.getElementById('favorites-list').innerHTML = '<p class="error">Failed to load favorites.</p>';
  }
}

async function removeFavorite(mealId) {
  if (!confirm('Remove from favorites?')) return;
  await fetch(`${API}/favorites/${encodeURIComponent(mealId)}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  loadFavorites();
}

// ── Preferences ───────────────────────────────────────────────────────────────

async function loadPreferences() {
  if (!token) return;
  try {
    const res = await fetch(`${API}/preferences`, { headers: authHeaders() });
    if (!res.ok) return;
    const pref = await res.json();
    document.getElementById('pref-dietary').value = pref.dietaryType || '';
    document.getElementById('pref-excluded').value = pref.excludedIngredients || '';
    document.getElementById('pref-cuisine').value = pref.preferredCuisine || '';
    document.getElementById('pref-time').value = pref.maxCookingTime || '';
  } catch { /* silently ignore */ }
}

async function savePreferences() {
  const pref = {
    dietaryType: document.getElementById('pref-dietary').value,
    excludedIngredients: document.getElementById('pref-excluded').value,
    preferredCuisine: document.getElementById('pref-cuisine').value,
    maxCookingTime: parseInt(document.getElementById('pref-time').value) || 60
  };
  try {
    const res = await fetch(`${API}/preferences`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(pref)
    });
    const msg = document.getElementById('pref-msg');
    if (res.ok) {
      msg.textContent = 'Preferences saved!';
      msg.className = 'success';
    } else {
      msg.textContent = 'Failed to save preferences.';
      msg.className = 'error';
    }
  } catch {
    document.getElementById('pref-msg').textContent = 'Network error.';
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const active = document.querySelector('.page.active')?.id;
    if (active === 'page-login') login();
    else if (active === 'page-register') register();
    else if (active === 'page-search') searchRecipes();
  }
});

window.onload = () => {
  if (token) {
    showNav(true);
    showPage('search');
  } else {
    showNav(false);
    showPage('login');
  }
};
