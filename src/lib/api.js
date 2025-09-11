const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001";

async function request(path, options = {}) {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Request failed");
    return data;
  } catch (err) {
    console.error(`API error [${path}]:`, err.message);
    throw err;
  }
}

/* Auth endpoints */
export function registerUser({ email, password, name }) {
  return request("/register", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });
}

export function loginUser({ email, password }) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/* Chat endpoints */
export function sendEphemeralMessage(message) {
  return request("/anon-chat", {
    method: "POST",
    body: JSON.stringify({ session_id: "ephemeral", message }),
  });
}