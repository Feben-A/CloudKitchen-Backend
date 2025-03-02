const express = require("express");
const router = express.Router();
const AnalyticsController = require("../controllers/analytics");

// Define API endpoints
router.get("/stock-value-category", AnalyticsController.getStockValueByCategory);
router.get("/expiring-soon", AnalyticsController.getExpiringSoon);
router.get("/most-used-ingredients", AnalyticsController.getMostUsedIngredients);
router.get("/most-ordered-dishes", AnalyticsController.getMostOrderedDishes);
router.get("/stock-usage-trend", AnalyticsController.getStockUsageTrend);
router.get("/stock-levels-category", AnalyticsController.getStockLevelsByCategory);
router.get("/ingredient-category-distribution", AnalyticsController.getIngredientCategoryDistribution);
router.get("/restaurant-performance", AnalyticsController.getRestaurantPerformance);
router.get("/revenue-trends", AnalyticsController.getRevenueTrends);
router.get("/live-order-status", AnalyticsController.getLiveOrderStatus);

module.exports = router;