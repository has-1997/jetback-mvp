require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
