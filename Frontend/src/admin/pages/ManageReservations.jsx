import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ManageReservations() {
  const [reservations, setReservations] = useState([]);

  const fetchReservations = async () => {
    const res = await axios.get(`${API_BASE}/api/reservations`);
    setReservations(res.data.reservations);
  };

  const updateStatus = async (id, status) => {
    await axios.put(`${API_BASE}/api/reservations/${id}/status`, { status });
    fetchReservations();
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Reservations</h1>
      <div className="space-y-4">
        {reservations.map((r) => (
          <div key={r._id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">
                {r.name} ({r.phone}) — {r.guests} guests
              </h2>
              <select
                value={r.status}
                onChange={(e) => updateStatus(r._id, e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <p>{r.date} at {r.time} — {r.seating}</p>
            {r.special && <p className="text-sm text-gray-600">Note: {r.special}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
