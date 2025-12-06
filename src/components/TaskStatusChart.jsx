import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function TaskStatusChart({ stats }) {
  if (!stats || !stats.status_counts) return null;

  const COLORS = {
    pending: "#F59E0B",
    in_progress: "#3B82F6",
    completed: "#10B981"
  };

  const data = Object.entries(stats.status_counts).map(([key, value]) => ({
    name: key.replace("_", " ").toUpperCase(),
    value,
    color: COLORS[key],
  }));

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Tasks by Status</h3>

      <PieChart width={450} height={260}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={90}
          label
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
