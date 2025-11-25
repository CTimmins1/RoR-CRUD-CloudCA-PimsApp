import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function TaskPriorityChart({ stats }) {
  if (!stats || !stats.priority_counts) return <p>No priority data yet.</p>;

  const entries = Object.entries(stats.priority_counts);
  if (entries.length === 0) return <p>No priority data yet.</p>;

  const data = entries.map(([priority, count]) => ({
    priority,
    tasks: count,
  }));

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <h3>Tasks by Priority</h3>
      <BarChart
        width={500}
        height={260}
        data={data}
        margin={{ top: 30, right: 30, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="priority" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="tasks" fill="#6366f1" />
      </BarChart>
    </div>
  );
}
