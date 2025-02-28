-- DROP TABLES IF THEY ALREADY EXIST (Ensures a clean setup)
DROP TABLE IF EXISTS Order_Ingredients;
DROP TABLE IF EXISTS Order_Menu_Items;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Recipes;
DROP TABLE IF EXISTS Inventory;
DROP TABLE IF EXISTS Menu_Items;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Restaurants;

-- RESTAURANTS TABLE (Tracks Multiple Restaurant Locations)
CREATE TABLE Restaurants (
    restaurant_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    restaurant_code VARCHAR(20) UNIQUE NOT NULL
);

-- USERS TABLE (Tracks Restaurant Staff)
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(50) CHECK (role IN ('chef', 'waiter', 'manager')) NOT NULL,
    restaurant_id INT REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE,
    access_code VARCHAR(50) NOT NULL CHECK (access_code IN ('CHEF123', 'WAITER123', 'MANAGER123'))
);

-- INVENTORY TABLE (Tracks Ingredients Available in the Kitchen)
CREATE TABLE Inventory (
    ingredient_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    quantity DECIMAL(10,2) CHECK (quantity >= 0) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    price_per_unit DECIMAL(10,2) NOT NULL,
    expiry_date DATE,
    restaurant_id INT REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE
);

-- MENU ITEMS TABLE (Stores Dishes Available at a Restaurant)
CREATE TABLE Menu_Items (
    menu_item_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    restaurant_id INT REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE
);


-- ORDERS TABLE (Tracks Customer Orders)
CREATE TABLE Orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE SET NULL,
    order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('preparing', 'complete')) DEFAULT 'preparing' NOT NULL,
    restaurant_id INT REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE
);

-- ORDER MENU ITEMS TABLE (Tracks Which Menu Items Are in Each Order)
CREATE TABLE Order_Menu_Items (
    order_menu_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES Orders(order_id) ON DELETE CASCADE,
    menu_item_id INT REFERENCES Menu_Items(menu_item_id) ON DELETE CASCADE,
    quantity INT CHECK (quantity > 0) NOT NULL
);

-- RECIPES TABLE (Defines Ingredients Needed for Each Dish)
CREATE TABLE Recipes (
    recipe_id SERIAL PRIMARY KEY,
    menu_item_id INT REFERENCES Menu_Items(menu_item_id) ON DELETE CASCADE,
    ingredient_id INT REFERENCES Inventory(ingredient_id) ON DELETE CASCADE,
    ingredient_name, VARCHAR(20),
    quantity_required DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL
);


-- INSERT SAMPLE DATA

-- Insert Restaurants
INSERT INTO Restaurants (name, location, restaurant_code) VALUES
('Pizza Haven', 'New York', 'PIZNYC'),
('Burger Spot', 'London', 'BURLDN'),
('Taco Fiesta', 'Los Angeles', 'TACLA'),
('Sushi World', 'Tokyo', 'SUSTOK');

-- Insert Users (Staff Members with Three Distinct Access Codes)
INSERT INTO Users (name, email, password, role, restaurant_id, access_code) VALUES
('Alice Smith', 'alice@example.com', 'hashedpassword1', 'chef', 1, 'CHEF123'),
('Bob Johnson', 'bob@example.com', 'hashedpassword2', 'waiter', 1, 'WAITER123'),
('Charlie Davis', 'charlie@example.com', 'hashedpassword3', 'manager', 1, 'MANAGER123'),
('Emma Brown', 'emma@example.com', 'hashedpassword4', 'chef', 2, 'CHEF123'),
('David White', 'david@example.com', 'hashedpassword5', 'waiter', 2, 'WAITER123'),
('Sophia Green', 'sophia@example.com', 'hashedpassword6', 'manager', 3, 'MANAGER123'),
('Liam Carter', 'liam@example.com', 'hashedpassword7', 'chef', 4, 'CHEF123');

-- Insert Menu Items (Dishes)
INSERT INTO Menu_Items (name, category, restaurant_id) VALUES
('Margherita Pizza', 'Main Course', 1),
('Cheeseburger', 'Main Course', 2),
('Caesar Salad', 'Starter', 1),
('BBQ Burger', 'Main Course', 2),
('Tacos', 'Main Course', 3),
('Sushi Roll', 'Main Course', 4),
('Tempura', 'Starter', 4);

-- Insert Inventory (Ingredients)
INSERT INTO Inventory (name, category, quantity, unit, price_per_unit, expiry_date, restaurant_id) VALUES
('Cheese', 'Dairy', 15.00, 'kg', 5.00, '2025-04-01', 1),
('Tomato Sauce', 'Sauce', 30.00, 'litres', 3.00, '2025-03-15', 1),
('Lettuce', 'Vegetable', 25.00, 'pieces', 0.50, '2025-03-10', 2),
('Beef Patty', 'Meat', 50.00, 'pieces', 2.50, '2025-04-01', 2),
('Burger Bun', 'Bakery', 60.00, 'pieces', 1.00, '2025-03-20', 2),
('Tortilla', 'Bakery', 40.00, 'pieces', 1.20, '2025-04-05', 3),
('Avocado', 'Vegetable', 20.00, 'pieces', 1.80, '2025-03-12', 3),
('Rice', 'Grain', 100.00, 'kg', 2.50, '2025-06-01', 4),
('Fish', 'Meat', 40.00, 'kg', 8.00, '2025-03-25', 4),
('Milk', 'Dairy', 5.00, 'litres', 1.50, CURRENT_DATE + INTERVAL '3 days', 1),  -- Expiring in 3 days
('Tomatoes', 'Vegetable', 10.00, 'kg', 2.00, CURRENT_DATE + INTERVAL '5 days', 1), -- Expiring in 5 days
('Lettuce', 'Vegetable', 15.00, 'pieces', 0.80, CURRENT_DATE + INTERVAL '6 days', 2), -- Expiring in 6 days
('Cheese', 'Dairy', 8.00, 'kg', 5.50, CURRENT_DATE + INTERVAL '10 days', 1),  -- Expiring in 10 days (should NOT be returned)
('Olive Oil', 'Oil', 3.00, 'litres', 4.00, CURRENT_DATE + INTERVAL '15 days', 3);  -- Expiring in 15 days (should NOT be returned)

-- Insert Recipes (Dishes & Ingredients) JUST ADD INGREDIENT NAME HERE.
INSERT INTO Recipes (menu_item_id, ingredient_id, ingredient_name, quantity_required, unit) VALUES
(1, 1, 'Cheese', 200.00, 'g'),  -- Margherita Pizza needs Cheese
(1, 2, 'Tomato Sauce', 150.00, 'ml'), -- Margherita Pizza needs Tomato Sauce
(2, 4, 'Beef Patty', 1.00, 'piece'), -- Cheeseburger needs Beef Patty
(2, 5, 'Burger Bun', 1.00, 'piece'), -- Cheeseburger needs Burger Bun
(3, 3, 'Lettuce', 1.00, 'piece'), -- Caesar Salad needs Lettuce
(5, 6, 'Tortilla', 1.00, 'piece'), -- Tacos need Tortilla
(5, 7, 'Avocado', 0.5, 'piece'), -- Tacos need Avocado
(6, 8, 'Rice', 200.00, 'g'), -- Sushi Roll needs Rice
(6, 9, 'Fish', 100.00, 'g'); -- Sushi Roll needs Fish


-- Insert Orders (Customer Orders)
INSERT INTO Orders (user_id, order_time, status, restaurant_id) VALUES
(2, '2025-02-26 14:00:00', 'preparing', 1),
(5, '2025-02-26 14:15:00', 'complete', 2),
(6, '2025-02-26 14:30:00', 'preparing', 3),
(7, '2025-02-26 14:45:00', 'complete', 4),
(2, '2025-02-27 12:30:00', 'complete', 1),
(5, '2025-02-27 13:00:00', 'preparing', 2);

-- Insert Order Menu Items (Dishes in Each Order)
INSERT INTO Order_Menu_Items (order_id, menu_item_id, quantity) VALUES
(1, 1, 2),  -- Order 1: 2 Margherita Pizzas
(1, 3, 1),  -- Order 1: 1 Caesar Salad
(2, 2, 1),  -- Order 2: 1 Cheeseburger
(3, 5, 3),  -- Order 3: 3 Tacos
(4, 6, 2),  -- Order 4: 2 Sushi Rolls
(5, 1, 1),  -- Order 5: 1 Margherita Pizza
(6, 2, 2);  -- Order 6: 2 Cheeseburgers
