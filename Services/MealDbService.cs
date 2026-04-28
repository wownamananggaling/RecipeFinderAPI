public class MealDbService
{
    private readonly HttpClient _http;
    private const string BaseUrl = "https://www.themealdb.com/api/json/v1/1";

    public MealDbService(HttpClient http)
    {
        _http = http;
    }

    public async Task<List<Meal>> SearchMealsAsync(string query)
    {
        var response = await _http.GetFromJsonAsync<MealSearchResponse>(
            $"{BaseUrl}/search.php?s={Uri.EscapeDataString(query)}");
        return response?.Meals ?? new List<Meal>();
    }

    public async Task<Meal?> GetMealByIdAsync(string id)
    {
        var response = await _http.GetFromJsonAsync<MealSearchResponse>(
            $"{BaseUrl}/lookup.php?i={Uri.EscapeDataString(id)}");
        return response?.Meals?.FirstOrDefault();
    }

    public async Task<Meal?> GetRandomMealAsync()
    {
        var response = await _http.GetFromJsonAsync<MealSearchResponse>(
            $"{BaseUrl}/random.php");
        return response?.Meals?.FirstOrDefault();
    }
}
