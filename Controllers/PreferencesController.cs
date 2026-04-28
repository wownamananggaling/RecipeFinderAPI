using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PreferencesController : ControllerBase
{
    private readonly AppDbContext _db;

    public PreferencesController(AppDbContext db)
    {
        _db = db;
    }

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetPreferences()
    {
        var pref = await _db.UserPreferences
            .FirstOrDefaultAsync(p => p.UserId == GetUserId());
        if (pref == null)
            return Ok(new UserPreference()); // return defaults instead of 404
        return Ok(pref);
    }

    [HttpPost]
    public async Task<IActionResult> SavePreferences([FromBody] SavePreferencesDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = GetUserId();
        var existing = await _db.UserPreferences
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (existing != null)
        {
            existing.DietaryType = dto.DietaryType ?? string.Empty;
            existing.ExcludedIngredients = dto.ExcludedIngredients ?? string.Empty;
            existing.PreferredCuisine = dto.PreferredCuisine ?? string.Empty;
            existing.MaxCookingTime = dto.MaxCookingTime > 0 ? dto.MaxCookingTime : 60;
        }
        else
        {
            _db.UserPreferences.Add(new UserPreference
            {
                UserId = userId,
                DietaryType = dto.DietaryType ?? string.Empty,
                ExcludedIngredients = dto.ExcludedIngredients ?? string.Empty,
                PreferredCuisine = dto.PreferredCuisine ?? string.Empty,
                MaxCookingTime = dto.MaxCookingTime > 0 ? dto.MaxCookingTime : 60
            });
        }

        await _db.SaveChangesAsync();
        return Ok("Preferences saved.");
    }
}

public record SavePreferencesDto(
    string? DietaryType,
    string? ExcludedIngredients,
    string? PreferredCuisine,
    int MaxCookingTime
);
