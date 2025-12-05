import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectShow from "./pages/ProjectShow.jsx";
import RequireAuth from "./components/RequireAuth.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RequireAuth><Projects /></RequireAuth>} />
      <Route path="/projects" element={<RequireAuth><Projects /></RequireAuth>} />
      <Route path="/projects/:id" element={<RequireAuth><ProjectShow /></RequireAuth>} />
    </Routes>
  );
}