using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class FavoritesController : ControllerBase
{
    private readonly AppDbContext _db;

    public FavoritesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetFavorites(int userId)
    {
        var favorites = await _db.Favorites
            .Where(f => f.UserId == userId)
            .ToListAsync();
        return Ok(favorites);
    }

    [HttpPost]
    public async Task<IActionResult> AddFavorite([FromBody] Favorite favorite)
    {
        var exists = await _db.Favorites.AnyAsync(f =>
            f.UserId == favorite.UserId && f.MealId == favorite.MealId);
        if (exists) return BadRequest("Already in favorites.");

        _db.Favorites.Add(favorite);
        await _db.SaveChangesAsync();
        return Ok(favorite);
    }

    [HttpDelete("{userId}/{mealId}")]
    public async Task<IActionResult> RemoveFavorite(int userId, string mealId)
    {
        var fav = await _db.Favorites.FirstOrDefaultAsync(f =>
            f.UserId == userId && f.MealId == mealId);
        if (fav == null) return NotFound();

        _db.Favorites.Remove(fav);
        await _db.SaveChangesAsync();
        return Ok("Removed from favorites.");
    }
}