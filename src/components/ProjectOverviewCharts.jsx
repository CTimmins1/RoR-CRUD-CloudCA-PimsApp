import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";

export default function ProjectOverviewCharts({ projects }) {
  if (!projects || projects.length === 0) return null;

  // Status mapping (integer → label)
  const STATUS_MAP = {
    0: "To Do",
    1: "In Progress",
    2: "Completed",
  };

  const STATUS_COLORS = {
    "To Do": "#EF4444",
    "In Progress": "#F59E0B",
    Completed: "#10B981",
  };

  // BAR CHART
  const barData = projects.map((p) => ({
    name: p.title,
    tasks: p.tasks_count || p.tasks?.length || 0,
  }));

  // PIE CHART
  const statusCounts = { "To Do": 0, "In Progress": 0, "Completed": 0 };

  projects.forEach((p) => {
    const label = STATUS_MAP[p.status_int]; // <--- FIXED HERE
    if (label) statusCounts[label]++;
  });

  const pieData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div style={{ display: "flex", gap: "40px", marginBottom: "40px" }}>
      {/* BAR CHART */}
      <div>
        <h3>Tasks Per Project</h3>
        <BarChart width={350} height={250} data={barData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="tasks" fill="#6366F1" />
        </BarChart>
      </div>

      {/* PIE CHART */}
      <div>
        <h3>Project Status Breakdown</h3>
        <PieChart width={300} height={250}>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            nameKey="name"
            label
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={STATUS_COLORS[entry.name]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
}
