const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const port = 3000;
const dataFile = path.join(__dirname, "data.json");

/**
 * @typedef {Object} Percentage
 * @property {string} label - vote label, "yes" or "no"
 * @property {string} percentage - percentage of votes
 *
 * @typedef {Object} Response
 * @property {number} total - total number of votes
 * @property {Percentage[]} percentages - array of percentage objects
 */

app.use(express.urlencoded({ extended: true }));

// Enable Cors
app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/poll", async (_req, res) => {
  const data = JSON.parse(await fs.readFile(dataFile, "utf8"));
  const totalVotes = Object.values(data).reduce((acc, item) => acc + item, 0);

  /** @type {Percentage[]} */
  const percentages = Object.entries(data).map(([key, value]) => ({
    label: key,
    percentage: ((value / totalVotes) * 100 || 0).toFixed(1),
  }));

  /** @type {Response} */
  const response = { total: totalVotes, percentages: percentages };

  res.json(response);
});
app.post("/poll", async (req, res) => {
  const validVotes = ["yes", "no"];
  const vote = req.body.vote;

  if (!validVotes.includes(vote)) {
    return res.status(400).json({ message: "invalid vote value" });
  }

  const data = JSON.parse(await fs.readFile(dataFile, "utf8"));
  data[vote] = data[vote] + 1;

  await fs.writeFile(dataFile, JSON.stringify(data, null, 2));

  res.status(201).json({ message: "new vote added" });
});

app.listen(port, () => {
  console.log(`server is running on ${port} 🎉`);
});
