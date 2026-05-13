import { LucideIcon } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string | number;
    sub?: string;
    icon: LucideIcon;
    color: "green" | "blue" | "amber" | "red";
}

const colorMap = {
    green: {
        bg: "bg-primary-50",
        icon: "text-primary-600",
        border: "border-primary-100",
    },
    blue: {
        bg: "bg-blue-50",
        icon: "text-blue-600",
        border: "border-blue-100",
    },
    amber: {
        bg: "bg-amber-50",
        icon: "text-amber-600",
        border: "border-amber-100",
    },
    red: {
        bg: "bg-red-50",
        icon: "text-red-600",
        border: "border-red-100",
    },
};

export default function StatCard({
    label,
    value,
    sub,
    icon: Icon,
    color,
}: StatCardProps) {
    const c = colorMap[color];

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 hover:shadow-sm transition-shadow">
            {/* Icon */}
            <div className={`${c.bg} ${c.border} border p-2.5 rounded-lg shrink-0`}>
                <Icon size={20} className={c.icon} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 leading-tight">
                    {label}
                </p>
                <p className="text-2xl font-display font-bold text-gray-900">
                    {value}
                </p>
                {sub && (
                    <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                )}
            </div>
        </div>
    );
}