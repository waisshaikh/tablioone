import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;
const socket = io(API_BASE);

export default function Orders() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("online");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/orders`);
      setOrders(res.data?.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Socket live update
    socket.on("orderUpdated", (updatedOrder) => {
      setOrders((prev) => {
        const exists = prev.find((o) => o._id === updatedOrder._id);

        if (exists) {
          return prev.map((o) =>
            o._id === updatedOrder._id ? updatedOrder : o
          );
        }

        return [updatedOrder, ...prev];
      });
    });

    return () => socket.off("orderUpdated");
  }, []);

  // Update status
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${API_BASE}/api/orders/${id}/status`, {
        status: newStatus,
      });
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Status Badge
  const renderStatusBadge = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      preparing: "bg-indigo-100 text-indigo-700",
      completed: "bg-green-100 text-green-700",
      delivered: "bg-emerald-100 text-emerald-700",
      cancelled: "bg-red-100 text-red-700",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${colors[status] || "bg-gray-100 text-gray-700"
          }`}
      >
        {status}
      </span>
    );
  };

  // Orders UI
  const renderOrders = (orders, type) => (
    <div className="grid md:grid-cols-2 gap-4 mt-4">
      {orders
        .filter((o) =>
          type === "online"
            ? o.channel === "online"
            : o.channel === "table"
        )
        .map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow-md p-4 border hover:shadow-lg transition"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">
                Order #{order._id.slice(-6)}
              </h3>
              {renderStatusBadge(order.status)}
            </div>

            {/* INFO */}
            <div className="text-sm text-gray-600 space-y-1">
              {/* NAME */}
              <div>👤 {order.customer?.name || "Guest"}</div>

              {/* TABLE */}
              {order.table && <div>🍽 Table {order.table}</div>}

              {/* PHONE (ONLY ONLINE) */}
              {!order.table && order.customer?.phone && (
                <div className="text-xs text-gray-500">
                  📞 {order.customer.phone}
                </div>
              )}

              {/* ADDRESS (ONLY ONLINE) */}
              {!order.table && order.customer?.address && (
                <div className="text-xs text-gray-500">
                  📍 {order.customer.address}
                </div>
              )}
            </div>

            {/* PRICE + TIME */}
            <div className="flex justify-between items-center mt-3 text-sm">
              <span className="font-medium text-gray-800">
                ₹{order.totalPrice}
              </span>
              <span className="text-gray-500">
                ⏰ {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>

            {/* STATUS */}
            <div className="mt-3">
              <label className="text-xs text-gray-500">
                Update Status:
              </label>
              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(order._id, e.target.value)
                }
                className="mt-1 w-full px-2 py-1 border rounded bg-gray-50 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="completed">Completed</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* 🔥 VIEW BILL BUTTON */}
            <div className="mt-3">
              <button
                onClick={() =>
                  navigate(`/admin/bill/${order._id}`)
                }
                className="w-full bg-black text-white py-2 rounded-lg text-sm hover:opacity-90 transition"
              >
                View Bill
              </button>
            </div>
          </div>
        ))}
    </div>
  );

  if (loading) {
    return <div className="p-6 text-gray-500">Loading orders...</div>;
  }

  return (
    <div className="p-6">
      {/* TABS */}
      <div className="flex gap-4">
        <button
          onClick={() => setActiveTab("online")}
          className={`px-4 py-2 rounded-lg font-medium ${activeTab === "online"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          Online Orders
        </button>

        <button
          onClick={() => setActiveTab("dinein")}
          className={`px-4 py-2 rounded-lg font-medium ${activeTab === "dinein"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          Dine-in Orders
        </button>
      </div>

      {/* ORDERS */}
      {activeTab === "online"
        ? renderOrders(orders, "online")
        : renderOrders(orders, "dinein")}
    </div>
  );
}