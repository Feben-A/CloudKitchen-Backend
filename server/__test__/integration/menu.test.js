const request = require("supertest");
const app = require("../../app");
const { resetTestDB } = require("./config");

describe("Menu API Endpoints", () => {
  let api;

  beforeEach(async () => {
    await resetTestDB();
  });

  beforeAll(() => {
    api = app.listen(4000, () => {
      console.log("Test server running on port 4000");
    });
  });

  afterAll((done) => {
    console.log("Closing test server");
    api.close(done);
  });

  describe("GET /menu", () => {
    it("should return all menu items", async () => {
      const response = await request(api).get("/menu");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("GET /menu/names", () => {
    it("should return menu item names", async () => {
      const response = await request(api).get("/menu/names");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("POST /menu", () => {
    it("should create a new menu item", async () => {
      const newItem = {
        name: "Veggie Burger",
        category: "Main Course",
        restaurant_id: 1,
        ingredients: [
          { ingredient_name: "Lettuce", quantity: 1, unit: "piece" },
          { ingredient_name: "Tomato", quantity: 2, unit: "slice" },
        ],
      };

      const response = await request(api).post("/menu").send(newItem);

      expect(response.status).toBe(201);
      expect(response.body).toBeInstanceOf(Array);
    });
  });
});