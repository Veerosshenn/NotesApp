<template>
  <div class="app">
    <div class="max-w-4xl mx-auto w-full">
      <h1>📝 My Notes App</h1>

      <!-- Create Note Form -->
      <form @submit.prevent="addNote" class="note-form">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            v-model="newNote.title"
            placeholder="Note title"
            required
          />
          <textarea
            v-model="newNote.content"
            placeholder="Note content"
            required
          ></textarea>
        </div>

        <div class="flex justify-end">
          <button type="submit">
            ➕ Add Note
          </button>
        </div>
      </form>

      <!-- Notes List -->
      <transition-group name="list" tag="ul" class="notes-container">
        <NoteItem
          v-for="note in notes"
          :key="note._id"
          :note="note"
          @deleted="onNoteDeleted"
          @updated="onNoteUpdated"
        />
      </transition-group>

      <p v-if="notes.length === 0" class="empty-state">No notes yet — add your first note!</p>
    </div>
  </div>
</template>

<style scoped>
@import './App.css';
</style>

<script>
import NoteItem from "./components/NoteItem.vue";
import { fetchNotes, createNote } from "./api/notes";

export default {
  components: { NoteItem },
  data() {
    return {
      notes: [],
      newNote: { title: "", content: "" },
    };
  },
  async mounted() {
    await this.loadNotes();
  },
  methods: {
    async loadNotes() {
      this.notes = await fetchNotes();
    },
    async addNote() {
      if (!this.newNote.title || !this.newNote.content) return;

      const created = await createNote(this.newNote);
      this.notes.unshift(created); // instant UI update
      this.newNote = { title: "", content: "" };
    },
    onNoteDeleted(id) {
      this.notes = this.notes.filter(note => note._id !== id);
    },
    onNoteUpdated(updatedNote) {
      const index = this.notes.findIndex(n => n._id === updatedNote._id);
      if (index !== -1) this.notes[index] = updatedNote;
    },
  },
};
</script>
