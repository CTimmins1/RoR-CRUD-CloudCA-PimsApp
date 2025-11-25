export default function ProjectList({ projects, onSelect, onDelete }) {
  return (
    <div>
      <h3>Projects</h3>
      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            <strong onClick={() => onSelect(p)} style={{ cursor: "pointer" }}>
              {p.name}
            </strong>

            <button onClick={() => onDelete(p.id)} style={{ marginLeft: "10px" }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
