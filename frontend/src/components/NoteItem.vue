<template>
  <li class="note-item">
    <div class="note-top-row">
      <span class="meta-chip">{{ formatDate(note.updatedAt || note.createdAt) }}</span>
      <button
        @click="$emit('pin-toggled', note)"
        class="pin-toggle"
        :class="{ active: isPinned }"
        :aria-label="isPinned ? 'Unpin note' : 'Pin note'"
        type="button"
      >
        {{ isPinned ? "Pinned" : "Pin" }}
      </button>
    </div>

    <div class="note-content">
      <transition name="fade-slide" mode="out-in">
        <div v-if="editMode" key="edit" class="note-edit-mode">
          <input v-model="editNote.title" aria-label="Edit note title" />

          <input
            v-model="editTagText"
            aria-label="Edit note tags"
            placeholder="Tags: work, ideas, todo"
          />

          <div class="editor-switch">
            <button type="button" :class="{ active: !previewMode }" @click="previewMode = false">Write</button>
            <button type="button" :class="{ active: previewMode }" @click="previewMode = true">Preview</button>
          </div>

          <textarea
            v-if="!previewMode"
            v-model="editNote.content"
            aria-label="Edit note content"
          ></textarea>
          <div v-else class="markdown-preview" v-html="renderMarkdown(editNote.content)"></div>
        </div>

        <div v-else key="display" class="note-display-mode">
          <strong>{{ note.title }}</strong>
          <div class="tag-list" v-if="note.tags && note.tags.length">
            <span v-for="tag in note.tags" :key="`${note._id}-${tag}`">#{{ tag }}</span>
          </div>
          <div class="note-markdown" v-html="renderMarkdown(note.content)"></div>
        </div>
      </transition>
    </div>

    <div class="note-buttons">
      <div class="flex gap-2">
        <button v-if="editMode" @click="saveEdit" class="btn-save" :disabled="isSaving">{{ isSaving ? "Saving..." : "Save" }}</button>
        <button v-if="editMode" @click="cancelEdit" class="btn-cancel" :disabled="isSaving">Cancel</button>
        <button v-else @click="startEdit" class="btn-edit">Edit</button>
      </div>

      <button @click="deleteCurrentNote" class="btn-delete" :disabled="isDeleting">{{ isDeleting ? "Deleting..." : "Delete" }}</button>
    </div>
  </li>
</template>

<script>
import { marked } from "marked";
import DOMPurify from "dompurify";
import { updateNote, deleteNote } from "../api/notes";
import "./NoteItem.css";

export default {
  props: {
    note: {
      type: Object,
      required: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editMode: false,
      editNote: { title: "", content: "" },
      editTagText: "",
      previewMode: false,
      isSaving: false,
      isDeleting: false,
    };
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
    renderMarkdown(text) {
      const source = String(text || "");
      const html = marked.parse(source, { breaks: true, gfm: true });
      return DOMPurify.sanitize(html);
    },
    formatDate(value) {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(value));
    },
    startEdit() {
      this.editMode = true;
      this.editNote = { title: this.note.title, content: this.note.content };
      this.editTagText = (this.note.tags || []).join(", ");
      this.previewMode = false;
    },
    cancelEdit() {
      this.editMode = false;
      this.previewMode = false;
    },
    async saveEdit() {
      if (!this.editNote.title || !this.editNote.content) return;

      this.isSaving = true;
      try {
        const updated = await updateNote(this.note._id, {
          title: this.editNote.title,
          content: this.editNote.content,
          tags: this.parseTags(this.editTagText),
          pinned: this.note.pinned,
        });
        this.$emit("updated", updated);
        this.editMode = false;
        this.previewMode = false;
      } finally {
        this.isSaving = false;
      }
    },
    async deleteCurrentNote() {
      if (!confirm("Delete this note?")) return;

      this.isDeleting = true;
      try {
        await deleteNote(this.note._id);
        this.$emit("deleted", this.note._id);
      } finally {
        this.isDeleting = false;
      }
    },
  },
};
</script>
