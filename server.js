const express = require("express");
require("dotenv").config();  // Load .env file
const connectDb = require("./src/config/db");

const app = express();
app.use(express.json());

connectDb(); // Connect to MongoDB

app.get("/", (req, res) => {
    res.send("Task manager API is running.");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
