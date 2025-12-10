// src/pages/ProjectShow.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Edit2 } from "lucide-react";

// Chart components for visualising task distribution
import TaskPriorityChart from "../components/TaskPriorityChart";
import TaskStatusChart from "../components/TaskStatusChart";

export default function ProjectShow() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  // Local state for task creation + editing
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState(0);
  const [editStatus, setEditStatus] = useState(0); // required for task status edits

  const navigate = useNavigate();

  // Fetch project data on mount or when project ID changes
  useEffect(() => {
    loadProject();
  }, [id]);

  // Retrieve the project, its tasks, and all metadata needed for rendering
  const loadProject = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/projects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const data = await res.json();

      // Basic sanity logging for visibility during development
      console.log("Loaded project:", data);
      console.log("Tasks:", data.tasks);

      setProject(data);
    } catch (err) {
      alert("Project not found");
      navigate("/projects");
    }
  };

  // Create a new task and inject it into local state
  const createTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      const res = await fetch(`http://localhost:3000/api/v1/projects/${id}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          task: { title: newTaskTitle.trim(), priority: 0 },
        }),
      });

      const newTask = await res.json();
      setProject({ ...project, tasks: [...project.tasks, newTask] });
      setNewTaskTitle("");
    } catch (err) {
      alert("Task creation failed");
    }
  };

  // Update an existing task (title, priority, status)
  const updateTask = async (taskId) => {
    if (!editTitle.trim()) {
      alert("Title cannot be empty");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/v1/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          task: {
            title: editTitle.trim(),
            priority: editPriority,
            status: editStatus,
          },
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      const updatedTask = await res.json();

      // Replace the edited task locally without re-fetching the full project
      setProject({
        ...project,
        tasks: project.tasks.map((t) =>
          t.id === taskId ? updatedTask : t
        ),
      });

      setEditingTaskId(null);
    } catch (err) {
      alert("Update failed — title cannot be blank");
    }
  };

  // Delete a task and remove it from local state
  const deleteTask = async (taskId) => {
    if (!confirm("Delete task?")) return;

    await fetch(`http://localhost:3000/api/v1/tasks/${taskId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    setProject({
      ...project,
      tasks: project.tasks.filter((t) => t.id !== taskId),
    });
  };

  // Early return to avoid undefined access before project loads
  if (!project)
    return <div className="p-20 text-center text-3xl">Loading...</div>;

  // Aggregate task stats to drive both charts (priority + status)
  const buildTaskStats = (tasks = []) => {
    const priority_counts = { low: 0, medium: 0, high: 0 };
    const status_counts = { pending: 0, in_progress: 0, completed: 0 };

    tasks.forEach((t) => {
      // Priority classification
      if (t.priority === 0 || t.priority === "low") priority_counts.low++;
      else if (t.priority === 1 || t.priority === "medium") priority_counts.medium++;
      else priority_counts.high++;

      // Status classification
      if (t.status === 0 || t.status === "pending") status_counts.pending++;
      else if (t.status === 1 || t.status === "in_progress") status_counts.in_progress++;
      else status_counts.completed++;
    });

    return { priority_counts, status_counts };
  };

  // Compute chart-ready stats based on current task list
  const stats = buildTaskStats(project.tasks || []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-12">
      <div className="max-w-6xl mx-auto">

        {/* Page nav / back button */}
        <button
          onClick={() => navigate("/projects")}
          className="flex items-center gap-3 mb-8 text-indigo-600 hover:text-indigo-800 text-xl"
        >
          <ArrowLeft size={28} /> Back to Projects
        </button>

        {/* Project title */}
        <h1 className="text-6xl font-black mb-12">
          {project.title || project.name}
        </h1>

        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-10">

          {/* Section heading */}
          <h2 className="text-4xl font-bold mb-8">Tasks</h2>

          {/* Data visualisation layer */}
          <div className="grid grid-cols-2 gap-12 mb-12">
            <TaskPriorityChart stats={stats} />
            <TaskStatusChart stats={stats} />
          </div>

          {/* Task creation UI */}
          <div className="flex gap-6 mb-10">
            <input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && createTask()}
              placeholder="add new task..."
              className="flex-1 px-8 py-5 border-2 rounded-2xl"
            />

            <button
              onClick={createTask}
              className="bg-green-600 text-white px-12 py-5 rounded-2xl flex items-center gap-4"
            >
              <Plus size={32} /> Add Task
            </button>
          </div>

          {/* Task list rendering */}
          <div className="space-y-6">
            {project.tasks?.length === 0 ? (
              <p className="text-center text-xl text-gray-500 py-20">
                No tasks yet — add one above!
              </p>
            ) : (
              project.tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-gray-50 p-6 rounded-2xl flex justify-between items-center"
                >

                  {/* Editing mode */}
                  {editingTaskId === task.id ? (
                    <div className="flex gap-4 flex-1 items-center">
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-xl"
                      />

                      {/* Priority selector */}
                      <select
                        value={editPriority}
                        onChange={(e) => setEditPriority(Number(e.target.value))}
                        className="px-4 py-2 border rounded-xl"
                      >
                        <option value={0}>Low</option>
                        <option value={1}>Medium</option>
                        <option value={2}>High</option>
                      </select>

                      {/* Status selector */}
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(Number(e.target.value))}
                        className="px-4 py-2 border rounded-xl"
                      >
                        <option value={0}>Pending</option>
                        <option value={1}>In Progress</option>
                        <option value={2}>Completed</option>
                      </select>

                      {/* Save edited task */}
                      <button
                        onClick={() => updateTask(task.id)}
                        className="text-green-600 font-bold"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    // Standard display mode
                    <div className="flex-1">

                      <span className="text-xl font-medium">{task.title}</span>

                      <span className="ml-6 text-gray-500">
                        Priority:{" "}
                        {task.priority === 0
                          ? "Low"
                          : task.priority === 1
                          ? "Medium"
                          : "High"}
                      </span>

                      <span className="ml-6 text-gray-500">
                        Status:{" "}
                        {task.status === 0
                          ? "Pending"
                          : task.status === 1
                          ? "In Progress"
                          : "Completed"}
                      </span>
                    </div>
                  )}

                  {/* Edit + Delete actions */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setEditingTaskId(task.id);
                        setEditTitle(task.title);
                        setEditPriority(task.priority || 0);
                        setEditStatus(task.status ?? 0);
                      }}
                      className="text-blue-600"
                    >
                      <Edit2 size={22} />
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-600"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
