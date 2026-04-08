<template>
  <div class="app">
    <div class="app-shell">
      <header class="hero">
        <p class="eyebrow">Personal Workspace</p>
        <h1>Notes that stay sharp</h1>
        <p class="subtitle">Create, pin, and find notes instantly with a clean writing-first layout.</p>
      </header>

      <section class="stats-grid">
        <article class="stat-card">
          <span>Total</span>
          <strong>{{ notes.length }}</strong>
        </article>
        <article class="stat-card">
          <span>Pinned</span>
          <strong>{{ pinnedCount }}</strong>
        </article>
        <article class="stat-card">
          <span>Showing</span>
          <strong>{{ filteredNotes.length }}</strong>
        </article>
      </section>

      <form @submit.prevent="addNote" class="note-form">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            v-model="newNote.title"
            placeholder="Write a short title"
            aria-label="Note title"
            required
          />
          <textarea
            v-model="newNote.content"
            placeholder="Capture the idea before it disappears"
            aria-label="Note content"
            required
          ></textarea>
        </div>

        <input
          v-model="newNote.tagsInput"
          placeholder="Tags (comma-separated, for example: work, ideas, todo)"
          aria-label="Note tags"
        />

        <div class="form-footer">
          <p>{{ newNote.content.length }} characters</p>
          <button type="submit" :disabled="isSaving">{{ isSaving ? "Saving..." : "Add Note" }}</button>
        </div>
      </form>

      <section class="toolbar">
        <input
          v-model.trim="searchQuery"
          placeholder="Search by title or content"
          aria-label="Search notes"
        />
        <select v-model="sortBy" aria-label="Sort notes">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="updated">Recently updated</option>
        </select>
        <select v-model="selectedTag" aria-label="Filter by tag">
          <option value="">All tags</option>
          <option v-for="tag in availableTags" :key="tag" :value="tag">#{{ tag }}</option>
        </select>
        <button class="toggle-filter" @click="showPinnedOnly = !showPinnedOnly" type="button">
          {{ showPinnedOnly ? "Show all" : "Pinned only" }}
        </button>
      </section>

      <p v-if="errorMessage" class="status error">{{ errorMessage }}</p>
      <p v-if="isLoading" class="status loading">Loading notes...</p>

      <transition-group v-if="!isLoading && filteredNotes.length" name="list" tag="ul" class="notes-container">
        <NoteItem
          v-for="note in filteredNotes"
          :key="note._id"
          :note="note"
          :is-pinned="Boolean(note.pinned)"
          @deleted="onNoteDeleted"
          @updated="onNoteUpdated"
          @pin-toggled="togglePin"
        />
      </transition-group>

      <p v-else-if="!isLoading" class="empty-state">
        {{ notes.length ? "No notes match your search yet." : "No notes yet. Add your first one above." }}
      </p>
    </div>
  </div>
</template>

<style scoped>
@import './App.css';
</style>

<script>
import NoteItem from "./components/NoteItem.vue";
import { fetchNotes, createNote, updateNote } from "./api/notes";

export default {
  components: { NoteItem },
  data() {
    return {
      notes: [],
      newNote: { title: "", content: "", tagsInput: "" },
      searchQuery: "",
      sortBy: "newest",
      selectedTag: "",
      showPinnedOnly: false,
      isLoading: false,
      isSaving: false,
      errorMessage: "",
    };
  },
  computed: {
    availableTags() {
      return [...new Set(this.notes.flatMap((note) => note.tags || []))].sort();
    },
    pinnedCount() {
      return this.notes.filter((note) => note.pinned).length;
    },
    filteredNotes() {
      let results = [...this.notes];

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        results = results.filter((note) => {
          const tags = (note.tags || []).join(" ").toLowerCase();
          return (
            note.title.toLowerCase().includes(query)
            || note.content.toLowerCase().includes(query)
            || tags.includes(query)
          );
        });
      }

      if (this.selectedTag) {
        results = results.filter((note) => (note.tags || []).includes(this.selectedTag));
      }

      if (this.showPinnedOnly) {
        results = results.filter((note) => note.pinned);
      }

      if (this.sortBy === "oldest") {
        results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else if (this.sortBy === "updated") {
        results.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      } else {
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      results.sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)));
      return results;
    },
  },
  async mounted() {
    await this.loadNotes();
  },
  methods: {
    parseTags(rawValue) {
      if (!rawValue) return [];
      return [...new Set(
        rawValue
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean)
      )];
    },
    async togglePin(note) {
      this.errorMessage = "";
      try {
        const updated = await updateNote(note._id, { pinned: !note.pinned });
        this.onNoteUpdated(updated);
      } catch (error) {
        this.errorMessage = error.message || "Unable to update pin state";
      }
    },
    async loadNotes() {
      this.isLoading = true;
      this.errorMessage = "";

      try {
        this.notes = await fetchNotes();
      } catch (error) {
        this.errorMessage = error.message || "Unable to load notes";
      } finally {
        this.isLoading = false;
      }
    },
    async addNote() {
      if (!this.newNote.title || !this.newNote.content) return;

      this.isSaving = true;
      this.errorMessage = "";

      try {
        const created = await createNote({
          title: this.newNote.title,
          content: this.newNote.content,
          tags: this.parseTags(this.newNote.tagsInput),
        });
        this.notes.unshift(created);
        this.newNote = { title: "", content: "", tagsInput: "" };
      } catch (error) {
        this.errorMessage = error.message || "Unable to create note";
      } finally {
        this.isSaving = false;
      }
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
