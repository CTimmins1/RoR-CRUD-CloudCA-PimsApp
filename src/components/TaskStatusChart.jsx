import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";

const COLORS = ["#fbbf24", "#3b82f6", "#22c55e", "#ef4444"];

export default function TaskStatusChart({ stats }) {
  if (!stats || !stats.status_counts) return <p>No status data yet.</p>;

  const entries = Object.entries(stats.status_counts);
  if (entries.length === 0) return <p>No status data yet.</p>;

  const data = entries.map(([status, count]) => ({
    name: status,
    value: count,
  }));

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <h3>Tasks by Status</h3>
      <PieChart width={400} height={260}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
