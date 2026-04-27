using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class RecipeController : ControllerBase
{
    private readonly MealDbService _mealService;

    public RecipeController(MealDbService mealService)
    {
        _mealService = mealService;
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string q)
    {
        if (string.IsNullOrWhiteSpace(q))
            return BadRequest("Search query is required.");
        var meals = await _mealService.SearchMealsAsync(q);
        return Ok(meals);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var meal = await _mealService.GetMealByIdAsync(id);
        if (meal == null) return NotFound();
        return Ok(meal);
    }

    [HttpGet("random")]
    public async Task<IActionResult> GetRandom()
    {
        var meal = await _mealService.GetRandomMealAsync();
        return Ok(meal);
    }

    [HttpGet("filter-by-ingredients")]
    public async Task<IActionResult> FilterByIngredients(
        [FromQuery] string ingredients,
        [FromQuery] int? maxTime = null,
        [FromQuery] string? dietary = null,
        [FromQuery] string? cuisine = null)
    {
        if (string.IsNullOrWhiteSpace(ingredients))
            return BadRequest("Please provide at least one ingredient.");

        var ingredientList = ingredients
            .Split(',', StringSplitOptions.RemoveEmptyEntries)
            .Select(i => i.Trim().ToLower())
            .ToList();

        var allMeals = new List<Meal>();
        foreach (var ingredient in ingredientList)
        {
            var results = await _mealService.SearchMealsAsync(ingredient);
            allMeals.AddRange(results);
        }

        var matched = allMeals
            .GroupBy(m => m.IdMeal)
            .OrderByDescending(g => g.Count())
            .Select(g => g.First())
            .ToList();

        if (!string.IsNullOrWhiteSpace(dietary))
            matched = matched
                .Where(m => m.StrCategory != null &&
                    m.StrCategory.ToLower().Contains(dietary.ToLower()))
                .ToList();

        if (!string.IsNullOrWhiteSpace(cuisine))
            matched = matched
                .Where(m => m.StrArea != null &&
                    m.StrArea.ToLower().Contains(cuisine.ToLower()))
                .ToList();

        return Ok(matched);
    }
}