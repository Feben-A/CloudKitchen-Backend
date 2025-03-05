const MenuController = require("../../../controllers/menu");
const Menu = require("../../../models/Menu");

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

describe("MenuController", () => {
    beforeEach(() => jest.clearAllMocks());
    afterAll(() => jest.resetAllMocks());

    // Test index()
    describe("index", () => {
        it("should return menu items with a status code 200", async () => {
            const testMenu = [{ id: 1, name: "Pizza" }, { id: 2, name: "Burger" }];
            jest.spyOn(Menu, "getAll").mockResolvedValue(testMenu);

            await MenuController.index(null, mockRes);

            expect(Menu.getAll).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(testMenu);
        });

        it("should return an error if fetching menu fails", async () => {
            jest.spyOn(Menu, "getAll").mockRejectedValue(new Error("DB Error"));

            await MenuController.index(null, mockRes);

            expect(Menu.getAll).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(200);  // Note: The controller does not return a 500
            expect(mockJson).toHaveBeenCalledWith({ error: "DB Error" });
        });
    });

    // Test show()
    describe("show", () => {
        it("should return menu item names with a 200 status", async () => {
            const testMenuNames = ["Pizza", "Burger"];
            jest.spyOn(Menu, "getMenuItems").mockResolvedValue(testMenuNames);

            await MenuController.show(null, mockRes);

            expect(Menu.getMenuItems).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(testMenuNames);
        });

        it("should return 404 if no menu items found", async () => {
            jest.spyOn(Menu, "getMenuItems").mockRejectedValue(new Error("No menu items found"));

            await MenuController.show(null, mockRes);

            expect(Menu.getMenuItems).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: "No menu items found" });
        });
    });

    // Test create()
    describe("create", () => {
        it("should create a new menu item and return 200", async () => {
            const testMenuItem = {
                name: "Sushi",
                category: "Japanese",
                restaurant_id: 1,
                ingredients: [{ ingredient_id: 1, quantity: 2 }]
            };
            const mockReq = { body: testMenuItem, restaurant_id: 1 };

            jest.spyOn(Menu, "newItem").mockResolvedValue(3); // Mock menu item ID
            jest.spyOn(Menu, "newRecipe").mockResolvedValue([{ recipe_id: 1, ingredient_id: 1, quantity: 2 }]);

            await MenuController.create(mockReq, mockRes);

            expect(Menu.newItem).toHaveBeenCalledWith("Sushi", "Japanese", 1);
            expect(Menu.newRecipe).toHaveBeenCalledWith(testMenuItem.ingredients, 3);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith([{ recipe_id: 1, ingredient_id: 1, quantity: 2 }]);
        });

        it("should return 404 if menu creation fails", async () => {
            const testMenuItem = { name: "Sushi", category: "Japanese", restaurant_id: 1, ingredients: [] };
            const mockReq = { body: testMenuItem, restaurant_id: 1 };

            jest.spyOn(Menu, "newItem").mockRejectedValue(new Error("Error creating menu item"));

            await MenuController.create(mockReq, mockRes);

            expect(Menu.newItem).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: "Error creating menu item" });
        });
    });
});