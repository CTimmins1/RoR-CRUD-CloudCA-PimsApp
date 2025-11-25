import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function TaskTimelineChart({ stats }) {
  if (!stats || !stats.tasks_per_day) return <p>No timeline data yet.</p>;

  const data = Object.entries(stats.tasks_per_day).map(([date, count]) => ({
    date,
    tasks: count,
  }));

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <h3>Tasks Created Per Day</h3>
      <LineChart
        width={600}
        height={300}
        data={data}
        margin={{ top: 30, right: 30, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="tasks" stroke="#0077cc" />
      </LineChart>
    </div>
  );
}
