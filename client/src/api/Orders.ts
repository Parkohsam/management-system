import API from "./axios";
import { Order } from "../types";

export const getOrders = async (): Promise<Order[]> => {
    const res = await API.get("/orders");
    return res.data.orders;
};

export const createOrder = async (data: {
    customer: { name: string; email: string; phone?: string };
    items: { productId: string; quantity: number }[];
    note?: string;
}): Promise<Order> => {
    const res = await API.post("/orders", data);
    return res.data.order;
};

export const updateOrderStatus = async (
    id: string,
    status: Order["status"]
): Promise<Order> => {
    const res = await API.put(`/orders/${id}`, { status });
    return res.data.order;
};

export const deleteOrder = async (id: string): Promise<void> => {
    await API.delete(`/orders/${id}`);
};