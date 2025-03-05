const request = require("supertest");
const app = require("../../app");
const { resetTestDB } = require("./config");

describe("Inventory API Endpoints", () => {
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

  describe("GET /inventory", () => {
    it("should return all inventory items", async () => {
      const response = await request(api).get("/inventory");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("GET /inventory/:id", () => {
    it("should return a single inventory item", async () => {
      const response = await request(api).get("/inventory/1");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("ingredient_id", 1);
    });

    it("should return 404 if item not found", async () => {
      const response = await request(api).get("/inventory/999");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Item not found");
    });
  });

  describe("POST /inventory", () => {
    it("should create a new inventory item", async () => {
      const newItem = {
        name: "New Ingredient",
        category: "Vegetable",
        quantity: 10,
        unit: "kg",
        price_per_unit: 5.0,
        expiry_date: "2025-12-31",
        restaurant_id: 1,
      };

      const response = await request(api).post("/inventory").send(newItem);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("name", "New Ingredient");
    });

    it("should return 400 if required fields are missing", async () => {
      const incompleteItem = { name: "Incomplete Ingredient" };

      const response = await request(api).post("/inventory").send(incompleteItem);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Missing required fields");
    });
  });

  describe("PATCH /inventory/increase", () => {
    it("should increase stock of an existing item", async () => {
      const update = {
        name: "Cheese",
        category: "Dairy",
        quantity: 5,
        unit: "kg",
        price_per_unit: 5.0,
        expiry_date: "2025-06-10",
        restaurant_id: 1,
      };

      const response = await request(api).patch("/inventory/increase").send(update);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("quantity");
    });
  });

  describe("DELETE /inventory/:id", () => {
    it("should delete an inventory item", async () => {
      const response = await request(api).delete("/inventory/1");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Item deleted successfully");
    });

    it("should return 404 if item does not exist", async () => {
      const response = await request(api).delete("/inventory/999");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Item not found");
    });
  });
});