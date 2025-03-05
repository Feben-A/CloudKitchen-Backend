const OrdersController = require("../../../controllers/orders");
const Order = require("../../../models/Order");

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

describe("OrdersController", () => {
    beforeEach(() => jest.clearAllMocks());
    afterAll(() => jest.resetAllMocks());

    // ✅ Test index()
    describe("index", () => {
        it("should return orders with a status code 200", async () => {
            const testOrders = [{ order_id: 1, table_number: 4 }, { order_id: 2, table_number: 6 }];
            jest.spyOn(Order, "getAll").mockResolvedValue(testOrders);

            await OrdersController.index(null, mockRes);

            expect(Order.getAll).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(testOrders);
        });

        it("should return 404 if no orders are found", async () => {
            jest.spyOn(Order, "getAll").mockRejectedValue(new Error("No orders found"));

            await OrdersController.index(null, mockRes);

            expect(Order.getAll).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: "No orders found" });
        });
    });

    // ✅ Test createOrder()
    describe("createOrder", () => {
        it("should create a new order and return 201", async () => {
            const testOrder = { table_number: 4, user_id: 1, restaurant_id: 2, items: [{ foodItem: "Pizza", quantity: 2 }] };
            const newOrder = { order_id: 5, ...testOrder };
            const mockReq = { body: testOrder };

            jest.spyOn(Order, "createOrder").mockResolvedValue(newOrder);
            jest.spyOn(Order, "addOrderItems").mockResolvedValue([{ menu_item: "Pizza", quantity: 2 }]);

            await OrdersController.createOrder(mockReq, mockRes);

            expect(Order.createOrder).toHaveBeenCalledWith(expect.objectContaining(testOrder));
            expect(Order.addOrderItems).toHaveBeenCalledWith(testOrder.items, newOrder.order_id);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({ message: "Order created successfully!" }));
        });

        it("should return 400 if required fields are missing", async () => {
            const mockReq = { body: { table_number: 4 } };

            await OrdersController.createOrder(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ error: "Missing required fields or empty order items." });
        });

        it("should return 500 if order creation fails", async () => {
            const testOrder = { table_number: 4, user_id: 1, restaurant_id: 2, items: [{ foodItem: "Pizza", quantity: 2 }] };
            const mockReq = { body: testOrder };

            jest.spyOn(Order, "createOrder").mockRejectedValue(new Error("Database error"));

            await OrdersController.createOrder(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: "Server error while creating the order." });
        });
    });

    // ✅ Test create()
    describe("create", () => {
        it("should create a new order and return 200", async () => {
            const testOrder = { user_id: 1, restaurant_id: 2, table_number: 4, order_notes: "Extra cheese", items: [{ foodItem: "Burger", quantity: 1 }] };
            const mockReq = { body: testOrder };

            jest.spyOn(Order, "newOrder").mockResolvedValue({ order_id: 10, ...testOrder });
            jest.spyOn(Order, "newOrderMenuItems").mockResolvedValue([{ menu_item: "Burger", quantity: 1 }]);

            await OrdersController.create(mockReq, mockRes);

            expect(Order.newOrder).toHaveBeenCalled();
            expect(Order.newOrderMenuItems).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(expect.arrayContaining([{ menu_item: "Burger", quantity: 1 }]));
        });

        it("should return 400 if order creation fails", async () => {
            const mockReq = { body: { table_number: 4 } };

            jest.spyOn(Order, "newOrder").mockRejectedValue(new Error("Unable to add new order"));

            await OrdersController.create(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ error: "Unable to add new order" });
        });
    });

    // ✅ Test update()
    describe("update", () => {
        it("should update the order status and return 200", async () => {
            jest.spyOn(Order, "updateStatus").mockResolvedValue({ status: "complete" });

            const mockReq = { params: { id: 1 } };
            await OrdersController.update(mockReq, mockRes);

            expect(Order.updateStatus).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({ status: "complete" });
        });

        it("should return 400 if update fails", async () => {
            jest.spyOn(Order, "updateStatus").mockRejectedValue(new Error("Update failed"));

            const mockReq = { params: { id: 99 } };
            await OrdersController.update(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ error: "Update failed" });
        });
    });

    // ✅ Test remove()
    describe("remove", () => {
        it("should delete an order and return 204", async () => {
            jest.spyOn(Order, "deleteOrder").mockResolvedValue();

            const mockReq = { params: { id: 1 } };
            await OrdersController.remove(mockReq, mockRes);

            expect(Order.deleteOrder).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(204);
        });

        it("should return 400 if order deletion fails", async () => {
            jest.spyOn(Order, "deleteOrder").mockRejectedValue(new Error("Deletion failed"));

            const mockReq = { params: { id: 99 } };
            await OrdersController.remove(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ error: "Deletion failed" });
        });
    });
});