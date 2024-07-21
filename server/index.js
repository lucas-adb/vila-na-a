const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const port = 3000;
const dbPath = path.join(__dirname, "poll.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the "poll.db" database.');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vote BOOLEAN NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

app.use(express.urlencoded({ extended: true }));

// Enable Cors
app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/poll", async (_req, res) => {
  const sql = `
  SELECT 
    COUNT(vote) AS total,
    ROUND(SUM(CASE WHEN vote = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(vote), 1) AS yes_percentage,
    ROUND(SUM(CASE WHEN vote = 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(vote), 1) AS no_percentage
  FROM votes
`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }

    res.json(rows);
  });
});

app.post("/poll", async (req, res) => {
  if (!req.body.vote) {
    return res.status(400).json({ message: "vote is required" });
  }

  if (req.body.vote !== "yes" && req.body.vote !== "no") {
    return res.status(400).json({ message: "Vote must be 'yes' or 'no'" });
  }

  const vote = req.body.vote === "yes";

  const sql = `INSERT INTO votes (vote) VALUES (?)`;

  db.run(sql, [vote], (err) => {
    if (err) {
      return console.error(err.message);
    }
    res.status(201).json({ message: "new vote added" });
  });
});

app.listen(port, () => {
  console.log(`server is running on ${port} 🎉`);
});
