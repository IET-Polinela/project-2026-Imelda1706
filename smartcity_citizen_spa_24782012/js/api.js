const API_BASE_URL = "http://103.151.63.84:8003/api";

async function requestAPI(endpoint, method = "GET", bodyData = null) {
  const headers = {
    "Content-Type": "application/json",
  };

  const accessToken = localStorage.getItem("access_token");

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const options = {
    method: method,
    headers: headers,
  };

  if (bodyData) {
    options.body = JSON.stringify(bodyData);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

// =========================
// JWT Interceptor
// =========================
if (response.status === 401) {

    alert("Sesi Anda telah habis atau Anda belum login.");

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");

    window.location.hash = "#login";

    return {
        status: 401,
        ok: false,
        data: null,
    };
}

const data = await response.json().catch(() => null);

  return {
    status: response.status,
    ok: response.ok,
    data: data,
  };
}