const API_URL = import.meta.env.VITE_RENDER_URL;

// GET notes
export async function fetchNotes() {
  const res = await fetch(`${API_URL}/notes`);
  return res.json();
}

// CREATE note
export async function createNote(note) {
  const res = await fetch(`${API_URL}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(note)
  });
  return res.json();
}

// DELETE note
export async function deleteNote(id) {
  const res = await fetch(`${API_URL}/notes/${id}`, {
    method: "DELETE"
  });

  if (!res.ok) {
    throw new Error("Failed to delete note");
  }
}

// UPDATE note
export async function updateNote(id, note) {
  const res = await fetch(`${API_URL}/notes/${id}`, {
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