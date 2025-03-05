const AnalyticsController = require("../../../controllers/analytics");
const AnalyticsModel = require("../../../models/analytics");

// Mock response methods
const mockSend = jest.fn();
const mockJson = jest.fn();
const mockEnd = jest.fn();

const mockStatus = jest.fn(() => ({
    send: mockSend,
    json: mockJson,
    end: mockEnd
}));

const mockRes = { status: mockStatus };

describe("AnalyticsController", () => {
    beforeEach(() => jest.clearAllMocks());
    afterAll(() => jest.resetAllMocks());

    // Helper function to generate test cases
    const testEndpoints = [
        { method: "getStockValueByCategory", modelMethod: "getStockValueByCategory", successData: [{ category: "Dairy", value: 500 }] },
        { method: "getExpiringSoon", modelMethod: "getExpiringSoon", successData: [{ name: "Milk", expiry_date: "2024-03-30" }] },
        { method: "getMostUsedIngredients", modelMethod: "getMostUsedIngredients", successData: [{ ingredient: "Tomato", usage: 100 }] },
        { method: "getMostOrderedDishes", modelMethod: "getMostOrderedDishes", successData: [{ dish: "Margherita Pizza", orders: 50 }] },
        { method: "getStockUsageTrend", modelMethod: "getStockUsageTrend", successData: [{ date: "2024-03-01", used: 30 }] },
        { method: "getStockLevelsByCategory", modelMethod: "getStockLevelsByCategory", successData: [{ category: "Vegetables", stock: 200 }] },
        { method: "getIngredientCategoryDistribution", modelMethod: "getIngredientCategoryDistribution", successData: [{ category: "Meat", percentage: 40 }] },
        { method: "getRestaurantPerformance", modelMethod: "getRestaurantPerformance", successData: [{ restaurant: "Pizza Haven", revenue: 10000 }] },
        { method: "getRevenueTrends", modelMethod: "getRevenueTrends", successData: [{ date: "2024-03", revenue: 5000 }] },
        { method: "getLiveOrderStatus", modelMethod: "getLiveOrderStatus", successData: [{ order_id: 1, status: "preparing" }] }
    ];

    testEndpoints.forEach(({ method, modelMethod, successData }) => {
        describe(method, () => {
            it(`should return ${method} data with 200`, async () => {
                jest.spyOn(AnalyticsModel, modelMethod).mockResolvedValue(successData);

                await AnalyticsController[method](null, mockRes);

                expect(AnalyticsModel[modelMethod]).toHaveBeenCalledTimes(1);
                expect(mockStatus).toHaveBeenCalledWith(200);
                expect(mockJson).toHaveBeenCalledWith(successData);
            });

            it(`should return 500 if ${method} fails`, async () => {
                jest.spyOn(AnalyticsModel, modelMethod).mockRejectedValue(new Error("DB Error"));

                await AnalyticsController[method](null, mockRes);

                expect(mockStatus).toHaveBeenCalledWith(500);
                expect(mockJson).toHaveBeenCalledWith({ error: "Internal Server Error" });
            });
        });
    });
});