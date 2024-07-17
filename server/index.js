const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const port = 3000;
const dataFile = path.join(__dirname, "data.json");

app.use(express.urlencoded({ extended: true }));

app.get("/poll", async (_req, res) => {
  const data = JSON.parse(await fs.readFile(dataFile, "utf8"));
  const totalVotes = Object.values(data).reduce((acc, item) => acc + item, 0);

  const result = Object.entries(data).map(([key, value]) => ({
    label: key,
    percentage: ((value / totalVotes) * 100 || 0).toFixed(1),
  }));

  res.json(result);
});

app.listen(port, () => {
  console.log(`server is running on ${port} 🎉`);
});
