import StatCard from "../components/StatCard";

export default function Dashboard() {
  // dummy data for now
  const stats = [
    { title: "Orders Today", value: "128", sub: "+12% vs yesterday" },
    { title: "Revenue", value: "₹42,350", sub: "Today" },
    { title: "Reservations", value: "17", sub: "Upcoming" },
    { title: "Popular Dish", value: "Butter Garlic Prawns", sub: "4.9 ★" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-5">
        <div className="font-semibold mb-2">Activity</div>
        <ul className="text-sm list-disc ml-5 space-y-1 text-slate-700">
          <li>New order #A102 received</li>
          <li>Table reservation approved for 7:30 PM</li>
          <li>Menu item “Grilled Lobster” marked as Out of Stock</li>
        </ul>
      </div>
    </div>
  );
}
