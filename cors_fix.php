<?php
/**
 * CORS fix — add these headers at the TOP of your existing API file (index.php or api.php).
 * This allows your Render frontend to call this API without being blocked.
 */

// Allow requests from your Render app (replace with your actual Render URL)
$allowed_origins = [
    'https://recipe-finder-api-ds4e.onrender.com',
    'http://localhost',       // for local testing
    'http://127.0.0.1',       // for local testing
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // During development you can use wildcard — remove this in production
    header("Access-Control-Allow-Origin: *");
}

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request (browser sends this before the real request)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// ── Your existing API logic below this line ─────────────────────────────────

$id       = $_GET['i']        ?? null;   // single recipe by ID:  ?i=1
$search   = $_GET['s']        ?? null;   // search by name:       ?s=chicken
$category = $_GET['c']        ?? null;   // filter by category:   ?c=Chicken

// Example: return a single recipe
if ($id) {
    // $recipe = fetchFromDB($id);
    // echo json_encode($recipe);
    echo json_encode(["message" => "Recipe $id loaded"]);
    exit();
}

// Example: return all / filtered recipes
// $recipes = fetchAllFromDB($search, $category);
// echo json_encode($recipes);
echo json_encode(["message" => "List endpoint — connect your DB query here"]);