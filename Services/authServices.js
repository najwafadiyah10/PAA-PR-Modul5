const API_URL = "https://library-api-lime.vercel.app/api";

async function registerUser(data) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

async function loginUser(data) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const result = await res.json();

  console.log("Response login:", result);

  if (result.data?.accessToken) {
    localStorage.setItem("token", result.data.accessToken);
    const role = result.data.user?.role || "member";
    localStorage.setItem("role", role);
  }

  return result;
}

async function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

async function kembali() {
  localStorage.clear();
  window.location.href = "dashboard_admin.html";
}