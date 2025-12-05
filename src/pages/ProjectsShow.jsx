import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";

export default function ProjectShow() {
  const { id } = useParams();
 const [project, setProject] = useState(null);
 const [newTaskTitle, setNewTaskTitle] = useState("");
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
     setProject(data);
   } catch (err) {
     console.log("failed to load project");
   }
 };

 const addTask = async () => {
   if (!newTaskTitle.trim()) return;
   try {
     const res = await fetch(`http://localhost:3000/api/v1/projects/${id}/tasks`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${localStorage.getItem("jwt")}`,
       },
       body: JSON.stringify({ task: { title: newTaskTitle.trim() } }),
     });
     const task = await res.json();
     setProject({ ...project, tasks: [...project.tasks, task] });
     setNewTaskTitle("");
   } catch (err) {
     alert("task failed");
   }
 };

 if (!project) return <div className="p-20 text-center text-3xl">Loading...</div>;

 return (
   <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-12">
     <div className="max-w-6xl mx-auto">
       <button onClick={() => navigate("/projects")} className="flex items-center gap-3 mb-8 text-indigo-600 hover:text-indigo-800 text-xl">
         <ArrowLeft size={28} /> Back
       </button>
       <h1 className="text-6xl font-black mb-12">{project.title || project.name}</h1>

       <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-10 mb-12">
         <h2 className="text-4xl font-bold mb-8">Tasks</h2>
         <div className="flex gap-6 mb-10">
           <input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)}
             onKeyPress={e => e.key === "Enter" && addTask()}
             placeholder="add new task" className="flex-1 px-8 py-5 border-2 rounded-2xl" />
           <button onClick={addTask}
             className="bg-green-600 hover:bg-green-700 text-white px-12 py-5 rounded-2xl flex items-center gap-4">
             <Plus size={32} /> Add Task
           </button>
         </div>
         <div className="space-y-4">
           {project.tasks?.map(t => (
             <div key={t.id} className="bg-gray-50 p-6 rounded-2xl">
               <span className="text-xl font-medium">{t.title}</span>
             </div>
           ))}
         </div>
       </div>
     </div>
   </div>
 );
}