import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Stethoscope,
  ClipboardList,
  Wrench,
  Users,
  LogOut,
  ShieldAlert,
  ChevronRight,
  User,
  X,
} from "lucide-react";
import MyProfileModal from "./iam/MyProfileModal";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const role = user?.role;

  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      roles: ["ROLE_ADMIN", "ROLE_MANAGER"],
    },
    {
      label: "Equipment",
      path: "/equipment",
      icon: Stethoscope,
      roles: ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_TECH"],
    },
    {
      label: "Work Orders",
      path: "/tickets",
      icon: ClipboardList,
      roles: ["ROLE_ADMIN", "ROLE_MANAGER"],
    },
    {
      label: "My Work Queue",
      path: "/my-queue",
      icon: Wrench,
      roles: ["ROLE_TECH", "ROLE_ADMIN"],
    },
    {
      label: "Users",
      path: "/users",
      icon: Users,
      roles: ["ROLE_ADMIN"],
    },
  ];

  const filteredNavItems = navItems.filter(
    (item) => role && item.roles.includes(role),
  );

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-tight leading-none">
              BioMed<span className="text-teal-400">Care</span>
            </h2>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
              Maintenance System
            </span>
          </div>
        </div>

        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Main Menu
        </div>
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => onClose && onClose()}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                active
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${active ? "text-teal-400" : "text-slate-400"}`}
                />
                <span>{item.label}</span>
              </div>
              {active && <ChevronRight className="w-4 h-4 text-teal-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div
          onClick={() => setIsProfileOpen(true)}
          className="flex items-center justify-between gap-3 mb-3 p-2 rounded-xl hover:bg-slate-800/80 transition cursor-pointer group"
          title="Click to view My Profile details"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400 group-hover:border-teal-500 transition shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white group-hover:text-teal-400 transition truncate">
                {user?.fullName || user?.username}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="text-xs text-slate-400 truncate">
                  {user?.department}
                </span>
              </div>
            </div>
          </div>
        </div>

        <MyProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 uppercase">
            {user?.role ? user.role.replace("ROLE_", "") : "USER"}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition cursor-pointer font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:block w-64 h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Off-Canvas Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="md:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
