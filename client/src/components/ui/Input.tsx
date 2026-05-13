import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export default function Input({ label, error, ...props }: InputProps) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {label}
            </label>
            <input
                {...props}
                className={`w-full px-3.5 py-2.5 text-sm border rounded-lg outline-none bg-white placeholder:text-gray-400 text-gray-900 focus:ring-2 focus:ring-primary-600 focus:border-transparent
                ${error ? "border-red-400" : "border-gray-300"}
                ${props.className || ""}
            `}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}