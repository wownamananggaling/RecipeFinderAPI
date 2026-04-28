using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FavoritesController : ControllerBase
{
    private readonly AppDbContext _db;

    public FavoritesController(AppDbContext db)
    {
        _db = db;
    }

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetFavorites()
    {
        var favorites = await _db.Favorites
            .Where(f => f.UserId == GetUserId())
            .ToListAsync();
        return Ok(favorites);
    }

    [HttpPost]
    public async Task<IActionResult> AddFavorite([FromBody] AddFavoriteDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = GetUserId();
        var exists = await _db.Favorites.AnyAsync(f =>
            f.UserId == userId && f.MealId == dto.MealId);
        if (exists)
            return Conflict("Already in favorites.");

        var favorite = new Favorite
        {
            UserId = userId,
            MealId = dto.MealId,
            MealName = dto.MealName,
            MealThumb = dto.MealThumb
        };

        _db.Favorites.Add(favorite);
        await _db.SaveChangesAsync();
        return Ok(favorite);
    }

    [HttpDelete("{mealId}")]
    public async Task<IActionResult> RemoveFavorite(string mealId)
    {
        var userId = GetUserId();
        var fav = await _db.Favorites.FirstOrDefaultAsync(f =>
            f.UserId == userId && f.MealId == mealId);
        if (fav == null)
            return NotFound();

        _db.Favorites.Remove(fav);
        await _db.SaveChangesAsync();
        return Ok("Removed from favorites.");
    }
}

public record AddFavoriteDto(
    [System.ComponentModel.DataAnnotations.Required] string MealId,
    [System.ComponentModel.DataAnnotations.Required] string MealName,
    string MealThumb
);
