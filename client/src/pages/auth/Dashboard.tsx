import { useEffect, useState } from "react";
import {
    DollarSign,
    ShoppingCart,
    Package,
    AlertTriangle,
    TrendingUp,
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { getProducts } from "../../api/product";
import { getOrders } from "../../api/Order";
import { Product, Order } from "../../types";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";

// Skeleton Loader
const Skeleton = ({ className }: { className?: string }) => (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
);

export default function DashboardPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [p, o] = await Promise.all([getProducts(), getOrders()]);
                setProducts(p);
                setOrders(o);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    //  Computed Stats
    const totalRevenue = orders
        .filter((o) => o.status === "delivered")
        .reduce((sum, o) => sum + o.totalAmount, 0);

    const lowStock = products.filter((p) => p.stock > 0 && p.stock < 10).length;

    const outOfStock = products.filter((p) => p.stock === 0).length;

    const recentOrders = [...orders]
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 5);

    // Chart Data
    const chartData = orders
        .reduce((acc: { date: string; revenue: number }[], order) => {
            const date = new Date(order.createdAt).toLocaleDateString("en-NG", {
                month: "short",
                day: "numeric",
            });
            const existing = acc.find((d) => d.date === date);
            if (existing) {
                existing.revenue += order.totalAmount;
            } else {
                acc.push({ date, revenue: order.totalAmount });
            }
            return acc;
        }, [])
        .slice(-7)
        .reverse(); // Last 7 days

    //  Order Status Count
    const statusCount = orders.reduce((acc: Record<string, number>, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {});

    // Loading State
    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-28" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Skeleton className="lg:col-span-2 h-72" />
                    <Skeleton className="h-72" />
                </div>
                <Skeleton className="h-64" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/*  Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Revenue"
                    value={`₦${totalRevenue.toLocaleString()}`}
                    sub="From delivered orders"
                    icon={DollarSign}
                    color="green"
                />
                <StatCard
                    label="Total Orders"
                    value={orders.length}
                    sub={`${statusCount["processing"] || 0} processing`}
                    icon={ShoppingCart}
                    color="blue"
                />
                <StatCard
                    label="Products"
                    value={products.length}
                    sub={`${outOfStock} out of stock`}
                    icon={Package}
                    color="amber"
                />
                <StatCard
                    label="Low Stock"
                    value={lowStock}
                    sub="Items below 10 units"
                    icon={AlertTriangle}
                    color="red"
                />
            </div>

            {/* Charts Row  */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-display font-bold text-gray-900 text-lg">
                                Revenue Overview
                            </h3>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Last 7 days performance
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg">
                            <TrendingUp size={14} />
                            <span className="text-xs font-medium">Live</span>
                        </div>
                    </div>

                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 11, fill: "#9CA3AF" }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: "#9CA3AF" }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v) => `₦${v}`}
                                />

                                <Tooltip
                                    formatter={(value: unknown) => [
                                        `₦${Number(value).toLocaleString()}`,
                                        "Revenue",
                                    ]}
                                    contentStyle={{
                                        borderRadius: "8px",
                                        border: "1px solid #E5E7EB",
                                        fontSize: "12px",
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#059669"
                                    strokeWidth={2}
                                    dot={{ fill: "#059669", r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
                            No order data yet
                        </div>
                    )}
                </div>

                {/* Order Status Breakdown */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="font-display font-bold text-gray-900 text-lg mb-6">
                        Order Status
                    </h3>
                    <div className="space-y-4">
                        {Object.entries(statusCount).length > 0 ? (
                            Object.entries(statusCount).map(([status, count]) => (
                                <div key={status} className="flex items-center justify-between">
                                    <Badge status={status as Order["status"]} />
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary-600 rounded-full"
                                                style={{
                                                    width: `${(count / orders.length) * 100}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 w-4 text-right">
                                            {count}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 text-center py-8">
                                No orders yet
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Recent Orders Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-display font-bold text-gray-900 text-lg">
                        Recent Orders
                    </h3>
                    <span className="text-xs text-gray-400">
                        Last {recentOrders.length} orders
                    </span>
                </div>

                {recentOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    {[
                                        "Order ID",
                                        "Customer",
                                        "Items",
                                        "Total",
                                        "Status",
                                        "Date",
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentOrders.map((order) => (
                                    <tr
                                        key={order._id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-5 py-3.5 font-medium text-primary-600">
                                            #{order._id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-800">
                                            {order.customer.name}
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-500">
                                            {order.items.length} item
                                            {order.items.length > 1 ? "s" : ""}
                                        </td>
                                        <td className="px-5 py-3.5 font-medium text-gray-800">
                                            ₦{order.totalAmount.toLocaleString()}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <Badge status={order.status} />
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString("en-NG", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-16 text-center">
                        <ShoppingCart size={32} className="text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">No orders yet</p>
                        <p className="text-gray-300 text-xs mt-1">
                            Orders will appear here once created
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
