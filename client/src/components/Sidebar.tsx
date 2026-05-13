import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Store,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  {
    to: "/",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    to: "/products",
    icon: Package,
    label: "Products",
  },
  {
    to: "/orders",
    icon: ShoppingCart,
    label: "Orders",
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <>
      {/*  Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/*  Sidebar  */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-30 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            `}
      >
        {/* Logo  */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
              <Store size={18} className="text-white" />
            </div>
            <span className="font-display text-xl font-bold text-gray-900">
              STAX
            </span>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation  */}
        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                            ${
                              isActive
                                ? "bg-primary-50 text-primary-700 border border-primary-100"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    className={isActive ? "text-primary-600" : "text-gray-400"}
                  />
                  {label}
                  {/* Active dot indicator */}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-gray-100">
          {/* User info */}
          <div className="flex items-center gap-3 px-3 py-2.5 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all group"
          >
            <LogOut
              size={18}
              className="text-gray-400 group-hover:text-red-500"
            />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
