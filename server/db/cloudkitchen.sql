-- DROP TABLES IF THEY ALREADY EXIST (Ensures a clean setup)
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
    table_number INT NOT NULL,
    user_id INT REFERENCES Users(user_id) ON DELETE SET NULL,
    order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('preparing', 'complete')) DEFAULT 'preparing' NOT NULL,
    order_notes VARCHAR(300) DEFAULT 'N/A',
    restaurant_id INT REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE
);

-- ORDER MENU ITEMS TABLE (Tracks Which Menu Items Are in Each Order)
CREATE TABLE Order_Menu_Items (
    order_menu_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES Orders(order_id) ON DELETE CASCADE,
    menu_item_id INT REFERENCES Menu_Items(menu_item_id) ON DELETE CASCADE,
    menu_item VARCHAR(30) NOT NULL,
    quantity INT CHECK (quantity > 0) NOT NULL
);

-- RECIPES TABLE (Defines Ingredients Needed for Each Dish)
CREATE TABLE Recipes (
    recipe_id SERIAL PRIMARY KEY,
    menu_item_id INT REFERENCES Menu_Items(menu_item_id) ON DELETE CASCADE,
    ingredient_id INT REFERENCES Inventory(ingredient_id) ON DELETE CASCADE,
    ingredient_name VARCHAR(20),
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
('Veggie Pizza', 'Main Course', 1),
('Pepperoni Pizza', 'Main Course', 1),
('BBQ Chicken Pizza', 'Main Course', 1),
('Caesar Salad', 'Starter', 1),
('Garlic Bread', 'Starter', 1),
('Hawaiian Pizza', 'Main Course', 1),
('Buffalo Wings', 'Starter', 1),
('Pasta Carbonara', 'Main Course', 1),
('Chocolate Brownie', 'Dessert', 1),
('Tiramisu', 'Dessert', 1),
('Minestrone Soup', 'Starter', 1),
('Coca-Cola', 'Drink', 1),
('Pepsi', 'Drink', 1),
('Orange Juice', 'Drink', 1),
('Lemonade', 'Drink', 1),
('Iced Tea', 'Drink', 1),
('Espresso', 'Drink', 1),
('Latte', 'Drink', 1),
('Cappuccino', 'Drink', 1),
('Hot Chocolate', 'Drink', 1),
('Mineral Water', 'Drink', 1);

-- Insert Inventory (Ingredients)
INSERT INTO Inventory (name, category, quantity, unit, price_per_unit, expiry_date, restaurant_id) VALUES
('Cheese', 'Dairy', 30.00, 'kg', 5.00, CURRENT_DATE + INTERVAL '15 days', 1),
('Tomato Sauce', 'Sauce', 50.00, 'litres', 3.00, CURRENT_DATE + INTERVAL '30 days', 1),
('Flour', 'Baking', 100.00, 'kg', 0.80, '2026-04-01', 1),
('Olive Oil', 'Oil', 10.00, 'litres', 4.00, '2025-06-10', 1),
('Basil', 'Herbs', 5.00, 'kg', 15.00, CURRENT_DATE + INTERVAL '20 days', 1),
('Pepperoni', 'Meat', 12.00, 'kg', 10.00, '2025-04-01', 1),
('BBQ Sauce', 'Sauce', 10.00, 'litres', 4.50, '2025-05-10', 1),
('Chicken', 'Meat', 20.00, 'kg', 7.00, '2025-04-15', 1),
('Lettuce', 'Vegetable', 15.00, 'pieces', 0.80, CURRENT_DATE + INTERVAL '10 days', 1),
('Garlic', 'Vegetable', 7.00, 'kg', 3.00, CURRENT_DATE + INTERVAL '12 days', 1),
('Mushrooms', 'Vegetable', 8.00, 'kg', 3.50, '2025-04-10', 1),
('Ham', 'Meat', 15.00, 'kg', 9.00, '2025-03-25', 1),
('Pineapple', 'Fruit', 10.00, 'kg', 4.00, '2025-04-05', 1),
('Buffalo Sauce', 'Sauce', 5.00, 'litres', 6.00, '2025-05-15', 1),
('Pasta', 'Baking', 25.00, 'kg', 2.50, '2026-05-01', 1),
('Cream', 'Dairy', 10.00, 'litres', 3.00, '2025-04-12', 1),
('Dark Chocolate', 'Confectionery', 7.00, 'kg', 8.00, '2025-09-30', 1),
('Cream', 'Dairy', 10.00, 'litres', 3.00, '2025-04-12', 1),
('Dark Chocolate', 'Confectionery', 7.00, 'kg', 8.00, '2025-09-30', 1),
('Fresh Basil', 'Herbs', 3.00, 'kg', 15.00, CURRENT_DATE + INTERVAL '5 days', 1),
('Spinach', 'Vegetable', 4.00, 'kg', 2.50, CURRENT_DATE + INTERVAL '4 days', 1),
('Mint', 'Herbs', 2.00, 'kg', 12.00, CURRENT_DATE + INTERVAL '6 days', 1),
('Romaine Lettuce', 'Vegetable', 8.00, 'pieces', 0.80, CURRENT_DATE + INTERVAL '3 days', 1),
('Mozzarella', 'Dairy', 2.00, 'kg', 6.00, CURRENT_DATE + INTERVAL '5 days', 1),
('Basil Leaves', 'Herbs', 3.00, 'g', 2.50, CURRENT_DATE + INTERVAL '8 days', 1),
('Parmesan Cheese', 'Dairy', 4.00, 'kg', 8.00, CURRENT_DATE + INTERVAL '15 days', 1),
('Chili Flakes', 'Spices', 1.50, 'kg', 3.00, CURRENT_DATE + INTERVAL '30 days', 1),
('Garlic Butter', 'Condiments', 2.50, 'kg', 5.50, CURRENT_DATE + INTERVAL '12 days', 1),
('Coca-Cola', 'Drink', 50.00, 'bottles', 1.50, CURRENT_DATE + INTERVAL '180 days', 1),
('Pepsi', 'Drink', 50.00, 'bottles', 1.50, CURRENT_DATE + INTERVAL '180 days', 1),
('Orange Juice', 'Drink', 30.00, 'litres', 2.00, CURRENT_DATE + INTERVAL '30 days', 1),
('Lemon Juice', 'Drink', 20.00, 'litres', 1.80, CURRENT_DATE + INTERVAL '20 days', 1),
('Tea Leaves', 'Drink', 10.00, 'kg', 15.00, CURRENT_DATE + INTERVAL '365 days', 1),
('Coffee Beans', 'Drink', 15.00, 'kg', 18.00, CURRENT_DATE + INTERVAL '365 days', 1),
('Chocolate Powder', 'Drink', 10.00, 'kg', 12.00, CURRENT_DATE + INTERVAL '365 days', 1),
('Bottled Water', 'Drink', 100.00, 'bottles', 1.00, CURRENT_DATE + INTERVAL '365 days', 1);

-- Insert Recipes (Dishes & Ingredients) JUST ADD INGREDIENT NAME HERE.
INSERT INTO Recipes (menu_item_id, ingredient_id, ingredient_name, quantity_required, unit) VALUES
(1, 1, 'Cheese', 200.00, 'g'),
(1, 2, 'Tomato Sauce', 150.00, 'ml'),
(2, 1, 'Cheese', 180.00, 'g'),
(2, 2, 'Tomato Sauce', 120.00, 'ml'),
(2, 5, 'Basil', 5.00, 'g'),
(3, 1, 'Cheese', 220.00, 'g'),
(3, 2, 'Tomato Sauce', 150.00, 'ml'),
(3, 6, 'Pepperoni', 100.00, 'g'),
(4, 1, 'Cheese', 210.00, 'g'),
(4, 2, 'Tomato Sauce', 130.00, 'ml'),
(4, 7, 'BBQ Sauce', 80.00, 'ml'),
(4, 8, 'Chicken', 150.00, 'g'),
(5, 9, 'Lettuce', 1.00, 'piece'),
(6, 10, 'Garlic', 50.00, 'g'),
(7, 1, 'Cheese', 180.00, 'g'),
(7, 2, 'Tomato Sauce', 120.00, 'ml'),
(7, 3, 'Flour', 200.00, 'g'),
(7, 4, 'Olive Oil', 10.00, 'ml'),
(7, 13, 'Ham', 150.00, 'g'),
(7, 14, 'Pineapple', 100.00, 'g'),
(8, 15, 'Buffalo Sauce', 50.00, 'ml'),
(8, 16, 'Chicken', 200.00, 'g'),
(9, 17, 'Pasta', 250.00, 'g'),
(9, 18, 'Cream', 100.00, 'ml'),
(10, 19, 'Dark Chocolate', 150.00, 'g');


-- Insert Orders (Customer Orders)
INSERT INTO Orders (table_number, user_id, order_time, status, order_notes, restaurant_id) VALUES
(4, 2, '2025-02-12 12:45:00', 'complete', 'Extra sauce on the side', 1),
(6, 3, '2025-02-14 14:20:00', 'preparing', 'No onions', 1),
(3, 1, '2025-02-16 18:30:00', 'complete', 'Gluten-free option', 1),
(7, 2, '2025-02-17 20:10:00', 'preparing', 'Extra spicy', 1),
(2, 3, '2025-02-18 15:25:00', 'complete', 'Add extra cheese', 1),
(5, 2, '2025-02-19 19:50:00', 'preparing', 'No pickles', 1),
(8, 3, '2025-02-20 13:10:00', 'complete', 'Well-done steak', 1),
(1, 1, '2025-02-21 17:40:00', 'preparing', 'Vegan option', 1),
(9, 2, '2025-02-22 12:00:00', 'complete', 'Extra dressing', 1),
(4, 3, '2025-02-23 21:30:00', 'preparing', 'No garlic', 1),
(7, 2, '2025-02-24 10:30:00', 'preparing', 'Less salt', 1),
(6, 3, '2025-02-25 13:15:00', 'complete', 'Well-done burger', 1),
(3, 1, '2025-02-26 15:45:00', 'preparing', 'Extra crispy fries', 1),
(2, 2, '2025-02-27 17:20:00', 'complete', 'Spicy mayo on the side', 1),
(5, 3, '2025-02-28 12:55:00', 'preparing', 'Gluten-free bread', 1),
(8, 1, '2025-03-01 19:10:00', 'complete', 'Lightly toasted', 1);

-- Insert Order Menu Items (Dishes in Each Order)
INSERT INTO Order_Menu_Items (order_id, menu_item_id, menu_item, quantity) VALUES
(1, 1, 'Margherita Pizza', 2),  
(1, 3, 'Pepperoni Pizza', 1),  
(2, 2, 'Veggie Pizza', 1),  
(3, 5, 'Caesar Salad', 1),  
(4, 6, 'Garlic Bread', 2),
(5, 4, 'BBQ Chicken Pizza', 1),  
(6, 5, 'Caesar Salad', 2),
(7, 7, 'Hawaiian Pizza', 2),  
(8, 8, 'Buffalo Wings', 3),  
(9, 9, 'Pasta Carbonara', 1),  
(10, 10, 'Chocolate Brownie', 2),  
(11, 7, 'Hawaiian Pizza', 1),  
(12, 8, 'Buffalo Wings', 2),  
(13, 9, 'Pasta Carbonara', 3),  
(14, 10, 'Chocolate Brownie', 2),  
(15, 7, 'Hawaiian Pizza', 3),  
(16, 8, 'Buffalo Wings', 4);