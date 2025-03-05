const request = require("supertest");
const app = require("../../app");
const { resetTestDB } = require("./config");

describe("Analytics API Endpoints", () => {
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
    console.log("Gracefully closing server");
    api.close(done);
  });

  describe("GET /analytics/stock-value-category", () => {
    it("should return stock value by category", async () => {
      const response = await request(api).get("/analytics/stock-value-category");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /analytics/expiring-soon", () => {
    it("should return expiring soon stock", async () => {
      const response = await request(api).get("/analytics/expiring-soon");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("GET /analytics/most-used-ingredients", () => {
    it("should return most used ingredients", async () => {
      const response = await request(api).get("/analytics/most-used-ingredients");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("GET /analytics/most-ordered-dishes", () => {
    it("should return most ordered dishes", async () => {
      const response = await request(api).get("/analytics/most-ordered-dishes");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("GET /analytics/stock-usage-trend", () => {
    it("should return stock usage trends", async () => {
      const response = await request(api).get("/analytics/stock-usage-trend");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("GET /analytics/stock-levels-category", () => {
    it("should return stock levels by category", async () => {
      const response = await request(api).get("/analytics/stock-levels-category");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("GET /analytics/ingredient-category-distribution", () => {
    it("should return ingredient category distribution", async () => {
      const response = await request(api).get("/analytics/ingredient-category-distribution");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("GET /analytics/restaurant-performance", () => {
    it("should return restaurant performance metrics", async () => {
      const response = await request(api).get("/analytics/restaurant-performance");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("GET /analytics/revenue-trends", () => {
    it("should return revenue trends", async () => {
      const response = await request(api).get("/analytics/revenue-trends");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("GET /analytics/live-order-status", () => {
    it("should return live order status", async () => {
      const response = await request(api).get("/analytics/live-order-status");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });
});