import { API_URL } from "./configApi";

export async function get() {
  const response = await fetch(`${API_URL}/1`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Bypass-Tunnel-Reminder": "true"
    }});
  const data = await response.json();
  return data;
}

export async function create(item) {
  const response = await fetch(`${API_URL}/1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Bypass-Tunnel-Reminder": "true"
    },
    body: JSON.stringify(item)
  });

  return response.json();
}

export async function updatePerson(id, item) {
    const response = await fetch(`${API_URL}/1/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Bypass-Tunnel-Reminder": "true"
      },
      body: JSON.stringify(item)
    });
  
    return response.json();
  }
  
  export async function deletePerson(id) {
    await fetch(`${API_URL}/1/${id}`, {
      method: "DELETE"
    });
  }