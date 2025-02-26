DROP TABLE IF EXISTS Users, recipes, orders, order_menu_items, order_ingredients, menu_items, inventory CASCADE;



-- USERS TABLE (Staff Members)
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(50) NOT NULL -- e.g., chef, waiter, manager
);

-- MENU ITEMS TABLE (Dishes Available)
CREATE TABLE Menu_Items (
    menu_item_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL
);

-- INVENTORY TABLE (Ingredients Stock)
CREATE TABLE Inventory (
    ingredient_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- e.g., Vegetables, Dairy
    quantity DECIMAL(10,2) NOT NULL, -- Allows fractional quantities (e.g., 0.5 kg)
    unit VARCHAR(20) NOT NULL, -- e.g., kg, litres, pieces
    price_per_unit DECIMAL(10,2) NOT NULL,
    expiry_date DATE
);

-- RECIPES TABLE (Links Menu Items to Ingredients)
CREATE TABLE Recipes (
    recipe_id SERIAL PRIMARY KEY,
    menu_item_id INT REFERENCES Menu_Items(menu_item_id) ON DELETE CASCADE,
    ingredient_id INT REFERENCES Inventory(ingredient_id) ON DELETE CASCADE,
    quantity_required DECIMAL(10,2) NOT NULL, -- Amount needed per dish
    unit VARCHAR(20) NOT NULL -- Measurement unit for ingredient
);

-- ORDERS TABLE (Customer Orders)
CREATE TABLE Orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE SET NULL, -- Staff member handling the order
    order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('preparing', 'complete')) NOT NULL
);

-- ORDER MENU ITEMS TABLE (Links Orders to Menu Items)
CREATE TABLE Order_Menu_Items (
    order_menu_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES Orders(order_id) ON DELETE CASCADE,
    menu_item_id INT REFERENCES Menu_Items(menu_item_id) ON DELETE CASCADE,
    quantity INT NOT NULL -- Number of each menu item in the order
);

-- ORDER INGREDIENTS TABLE (Tracks Ingredient Usage for Orders)
CREATE TABLE Order_Ingredients (
    order_ingredient_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES Orders(order_id) ON DELETE CASCADE,
    ingredient_id INT REFERENCES Inventory(ingredient_id) ON DELETE CASCADE,
    quantity_used DECIMAL(10,2) NOT NULL
);

-- INSERT STAFF MEMBERS (Users)
INSERT INTO Users (name, email, password, role) VALUES
('Alice Smith', 'alice@example.com', 'hashedpassword1', 'chef'),
('Bob Johnson', 'bob@example.com', 'hashedpassword2', 'waiter'),
('Charlie Davis', 'charlie@example.com', 'hashedpassword3', 'manager');

-- INSERT MENU ITEMS (Dishes)
INSERT INTO Menu_Items (name, category) VALUES
('Margherita Pizza', 'Main Course'),
('Cheeseburger', 'Main Course'),
('Caesar Salad', 'Starter');

-- INSERT INVENTORY (Ingredients)
INSERT INTO Inventory (name, category, quantity, unit, price_per_unit, expiry_date) VALUES
('Cheese', 'Dairy', 10.00, 'kg', 5.00, '2025-03-01'),
('Tomato Sauce', 'Sauce', 20.00, 'litres', 3.00, '2025-02-28'),
('Lettuce', 'Vegetable', 50.00, 'pieces', 0.50, '2025-02-26'),
('Beef Patty', 'Meat', 30.00, 'pieces', 2.50, '2025-02-27'),
('Burger Bun', 'Bakery', 40.00, 'pieces', 1.00, '2025-03-05');

-- INSERT RECIPES (Linking Menu Items to Ingredients)
INSERT INTO Recipes (menu_item_id, ingredient_id, quantity_required, unit) VALUES
(1, 1, 200.00, 'g'),  -- Margherita Pizza needs 200g of Cheese
(1, 2, 150.00, 'ml'), -- Margherita Pizza needs 150ml of Tomato Sauce
(2, 4, 1.00, 'piece'), -- Cheeseburger needs 1 Beef Patty
(2, 5, 1.00, 'piece'), -- Cheeseburger needs 1 Burger Bun
(3, 3, 1.00, 'piece'); -- Caesar Salad needs 1 Lettuce Leaf

-- INSERT ORDERS (Customer Orders)
INSERT INTO Orders (user_id, order_time, status) VALUES
(2, '2025-02-25 12:30:00', 'preparing'), -- Order taken by Bob (waiter)
(2, '2025-02-25 12:45:00', 'complete'); -- Another order completed

-- INSERT ORDER MENU ITEMS (Tracking Dishes in an Order)
INSERT INTO Order_Menu_Items (order_id, menu_item_id, quantity) VALUES
(1, 1, 2),  -- Order 1: 2 Margherita Pizzas
(1, 2, 1);  -- Order 1: 1 Cheeseburger

-- INSERT ORDER INGREDIENTS (Tracking Ingredient Usage in Orders)
INSERT INTO Order_Ingredients (order_id, ingredient_id, quantity_used) VALUES
(1, 1, 400.00),  -- 400g of Cheese used for 2 Pizzas
(1, 2, 300.00),  -- 300ml of Tomato Sauce used for 2 Pizzas
(1, 4, 1.00),    -- 1 Beef Patty used for 1 Cheeseburger
(1, 5, 1.00);    -- 1 Burger Bun used for 1 Cheeseburger