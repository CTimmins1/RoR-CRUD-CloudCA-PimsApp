import { useEffect, useState } from "react";
import TaskTimelineChart from "./TaskTimelineChart";
import TaskStatusChart from "./TaskStatusChart";
import TaskPriorityChart from "./TaskPriorityChart";

const API_URL = "http://localhost:3000/api/v1";

export default function ProjectDetails({ project, goBack }) {
  if (!project) {
    return (
      <div>
        <button onClick={goBack}>⬅ Back</button>
        <p>No project selected.</p>
      </div>
    );
  }

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [form, setForm] = useState({ title: "", status: "pending" });

  const token = localStorage.getItem("token");
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

  useEffect(() => {
    fetch(`${API_URL}/projects/${project.id}/tasks`, {
      headers: authHeaders
    })
      .then((res) => res.json())
      .then(setTasks);

    fetch(`${API_URL}/projects/${project.id}/stats`, {
      headers: authHeaders
    })
      .then((res) => res.json())
      .then(setStats);
  }, [project.id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${API_URL}/projects/${project.id}/tasks`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((task) => {
        setTasks([...tasks, task]);
        setForm({ title: "", status: "pending" });

        fetch(`${API_URL}/projects/${project.id}/stats`, {
          headers: authHeaders
        })
          .then((res) => res.json())
          .then(setStats);
      });
  };

  const handleDeleteTask = (taskId) => {
    if (!window.confirm("Delete this task?")) return;

    fetch(`${API_URL}/projects/${project.id}/tasks/${taskId}`, {
      method: "DELETE",
      headers: authHeaders
    }).then(() => {
      setTasks(tasks.filter((t) => t.id !== taskId));

      fetch(`${API_URL}/projects/${project.id}/stats`, {
        headers: authHeaders
      })
        .then((res) => res.json())
        .then(setStats);
    });
  };

  const handleEditTask = (task) => {
    const newTitle = window.prompt("New task title:", task.title);
    if (!newTitle) return;

    const newStatus = window.prompt(
      "New status (pending / in_progress / completed):",
      task.status
    );
    if (!newStatus) return;

    fetch(`${API_URL}/projects/${project.id}/tasks/${task.id}`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify({
        title: newTitle,
        status: newStatus,
      }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));

        fetch(`${API_URL}/projects/${project.id}/stats`, {
          headers: authHeaders
        })
          .then((res) => res.json())
          .then(setStats);
      });
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
            {t.title} – {t.status}{" "}
            <button onClick={() => handleEditTask(t)}>Edit</button>{" "}
            <button onClick={() => handleDeleteTask(t.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>Add Task</h3>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Task title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <br />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <br />
        <button type="submit">Add Task</button>
      </form>

      <h3>Analytics</h3>
      {stats && <p>Total tasks: {stats.total_tasks}</p>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
        <TaskTimelineChart stats={stats} />
        <TaskStatusChart stats={stats} />
        <TaskPriorityChart stats={stats} />
      </div>

      <h4>Raw Stats (debug)</h4>
      <pre>{JSON.stringify(stats, null, 2)}</pre>
    </div>
  );
}
