const Inventory = require("../../../models/Inventory");
const db = require("../../../db/connect");

jest.mock("../../../db/connect");

describe("Inventory Model", () => {
    beforeEach(() => jest.clearAllMocks());
    afterAll(() => jest.resetAllMocks());

    describe("getAll", () => {
        it("should return all inventory items sorted", async () => {
            const testItems = [{ id: 1, name: "Tomato" }, { id: 2, name: "Cheese" }];
            db.query.mockResolvedValue({ rows: testItems });

            const result = await Inventory.getAll("name", "asc");

            expect(db.query).toHaveBeenCalledTimes(1);
            expect(result).toEqual(testItems);
        });

        it("should throw an error if query fails", async () => {
            db.query.mockRejectedValue(new Error("DB Error"));

            await expect(Inventory.getAll()).rejects.toThrow("DB Error");
        });
    });

    describe("getById", () => {
        it("should return an inventory item by ID", async () => {
            const testItem = { ingredient_id: 1, name: "Tomato" };
            db.query.mockResolvedValue({ rows: [testItem] });

            const result = await Inventory.getById(1);

            expect(db.query).toHaveBeenCalledWith("SELECT * FROM Inventory WHERE ingredient_id = $1;", [1]);
            expect(result).toEqual(testItem);
        });

        it("should return null if no item found", async () => {
            db.query.mockResolvedValue({ rows: [] });

            const result = await Inventory.getById(99);

            expect(result).toBeNull();
        });
    });

    describe("getByRestaurantId", () => {
        it("should return inventory items for a restaurant", async () => {
            const testItems = [{ ingredient_id: 1, name: "Tomato" }];
            db.query.mockResolvedValue({ rows: testItems });

            const result = await Inventory.getByRestaurantId(1);

            expect(db.query).toHaveBeenCalledWith("SELECT * FROM Inventory WHERE restaurant_id = $1;", [1]);
            expect(result).toEqual(testItems);
        });
    });

    describe("create", () => {
        it("should insert a new inventory item", async () => {
            const testItem = {
                name: "Tomato", category: "Vegetable", quantity: 10, unit: "kg",
                price_per_unit: 5, expiry_date: "2024-04-10", restaurant_id: 1
            };
            db.query.mockResolvedValue({ rows: [{ ingredient_id: 1, ...testItem }] });

            const result = await Inventory.create(...Object.values(testItem));

            expect(db.query).toHaveBeenCalled();
            expect(result).toEqual({ ingredient_id: 1, ...testItem });
        });

        it("should throw an error if insertion fails", async () => {
            db.query.mockRejectedValue(new Error("Insert Error"));

            await expect(Inventory.create("Tomato", "Vegetable", 10, "kg", 5, "2024-04-10", 1))
                .rejects.toThrow("Database Insert Error: Insert Error");
        });
    });

    describe("update", () => {
        it("should update an inventory item", async () => {
            const updatedItem = { name: "Tomato", category: "Vegetable", quantity: 20, unit: "kg", price_per_unit: 6, expiry_date: "2024-05-10", restaurant_id: 1 };
            db.query.mockResolvedValue({ rows: [{ ingredient_id: 1, ...updatedItem }] });

            const result = await Inventory.update(1, updatedItem);

            expect(db.query).toHaveBeenCalled();
            expect(result).toEqual({ ingredient_id: 1, ...updatedItem });
        });

        it("should return null if item does not exist", async () => {
            db.query.mockResolvedValue({ rows: [] });

            const result = await Inventory.update(99, { name: "Onion" });

            expect(result).toBeNull();
        });
    });

    describe("increaseStock", () => {
        it("should increase stock for an existing item", async () => {
            const updatedItem = { name: "Tomato", category: "Vegetable", quantity: 30 };
            db.query.mockResolvedValue({ rows: [updatedItem] });

            const result = await Inventory.increaseStock("Tomato", "Vegetable", 10, "kg", 5, "2024-04-10", 1);

            expect(db.query).toHaveBeenCalled();
            expect(result).toEqual(updatedItem);
        });

        it("should return null if item does not exist", async () => {
            db.query.mockResolvedValue({ rows: [] });

            const result = await Inventory.increaseStock("Unknown", "Vegetable", 5, "kg", 5, "2024-04-10", 1);

            expect(result).toBeNull();
        });
    });

    describe("deductStockFIFO", () => {
        it("should deduct stock using FIFO", async () => {
            const mockClient = { query: jest.fn(), connect: jest.fn().mockResolvedValue(), release: jest.fn() };
            db.connect.mockResolvedValue(mockClient);

            mockClient.query.mockResolvedValueOnce({ rows: [{ ingredient_id: 1, quantity: 10 }] });

            const result = await Inventory.deductStockFIFO("Tomato", 5, 1);

            expect(mockClient.query).toHaveBeenCalled();
            expect(result).toEqual({ message: "Successfully deducted 5 units of Tomato" });
        });

        it("should rollback transaction on error", async () => {
            const mockClient = { query: jest.fn(), connect: jest.fn().mockResolvedValue(), release: jest.fn() };
            db.connect.mockResolvedValue(mockClient);

            mockClient.query.mockRejectedValue(new Error("Transaction Error"));

            await expect(Inventory.deductStockFIFO("Tomato", 5, 1)).rejects.toThrow("Transaction Error");
            expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
        });
    });

    describe("deleteById", () => {
        it("should delete an inventory item by ID", async () => {
            db.query.mockResolvedValue({ rowCount: 1 });

            const result = await Inventory.deleteById(1);

            expect(db.query).toHaveBeenCalled();
            expect(result).toBe(true);
        });

        it("should return false if item does not exist", async () => {
            db.query.mockResolvedValue({ rowCount: 0 });

            const result = await Inventory.deleteById(99);

            expect(result).toBe(false);
        });
    });

    describe("deleteExpired", () => {
        it("should delete expired stock", async () => {
            db.query.mockResolvedValue({ rowCount: 3 });

            const result = await Inventory.deleteExpired();

            expect(db.query).toHaveBeenCalled();
            expect(result).toBe(3);
        });

        it("should return 0 if no expired stock", async () => {
            db.query.mockResolvedValue({ rowCount: 0 });

            const result = await Inventory.deleteExpired();

            expect(result).toBe(0);
        });
    });
});