const express = require("express");
const dotenv = require("dotenv");

dotenv.config(); // loads the .env into process.env
const app = express();

//parse incoming json bodies
app.use(express.json());
require("./src/db/");
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port  ${PORT}`);
});
