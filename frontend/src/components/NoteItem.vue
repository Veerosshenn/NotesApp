<template>
  <li class="note-item">
    <div class="note-content">
      <transition name="fade-slide" mode="out-in">
        <!-- Edit Mode -->
        <div v-if="editMode" key="edit" class="note-edit-mode">
          <input v-model="editNote.title" />
          <textarea v-model="editNote.content"></textarea>
        </div>

        <!-- Display Mode -->
        <div v-else key="display" class="note-display-mode">
          <strong>{{ note.title }}</strong>
          <p>{{ note.content }}</p>
        </div>
      </transition>
    </div>

    <!-- Buttons -->
    <div class="note-buttons">
      <div class="flex gap-2">
        <button v-if="editMode" @click="saveEdit" class="btn-save">💾 Save</button>
        <button v-if="editMode" @click="cancelEdit" class="btn-cancel">❌ Cancel</button>
        <button v-else @click="startEdit" class="btn-edit">✏️ Edit</button>
      </div>

      <button @click="deleteNote" class="btn-delete">🗑️ Delete</button>
    </div>
  </li>
</template>

<script>
import { updateNote, deleteNote } from "../api/notes";
import "./NoteItem.css";

export default {
  props: ["note"],
  data() {
    return {
      editMode: false,
      editNote: { title: "", content: "" },
    };
  },
  methods: {
    startEdit() {
      this.editMode = true;
      this.editNote = { title: this.note.title, content: this.note.content };
    },
    cancelEdit() {
      this.editMode = false;
    },
    async saveEdit() {
      if (!this.editNote.title || !this.editNote.content) return;
      const updated = await updateNote(this.note._id, this.editNote);
      this.$emit("updated", updated);
      this.editMode = false;
    },
    async deleteNote() {
      if (!confirm("Delete this note?")) return;
      await deleteNote(this.note._id);
      this.$emit("deleted", this.note._id);
    },
  },
};
</script>
