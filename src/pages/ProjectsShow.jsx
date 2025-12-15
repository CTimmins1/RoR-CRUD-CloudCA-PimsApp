// src/pages/ProjectShow.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Edit2 } from "lucide-react";
import { apiRequest } from "../api";

// Charts
import TaskPriorityChart from "../components/TaskPriorityChart";
import TaskStatusChart from "../components/TaskStatusChart";

export default function ProjectShow() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState(0);
  const [editStatus, setEditStatus] = useState(0);

  useEffect(() => {
    loadProject();
  }, [id]);

  // Load project + tasks
  const loadProject = async () => {
    try {
      const data = await apiRequest(`/projects/${id}`);
      setProject(data);
    } catch {
      alert("Project not found");
      navigate("/projects");
    }
  };

  // Create task
  const createTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      const newTask = await apiRequest(`/projects/${id}/tasks`, "POST", {
        task: { title: newTaskTitle.trim(), priority: 0 },
      });

      setProject({
        ...project,
        tasks: [...project.tasks, newTask],
      });

      setNewTaskTitle("");
    } catch {
      alert("Task creation failed");
    }
  };

  // Update task
  const updateTask = async (taskId) => {
    if (!editTitle.trim()) {
      alert("Title cannot be empty");
      return;
    }

    try {
      const updatedTask = await apiRequest(`/tasks/${taskId}`, "PATCH", {
        task: {
          title: editTitle.trim(),
          priority: editPriority,
          status: editStatus,
        },
      });

      setProject({
        ...project,
        tasks: project.tasks.map((t) =>
          t.id === taskId ? updatedTask : t
        ),
      });

      setEditingTaskId(null);
    } catch {
      alert("Update failed");
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    if (!confirm("Delete task?")) return;

    try {
      await apiRequest(`/tasks/${taskId}`, "DELETE");

      setProject({
        ...project,
        tasks: project.tasks.filter((t) => t.id !== taskId),
      });
    } catch {
      alert("Delete failed");
    }
  };

  if (!project) {
    return <div className="p-20 text-center text-3xl">Loading...</div>;
  }

  // Build stats for charts
  const buildTaskStats = (tasks = []) => {
    const priority_counts = { low: 0, medium: 0, high: 0 };
    const status_counts = { pending: 0, in_progress: 0, completed: 0 };

    tasks.forEach((t) => {
      const priority =
        typeof t.priority === "number"
          ? ["low", "medium", "high"][t.priority]
          : t.priority;

      if (priority_counts[priority] !== undefined) {
        priority_counts[priority]++;
      }

      const status =
        typeof t.status === "number"
          ? ["pending", "in_progress", "completed"][t.status]
          : t.status;

      if (status_counts[status] !== undefined) {
        status_counts[status]++;
      }
    });

    return { priority_counts, status_counts };
  };

  const stats = buildTaskStats(project.tasks || []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-12">
      <div className="max-w-6xl mx-auto">

        <button
          onClick={() => navigate("/projects")}
          className="flex items-center gap-3 mb-8 text-indigo-600 text-xl"
        >
          <ArrowLeft size={28} /> Back to Projects
        </button>

        <h1 className="text-6xl font-black mb-12">
          {project.title || project.name}
        </h1>

        <div className="bg-white rounded-3xl shadow-2xl p-10">

          <h2 className="text-4xl font-bold mb-8">Tasks</h2>

          <div className="grid grid-cols-2 gap-12 mb-12">
            <TaskPriorityChart stats={stats} />
            <TaskStatusChart stats={stats} />
          </div>

          <div className="flex gap-6 mb-10">
            <input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createTask()}
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

          <div className="space-y-6">
            {project.tasks.length === 0 ? (
              <p className="text-center text-xl text-gray-500 py-20">
                No tasks yet — add one above!
              </p>
            ) : (
              project.tasks.map((task) => {
                const priorityLabel =
                  typeof task.priority === "number"
                    ? ["Low", "Medium", "High"][task.priority]
                    : task.priority
                      ?.charAt(0)
                      .toUpperCase() + task.priority?.slice(1);

                const statusLabel =
                  typeof task.status === "number"
                    ? ["Pending", "In Progress", "Completed"][task.status]
                    : task.status
                      ?.replace("_", " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase());

                return (
                  <div
                    key={task.id}
                    className="bg-gray-50 p-6 rounded-2xl flex justify-between items-center"
                  >
                    {editingTaskId === task.id ? (
                      <div className="flex gap-4 flex-1 items-center">
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="flex-1 px-4 py-2 border rounded-xl"
                        />

                        <select
                          value={editPriority}
                          onChange={(e) =>
                            setEditPriority(Number(e.target.value))
                          }
                          className="px-4 py-2 border rounded-xl"
                        >
                          <option value={0}>Low</option>
                          <option value={1}>Medium</option>
                          <option value={2}>High</option>
                        </select>

                        <select
                          value={editStatus}
                          onChange={(e) =>
                            setEditStatus(Number(e.target.value))
                          }
                          className="px-4 py-2 border rounded-xl"
                        >
                          <option value={0}>Pending</option>
                          <option value={1}>In Progress</option>
                          <option value={2}>Completed</option>
                        </select>

                        <button
                          onClick={() => updateTask(task.id)}
                          className="text-green-600 font-bold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <span className="text-xl font-medium">
                          {task.title}
                        </span>

                        <span className="ml-6 text-gray-500">
                          Priority: {priorityLabel}
                        </span>

                        <span className="ml-6 text-gray-500">
                          Status: {statusLabel}
                        </span>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          setEditingTaskId(task.id);
                          setEditTitle(task.title);
                          setEditPriority(
                            typeof task.priority === "number"
                              ? task.priority
                              : ["low", "medium", "high"].indexOf(task.priority) || 0
                          );

                          setEditStatus(
                            typeof task.status === "number"
                              ? task.status
                              : ["pending", "in_progress", "completed"].indexOf(task.status) || 0
                          );
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
                );
              })
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
