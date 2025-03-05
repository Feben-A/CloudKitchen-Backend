const Order = require("../../../models/Order");
const db = require("../../../db/connect");

jest.mock("../../../db/connect");

describe("Order Model", () => {
    beforeEach(() => jest.clearAllMocks());
    afterAll(() => jest.resetAllMocks());

    describe("getAll", () => {
        it("should return all orders", async () => {
            const testOrders = [
                {
                    order_id: 1,
                    order_time: "2024-04-10 12:00:00",
                    menu_items: "2 Pizza, 1 Burger",
                    total_quantity: 3,
                    order_notes: "Extra cheese",
                    status: "preparing"
                }
            ];
            db.query.mockResolvedValue({ rows: testOrders });

            const result = await Order.getAll();

            expect(db.query).toHaveBeenCalled();
            expect(result).toEqual(testOrders);
        });

        it("should throw an error if no orders are found", async () => {
            db.query.mockResolvedValue({ rows: [] });

            await expect(Order.getAll()).rejects.toThrow("No orders found");
        });
    });

    describe("getOrderById", () => {
        it("should return an order by ID", async () => {
            const testOrder = {
                order_id: 1,
                user_id: 2,
                order_time: "2024-04-10 12:00:00",
                status: "preparing",
                restaurant_id: 1
            };
            db.query.mockResolvedValue({ rows: [testOrder] });

            const result = await Order.getOrderById(1);

            expect(db.query).toHaveBeenCalledWith("SELECT * FROM Orders WHERE order_id = $1;", [1]);
            expect(result).toEqual(new Order(testOrder));
        });

        it("should throw an error if the order is not found", async () => {
            db.query.mockResolvedValue({ rows: [] });

            await expect(Order.getOrderById(99)).rejects.toThrow("Unable to find order");
        });
    });

    describe("createOrder", () => {
        it("should create a new order and return it", async () => {
            const newOrder = {
                table_number: 3,
                user_id: 2,
                status: "preparing",
                order_notes: "No onions",
                restaurant_id: 1
            };
            db.query.mockResolvedValue({ rows: [{ order_id: 1, ...newOrder }] });

            const result = await Order.createOrder(newOrder);

            expect(db.query).toHaveBeenCalled();
            expect(result).toEqual({ order_id: 1, ...newOrder });
        });

        it("should handle database errors", async () => {
            db.query.mockRejectedValue(new Error("Insert Error"));

            await expect(Order.createOrder({ table_number: 1, user_id: 2, status: "preparing", order_notes: "", restaurant_id: 1 }))
                .rejects.toThrow("Insert Error");
        });
    });

    describe("addOrderItems", () => {
        it("should insert order items", async () => {
            const items = [{ foodItem: "Pizza", quantity: 2 }];
            db.query.mockResolvedValue({ rows: [{ order_id: 1, menu_item: "Pizza", quantity: 2 }] });

            const result = await Order.addOrderItems(items, 1);

            expect(db.query).toHaveBeenCalledTimes(items.length);
            expect(result).toEqual([{ order_id: 1, menu_item: "Pizza", quantity: 2 }]);
        });

        it("should handle database errors", async () => {
            db.query.mockRejectedValue(new Error("Insert Error"));

            await expect(Order.addOrderItems([{ foodItem: "Pizza", quantity: 2 }], 1))
                .rejects.toThrow("Insert Error");
        });
    });

    describe("newOrder", () => {
        it("should create a new order and return it", async () => {
            const newOrder = {
                user_id: 2,
                restaurant_id: 1,
                table_number: 5,
                order_notes: "Spicy"
            };
            db.query.mockResolvedValue({ rows: [{ order_id: 1, ...newOrder }] });

            const result = await Order.newOrder(newOrder.user_id, newOrder.restaurant_id, newOrder.table_number, newOrder.order_notes);

            expect(db.query).toHaveBeenCalled();
            expect(result).toEqual({ order_id: 1, ...newOrder });
        });

        it("should throw an error if insertion fails", async () => {
            db.query.mockResolvedValue({ rows: [] });

            await expect(Order.newOrder(2, 1, 5, "Spicy")).rejects.toThrow("Unable to add new order");
        });
    });

    describe("newOrderMenuItems", () => {
        it("should insert multiple menu items", async () => {
            const items = [{ foodItem: "Pizza", quantity: 2 }];
            db.query.mockResolvedValueOnce({ rows: [{ menu_item_id: 1 }] });
            db.query.mockResolvedValueOnce({ rows: [{ order_id: 1, menu_item: "Pizza", quantity: 2 }] });

            const result = await Order.newOrderMenuItems(items, 1);

            expect(db.query).toHaveBeenCalledTimes(items.length * 2);
            expect(result).toEqual([{ order_id: 1, menu_item: "Pizza", quantity: 2 }]);
        });

        it("should throw an error if menu item is not found", async () => {
            db.query.mockResolvedValueOnce({ rows: [] });

            await expect(Order.newOrderMenuItems([{ foodItem: "Unknown", quantity: 2 }], 1))
                .rejects.toThrow("Menu item 'Unknown' not found.");
        });
    });

    describe("updateStatus", () => {
        it("should update order status", async () => {
            db.query.mockResolvedValue({ rows: [{ status: "complete" }] });

            const result = await Order.updateStatus(1);

            expect(db.query).toHaveBeenCalled();
            expect(result).toEqual({ status: "complete" });
        });

        it("should return undefined if no order was updated", async () => {
            db.query.mockResolvedValue({ rows: [] });

            const result = await Order.updateStatus(99);

            expect(result).toBeUndefined();
        });
    });

    describe("deleteOrder", () => {
        it("should delete an order by ID", async () => {
            db.query.mockResolvedValue({ rowCount: 1 });

            await Order.deleteOrder(1);

            expect(db.query).toHaveBeenCalled();
        });

        it("should handle errors gracefully", async () => {
            db.query.mockRejectedValue(new Error("Delete Error"));

            await expect(Order.deleteOrder(1)).rejects.toThrow("Delete Error");
        });
    });
});