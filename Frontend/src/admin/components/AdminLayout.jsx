import { Link, NavLink, Outlet } from "react-router-dom";
import { useState } from "react";

export default function AdminLayout() {
  const [open, setOpen] = useState(true);

  const navItems = [
    { to: "/admin", label: "Dashboard", end: true },
    { to: "/admin/menu", label: "Menu" },
    { to: "/admin/orders", label: "Orders" },
    { to: "/admin/reservations", label: "Reservations" },
    { to: "/admin/facts", label: "Facts" },
    { to: "/admin/customers", label: "Customers" },
    { to: "/admin/reports", label: "Reports" },
    { to: "/admin/settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex mt-15 " >
      {/* Sidebar */}
      <aside className={`bg-white border-r w-72 shrink-0 transition-all ${open ? "translate-x-0" : "-translate-x-72"} md:translate-x-0`}>
        <div className="h-16 flex items-center px-6 border-b">
          <span className="font-extrabold text-xl tracking-tight">TablioOne ADMIN</span>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block rounded-xl px-3 py-2 text-sm font-medium transition
                ${isActive ? "bg-slate-900 text-white" : "hover:bg-slate-100"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="pt-4 border-t mt-4">
            <Link to="/" className="block text-sm px-3 py-2 rounded-xl hover:bg-slate-100">
              ⬅ Back to Site
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-4">
          <button
            className="md:hidden px-3 py-2 rounded-lg border"
            onClick={() => setOpen((v) => !v)}
          >
            ☰
          </button>
          <div className="font-semibold">Admin Panel</div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">admin@seabite.com</span>
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=Admin`}
              alt="admin"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </header>

        {/* Content */}
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
