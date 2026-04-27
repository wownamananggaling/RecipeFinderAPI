public class Favorite
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string MealId { get; set; } = string.Empty;
    public string MealName { get; set; } = string.Empty;
    public string MealThumb { get; set; } = string.Empty;
}