public class Meal
{
    public string IdMeal { get; set; }
    public string StrMeal { get; set; }
    public string StrCategory { get; set; }
    public string StrArea { get; set; }
    public string StrInstructions { get; set; }
    public string StrMealThumb { get; set; }
    public string StrYoutube { get; set; }
}

public class MealSearchResponse
{
    public List<Meal> Meals { get; set; }
}