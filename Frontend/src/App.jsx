import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";

// Public pages
import Home from "./pages/Home";
import TableQRScanner from "./pages/TableQRScanner";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import TableOrder from "./pages/TableOrder";
import Reservation from "./pages/Reservation";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/LoginPhone";
import Profile from "./pages/Profile";
// import GoogleTest from "./pages/GoogleTest";

// Admin pages
import AdminLayout from "./admin/components/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import ManageMenu from "./admin/pages/Menu";
import ManageOrders from "./admin/pages/Orders";
import ManageReservations from "./admin/pages/ManageReservations";
import ManageFacts from "./admin/pages/ManageFacts";
import ManageUsers from "./admin/pages/ManageUsers";
import Bill from "./admin/pages/Bill";


import { Navigate } from "react-router-dom";
import { auth } from "./firebase";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

import { onAuthStateChanged } from "firebase/auth";

const AdminRoute = ({ children }) => {
  const [user, setUser] = useState(undefined); 

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsub();
  }, []);

  // wait until firebase loads
  if (user === undefined) {
    return <div className="text-center mt-20">Checking access...</div>;
  }

  // not admin
  if (!user || user.email !== ADMIN_EMAIL) {
    return <Navigate to="/" />;
  }

  //  admin allowed
  return children;
};

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  //  Theme handler
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme === "dark" ? "dark" : ""
    );
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar theme={theme} setTheme={setTheme} />

        <main className="flex-1">
          <Routes>
            {/* Default public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/scan-table" element={<TableQRScanner />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/table/:id" element={<TableOrder />} />
            <Route path="/reservation" element={<Reservation />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} /> {/*  */}
            {/* <Route path="/googletest" element={<GoogleTest />} /> */}

            {/* Admin routes */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="menu" element={<ManageMenu />} />
              <Route path="orders" element={<ManageOrders />} />
              <Route path="bill/:id" element={<Bill />} />
              <Route path="reservations" element={<ManageReservations />} />
              <Route path="facts" element={<ManageFacts />} />
              <Route path="users" element={<ManageUsers />} />
            </Route>
          </Routes>
        </main>

        <Footer />
      </div>
    </CartProvider>
  );
}
