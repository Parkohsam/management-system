import API from "./axios";
import { Product } from "../types";

export const getProducts = async (): Promise<Product[]> => {
  const res = await API.get("/products");
  return res.data.products;
};