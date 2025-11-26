
import { useState } from "react";
import ProjectsList from "./components/ProjectsList";
import ProjectDetails from "./components/ProjectDetails";

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>PIMS – Project Management System</h1>

      {!selectedProject ? (
        <ProjectsList onSelectProject={setSelectedProject} />
      ) : (
        <ProjectDetails
          project={selectedProject}
          goBack={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
