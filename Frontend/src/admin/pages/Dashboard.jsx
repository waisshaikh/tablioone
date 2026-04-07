import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import StatCard from "../components/StatCard";

const API_BASE = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const [stats, setStats] = useState({
    ordersToday: 0,
    revenue: 0,
    reservations: 0,
    popular: "N/A",
  });

  //  CALCULATE STATS (orders + popular dish)
 const calculateStats = (orders) => {
  const today = new Date().toDateString();

  let itemCount = {};
  let popular = "N/A";

  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today
  );

  const revenue = orders
    .filter((o) => o.status === "completed" || o.status === "delivered")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  //  POPULAR DISH CALCULATION
  orders.forEach((order) => {
    order.items?.forEach((item) => {
      if (!itemCount[item.name]) {
        itemCount[item.name] = 0;
      }

      itemCount[item.name] += item.quantity || 1;
    });
  });

  //  FIND MAX
  let max = 0;

  for (let item in itemCount) {
    if (itemCount[item] > max) {
      max = itemCount[item];
      popular = item;
    }
  }

  setStats({
    ordersToday: todayOrders.length,
    revenue,
    reservations: stats.reservations, // keep previous
    popular,
  });
};

  // FETCH ORDERS
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/orders`);
      const orders = res.data?.orders || [];
      calculateStats(orders);
    } catch (err) {
      console.error("Dashboard error:", err);
    }
  };

  //  FETCH RESERVATIONS
  const fetchReservations = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/reservations`);
      const reservations = res.data?.reservations || [];

      setStats((prev) => ({
        ...prev,
        reservations: reservations.length,
      }));
    } catch (err) {
      console.error("Reservation error:", err);
    }
  };

  //  INITIAL LOAD
  useEffect(() => {
    fetchOrders();
    fetchReservations();
  }, []);

  //  SOCKET (REALTIME UPDATES)
  useEffect(() => {
    const socket = io(API_BASE);

    socket.on("orderUpdated", () => {
      console.log("⚡ Orders updated");
      fetchOrders(); 
    });

    socket.on("reservationUpdated", () => {
      console.log("⚡ Reservations updated");
      fetchReservations();
    });

    return () => socket.disconnect();
  }, []);

  // UI DATA
  const data = [
    { title: "Orders Today", value: stats.ordersToday, sub: "Live" },
    { title: "Revenue", value: `₹${stats.revenue}`, sub: "Live" },
    { title: "Reservations", value: stats.reservations },
    { title: "Popular Dish", value: stats.popular },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {data.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-5">
        <div className="font-semibold mb-2">Activity</div>
        <ul className="text-sm list-disc ml-5 space-y-1 text-slate-700">
          <li>⚡ Live orders connected</li>
          <li>📅 Live reservations tracking</li>
        </ul>
      </div>
    </div>
  );
}