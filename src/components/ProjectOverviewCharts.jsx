
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function ProjectOverviewCharts({ projects }) {
  if (!projects || projects.length === 0) return null;

  // Bar chart data: number of tasks per project
  const barData = projects.map((p) => ({
    name: p.title,
    tasks: p.tasks_count || p.tasks?.length || 0,
  }));

  return (
    <div style={{ marginBottom: "40px" }}>
      <h3 className="text-2xl font-bold mb-6">Tasks Per Project</h3>

      <BarChart width={500} height={300} data={barData}>
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="tasks" fill="#6366F1" />
      </BarChart>
    </div>
  );
}
