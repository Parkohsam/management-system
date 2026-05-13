import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";
import { toast } from "react-hot-toast";
import { Product } from "../../types";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../api/product";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";

// ── Types ─────────────────────────────────────────────────
type ProductForm = {
    name: string;
    description: string;
    price: string;
    stock: string;
    category: Product["category"];
    sku: string;
};

const emptyForm: ProductForm = {
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "Electronics",
    sku: "",
};

const categories: Product["category"][] = [
    "Electronics",
    "Furniture",
    "Health",
    "Apparel",
    "Other",
];

// ── Stock Badge ───────────────────────────────────────────
const StockBadge = ({ stock }: { stock: number }) => {
    if (stock === 0)
        return (
            <span className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                Out of Stock
            </span>
        );
    if (stock < 10)
        return (
            <span className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                Low: {stock}
            </span>
        );
    return (
        <span className="text-xs font-medium text-green-600 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">
            {stock} units
        </span>
    );
};

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("All");
    const [modal, setModal] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [form, setForm] = useState<ProductForm>(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Fetch Product
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch {
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    //  Filter 
    const filtered = products.filter((p) => {
        const matchSearch =
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.sku.toLowerCase().includes(search.toLowerCase());
        const matchCat =
            categoryFilter === "All" || p.category === categoryFilter;
        return matchSearch && matchCat;
    });

    // Open Modal 
    const openAdd = () => {
        setEditProduct(null);
        setForm(emptyForm);
        setModal(true);
    };

    const openEdit = (product: Product) => {
        setEditProduct(product);
        setForm({
            name: product.name,
            description: product.description,
            price: String(product.price),
            stock: String(product.stock),
            category: product.category,
            sku: product.sku,
        });
        setModal(true);
    };

    //  Submit Form 
    const handleSubmit = async () => {
        if (!form.name || !form.price || !form.stock || !form.sku) {
            toast.error("Please fill all required fields");
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                name: form.name,
                description: form.description,
                price: parseFloat(form.price),
                stock: parseInt(form.stock),
                category: form.category,
                sku: form.sku,
            };

            if (editProduct) {
                const updated = await updateProduct(editProduct._id, payload);
                setProducts((prev) =>
                    prev.map((p) => (p._id === editProduct._id ? updated : p))
                );
                toast.success("Product updated! ✅");
            } else {
                const created = await createProduct(payload as Omit<Product, "_id" | "createdAt" | "updatedAt">);
                setProducts((prev) => [created, ...prev]);
                toast.success("Product added! 🎉");
            }
            setModal(false);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    //  Delete
    const handleDelete = async (id: string) => {
        try {
            await deleteProduct(id);
            setProducts((prev) => prev.filter((p) => p._id !== id));
            toast.success("Product deleted");
            setDeleteConfirm(null);
        } catch {
            toast.error("Failed to delete product");
        }
    };

    //  Loading 
    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-10 bg-gray-200 animate-pulse rounded-lg w-48" />
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 border-b border-gray-100 animate-pulse bg-gray-50" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5">

            {/*  Header  */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-display font-bold text-gray-900 text-2xl">
                        Products
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {products.length} total products
                    </p>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700  text-white text-sm font-medium px-4 py-2.5 rounded-lg"
                >
                    <Plus size={16} />
                    Add Product
                </button>
            </div>

            {/*  Filters  */}
            <div className="flex gap-3 flex-wrap">
                {/* Search */}
                <div className="relative flex-1 min-w-48">
                    <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products or SKU..."
                        className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent bg-white"
                    />
                </div>

                {/* Category filter */}
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-600 bg-white text-gray-700"
                >
                    <option value="All">All Categories</option>
                    {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            {/*  Table  */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {filtered.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    {["Product", "SKU", "Category", "Price", "Stock", "Actions"].map(
                                        (h) => (
                                            <th
                                                key={h}
                                                className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide"
                                            >
                                                {h}
                                            </th>
                                        )
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((product) => (
                                    <tr
                                        key={product._id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        {/* Product name & description */}
                                        <td className="px-5 py-4">
                                            <div className="font-medium text-gray-900">
                                                {product.name}
                                            </div>
                                            {product.description && (
                                                <div className="text-xs text-gray-400 mt-0.5 truncate max-w-48">
                                                    {product.description}
                                                </div>
                                            )}
                                        </td>

                                        {/* SKU */}
                                        <td className="px-5 py-4">
                                            <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                {product.sku}
                                            </span>
                                        </td>

                                        {/* Category */}
                                        <td className="px-5 py-4 text-gray-600">
                                            {product.category}
                                        </td>

                                        {/* Price */}
                                        <td className="px-5 py-4 font-medium text-gray-900">
                                            ₦{product.price.toLocaleString()}
                                        </td>

                                        {/* Stock */}
                                        <td className="px-5 py-4">
                                            <StockBadge stock={product.stock} />
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openEdit(product)}
                                                    className="p-1.5 text-gray-400 hover:text-primary-600  hover:bg-primary-50 rounded-lg transition-colors"
                                                >
                                                    <Edit size={15} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(product._id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600  hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    /* Empty state */
                    <div className="py-20 text-center">
                        <Package size={40} className="text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-400 font-medium">No products found</p>
                        <p className="text-gray-300 text-sm mt-1">
                            {search ? "Try a different search" : "Add your first product"}
                        </p>
                        {!search && (
                            <button
                                onClick={openAdd}
                                className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                                + Add Product
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/*  Add/Edit Modal */}
            <Modal
                open={modal}
                onClose={() => setModal(false)}
                title={editProduct ? "Edit Product" : "Add New Product"}
            >
                <Input
                    label="Product Name *"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Wireless Headphones"
                />

                <Input
                    label="Description"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Short product description"
                />

                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="Price (₦) *"
                        type="number"
                        value={form.price}
                        onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                        placeholder="0.00"
                    />
                    <Input
                        label="Stock *"
                        type="number"
                        value={form.stock}
                        onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                        placeholder="0"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Category *
                        </label>
                        <select
                            value={form.category}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    category: e.target.value as Product["category"],
                                }))
                            }
                            className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                        >
                            {categories.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="SKU *"
                        value={form.sku}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, sku: e.target.value.toUpperCase() }))
                        }
                        placeholder="ELEC-001"
                    />
                </div>

                <div className="flex gap-3 mt-2">
                    <button
                        onClick={() => setModal(false)}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-white  bg-primary-600 hover:bg-primary-700 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {submitting
                            ? "Saving..."
                            : editProduct
                                ? "Update Product"
                                : "Add Product"}
                    </button>
                </div>
            </Modal>

            {/*  Delete Confirm Modal  */}
            <Modal
                open={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                title="Delete Product"
            >
                <p className="text-gray-600 text-sm mb-6">
                    Are you sure you want to delete this product? This action
                    cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={() => setDeleteConfirm(null)}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
                    >
                        Delete
                    </button>
                </div>
            </Modal>

        </div>
    );
}