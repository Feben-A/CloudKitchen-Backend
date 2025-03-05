const request = require("supertest");
const app = require("../../app");
const { resetTestDB } = require("./config");

describe("Orders API Endpoints", () => {
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

  describe("GET /orders", () => {
    it("should return all orders", async () => {
      const response = await request(api).get("/orders");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("GET /orders/:id", () => {
    it("should return a specific order", async () => {
      const response = await request(api).get("/orders/1");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("order_id", 1);
    });

    it("should return 404 if order is not found", async () => {
      const response = await request(api).get("/orders/999");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Unable to find order");
    });
  });

  describe("POST /orders", () => {
    it("should create a new order", async () => {
      const newOrder = {
        table_number: 5,
        user_id: 2,
        status: "preparing",
        order_notes: "Extra sauce",
        restaurant_id: 1,
        items: [{ foodItem: "Margherita Pizza", quantity: 2 }],
      };

      const response = await request(api).post("/orders").send(newOrder);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Order created successfully!");
    });

    it("should return 400 if required fields are missing", async () => {
      const response = await request(api).post("/orders").send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Missing required fields or empty order items.");
    });
  });

  describe("PATCH /orders/:id", () => {
    it("should update an order status to complete", async () => {
      const response = await request(api).patch("/orders/1");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "complete");
    });
  });

  describe("DELETE /orders/:id", () => {
    it("should delete an order", async () => {
      const response = await request(api).delete("/orders/1");

      expect(response.status).toBe(204);
    });

    it("should return 404 if order does not exist", async () => {
      const response = await request(api).delete("/orders/999");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Order not found");
    });
  });
});