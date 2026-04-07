import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export default function Bill() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await axios.get(`${API_BASE}/api/orders`);
      const found = res.data.orders.find((o) => o._id === id);
      setOrder(found);
    };
    fetchOrder();
  }, [id]);

  if (!order) return <div className="p-6">Loading bill...</div>;

  // 🔥 SAFE CALCULATION (backup if backend wrong)
  const subtotal =
    order.bill?.subtotal ??
    order.items.reduce(
      (sum, item) => sum + item.price * (item.quantity ?? 1),
      0
    );

  const gst = order.bill?.gst ?? Math.round(subtotal * 0.05);
  const total = order.bill?.finalTotal ?? subtotal + gst;

  // 🔥 PRINT ONLY BILL (NO SIDEBAR)
  const handlePrint = () => {
    const content = document.getElementById("invoice").innerHTML;

    const printWindow = window.open("", "", "width=800,height=600");

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            h2 {
              margin-bottom: 10px;
            }
            .row {
              display: flex;
              justify-content: space-between;
              margin: 4px 0;
            }
            hr {
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="p-6">
      {/* 🔥 ONLY THIS WILL PRINT */}
      <div
        id="invoice"
        className="bg-white text-black max-w-xl mx-auto p-6 rounded shadow"
      >
        <h2 className="text-2xl font-bold mb-4">🧾 Invoice</h2>

        <p><strong>Order ID:</strong> {order._id.slice(-6)}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>

        <p><strong>Customer:</strong> {order.customer?.name || "Guest"}</p>

        {order.table && (
          <p><strong>Table:</strong> {order.table}</p>
        )}

        <hr />

        {/* ITEMS */}
        {order.items.map((item, i) => {
          const qty = item.quantity ?? 1;
          return (
            <div key={i} className="flex justify-between">
              <span>{item.name} x {qty}</span>
              <span>₹{item.price * qty}</span>
            </div>
          );
        })}

        <hr />

        {/* BILL */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>GST (5%)</span>
            <span>₹{gst}</span>
          </div>

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>

        <p className="mt-3">
          <strong>Payment:</strong>{" "}
          {order.bill?.paymentMode || (order.table ? "cash" : "online")}
        </p>
      </div>

      {/* PRINT BUTTON OUTSIDE */}
      <div className="text-center mt-4">
        <button
          onClick={handlePrint}
          className="bg-black text-white px-4 py-2 rounded"
        >
          🖨 Print Bill
        </button>
      </div>
    </div>
  );
}