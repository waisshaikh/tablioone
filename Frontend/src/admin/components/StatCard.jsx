export default function StatCard({ title, value, sub }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-5">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}
