import { useState } from "react";
import { createProject } from "../api";

export default function ProjectForm({ onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const newProject = await createProject({
      name,
      description,
      status: "Planned",
    });
    onCreated(newProject);
    setName("");
    setDescription("");
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h3>Create Project</h3>
      <input
        placeholder="Project name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      /><br /><br />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      /><br /><br />

      <button type="submit">Add Project</button>
    </form>
  );
}
