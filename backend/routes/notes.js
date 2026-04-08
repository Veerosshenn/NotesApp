const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

function normalizeTags(tagsInput) {
  if (!tagsInput) return [];

  const tags = Array.isArray(tagsInput)
    ? tagsInput
    : String(tagsInput).split(",");

  return [...new Set(
    tags
      .map((tag) => String(tag).trim().toLowerCase())
      .filter(Boolean)
  )];
}

// GET all notes
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// CREATE note
router.post("/", async (req, res) => {
  const { title, content, tags, pinned } = req.body;

  if (!String(title || "").trim() || !String(content || "").trim()) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  try {
    const note = new Note({
      title: String(title).trim(),
      content: String(content).trim(),
      tags: normalizeTags(tags),
      pinned: Boolean(pinned),
    });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// UPDATE note
router.put("/:id", async (req, res) => {
  const { title, content, tags, pinned } = req.body;
  const updates = {};

  if (title !== undefined) {
    if (!String(title).trim()) {
      return res.status(400).json({ error: "Title cannot be empty" });
    }
    updates.title = String(title).trim();
  }

  if (content !== undefined) {
    if (!String(content).trim()) {
      return res.status(400).json({ error: "Content cannot be empty" });
    }
    updates.content = String(content).trim();
  }

  if (tags !== undefined) {
    updates.tags = normalizeTags(tags);
  }

  if (pinned !== undefined) {
    updates.pinned = Boolean(pinned);
  }

  if (!Object.keys(updates).length) {
    return res.status(400).json({ error: "No valid fields were provided for update" });
  }

  try {
    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE note
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Note.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
