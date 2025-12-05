import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Plus, Trash2, Edit2 } from "lucide-react";

// Import charts for project analytics
import ProjectOverviewCharts from "../components/ProjectOverviewCharts";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const navigate = useNavigate();

  // Load projects on initial page render
  useEffect(() => {
    loadProjects();
  }, []);

  // Fetch all projects belonging to the authenticated user
  const loadProjects = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/projects", {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      const data = await res.json();
      
      // Log to verify if backend provides status + tasks_count
      console.log("Loaded projects:", data);
      
      setProjects(data);
    } catch (err) {
      console.log("Failed to load projects");
    }
  };

  // Create a new project
  const createProject = async () => {
    if (!newName.trim()) return;

    try {
      const res = await fetch("http://localhost:3000/api/v1/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({ project: { title: newName.trim() } }),
      });

      const data = await res.json();
      setProjects([...projects, data]);
      setNewName("");
    } catch (err) {
      alert("Project creation failed");
    }
  };

  // Update a project's name
  const updateProject = async (id) => {
    if (!editName.trim()) return;

    try {
      const res = await fetch(`http://localhost:3000/api/v1/projects/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({ project: { title: editName.trim() } }),
      });

      const data = await res.json();
      setProjects(projects.map((p) => (p.id === id ? data : p)));
      setEditingId(null);
    } catch (err) {
      alert("Project update failed");
    }
  };

  // Delete a project
  const deleteProject = async (id) => {
    if (!confirm("Delete this project?")) return;

    await fetch(`http://localhost:3000/api/v1/projects/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
    });

    setProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-12">
      <div className="max-w-7xl mx-auto">

        {/* Header / navigation section */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            PIMS
          </h1>
          <button
            onClick={() => {
              localStorage.removeItem("jwt");
              navigate("/login");
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl flex items-center gap-3"
          >
            <LogOut size={28} /> Logout
          </button>
        </div>

        {/* New project creation section */}
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-10 mb-12">
          <h2 className="text-4xl font-bold mb-8">Create New Project</h2>

          <div className="flex gap-6">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && createProject()}
              placeholder="project name"
              className="flex-1 px-8 py-5 text-xl border-2 rounded-2xl"
            />

            <button
              onClick={createProject}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-5 rounded-2xl flex items-center gap-4"
            >
              <Plus size={32} /> Add Project
            </button>
          </div>
        </div>

        {/* Dashboard charts showing project analytics */}
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-10 mb-12">
          <h2 className="text-4xl font-bold mb-8">Project Overview</h2>
          
          {/* Charts only render when projects are available */}
          <ProjectOverviewCharts projects={projects} />
        </div>

        {/* Project cards (interactive grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition transform hover:-translate-y-4"
            >
              {/* Project banner */}
              <div
                onClick={() => navigate(`/projects/${project.id}`)}
                className="cursor-pointer h-48 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-3xl"
              ></div>

              {/* Project content */}
              <div className="p-8">

                {/* Edit mode for title */}
                {editingId === project.id ? (
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && updateProject(project.id)}
                    onBlur={() => updateProject(project.id)}
                    className="text-2xl font-bold w-full mb-4 px-4 py-2 border-2 rounded-xl"
                    autoFocus
                  />
                ) : (
                  <h3 className="text-2xl font-bold mb-4">
                    {project.title || project.name}
                  </h3>
                )}

                {/* Interaction controls */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    View Tasks
                  </button>

                  <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(project.id);
                        setEditName(project.title || project.name);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 size={24} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProject(project.id);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>

                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
