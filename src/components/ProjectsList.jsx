import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/api/v1";

export default function ProjectsList({ onSelectProject }) {
  // Store list of all projects
  const [projects, setProjects] = useState([]);

  // Form state for creating a new project
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending", // default value matches backend enum
  });

  // Authorization header for authenticated requests
  const token = localStorage.getItem("token");
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

  // Load all projects one time when component mounts
  useEffect(() => {
    fetch(`${API_URL}/projects`, {
      headers: authHeaders
    })
      .then((res) => res.json())
      .then(setProjects);
  }, []);

  // Create a new project and update the local list
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${API_URL}/projects`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((project) => {
        setProjects([...projects, project]);
      });
  };

  // Delete a project after confirming with the user
  const handleDeleteProject = (id) => {
    if (!window.confirm("Delete this project?")) return;

    fetch(`${API_URL}/projects/${id}`, {
      method: "DELETE",
      headers: authHeaders
    }).then(() => {
      setProjects(projects.filter((p) => p.id !== id));
    });
  };

  // Edit project title, description, and status
  const handleEditProject = (project) => {
    const newTitle = window.prompt("New project title:", project.title);
    if (!newTitle) return;

    const newDescription = window.prompt(
      "New description:",
      project.description || ""
    );

    // Status values must match backend enum
    const newStatus = window.prompt(
      "New status (pending / in_progress / completed):",
      project.status
    );
    if (!newStatus) return;

    fetch(`${API_URL}/projects/${project.id}`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify({
        title: newTitle,
        description: newDescription,
        status: newStatus,
      }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setProjects(
          projects.map((p) => (p.id === updated.id ? updated : p))
        );
      });
  };

  return (
    <div>
      {/* List of all projects */}
      <ul>
        {projects.map((p) => (
          <li key={p.id} style={{ margin: "0.5rem 0" }}>
            {/* Select a project to load its details page */}
            <button onClick={() => onSelectProject(p)}>
              {p.title}
            </button>{" "}

            {/* Edit or delete functionality */}
            <button onClick={() => handleEditProject(p)}>Edit</button>{" "}
            <button onClick={() => handleDeleteProject(p.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Form for creating a new project */}
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

        {/* Status dropdown matches backend enum values */}
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <br />

        <button type="submit">Create</button>
      </form>
    </div>
  );
}
