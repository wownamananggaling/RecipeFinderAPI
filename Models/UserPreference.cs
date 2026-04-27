public class UserPreference
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string DietaryType { get; set; } = string.Empty;
    public string ExcludedIngredients { get; set; } = string.Empty;
    public string PreferredCuisine { get; set; } = string.Empty;
    public int MaxCookingTime { get; set; } = 60;
}