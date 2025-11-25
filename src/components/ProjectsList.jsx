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

  const handleDeleteProject = (id) => {
  if (!window.confirm("Delete this project? This cannot be undone.")) return;

  fetch(`${API_URL}/projects/${id}`, {
    method: "DELETE",
  }).then(() => {
    setProjects(projects.filter((p) => p.id !== id));
  });
};

const handleEditProject = (project) => {
  const newTitle = window.prompt("New project title:", project.title);
  if (!newTitle) return;

  const newDescription = window.prompt(
    "New description:",
    project.description || ""
  );

  const newStatus = window.prompt(
    'New status (pending / active / complete):',
    project.status || "pending"
  );

  fetch(`${API_URL}/projects/${project.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: newTitle,
      description: newDescription,
      status: newStatus,
    }),
  })
    .then((res) => res.json())
    .then((updated) =>
      setProjects(
        projects.map((p) => (p.id === updated.id ? updated : p))
      )
    );
};

  return (
    <div>
      <h2>Projects</h2>

    <ul>
      {projects.map((p) => (
        <li key={p.id} style={{ margin: "0.5rem 0" }}>
          <button onClick={() => onSelectProject(p)}>{p.title}</button>
          {" "}
          <button onClick={() => handleEditProject(p)}>Edit</button>
          {" "}
          <button onClick={() => handleDeleteProject(p.id)}>Delete</button>
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
