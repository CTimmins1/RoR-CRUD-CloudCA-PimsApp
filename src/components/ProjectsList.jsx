import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/api/v1";

export default function ProjectsList({ onSelectProject }) {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
  });

  useEffect(() => {
    fetch(`${API_URL}/projects`)
      .then((res) => res.json())
      .then(setProjects);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((project) => setProjects([...projects, project]));
  };

  return (
    <div>
      <h2>Projects</h2>

      <ul>
        {projects.map((p) => (
          <li key={p.id} style={{ margin: "0.5rem 0" }}>
            <button onClick={() => onSelectProject(p)}>{p.title}</button>
          </li>
        ))}
      </ul>

      <h3>Add New Project</h3>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        /><br />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        /><br />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="complete">Complete</option>
        </select><br />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
