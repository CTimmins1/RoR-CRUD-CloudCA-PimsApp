// Simple logout helper.
// All i do is remove the JWT token from localStorage.
// This effectively "logs out" the user, since they no longer have credentials.

export function logout() {
  // Remove saved JWT token
  localStorage.removeItem("token");

}
