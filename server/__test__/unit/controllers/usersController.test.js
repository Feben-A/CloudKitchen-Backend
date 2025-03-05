const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserController = require("../../../controllers/users");
const User = require("../../../models/User");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../../models/User");

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

describe("UserController", () => {
    beforeEach(() => jest.clearAllMocks());
    afterAll(() => jest.resetAllMocks());

    // ✅ Test index()
    describe("index", () => {
        it("should return all users with a 200 status", async () => {
            const testUsers = [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }];
            User.getAll.mockResolvedValue(testUsers);

            await UserController.index(null, mockRes);

            expect(User.getAll).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(testUsers);
        });

        it("should return 400 on failure", async () => {
            User.getAll.mockRejectedValue(new Error("DB Error"));

            await UserController.index(null, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ error: "DB Error" });
        });
    });

    // ✅ Test register()
    describe("register", () => {
        it("should create a new user and return 201", async () => {
            const testUser = {
                name: "Alice",
                email: "alice@example.com",
                password: "securepassword",
                role: "manager",
                restaurant_code: "PIZNYC",
            };
            const hashedPassword = "hashedpassword123";
            const restaurantId = 1;
            const mockReq = { body: testUser };

            User.getRestaurantId.mockResolvedValue(restaurantId);
            bcrypt.genSalt.mockResolvedValue(10);
            bcrypt.hash.mockResolvedValue(hashedPassword);
            User.create.mockResolvedValue({ id: 3, ...testUser, password: hashedPassword });

            await UserController.register(mockReq, mockRes);

            expect(User.getRestaurantId).toHaveBeenCalledWith("PIZNYC");
            expect(bcrypt.hash).toHaveBeenCalledWith(testUser.password, 10);
            expect(User.create).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(201);
        });

        it("should return 400 if registration fails", async () => {
            const mockReq = { body: { email: "alice@example.com" } };

            User.getRestaurantId.mockRejectedValue(new Error("Restaurant not found"));

            await UserController.register(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ error: "Restaurant not found" });
        });
    });

    // ✅ Test login()
    describe("login", () => {
        it("should authenticate a user and return a token with 200", async () => {
            const testUser = {
                name: "Alice",
                email: "alice@example.com",
                password: "securepassword",
                role: "manager",
                user_id: 1,
                restaurant_id: 2,
            };
            const mockReq = { body: { email: "alice@example.com", password: "securepassword" } };
            const token = "mocked.jwt.token";

            User.getStaffByEmail.mockResolvedValue(testUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue(token);

            await UserController.login(mockReq, mockRes);

            expect(User.getStaffByEmail).toHaveBeenCalledWith("alice@example.com");
            expect(bcrypt.compare).toHaveBeenCalledWith("securepassword", testUser.password);
            expect(jwt.sign).toHaveBeenCalledWith(
                {
                    name: testUser.name,
                    role: testUser.role,
                    user_id: testUser.user_id,
                    restaurant_id: testUser.restaurant_id,
                },
                process.env.SECRET_TOKEN,
                { expiresIn: 3600 }
            );
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                token: token,
            });
        });

        it("should return 401 if user is not found", async () => {
            User.getStaffByEmail.mockResolvedValue(null);
            const mockReq = { body: { email: "wrong@example.com", password: "wrongpassword" } };

            await UserController.login(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(401);
            expect(mockJson).toHaveBeenCalledWith({ error: "No user found." });
        });

        it("should return 401 if password is incorrect", async () => {
            const testUser = { email: "alice@example.com", password: "securepassword" };
            const mockReq = { body: { email: "alice@example.com", password: "wrongpassword" } };

            User.getStaffByEmail.mockResolvedValue(testUser);
            bcrypt.compare.mockResolvedValue(false);

            await UserController.login(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(401);
            expect(mockJson).toHaveBeenCalledWith({ error: "User could not be authenticated" });
        });
    });
});