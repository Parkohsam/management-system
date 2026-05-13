interface BadgeProps {
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
}

const statusMap = {
    pending: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        dot: "bg-amber-500",
        label: "Pending",
    },
    processing: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        dot: "bg-blue-500",
        label: "Processing",
    },
    shipped: {
        bg: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-200",
        dot: "bg-purple-500",
        label: "Shipped",
    },
    delivered: {
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200",
        dot: "bg-green-500",
        label: "Delivered",
    },
    cancelled: {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        dot: "bg-red-500",
        label: "Cancelled",
    },
};

export default function Badge({ status }: BadgeProps) {
    const s = statusMap[status];
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${s.bg} ${s.text} ${s.border}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
        </span>
    );
}