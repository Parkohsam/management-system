import API from "./axios";
import { Order } from "../types";

export const getOrders = async (): Promise<Order[]> => {
    const res = await API.get("/orders");
    return res.data.orders;
};