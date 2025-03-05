const request = require("supertest");
const app = require("../../app");
const { resetTestDB } = require("./config");

describe("Users API Endpoints", () => {
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

  describe("GET /users", () => {
    it("should return all users", async () => {
      const response = await request(api).get("/users");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("POST /users/register", () => {
    it("should register a new user", async () => {
      const newUser = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "chef",
        restaurant_code: "PIZNYC",
        access_code: "CHEF123",
      };

      const response = await request(api).post("/users/register").send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("name", "Test User");
    });
  });

  describe("POST /users/login", () => {
    it("should log in an existing user", async () => {
      const credentials = { email: "alice@example.com", password: "hashedpassword1" };

      const response = await request(api).post("/users/login").send(credentials);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("token");
    });

    it("should return 401 if login fails", async () => {
      const wrongCredentials = { email: "wrong@example.com", password: "wrongpassword" };

      const response = await request(api).post("/users/login").send(wrongCredentials);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("No user found.");
    });
  });
});