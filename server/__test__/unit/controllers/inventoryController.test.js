const InventoryController = require("../../../controllers/inventory");
const Inventory = require("../../../models/Inventory");

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

describe("InventoryController", () => {
    beforeEach(() => jest.clearAllMocks());
    afterAll(() => jest.resetAllMocks());

    // ✅ Test index()
    describe("index", () => {
        it("should return all inventory items with a 200 status", async () => {
            const testInventory = [{ id: 1, name: "Tomato", quantity: 10 }];
            jest.spyOn(Inventory, "getAll").mockResolvedValue(testInventory);

            await InventoryController.index({ query: {} }, mockRes);

            expect(Inventory.getAll).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(testInventory);
        });

        it("should return 500 on failure", async () => {
            jest.spyOn(Inventory, "getAll").mockRejectedValue(new Error("DB Error"));

            await InventoryController.index({ query: {} }, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: "Internal Server Error" });
        });
    });

    // ✅ Test getInventoryById()
    describe("getInventoryById", () => {
        it("should return an inventory item with 200", async () => {
            const testItem = { id: 1, name: "Tomato", quantity: 10 };
            jest.spyOn(Inventory, "getById").mockResolvedValue(testItem);

            await InventoryController.getInventoryById({ params: { id: 1 } }, mockRes);

            expect(Inventory.getById).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(testItem);
        });

        it("should return 404 if item not found", async () => {
            jest.spyOn(Inventory, "getById").mockResolvedValue(null);

            await InventoryController.getInventoryById({ params: { id: 99 } }, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: "Item not found" });
        });
    });

    // ✅ Test createOrUpdateInventory()
    describe("createOrUpdateInventory", () => {
        it("should create a new inventory item and return 201", async () => {
            const testItem = { name: "Tomato", category: "Vegetable", quantity: 10, unit: "kg", price_per_unit: 2.5, expiry_date: "2025-05-10", restaurant_id: 1 };
            const mockReq = { body: testItem };

            jest.spyOn(Inventory, "getByNameAndRestaurant").mockResolvedValue(null);
            jest.spyOn(Inventory, "create").mockResolvedValue({ id: 1, ...testItem });

            await InventoryController.createOrUpdateInventory(mockReq, mockRes);

            expect(Inventory.create).toHaveBeenCalledWith(expect.objectContaining(testItem));
            expect(mockStatus).toHaveBeenCalledWith(201);
        });

        it("should update existing inventory item if found", async () => {
            const testItem = { name: "Tomato", category: "Vegetable", quantity: 5, unit: "kg", price_per_unit: 2.5, expiry_date: "2025-05-10", restaurant_id: 1 };
            const mockReq = { body: testItem };

            jest.spyOn(Inventory, "getByNameAndRestaurant").mockResolvedValue(testItem);
            jest.spyOn(Inventory, "increaseStock").mockResolvedValue({ ...testItem, quantity: 15 });

            await InventoryController.createOrUpdateInventory(mockReq, mockRes);

            expect(Inventory.increaseStock).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(200);
        });
    });

    // ✅ Test increaseStock()
    describe("increaseStock", () => {
        it("should increase stock and return 200", async () => {
            const mockReq = { body: { name: "Tomato", category: "Vegetable", quantity: 5, unit: "kg", price_per_unit: 2.5, expiry_date: "2025-05-10", restaurant_id: 1 } };

            jest.spyOn(Inventory, "increaseStock").mockResolvedValue({ name: "Tomato", quantity: 15 });

            await InventoryController.increaseStock(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(200);
        });
    });

    // ✅ Test deductIngredientStock()
    describe("deductIngredientStock", () => {
        it("should deduct stock and return 200", async () => {
            const mockReq = { body: { name: "Tomato", quantity: 2, restaurant_id: 1 } };

            jest.spyOn(Inventory, "deductStockFIFO").mockResolvedValue({ name: "Tomato", quantity: 8 });

            await InventoryController.deductIngredientStock(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(200);
        });
    });

    // ✅ Test updateInventoryItem()
    describe("updateInventoryItem", () => {
        it("should update an inventory item and return 200", async () => {
            const mockReq = { params: { id: 1 }, body: { name: "Tomato", quantity: 15 } };

            jest.spyOn(Inventory, "update").mockResolvedValue({ id: 1, name: "Tomato", quantity: 15 });

            await InventoryController.updateInventoryItem(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(200);
        });
    });

    // ✅ Test removeExpiredStock()
    describe("removeExpiredStock", () => {
        it("should remove expired items and return 200", async () => {
            jest.spyOn(Inventory, "deleteExpired").mockResolvedValue(3);

            await InventoryController.removeExpiredStock(null, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({ message: "3 expired items removed" });
        });
    });

    // ✅ Test deleteInventoryItem()
    describe("deleteInventoryItem", () => {
        it("should delete an inventory item and return 200", async () => {
            const mockReq = { params: { id: 1 } };

            jest.spyOn(Inventory, "deleteById").mockResolvedValue({ id: 1, name: "Tomato" });

            await InventoryController.deleteInventoryItem(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({ message: "Item deleted successfully" });
        });
    });
});