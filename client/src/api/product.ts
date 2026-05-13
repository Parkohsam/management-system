import API from "./axios";
import { Product } from "../types";

export const getProducts = async (): Promise<Product[]> => {
    const res = await API.get("/products");
    return res.data.products;
};

export const createProduct = async (
    data: Omit<Product, "_id" | "createdAt" | "updatedAt">
): Promise<Product> => {
    const res = await API.post("/products", data);
    return res.data.product;
};

export const updateProduct = async (
    id: string,
    data: Partial<Product>
): Promise<Product> => {
    const res = await API.put(`/products/${id}`, data);
    return res.data.product;
};

export const deleteProduct = async (id: string): Promise<void> => {
    await API.delete(`/products/${id}`);
};