require("dotenv").config();

const mongoose = require("mongoose");
const Note = require("./models/Note");

const sampleNotes = [
  {
    title: "Finish notes app polish",
    content: "Tidy up the last UI details, check mobile spacing, and make sure the search/filter flow still feels smooth.",
    tags: ["work", "dev", "todo"],
    pinned: true,
    createdAt: "2026-03-28T18:40:00.000Z",
    updatedAt: "2026-03-28T20:15:00.000Z",
  },
  {
    title: "Groceries for the week",
    content: "Milk, eggs, bread, tomatoes, rice, pasta, coffee, and snacks for the desk drawer.",
    tags: ["groceries", "errands"],
    pinned: false,
    createdAt: "2026-03-19T16:10:00.000Z",
    updatedAt: "2026-03-19T16:10:00.000Z",
  },
  {
    title: "Reply to messages",
    content: "Answer the two pending texts, send the follow-up email, and check if anyone replied about the weekend plan.",
    tags: ["personal", "errands"],
    pinned: false,
    createdAt: "2026-03-11T09:05:00.000Z",
    updatedAt: "2026-03-11T10:30:00.000Z",
  },
  {
    title: "Workout plan",
    content: "Do a short upper-body session, then a walk after dinner so I’m not sitting all evening.",
    tags: ["health", "routine"],
    pinned: true,
    createdAt: "2026-03-03T07:45:00.000Z",
    updatedAt: "2026-03-03T08:20:00.000Z",
  },
  {
    title: "Weekend ideas",
    content: "Maybe try a new coffee shop, take a long walk, and spend an hour cleaning up the room.",
    tags: ["plans", "personal"],
    pinned: false,
    createdAt: "2026-02-24T14:25:00.000Z",
    updatedAt: "2026-02-24T14:25:00.000Z",
  },
  {
    title: "Small bug list",
    content: "Check the CORS config, make sure the backend env is right on Render, and verify the notes load after deploy.",
    tags: ["dev", "bugs"],
    pinned: true,
    createdAt: "2026-02-16T19:00:00.000Z",
    updatedAt: "2026-02-16T21:10:00.000Z",
  },
  {
    title: "Things to buy later",
    content: "Notebook refill, charger cable, and a better mouse pad if I see one on sale.",
    tags: ["shopping", "ideas"],
    pinned: false,
    createdAt: "2026-02-08T12:35:00.000Z",
    updatedAt: "2026-02-08T12:35:00.000Z",
  },
  {
    title: "Quick cleanup",
    content: "Empty downloads, sort screenshots, and archive the old tabs I keep meaning to close.",
    tags: ["home", "cleanup"],
    pinned: false,
    createdAt: "2026-01-30T17:50:00.000Z",
    updatedAt: "2026-01-30T18:05:00.000Z",
  },
  {
    title: "Project next steps",
    content: "Add tag filtering, markdown preview, and maybe a better empty state before wrapping this up.",
    tags: ["dev", "ideas"],
    pinned: true,
    createdAt: "2026-01-22T20:10:00.000Z",
    updatedAt: "2026-01-22T22:05:00.000Z",
  },
  {
    title: "Reminder for later",
    content: "Review the deployment settings one more time and double-check the production backend URL.",
    tags: ["reminder", "dev"],
    pinned: false,
    createdAt: "2026-01-14T08:15:00.000Z",
    updatedAt: "2026-01-14T08:15:00.000Z",
  },
];

async function seedDatabase() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const shouldReset = process.argv.includes("--reset");

  if (shouldReset) {
    await Note.deleteMany({});
  }

  const existingTitles = new Set((await Note.find({}, { title: 1 })).map((note) => note.title));
  const notesToInsert = sampleNotes.filter((note) => !existingTitles.has(note.title));

  if (notesToInsert.length > 0) {
    await Note.collection.insertMany(notesToInsert);
  }

  const totalCount = await Note.countDocuments();
  console.log(`Seed complete. Inserted ${notesToInsert.length} notes. Total notes: ${totalCount}.`);

  await mongoose.disconnect();
}

seedDatabase().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exitCode = 1;
});