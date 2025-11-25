import { useEffect, useState } from "react";
import { fetchProjects, deleteProject, fetchTasks } from "./api";

import ProjectForm from "./components/ProjectForm";
import ProjectList from "./components/ProjectList";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

export default function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  async function loadProjects() {
    const data = await fetchProjects();
    setProjects(data);
  }

  async function loadTasks(projectId) {
    const data = await fetchTasks(projectId);
    setTasks(data);
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function handleSelect(project) {
    setSelectedProject(project);
    loadTasks(project.id);
  }

  async function handleDeleteProject(id) {
    await deleteProject(id);
    loadProjects();
    setSelectedProject(null);
    setTasks([]);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>PIMS Frontend</h1>

      {/* Create Project */}
      <ProjectForm onCreated={loadProjects} />

      {/* list projects */}
      <ProjectList
        projects={projects}
        onSelect={handleSelect}
        onDelete={handleDeleteProject}
      />

      {/* project details & tasks */}
      {selectedProject && (
        <div style={{ marginTop: "30px" }}>
          <h2>{selectedProject.name}</h2>
          <p>{selectedProject.description}</p>

          {/* add task */}
          <TaskForm
            projectId={selectedProject.id}
            onCreated={() => loadTasks(selectedProject.id)}
          />

          {/* task list */}
          <TaskList tasks={tasks} onRefresh={() => loadTasks(selectedProject.id)} />
        </div>
      )}
    </div>
  );
}
