using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class PreferencesController : ControllerBase
{
    private readonly AppDbContext _db;

    public PreferencesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetPreferences(int userId)
    {
        var pref = await _db.UserPreferences
            .FirstOrDefaultAsync(p => p.UserId == userId);
        if (pref == null) return NotFound("No preferences set.");
        return Ok(pref);
    }

    [HttpPost]
    public async Task<IActionResult> SavePreferences([FromBody] UserPreference pref)
    {
        var existing = await _db.UserPreferences
            .FirstOrDefaultAsync(p => p.UserId == pref.UserId);

        if (existing != null)
        {
            existing.DietaryType = pref.DietaryType;
            existing.ExcludedIngredients = pref.ExcludedIngredients;
            existing.PreferredCuisine = pref.PreferredCuisine;
            existing.MaxCookingTime = pref.MaxCookingTime;
        }
        else
        {
            _db.UserPreferences.Add(pref);
        }

        await _db.SaveChangesAsync();
        return Ok("Preferences saved.");
    }
}