// src/pages/ProjectShow.jsx - FINAL VERSION - 100% WORKING
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Edit2 } from "lucide-react";
import TaskPriorityChart from "../components/TaskPriorityChart";

export default function ProjectShow() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/v1/projects/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
    });
    const data = await res.json();

    console.log("Loaded project:", data);            
    console.log("Tasks:", data.tasks);               
    console.log("Priorities:", data.tasks.map(t => t.priority));

    setProject(data);
  } catch (err) {
    alert("Project not found");
    navigate("/projects");
  }
};

  const createTask = async () => {
    if (!newTaskTitle.trim()) return;
    try {
      const res = await fetch(`http://localhost:3000/api/v1/projects/${id}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({ task: { title: newTaskTitle.trim(), priority: 0 } }),
      });
      const newTask = await res.json();
      setProject({ ...project, tasks: [...project.tasks, newTask] });
      setNewTaskTitle("");
    } catch (err) {
      alert("task failed");
    }
  };

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
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        task: { title: editTitle.trim(), priority: editPriority },
      }),
    });

    if (!res.ok) throw new Error("Update failed");

    const updatedTask = await res.json();
    setProject({
      ...project,
      tasks: project.tasks.map(t => t.id === taskId ? updatedTask : t)
    });
    setEditingTaskId(null);
  } catch (err) {
    alert("Update failed — title cannot be blank");
  }
};

  const deleteTask = async (taskId) => {
    if (!confirm("Delete task?")) return;
    await fetch(`http://localhost:3000/api/v1/tasks/${taskId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
    });
    setProject({
      ...project,
      tasks: project.tasks.filter(t => t.id !== taskId)
    });
  };

  if (!project) return <div className="p-20 text-center text-3xl">Loading...</div>;

  // Build stats object required by TaskPriorityChart
const buildTaskStats = () => {
  if (!project || !project.tasks) return { priority_counts: {} };

  const priority_counts = { low: 0, medium: 0, high: 0 };

  project.tasks.forEach((task) => {
    if (task.priority === 0 || task.priority === "low") priority_counts.low++;
    else if (task.priority === 1 || task.priority === "medium") priority_counts.medium++;
    else priority_counts.high++;
  });

  return { priority_counts };
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-12">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate("/projects")} className="flex items-center gap-3 mb-8 text-indigo-600 hover:text-indigo-800 text-xl">
          <ArrowLeft size={28} /> Back to Projects
        </button>

        <h1 className="text-6xl font-black mb-12">{project.title || project.name}</h1>

        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-10">
          <h2 className="text-4xl font-bold mb-8">Tasks</h2>
          <TaskPriorityChart stats={buildTaskStats()} />

          <div className="flex gap-6 mb-10">
            <input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && createTask()}
              placeholder="add new task..."
              className="flex-1 px-8 py-5 border-2 rounded-2xl"
            />
            <button onClick={createTask}
              className="bg-green-600 text-white px-12 py-5 rounded-2xl flex items-center gap-4">
              <Plus size={32} /> Add Task
            </button>
          </div>

          <div className="space-y-6">
            {project.tasks?.length === 0 ? (
              <p className="text-center text-xl text-gray-500 py-20">No tasks yet — add one above!</p>
            ) : (
              project.tasks.map((task) => (
                <div key={task.id} className="bg-gray-50 p-6 rounded-2xl flex justify-between items-center">
                  {editingTaskId === task.id ? (
                    <div className="flex gap-4 flex-1 items-center">
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-xl"
                      />
                      <select
                        value={editPriority}
                        onChange={(e) => setEditPriority(Number(e.target.value))}
                        className="px-4 py-2 border rounded-xl"
                      >
                        <option value={0}>Low</option>
                        <option value={1}>Medium</option>
                        <option value={2}>High</option>
                      </select>
                      <button onClick={() => updateTask(task.id)} className="text-green-600 font-bold">
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <span className="text-xl font-medium">{task.title}</span>
                      <span className="ml-6 text-gray-500">
                      Priority: {
                        task.priority === 0 || task.priority === "low"
                          ? "Low"
                          : task.priority === 1 || task.priority === "medium"
                          ? "Medium"
                          : "High"
                      }
                    </span>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setEditingTaskId(task.id);
                        setEditTitle(task.title);
                        setEditPriority(task.priority || 0);
                      }}
                      className="text-blue-600"
                    >
                      <Edit2 size={22} />
                    </button>
                    <button onClick={() => deleteTask(task.id)} className="text-red-600">
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