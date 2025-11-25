import { useState } from "react";
import { createTask } from "../api";

export default function TaskForm({ projectId, onCreated }) {
  const [title, setTitle] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const newTask = await createTask(projectId, {
      title,
      status: "Open",
    });

    onCreated(newTask);
