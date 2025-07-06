require("dotenv").config();
const express = require("express");

const app = express();
const PORT = 3000;

// NEW CODE BLOCK
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
// END NEW CODE BLOCK

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
