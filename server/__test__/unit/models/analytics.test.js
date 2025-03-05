const AnalyticsModel = require("../../../models/analytics");
const db = require("../../../db/connect");

jest.mock("../../../db/connect");

describe("AnalyticsModel", () => {
    beforeEach(() => jest.clearAllMocks());
    afterAll(() => jest.resetAllMocks());

    // Helper function to generate test cases
    const testQueries = [
        { method: "getStockValueByCategory", mockData: [{ category: "Dairy", total_value: 500 }] },
        { method: "getExpiringSoon", mockData: [{ name: "Milk", quantity: 5, expiry_date: "2024-03-30" }] },
        { method: "getMostCommonIngredients", mockData: [{ ingredient_name: "Tomato", total_recipe_usage: 100 }] },
        { method: "getMostUsedIngredients", mockData: [{ ingredient_name: "Cheese", total_used: 50 }] },
        { method: "getMostOrderedDishes", mockData: [{ name: "Pizza", total_orders: 20 }] },
        { method: "getStockUsageTrend", mockData: [{ date: "2024-03-01", ingredient_name: "Flour", total_used: 30, unit: "kg" }] },
        { method: "getStockLevelsByCategory", mockData: [{ category: "Vegetables", total_quantity: 200 }] },
        { method: "getIngredientCategoryDistribution", mockData: [{ category: "Meat", ingredient_count: 10, total_quantity: 100, total_value: 500 }] },
        { method: "getRestaurantPerformance", mockData: [{ restaurant: "Pizza Haven", total_orders: 150, total_revenue: 10000 }] },
        { method: "getRevenueTrends", mockData: [{ date: "2024-03", total_revenue: 5000 }] },
        { method: "getLiveOrderStatus", mockData: [{ status: "preparing", total_orders: 5 }] },
    ];

    testQueries.forEach(({ method, mockData }) => {
        describe(method, () => {
            it(`should return ${method} data from the database`, async () => {
                db.query.mockResolvedValue({ rows: mockData });

                const result = await AnalyticsModel[method]();

                expect(db.query).toHaveBeenCalledTimes(1);
                expect(result).toEqual(mockData);
            });

            it(`should throw an error if ${method} query fails`, async () => {
                db.query.mockRejectedValue(new Error("Database error"));

                await expect(AnalyticsModel[method]()).rejects.toThrow("Database error");
            });
        });
    });
});