const Inventory = require("../models/inventory");

// GET Ingredient Usage Trends
async function getIngredientUsage(req, res) {
    try {
        const usageData = await Inventory.getIngredientUsage();
        res.status(200).json(usageData);
    } catch (error) {
        console.error("Error fetching ingredient usage:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// GET Expired vs Used Stock Ratio
async function getWasteAnalysis(req, res) {
    try {
        const wasteData = await Inventory.getWasteAnalysis();
        res.status(200).json(wasteData);
    } catch (error) {
        console.error("Error fetching waste analysis:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// GET Cost Analysis Over Time
async function getCostAnalysis(req, res) {
    try {
        const costData = await Inventory.getCostAnalysis();
        res.status(200).json(costData);
    } catch (error) {
        console.error("Error fetching cost analysis:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { getIngredientUsage, getWasteAnalysis, getCostAnalysis };