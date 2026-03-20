const API_URL = process.env.RENDER_URL;

export async function fetchNotes() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function createNote(note) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(note)
  });
  return res.json();
}

export async function deleteNote(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  if (!res.ok) {
    throw new Error("Failed to delete note");
  }
}

export async function updateNote(id, note) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(note)
  });

  if (!res.ok) {
    throw new Error("Failed to update note");
  }

  return res.json();
}

