const RAW_API_URL = import.meta.env.VITE_RENDER_URL || "http://localhost:3000";
const API_URL = RAW_API_URL.replace(/\/+$/, "");

function buildUrl(path) {
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

async function parseResponse(res, defaultMessage) {
  if (!res.ok) {
    let message = defaultMessage;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // Ignore JSON parse errors and keep default message.
    }
    throw new Error(message);
  }

  return res.status === 204 ? null : res.json();
}

// GET notes
export async function fetchNotes() {
  const res = await fetch(buildUrl("/notes"));
  return parseResponse(res, "Failed to fetch notes");
}

// CREATE note
export async function createNote(note) {
  const res = await fetch(buildUrl("/notes"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(note)
  });
  return parseResponse(res, "Failed to create note");
}

// DELETE note
export async function deleteNote(id) {
  const res = await fetch(buildUrl(`/notes/${id}`), {
    method: "DELETE"
  });
  await parseResponse(res, "Failed to delete note");
}

// UPDATE note
export async function updateNote(id, note) {
  const res = await fetch(buildUrl(`/notes/${id}`), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(note)
  });

  return parseResponse(res, "Failed to update note");
}