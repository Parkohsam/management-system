import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, Store } from "lucide-react";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    // Validation 
    const validate = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Enter a valid email address";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    //  Submit 
    const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
        await login(email, password);
        toast.success("Welcome back! 👋");
        navigate("/");
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="min-h-screen bg-gray-50 flex">

            {/* Left Panel  Branding  */}
            <div className="hidden lg:flex lg:w-1/2 bg-primary-600 flex-col justify-between p-12">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                        <Store size={22} className="text-primary-600" />
                    </div>
                    <span className="text-white font-display text-2xl font-bold tracking-wide">
                        STAX
                    </span>
                </div>

                {/* Middle content */}
                <div>
                    <h1 className="text-white font-display text-5xl font-bold leading-tight mb-6">
                        Manage your store with confidence
                    </h1>
                    <p className="text-primary-100 text-lg leading-relaxed">
                        Track inventory, manage orders and grow your business — all from one clean dashboard.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6 mt-12">
                        {[
                            { value: "2.4k+", label: "Products tracked" },
                            { value: "98%", label: "Order accuracy" },
                            { value: "24/7", label: "Always available" },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <div className="text-white font-display text-3xl font-bold">
                                    {stat.value}
                                </div>
                                <div className="text-primary-200 text-sm mt-1">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom quote */}
                <div className="border-t border-primary-500 pt-8">
                    <p className="text-primary-100 text-sm italic">
                        "The best tool we've used for managing our store operations."
                    </p>
                    <p className="text-primary-200 text-sm mt-2 font-medium">
                        — Amara O., Store Manager
                    </p>
                </div>
            </div>

            {/*  Right Panel Login Form*/}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md">

                    {/* Mobile logo */}
                    <div className="flex items-center gap-3 mb-10 lg:hidden">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                            <Store size={22} className="text-white" />
                        </div>
                        <span className="text-primary-600 font-display text-2xl font-bold">
                            STAX
                        </span>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-gray-900 font-display text-3xl font-bold mb-2">
                            Welcome back
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Sign in to your store dashboard
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                                    }}
                                    placeholder="admin@stax.com"
                                    className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg outline-none bg-white  placeholder:text-gray-400 text-gray-900 focus:ring-2 focus:ring-primary-600 focus:border-transparent
                                    ${errors.email ? "border-red-400 focus:ring-red-400" : "border-gray-300"}
                                    `}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>
                            )}
                        </div>

                        {/* Password field */}
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <button
                                    type="button"
                                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <Lock
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                                    }}
                                    placeholder="••••••••"
                                    className={`w-full pl-10 pr-10 py-2.5 text-sm border rounded-lg outline-none bg-white placeholder:text-gray-400 text-gray-900 focus:ring-2 focus:ring-primary-600 focus:border-transparent
                                    ${errors.password ? "border-red-400 focus:ring-red-400" : "border-gray-300"}
                                    `}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>
                            )}
                        </div>

                        {/* Submit button */}
                        {/* Buttons */}
                        <div className="space-y-3 mt-2">

                            {/* ⚡ Demo button */}
                            <button
                                type="button"
                                onClick={() => {
                                    setEmail("admin@stax.com");
                                    setPassword("admin123");
                                }}
                                className="w-full border border-primary-600 text-primary-600 hover:bg-primary-50 font-medium text-sm py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
                            >
                                Try Demo Account
                            </button>

                            {/* Sign in button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm py-2.5 rounded-lg flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg
                                            className="animate-spin h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12" cy="12" r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8z"
                                            />
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign in →"
                                )}
                            </button>

                        </div>

                        {/* Demo hint */}
                        <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-100">
                            <p className="text-xs font-medium text-primary-700 mb-1">
                                Reviewing this project?
                            </p>
                            <p className="text-xs text-primary-600">
                                Click "Try Demo Account" above to auto-fill credentials
                                and explore the dashboard instantly.
                            </p>
                        </div>



                    </form>


                    {/* Footer */}
                    <p className="text-center text-xs text-gray-400 mt-8">
                        © 2026 Stax Software. All rights reserved.
                    </p>

                </div>
            </div>

        </div>
    );
}