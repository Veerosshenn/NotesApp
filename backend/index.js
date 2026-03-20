require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const notesRoutes = require("./routes/notes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use("/notes", notesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running very fast like Sonic on http://localhost:${PORT}`);
});

