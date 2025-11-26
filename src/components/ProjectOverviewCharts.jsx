import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";

export default function ProjectOverviewCharts({ projects }) {
  if (!projects || projects.length === 0) return null;

  const barData = projects.map((p) => ({
    name: p.title,
    tasks: p.tasks_count || 0,
  }));

  const statusCounts = projects.reduce(
    (acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    },
    {}
  );

  const pieData = Object.keys(statusCounts).map((status) => ({
    name: status,
    value: statusCounts[status],
  }));

  return (
    <div style={{ display: "flex", gap: "40px", marginBottom: "40px" }}>
      <div>
        <h3>Tasks Per Project</h3>
        <BarChart width={350} height={250} data={barData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="tasks" />
        </BarChart>
      </div>

      <div>
        <h3>Project Status Breakdown</h3>
        <PieChart width={300} height={250}>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
}
