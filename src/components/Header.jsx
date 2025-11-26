import { logout } from "../utils/logout";

export default function Header() {
  // Simple click handler to trigger logout and redirect
  const handleLogout = () => {
    logout();

    // Redirect to login page after logging out
    window.location.href = "/login";
  };

  return (
    <header style={{ padding: "20px", background: "#eee" }}>
      <h2>PIMS Dashboard</h2>

      {/* The button is intentionally plain—style it however you want later */}
      <button onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
}
