const AnalyticsModel = require("../models/analytics");

class AnalyticsController {
    // Get Stock Value by Category
    static async getStockValueByCategory(req, res) {
        try {
            const data = await AnalyticsModel.getStockValueByCategory();
            res.json(data);
        } catch (error) {
            console.error("Error fetching stock value by category:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // Get Expiring Soon Stock
    static async getExpiringSoon(req, res) {
        try {
            const data = await AnalyticsModel.getExpiringSoon();
            res.json(data);
        } catch (error) {
            console.error("Error fetching expiring stock:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // Get Most Used Ingredients
    static async getMostUsedIngredients(req, res) {
        try {
            const data = await AnalyticsModel.getMostUsedIngredients();
            res.json(data);
        } catch (error) {
            console.error("Error fetching most used ingredients:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // Get Most Ordered Dishes
    static async getMostOrderedDishes(req, res) {
        try {
            const data = await AnalyticsModel.getMostOrderedDishes();
            res.json(data);
        } catch (error) {
            console.error("Error fetching most ordered dishes:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // Get Stock Usage Trend
    static async getStockUsageTrend(req, res) {
        try {
            const data = await AnalyticsModel.getStockUsageTrend();
            res.json(data);
        } catch (error) {
            console.error("Error fetching stock usage trend:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // Get Stock Levels by Category
    static async getStockLevelsByCategory(req, res) {
        try {
            const data = await AnalyticsModel.getStockLevelsByCategory();
            res.json(data);
        } catch (error) {
            console.error("Error fetching stock levels:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // Get Ingredient Category Distribution
    static async getIngredientCategoryDistribution(req, res) {
        try {
            const data = await AnalyticsModel.getIngredientCategoryDistribution();
            res.json(data);
        } catch (error) {
            console.error("Error fetching dish category distribution:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // Get Restaurant Performance
    static async getRestaurantPerformance(req, res) {
        try {
            const data = await AnalyticsModel.getRestaurantPerformance();
            res.json(data);
        } catch (error) {
            console.error("Error fetching restaurant performance:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // Get Revenue Trends
    static async getRevenueTrends(req, res) {
        try {
            const data = await AnalyticsModel.getRevenueTrends();
            res.json(data);
        } catch (error) {
            console.error("Error fetching revenue trends:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // Get Live Order Status
    static async getLiveOrderStatus(req, res) {
        try {
            const data = await AnalyticsModel.getLiveOrderStatus();
            res.json(data);
        } catch (error) {
            console.error("Error fetching live order status:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

module.exports = AnalyticsController;