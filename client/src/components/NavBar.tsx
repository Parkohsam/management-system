import { Menu, Bell } from "lucide-react";

interface NavbarProps {
    onMenuClick: () => void;
    title: string;
}

export default function Navbar({ onMenuClick, title }: NavbarProps) {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">

            {/* Left — Menu button + Page title */}
            <div className="flex items-center gap-4">
                {/* Mobile menu button */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100"
                >
                    <Menu size={22} />
                </button>

                {/* Page title */}
                <h1 className="font-display text-xl font-bold text-gray-900 tracking-wide">
                    {title}
                </h1>
            </div>

            {/* Right — Actions */}
            <div className="flex items-center gap-3">
                {/* Notification bell */}
                <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Bell size={20} />
                    {/* Notification dot */}
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-600 rounded-full" />
                </button>
            </div>
        </header>
    );
}