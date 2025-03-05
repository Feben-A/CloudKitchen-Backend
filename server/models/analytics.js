const db = require("../db/connect");

class AnalyticsModel {
    
    static async getStockValueByCategory() {
        const query = `
            SELECT 
                INITCAP(category) AS category, 
                ROUND(SUM(quantity * price_per_unit), 2) AS total_value  
            FROM Inventory
            GROUP BY category
            ORDER BY total_value DESC;
        `;
        const { rows } = await db.query(query);
        return rows;
    }

    static async getExpiringSoon() {
        const query = `
            SELECT 
                name, 
                CAST(quantity AS FLOAT) AS quantity,  
                TO_CHAR(expiry_date, 'YYYY-MM-DD') AS expiry_date  
            FROM Inventory
            WHERE expiry_date BETWEEN NOW() AND NOW() + INTERVAL '7 days'
            ORDER BY expiry_date ASC;
        `;
        const { rows } = await db.query(query);
        return rows;
    }

    static async getMostCommonIngredients() {
        const query = `
            SELECT 
                ingredient_name, 
                CAST(SUM(quantity_required) AS FLOAT) AS total_recipe_usage
            FROM Recipes
            WHERE ingredient_name IS NOT NULL
            GROUP BY ingredient_name
            ORDER BY total_recipe_usage DESC
            LIMIT 10;
        `;
        const { rows } = await db.query(query);
        return rows;
    }


    static async getMostUsedIngredients() {
        const query = `
                SELECT 
                    r.ingredient_name, 
                    CAST(SUM(r.quantity_required * omi.quantity) AS FLOAT) AS total_used
                FROM Order_Menu_Items omi
                JOIN Recipes r ON omi.menu_item_id = r.menu_item_id
                JOIN Orders o ON omi.order_id = o.order_id
                GROUP BY r.ingredient_name
                ORDER BY total_used DESC
                LIMIT 10;
        `;
        const { rows } = await db.query(query);
        return rows;
    }

    static async getMostOrderedDishes() {
        const query = `
            SELECT 
                mi.name, 
                CAST(SUM(omi.quantity) AS INTEGER) AS total_orders 
            FROM Order_Menu_Items omi
            JOIN Menu_Items mi ON omi.menu_item_id = mi.menu_item_id
            GROUP BY mi.name
            ORDER BY total_orders DESC
            LIMIT 10;
        `;
        const { rows } = await db.query(query);
        return rows;
    }

    static async getStockUsageTrend() {
        const query = `
            SELECT 
                TO_CHAR(DATE(o.order_time), 'YYYY-MM-DD') AS date,  
                r.ingredient_name, 
                SUM(r.quantity_required * omi.quantity) AS total_used,
                r.unit  
            FROM Orders o
            JOIN Order_Menu_Items omi ON o.order_id = omi.order_id
            JOIN Recipes r ON omi.menu_item_id = r.menu_item_id  
            GROUP BY DATE(o.order_time), r.ingredient_name, r.unit
            ORDER BY date ASC, total_used DESC;
        `;
        const { rows } = await db.query(query);
        return rows;
    }

    static async getStockLevelsByCategory() {
        const query = `
            SELECT 
                LOWER(category) AS category,  
                CAST(SUM(quantity) AS FLOAT) AS total_quantity
            FROM Inventory
            GROUP BY LOWER(category)
            ORDER BY total_quantity DESC;
        `;
        const { rows } = await db.query(query);
        return rows;
    }

    // Ingredient Category Distribution (Pie Chart)
    static async getIngredientCategoryDistribution() {
        const query = `
            SELECT 
                LOWER(category) AS category, 
                COUNT(ingredient_id) AS ingredient_count,
                SUM(quantity) AS total_quantity,
                SUM(quantity * price_per_unit) AS total_value
            FROM Inventory
            GROUP BY LOWER(category)
            ORDER BY total_value DESC;
        `;
        const { rows } = await db.query(query);
        return rows;
    }

    //  Restaurant Performance (Grouped Bar Chart)
    static async getRestaurantPerformance() {
        const query = `
            SELECT 
                r.name AS restaurant, 
                COUNT(o.order_id) AS total_orders, 
                COALESCE(SUM(omi.quantity * i.price_per_unit), 0) AS total_revenue
            FROM Restaurants r  
            LEFT JOIN Orders o ON r.restaurant_id = o.restaurant_id  
            LEFT JOIN Order_Menu_Items omi ON o.order_id = omi.order_id
            LEFT JOIN Recipes rec ON omi.menu_item_id = rec.menu_item_id
            LEFT JOIN Inventory i ON rec.ingredient_id = i.ingredient_id
            GROUP BY r.name
            ORDER BY total_revenue DESC;
        `;
        const { rows } = await db.query(query);
        return rows;
    }

    //  Revenue Trends (Area Chart)
    static async getRevenueTrends() {
        const query = `
SELECT 
            TO_CHAR(DATE(o.order_time), 'YYYY-MM-DD') AS date,  
            SUM(omi.quantity * i.price_per_unit)::NUMERIC(10,2) AS total_revenue  
            FROM Orders o 
            JOIN Order_Menu_Items omi ON o.order_id = omi.order_id
            JOIN Recipes r ON omi.menu_item_id = r.menu_item_id
            JOIN Inventory i ON r.ingredient_id = i.ingredient_id
            GROUP BY DATE(o.order_time)
            ORDER BY date ASC;
        `;
        const { rows } = await db.query(query);
        return rows;
    }

    //  Live Order Status (Donut Chart)
    static async getLiveOrderStatus() {
        const query = `
            SELECT status, COUNT(order_id)::INTEGER AS total_orders
            FROM Orders
            GROUP BY status
            ORDER BY total_orders DESC;
        `;
        const { rows } = await db.query(query);
        return rows;
    }
}

module.exports = AnalyticsModel;