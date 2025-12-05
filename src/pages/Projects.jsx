import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Plus, Trash2 } from "lucide-react";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [newName, setNewName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/projects", {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.log("couldn't load projects");
    }
  };

  const createProject = async () => {
    if (!newName.trim()) return;
    try {
      const res = await fetch("http://localhost:3000/api/v1/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          project: { title: newName.trim() },
        }),
      });
      const data = await res.json();
      setProjects([...projects, data]);
      setNewName("");
    } catch (err) {
      alert("create failed");
    }
  };

  const deleteProject = async (id) => {
    if (!confirm("Delete this project forever?")) return;
    try {
      await fetch(`http://localhost:3000/api/v1/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      alert("delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            PIMS
          </h1>
          <button onClick={() => { localStorage.removeItem("jwt"); navigate("/login"); }}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl flex items-center gap-3">
            <LogOut size={28} /> Logout
          </button>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-10 mb-12">
          <h2 className="text-text-4xl font-bold mb-8">Create New Project</h2>
          <div className="flex gap-6">
            <input value={newName} onChange={e => setNewName(e.target.value)}
              onKeyPress={e => e.key === "Enter" && createProject()}
              placeholder="project name" className="flex-1 px-8 py-5 text-xl border-2 rounded-2xl" />
            <button onClick={createProject}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-5 rounded-2xl flex items-center gap-4">
              <Plus size={32} /> Add Project
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {projects.map(p => (
            <div key={p.id} className="group bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition transform hover:-translate-y-4">
              <div onClick={() => navigate(`/projects/${p.id}`)}
                className="cursor-pointer h-48 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-3xl"></div>
              <div className="p-8 relative">
                <h3 className="text-2xl font-bold mb-4">{p.title || p.name}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteProject(p.id);
                  }}
                  className="absolute top-4 right-4 text-red-600 hover:text-red-800 opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 size={28} />
                </button>
                <div className="text-center mt-8">
                  <span className="text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
                    onClick={() => navigate(`/projects/${p.id}`)}>
                    View Tasks →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}