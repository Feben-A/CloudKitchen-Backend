const Menu = require("../../../models/Menu");
const db = require("../../../db/connect");

jest.mock("../../../db/connect");

describe("Menu Model", () => {
    beforeEach(() => jest.clearAllMocks());
    afterAll(() => jest.resetAllMocks());

    describe("getAll", () => {
        it("should return all menu items", async () => {
            const testItems = [{ name: "Pizza", category: "Main Course" }];
            db.query.mockResolvedValue({ rows: testItems });

            const result = await Menu.getAll();

            expect(db.query).toHaveBeenCalledWith("SELECT name, category FROM Menu_items;");
            expect(result).toEqual(testItems);
        });

        it("should throw an error if no menu items are found", async () => {
            db.query.mockResolvedValue({ rows: [] });

            await expect(Menu.getAll()).rejects.toThrow("No menu items found");
        });

        it("should handle database errors", async () => {
            db.query.mockRejectedValue(new Error("DB Error"));

            await expect(Menu.getAll()).rejects.toThrow("DB Error");
        });
    });

    describe("getMenuItems", () => {
        it("should return menu item names", async () => {
            const testItems = [{ name: "Burger" }];
            db.query.mockResolvedValue({ rows: testItems });

            const result = await Menu.getMenuItems();

            expect(db.query).toHaveBeenCalledWith("SELECT name FROM Menu_items;");
            expect(result).toEqual(testItems);
        });

        it("should throw an error if no menu items exist", async () => {
            db.query.mockResolvedValue({ rows: [] });

            await expect(Menu.getMenuItems()).rejects.toThrow("No menu items found");
        });
    });

    describe("newItem", () => {
        it("should insert a new menu item and return the menu_item_id", async () => {
            db.query.mockResolvedValue({ rows: [{ menu_item_id: 1 }] });

            const result = await Menu.newItem("Pasta", "Main Course", 2);

            expect(db.query).toHaveBeenCalledWith(
                "INSERT INTO Menu_items (name, category, restaurant_id) VALUES($1, $2, $3) RETURNING menu_item_id;",
                ["Pasta", "Main Course", 2]
            );
            expect(result).toBe(1);
        });

        it("should throw an error if insertion fails", async () => {
            db.query.mockResolvedValue({ rows: [] });

            await expect(Menu.newItem("Pasta", "Main Course", 2)).rejects.toThrow("Unable to add menu item");
        });

        it("should handle database errors", async () => {
            db.query.mockRejectedValue(new Error("Insert Error"));

            await expect(Menu.newItem("Pasta", "Main Course", 2)).rejects.toThrow("Insert Error");
        });
    });

    describe("newRecipe", () => {
        it("should insert multiple recipe ingredients", async () => {
            const ingredients = [
                { ingredient_name: "Tomato", quantity: 2, unit: "kg" },
                { ingredient_name: "Cheese", quantity: 1, unit: "kg" },
            ];
            db.query.mockResolvedValue({ rows: [{}] });

            const result = await Menu.newRecipe(ingredients, 1);

            expect(db.query).toHaveBeenCalledTimes(ingredients.length);
            expect(result).toEqual([{}, {}]);
        });

        it("should handle database errors", async () => {
            db.query.mockRejectedValue(new Error("Insert Error"));

            await expect(Menu.newRecipe([{ ingredient_name: "Tomato", quantity: 2, unit: "kg" }], 1))
                .rejects.toThrow("Insert Error");
        });
    });
});