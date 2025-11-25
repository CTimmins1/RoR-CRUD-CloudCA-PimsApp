import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/api/v1";

export default function ProjectDetails({ project, goBack }) {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [form, setForm] = useState({ title: "", status: "pending" });

  useEffect(() => {
    fetch(`${API_URL}/projects/${project.id}/tasks`)
      .then((res) => res.json())
      .then(setTasks);

    fetch(`${API_URL}/projects/${project.id}/stats`)
      .then((res) => res.json())
      .then(setStats);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/projects/${project.id}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((task) => setTasks([...tasks, task]));
  };

  return (
    <div>
      <button onClick={goBack}>⬅ Back</button>
      <h2>{project.title}</h2>
      <p>{project.description}</p>

      <h3>Tasks</h3>
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            {t.title} – {t.status}
          </li>
        ))}
      </ul>

      <h3>Add Task</h3>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Task title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        /><br />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="complete">Complete</option>
        </select>
        <br />
        <button type="submit">Add Task</button>
      </form>

      <h3>Stats</h3>
      <pre>{JSON.stringify(stats, null, 2)}</pre>
    </div>
  );
}
