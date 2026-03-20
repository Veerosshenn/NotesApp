# NotesApp

A small Notes application with a Vue 3 frontend (Vite + Tailwind) and an Express/SQLite backend.

## Features

- Create, edit and delete notes
- Responsive UI with Tailwind CSS
- Small SQLite backend for persistence

## Development Process

I used AI tools to speed up design and implementation. Below are examples showing prompts, AI outputs (abridged), and how I used them.

### Tailwind card layout

- Prompt given:

```
Generate a Tailwind CSS card layout with hover animations for a note component. Include a title, content area, and action buttons.
```

- AI output (excerpt):

```
<div class="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
  <h3 class="text-lg font-semibold">Title</h3>
  <p class="mt-2 text-gray-600">Content...</p>
  <div class="mt-4 flex gap-2">
    <button class="bg-green-500 text-white px-3 py-1 rounded">Save</button>
    <button class="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
  </div>
</div>
```

- How I modified/verified:

  - Converted to a darker theme to match the app design.
  - Reduced paddings and font sizes for a more compact card.
  - Added a subtle lift transform on hover and tuned box-shadow.

- Why the changes:

  - The AI suggestion was a good baseline; I adjusted spacing and colors to match the app's visual language and improve readability.

### Color palette and typography

- Prompt given:

```
Suggest a modern purple/indigo color palette and a font pairing (system sans + Inter). Provide Tailwind theme extension entries.
```

- AI output (excerpt):

```
colors: { brand: {50:'#faf5ff',100:'#f3e8ff',500:'#7c3aed',600:'#6d28d9'} },
fontFamily: { sans: ['Inter','ui-sans-serif','system-ui'] }
```

- How I modified/verified:

  - Integrated the palette into `tailwind.config.js`.
  - Added Google Fonts `Inter` link in `index.html` for local development.
  - Tuned the contrast for buttons and placeholders to pass quick visual checks.

- Why the changes:

  - The palette gave a premium look. Small contrast tweaks ensured legibility across components.

### Troubleshooting build error

- Prompt given:

```
I get an error from Tailwind: "Cannot apply unknown utility class '-translate-y-2'" when using @apply. How to fix?
```

- AI output (excerpt):

```
The negative translate utility cannot be used with @apply in some setups. Use explicit transform values in your CSS (e.g., transform: translateY(-0.5rem)) or enable the needed utility with @reference.
```

- How I modified/verified:

  - Replaced `@apply -translate-y-2` with `transform: translateY(-0.5rem)` in `src/main.css` to avoid build-time parsing issues.
  - Restarted Vite and confirmed the dev server no longer threw the error.

- Why the changes:

  - This avoids Tailwind's parser limitation with `@apply` and negative utilities while keeping the intended animation.


## Prerequisites

- Node.js (>=16) and npm
- Git

## Setup

1. Clone the repo (or if already local, skip):

```bash
git clone https://github.com/YOUR-USERNAME/NotesApp.git
cd NotesApp
```

2. Install backend dependencies and start backend:

```powershell
cd backend
npm install
node index.js
# Backend listens on http://localhost:3000
```

3. Install frontend dependencies and start dev server:

```powershell
cd ../frontend
npm install
npm run dev
# Frontend dev server defaults to http://localhost:5173
```

Open the frontend URL in your browser and the app should connect to the backend at `http://localhost:3000`.

## Scripts

- `backend`: run `node index.js` to start the Express server.
- `frontend`: run `npm run dev` inside `frontend/` (Vite dev server).





