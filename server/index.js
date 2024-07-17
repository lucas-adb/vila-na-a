const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 3000;
const dataFile = path.join(__dirname, 'data.json');

app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`server is running on ${port} 🎉`);
});