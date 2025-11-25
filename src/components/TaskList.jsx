import { deleteTask } from "../api";

export default function TaskList({ tasks, onRefresh }) {
  async function handleDelete(id) {
    await deleteTask(id);
    onRefresh();
  }

  return (
    <div>
      <h4>Tasks</h4>
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            {t.title}
            <button 
              onClick={() => handleDelete(t.id)} 
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

