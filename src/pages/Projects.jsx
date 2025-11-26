import { useState, useEffect } from "react";
import ProjectsList from "../components/ProjectsList";
import ProjectDetails from "../components/ProjectDetails";
import ProjectOverviewCharts from "../components/ProjectOverviewCharts";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/projects", {
      headers: authHeaders
    })
      .then((res) => res.json())
      .then(async (projects) => {
        const enriched = await Promise.all(
          projects.map(async (p) => {
            const tasksRes = await fetch(
              `http://localhost:3000/api/v1/projects/${p.id}/tasks`,
              { headers: authHeaders }
            );
            const tasks = await tasksRes.json();

            return { ...p, tasks_count: tasks.length };
          })
        );

        setProjects(enriched);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleBack = () => setSelectedProject(null);

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={handleLogout} style={{ marginBottom: "20px" }}>
        Logout
      </button>

      {!selectedProject && (
        <>
          <ProjectOverviewCharts projects={projects} />

          <ProjectsList
            projects={projects}
            setProjects={setProjects}
            onSelectProject={setSelectedProject}
          />
        </>
      )}

      {selectedProject && (
        <ProjectDetails project={selectedProject} goBack={handleBack} />
      )}
    </div>
  );
}
