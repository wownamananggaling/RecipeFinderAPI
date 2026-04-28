/**
 * Recipe Finder — app.js
 * Handles all UI interactions, state, and API calls.
 */

// ── Sample Data ────────────────────────────────────────────────────────────────
// Replace this with your actual API endpoint fetch if needed.
const RECIPES = [
  {
    id: 1,
    title: 'Chicken Mandi',
    category: 'Chicken',
    cuisine: 'Indian',
    time: '60 min',
    difficulty: 'Medium',
    steps: [
      'Clean and cut the chicken. Marinate briefly with salt, turmeric and a little oil.',
      'Rinse and soak basmati rice for 20 to 30 minutes.',
      'In a large pot, heat ghee or oil and fry chopped onion until golden brown.',
      'Add minced garlic and green chillies. Fry for 2 minutes until fragrant.',
      'Add the marinated chicken and cook until browned on all sides.',
      'Add spices: cumin, cardamom, cinnamon, bay leaf, and black pepper. Stir well.',
      'Pour in water or broth and bring to a boil. Drain the soaked rice and add it in.',
      'Cover and cook on low heat for 20 minutes. Serve garnished with fried onions and fresh coriander.'
    ]
  },
  {
    id: 2,
    title: 'Butter Chicken',
    category: 'Chicken',
    cuisine: 'Indian',
    time: '45 min',
    difficulty: 'Easy',
    steps: [
      'Marinate chicken in yogurt, lemon juice, turmeric, and garam masala for at least 1 hour.',
      'Grill or pan-fry the chicken until charred and cooked through. Set aside.',
      'In a separate pan, heat butter and saute onions, garlic, and ginger until soft.',
      'Add tomatoes and cook until they break down into a thick sauce.',
      'Blend the sauce until smooth, then return to the pan over medium heat.',
      'Stir in cream, a pinch of sugar, and the cooked chicken. Simmer for 10 minutes.',
      'Season with salt and serve hot with naan or basmati rice.'
    ]
  },
  {
    id: 3,
    title: 'Prawn Curry',
    category: 'Seafood',
    cuisine: 'Indian',
    time: '30 min',
    difficulty: 'Easy',
    steps: [
      'Clean and devein the prawns. Season with salt and turmeric.',
      'Heat oil in a pan and fry mustard seeds until they begin to pop.',
      'Add onions and cook until golden. Stir in ginger-garlic paste and cook 1 minute.',
      'Add chopped tomatoes, chilli powder, and coriander powder. Cook for 5 minutes.',
      'Add the seasoned prawns and cook on medium heat for 5 to 7 minutes.',
      'Pour in coconut milk and simmer for 3 minutes until the sauce thickens slightly.',
      'Garnish with fresh coriander and serve with steamed rice.'
    ]
  },
  {
    id: 4,
    title: 'Dal Makhani',
    category: 'Vegetarian',
    cuisine: 'Indian',
    time: '90 min',
    difficulty: 'Medium',
    steps: [
      'Soak black lentils and kidney beans overnight. Drain and boil until completely tender.',
      'In a heavy pan, heat butter and add bay leaf and cumin seeds. Let them splutter.',
      'Add onions and cook until deep golden brown. Add ginger-garlic paste and fry 2 minutes.',
      'Add tomato puree and cook on medium heat until oil separates from the mixture.',
      'Add the cooked lentils and beans. Mash a portion for a creamy, thick texture.',
      'Stir in fresh cream and simmer on very low heat for 20 minutes, stirring occasionally.',
      'Season with salt and garam masala. Serve with butter roti or jeera rice.'
    ]
  },
  {
    id: 5,
    title: 'Beef Rendang',
    category: 'Beef',
    cuisine: 'Asian',
    time: '120 min',
    difficulty: 'Hard',
    steps: [
      'Blend shallots, garlic, ginger, galangal, dried chilli, and lemongrass into a smooth paste.',
      'Cut beef into large chunks. Brown in hot oil in batches and set aside.',
      'In the same pot, fry the spice paste on medium heat until fragrant and oil separates.',
      'Add the beef back in along with coconut milk, kaffir lime leaves, and toasted coconut.',
      'Cook uncovered on medium heat, stirring frequently as the liquid reduces.',
      'Continue cooking until the sauce is nearly dry and coats the beef in a dark, rich crust.',
      'Serve with steamed white rice or ketupat.'
    ]
  },
  {
    id: 6,
    title: 'Mango Sticky Rice',
    category: 'Dessert',
    cuisine: 'Asian',
    time: '40 min',
    difficulty: 'Easy',
    steps: [
      'Soak glutinous rice in cold water overnight. Drain and steam for 25 minutes until cooked.',
      'In a saucepan, combine coconut milk, sugar, and a pinch of salt. Warm until sugar dissolves.',
      'Pour half the coconut mixture over the hot steamed rice and fold gently. Cover and rest 10 minutes.',
      'Slice fresh ripe mangoes into fans or thick pieces.',
      'Plate the sticky rice alongside the mango slices.',
      'Drizzle the remaining warm coconut cream over the top.',
      'Sprinkle with toasted sesame seeds or crispy split mung beans to finish.'
    ]
  }
];

// ── State ──────────────────────────────────────────────────────────────────────
let currentPage = 'search';
let currentRecipeId = null;
let currentFilter = 'All';
let favorites = loadFavorites();
let preferences = loadPreferences();

// ── DOM References ─────────────────────────────────────────────────────────────
const menuBtn       = document.getElementById('menuBtn');
const navDrawer     = document.getElementById('navDrawer');
const navOverlay    = document.getElementById('navOverlay');
const navClose      = document.getElementById('navClose');
const searchInput   = document.getElementById('searchInput');
const searchBtn     = document.getElementById('searchBtn');
const filterRow     = document.getElementById('filterRow');
const recipeGrid    = document.getElementById('recipeGrid');
const backBtn       = document.getElementById('backBtn');
const detailTitle   = document.getElementById('detailTitle');
const detailMeta    = document.getElementById('detailMeta');
const detailSteps   = document.getElementById('detailSteps');
const favBtn        = document.getElementById('favBtn');
const favBtnText    = document.getElementById('favBtnText');
const favsEmpty     = document.getElementById('favsEmpty');
const favsGrid      = document.getElementById('favsGrid');
const savePrefBtn   = document.getElementById('savePrefBtn');
const toast         = document.getElementById('toast');

// ── Navigation ─────────────────────────────────────────────────────────────────
function showPage(name) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Show target page
  const target = document.getElementById('page-' + name);
  if (target) target.classList.add('active');

  // Update bottom nav (detail page keeps search tab active)
  const activeTab = name === 'detail' ? 'search' : name;
  document.querySelectorAll('.bottom-nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === activeTab);
  });

  // Update drawer nav items
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === name);
  });

  currentPage = name;

  if (name === 'favorites') renderFavorites();
  if (name === 'prefs') syncPreferenceToggles();
}

function openNav() {
  navDrawer.classList.add('open');
  navOverlay.classList.add('open');
}

function closeNav() {
  navDrawer.classList.remove('open');
  navOverlay.classList.remove('open');
}

// ── Event Listeners ────────────────────────────────────────────────────────────
menuBtn.addEventListener('click', openNav);
navClose.addEventListener('click', closeNav);
navOverlay.addEventListener('click', closeNav);

// Drawer nav items
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    showPage(btn.dataset.page);
    closeNav();
  });
});

// Bottom nav items
document.querySelectorAll('.bottom-nav-item').forEach(btn => {
  btn.addEventListener('click', () => showPage(btn.dataset.page));
});

// Search
searchBtn.addEventListener('click', renderGrid);
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') renderGrid();
});

// Filter chips
filterRow.addEventListener('click', e => {
  const chip = e.target.closest('.filter-chip');
  if (!chip) return;
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  currentFilter = chip.dataset.filter;
  renderGrid();
});

// Back button on detail page
backBtn.addEventListener('click', () => showPage('search'));

// Favorite button
favBtn.addEventListener('click', toggleFavorite);

// Save preferences
savePrefBtn.addEventListener('click', savePreferences);

// Preference toggles
document.querySelectorAll('.toggle').forEach(btn => {
  btn.addEventListener('click', () => btn.classList.toggle('on'));
});

// ── Render Recipe Grid ─────────────────────────────────────────────────────────
function renderGrid() {
  const query = searchInput.value.trim().toLowerCase();

  let list = RECIPES;

  // Apply category filter
  if (currentFilter !== 'All') {
    list = list.filter(r => r.category === currentFilter);
  }

  // Apply search query
  if (query) {
    list = list.filter(r =>
      r.title.toLowerCase().includes(query) ||
      r.cuisine.toLowerCase().includes(query) ||
      r.category.toLowerCase().includes(query)
    );
  }

  if (!list.length) {
    recipeGrid.innerHTML = '<div class="empty-msg">No recipes found. Try a different search or filter.</div>';
    return;
  }

  recipeGrid.innerHTML = list.map(r => recipeCardHTML(r, 'openDetail')).join('');
}

function recipeCardHTML(r, clickFn) {
  return `
    <div class="recipe-card" onclick="${clickFn}(${r.id})" role="button" tabindex="0">
      <div class="recipe-card-img">
        <div class="img-placeholder">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c8956c" stroke-width="1.5">
            <path d="M3 11l19-9-9 19-2-8-8-2z"/>
          </svg>
        </div>
      </div>
      <div class="recipe-card-body">
        <div>
          <div class="recipe-card-title">${r.title}</div>
          <div class="recipe-card-meta">${r.cuisine} &middot; ${r.time}</div>
        </div>
        <div class="recipe-card-tags">
          <span class="tag">${r.category}</span>
          <span class="tag">${r.difficulty}</span>
        </div>
      </div>
    </div>
  `;
}

// ── Recipe Detail ──────────────────────────────────────────────────────────────
function openDetail(id) {
  const recipe = RECIPES.find(r => r.id === id);
  if (!recipe) return;

  currentRecipeId = id;

  detailTitle.textContent = recipe.title;

  detailMeta.innerHTML = `
    <span class="meta-badge cuisine">${recipe.cuisine}</span>
    <span class="meta-badge">${recipe.category}</span>
    <span class="meta-badge">${recipe.time}</span>
    <span class="meta-badge">${recipe.difficulty}</span>
  `;

  detailSteps.innerHTML = recipe.steps.map((step, i) => `
    <div class="instruction-step">
      <div class="step-num">${i + 1}</div>
      <div class="step-text">${step}</div>
    </div>
  `).join('');

  updateFavButton(id);
  showPage('detail');
}

function updateFavButton(id) {
  const isSaved = favorites.includes(id);
  favBtn.classList.toggle('saved', isSaved);
  favBtnText.textContent = isSaved ? 'Saved to Favorites' : 'Save to Favorites';
  const icon = favBtn.querySelector('svg');
  icon.setAttribute('fill', isSaved ? 'currentColor' : 'none');
}

function toggleFavorite() {
  if (!currentRecipeId) return;
  const idx = favorites.indexOf(currentRecipeId);
  if (idx > -1) {
    favorites.splice(idx, 1);
    showToast('Removed from Favorites');
  } else {
    favorites.push(currentRecipeId);
    showToast('Saved to Favorites');
  }
  saveFavorites();
  updateFavButton(currentRecipeId);
}

// ── Favorites ──────────────────────────────────────────────────────────────────
function renderFavorites() {
  const list = RECIPES.filter(r => favorites.includes(r.id));

  if (!list.length) {
    favsEmpty.style.display = 'flex';
    favsGrid.style.display = 'none';
    return;
  }

  favsEmpty.style.display = 'none';
  favsGrid.style.display = 'flex';
  favsGrid.innerHTML = list.map(r => recipeCardHTML(r, 'openDetail')).join('');
}

// ── Preferences ────────────────────────────────────────────────────────────────
function syncPreferenceToggles() {
  document.querySelectorAll('.toggle[data-pref]').forEach(btn => {
    const key = btn.dataset.pref;
    btn.classList.toggle('on', !!preferences[key]);
  });
}

function savePreferences() {
  document.querySelectorAll('.toggle[data-pref]').forEach(btn => {
    preferences[btn.dataset.pref] = btn.classList.contains('on');
  });
  localStorage.setItem('rf_prefs', JSON.stringify(preferences));
  showToast('Preferences saved');
}

function loadPreferences() {
  try {
    return JSON.parse(localStorage.getItem('rf_prefs')) || {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
      indian: true,
      asian: true,
      mediterranean: false,
      western: false
    };
  } catch {
    return {};
  }
}

// ── Persistence ────────────────────────────────────────────────────────────────
function saveFavorites() {
  localStorage.setItem('rf_favorites', JSON.stringify(favorites));
}

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem('rf_favorites')) || [];
  } catch {
    return [];
  }
}

// ── Toast ──────────────────────────────────────────────────────────────────────
let toastTimer = null;

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

// ── Init ───────────────────────────────────────────────────────────────────────
renderGrid();