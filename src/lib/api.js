const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

/* ------------------------
   Auth endpoints
------------------------ */
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

/* ------------------------
   Auth-protected fetch helper
   (requires token)
------------------------ */
export async function authFetch(url, token, options = {}) {
  if (!token) throw new Error("Unauthorized");
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  if (res.status === 401) throw new Error("Unauthorized");
  return res.json();
}

/* ------------------------
   Chat endpoints
------------------------ */
export function sendEphemeralMessage(message) {
  return request("/anon-chat", {
    method: "POST",
    body: JSON.stringify({ session_id: "ephemeral", message }),
  });
}

/* ------------------------
   Patients API
------------------------ */
export async function getPatients(token) {
  return authFetch(`${API_URL}/patients`, token);
}

/* ------------------------
   Search Paitents API
------------------------ */
export async function searchPatients(query, token) {
  return authFetch(`${API_URL}/search?q=${encodeURIComponent(query)}`, token);
}

/* ------------------------
   Patient Details API
------------------------ */
export async function addPatient({ name, age, condition }, token) {
  return authFetch(`${API_URL}/add-patient`, token, {
    method: "POST",
    body: JSON.stringify({ name, age, condition }),
  });
}
