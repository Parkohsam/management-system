import { useEffect, useState } from "react";
import { Plus, Search, Trash2, ShoppingCart, Eye } from "lucide-react";
import { toast } from "react-hot-toast";
import { Order, Product } from "../../types";
import { getOrders, createOrder, updateOrderStatus, deleteOrder } from "../../api/Orders";
import { getProducts } from "../../api/product";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";

//  Order Form Type
type OrderForm = {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    productId: string;
    quantity: string;
    note: string;
};

const emptyForm: OrderForm = {
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    productId: "",
    quantity: "1",
    note: "",
};

const statusOptions: Order["status"][] = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
];

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [modal, setModal] = useState(false);
    const [viewModal, setViewModal] = useState<Order | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [form, setForm] = useState<OrderForm>(emptyForm);
    const [submitting, setSubmitting] = useState(false);

    // ── Fetch Data ────────────────────────────────────────
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [o, p] = await Promise.all([getOrders(), getProducts()]);
            setOrders(o);
            setProducts(p);
        } catch {
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    //  Filter 
    const filtered = orders.filter((o) => {
        const matchSearch =
            o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
            o._id.toLowerCase().includes(search.toLowerCase());
        const matchStatus =
            statusFilter === "All" || o.status === statusFilter;
        return matchSearch && matchStatus;
    });

    // Create Order 
    const handleSubmit = async () => {
        if (!form.customerName || !form.customerEmail || !form.productId) {
            toast.error("Please fill all required fields");
            return;
        }

        setSubmitting(true);
        try {
            const newOrder = await createOrder({
                customer: {
                    name: form.customerName,
                    email: form.customerEmail,
                    phone: form.customerPhone,
                },
                items: [
                    {
                        productId: form.productId,
                        quantity: parseInt(form.quantity),
                    },
                ],
                note: form.note,
            });
            setOrders((prev) => [newOrder, ...prev]);
            toast.success("Order created!");
            setModal(false);
            setForm(emptyForm);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || "Failed to create order");
        } finally {
            setSubmitting(false);
        }
    };

    // Update Status 
    const handleStatusChange = async (
        id: string,
        status: Order["status"]
    ) => {
        try {
            const updated = await updateOrderStatus(id, status);
            setOrders((prev) =>
                prev.map((o) => (o._id === id ? updated : o))
            );
            toast.success(`Status updated to ${status}`);
        } catch {
            toast.error("Failed to update status");
        }
    };

    //  Delete Order 
    const handleDelete = async (id: string) => {
        try {
            await deleteOrder(id);
            setOrders((prev) => prev.filter((o) => o._id !== id));
            toast.success("Order deleted");
            setDeleteConfirm(null);
        } catch {
            toast.error("Failed to delete order");
        }
    };

    //  Loading 
    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-10 bg-gray-200 animate-pulse rounded-lg w-48" />
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-5">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-display font-bold text-gray-900 text-2xl">
                        Orders
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {orders.length} total orders
                    </p>
                </div>
                <button
                    onClick={() => { setForm(emptyForm); setModal(true); }}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700
            text-white text-sm font-medium px-4 py-2.5 rounded-lg"
                >
                    <Plus size={16} />
                    New Order
                </button>
            </div>

            {/* Filters  */}
            <div className="flex gap-3 flex-wrap">
                <div className="relative flex-1 min-w-48">
                    <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by customer or order ID..."
                        className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent bg-white"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-600 bg-white text-gray-700"
                >
                    <option value="All">All Status</option>
                    {statusOptions.map((s) => (
                        <option key={s} value={s} className="capitalize">{s}</option>
                    ))}
                </select>
            </div>

            {/* Orders Table  */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {filtered.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    {["Order ID", "Customer", "Items", "Total", "Status", "Date", "Actions"].map(
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
                                {filtered.map((order) => (
                                    <tr
                                        key={order._id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        {/* Order ID */}
                                        <td className="px-5 py-4 font-medium text-primary-600 font-mono text-xs">
                                            #{order._id.slice(-6).toUpperCase()}
                                        </td>

                                        {/* Customer */}
                                        <td className="px-5 py-4">
                                            <div className="font-medium text-gray-900">
                                                {order.customer.name}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {order.customer.email}
                                            </div>
                                        </td>

                                        {/* Items */}
                                        <td className="px-5 py-4 text-gray-500">
                                            {order.items.length} item{order.items.length > 1 ? "s" : ""}
                                        </td>

                                        {/* Total */}
                                        <td className="px-5 py-4 font-medium text-gray-900">
                                            ₦{order.totalAmount.toLocaleString()}
                                        </td>

                                        {/* Status — inline dropdown */}
                                        <td className="px-5 py-4">
                                            <select
                                                value={order.status}
                                                onChange={(e) =>
                                                    handleStatusChange(
                                                        order._id,
                                                        e.target.value as Order["status"]
                                                    )
                                                }
                                                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-primary-600 bg-white cursor-pointer"
                                            >
                                                {statusOptions.map((s) => (
                                                    <option key={s} value={s} className="capitalize">
                                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>

                                        {/* Date */}
                                        <td className="px-5 py-4 text-gray-400 text-xs">
                                            {new Date(order.createdAt).toLocaleDateString("en-NG", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setViewModal(order)}
                                                    className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                >
                                                    <Eye size={15} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(order._id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                        <ShoppingCart size={40} className="text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-400 font-medium">No orders found</p>
                        <p className="text-gray-300 text-sm mt-1">
                            {search ? "Try a different search" : "Create your first order"}
                        </p>
                        {!search && (
                            <button
                                onClick={() => setModal(true)}
                                className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                                + New Order
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Create Order Modal */}
            <Modal
                open={modal}
                onClose={() => setModal(false)}
                title="Create New Order"
            >
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                    Customer Details
                </p>

                <Input
                    label="Customer Name *"
                    value={form.customerName}
                    onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                    placeholder="e.g. Amara Okafor"
                />
                <Input
                    label="Customer Email *"
                    type="email"
                    value={form.customerEmail}
                    onChange={(e) => setForm((f) => ({ ...f, customerEmail: e.target.value }))}
                    placeholder="amara@gmail.com"
                />
                <Input
                    label="Phone Number"
                    value={form.customerPhone}
                    onChange={(e) => setForm((f) => ({ ...f, customerPhone: e.target.value }))}
                    placeholder="08012345678"
                />

                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 mt-2">
                    Order Details
                </p>

                {/* Product selector */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Product *
                    </label>
                    <select
                        value={form.productId}
                        onChange={(e) => setForm((f) => ({ ...f, productId: e.target.value }))}
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-600 bg-white"
                    >
                        <option value="">Select a product</option>
                        {products.map((p) => (
                            <option key={p._id} value={p._id} disabled={p.stock === 0}>
                                {p.name} — ₦{p.price.toLocaleString()}
                                {p.stock === 0 ? " (Out of stock)" : ` (${p.stock} left)`}
                            </option>
                        ))}
                    </select>
                </div>

                <Input
                    label="Quantity *"
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                    placeholder="1"
                />

                <Input
                    label="Note (optional)"
                    value={form.note}
                    onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                    placeholder="Any special instructions..."
                />

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
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {submitting ? "Creating..." : "Create Order"}
                    </button>
                </div>
            </Modal>

            {/*  View Order Modal  */}
            {viewModal && (
                <Modal
                    open={!!viewModal}
                    onClose={() => setViewModal(null)}
                    title={`Order #${viewModal._id.slice(-6).toUpperCase()}`}
                >
                    {/* Customer info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Customer
                        </p>
                        <p className="font-medium text-gray-900">{viewModal.customer.name}</p>
                        <p className="text-sm text-gray-500">{viewModal.customer.email}</p>
                        {viewModal.customer.phone && (
                            <p className="text-sm text-gray-500">{viewModal.customer.phone}</p>
                        )}
                    </div>

                    {/* Items */}
                    <div className="mb-4">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Items
                        </p>
                        <div className="space-y-2">
                            {viewModal.items.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {item.name}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            ₦{item.price.toLocaleString()} × {item.quantity}
                                        </p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">
                                        ₦{(item.price * item.quantity).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total & Status */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                        <div>
                            <p className="text-xs text-gray-500">Total Amount</p>
                            <p className="text-xl font-display font-bold text-gray-900">
                                ₦{viewModal.totalAmount.toLocaleString()}
                            </p>
                        </div>
                        <Badge status={viewModal.status} />
                    </div>

                    {/* Note */}
                    {viewModal.note && (
                        <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                            <p className="text-xs font-medium text-amber-700 mb-1">Note</p>
                            <p className="text-sm text-amber-600">{viewModal.note}</p>
                        </div>
                    )}
                </Modal>
            )}

            {/*  Delete Confirm Modal  */}
            <Modal
                open={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                title="Delete Order"
            >
                <p className="text-gray-600 text-sm mb-6">
                    Are you sure you want to delete this order?
                    This action cannot be undone.
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
                        Delete Order
                    </button>
                </div>
            </Modal>

        </div>
    );
}