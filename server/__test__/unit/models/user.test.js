const User = require("../../../models/User");
const db = require("../../../db/connect");

jest.mock("../../../db/connect");

describe("User Model", () => {
    beforeEach(() => jest.clearAllMocks());
    afterAll(() => jest.resetAllMocks());

    describe("getAll", () => {
        it("should return all users", async () => {
            const testUsers = [
                { user_id: 1, name: "Alice", email: "alice@example.com", role: "chef", restaurant_id: 1 },
                { user_id: 2, name: "Bob", email: "bob@example.com", role: "manager", restaurant_id: 2 }
            ];
            db.query.mockResolvedValue({ rows: testUsers });

            const result = await User.getAll();

            expect(db.query).toHaveBeenCalledWith("SELECT * FROM Users");
            expect(result).toEqual(testUsers);
        });

        it("should throw an error if no users exist", async () => {
            db.query.mockResolvedValue({ rows: [] });

            await expect(User.getAll()).rejects.toThrow("No users found");
        });
    });

    describe("getRestaurantId", () => {
        it("should return the restaurant ID when given a valid restaurant code", async () => {
            db.query.mockResolvedValue({ rows: [{ restaurant_id: 1 }] });

            const result = await User.getRestaurantId("PIZNYC");

            expect(db.query).toHaveBeenCalledWith(
                "SELECT restaurant_id FROM Restaurants WHERE LOWER(restaurant_code) = LOWER($1) LIMIT 1;",
                ["PIZNYC"]
            );
            expect(result).toBe(1);
        });

        it("should throw an error if the restaurant code is invalid", async () => {
            db.query.mockResolvedValue({ rows: [] });

            await expect(User.getRestaurantId("INVALID")).rejects.toThrow("Unable to find restaurant code");
        });
    });

    describe("getStaffByEmail", () => {
        it("should return user details when given a valid email", async () => {
            const testUser = { user_id: 1, name: "Alice", email: "alice@example.com", role: "chef" };
            db.query.mockResolvedValue({ rows: [testUser] });

            const result = await User.getStaffByEmail("alice@example.com");

            expect(db.query).toHaveBeenCalledWith("SELECT * FROM Users WHERE email = $1;", ["alice@example.com"]);
            expect(result).toEqual(testUser);
        });

        it("should throw an error if the user is not found", async () => {
            db.query.mockResolvedValue({ rows: [] });

            await expect(User.getStaffByEmail("missing@example.com")).rejects.toThrow("Unable to find user");
        });
    });

    describe("create", () => {
        it("should insert a new user and return their data", async () => {
            const newUser = {
                name: "Alice",
                email: "alice@example.com",
                password: "hashedpassword",
                role: "chef",
                access_code: "CHEF123",
                restaurant_id: 1
            };

            db.query.mockResolvedValue({ rows: [{ user_id: 1, ...newUser }] });

            const result = await User.create(newUser, newUser.restaurant_id);

            expect(db.query).toHaveBeenCalledWith(
                "INSERT INTO Users (name, email, password, role, restaurant_id, access_code) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                [
                    newUser.name,
                    newUser.email,
                    newUser.password,
                    newUser.role,
                    newUser.restaurant_id,
                    newUser.access_code
                ]
            );

            expect(result).toEqual({ user_id: 1, ...newUser });
        });

        it("should throw an error if user registration fails", async () => {
            db.query.mockResolvedValue({ rows: [] });

            await expect(User.create({ name: "Alice", email: "alice@example.com" }, 1))
                .rejects.toThrow("Unable to register staff");
        });
    });
});