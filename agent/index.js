const { exec } = require('child_process');
const express = require('express');

const app = express();

app.get('/redirect', (req, res) => {
  console.log(`Redirect -- ${req.query.url}`);

  exec(`start "link" "${req.query.url}"`);

  res.send(`OK -- ${req.query.url}`);
});

app.get('/shutdown', (_req, res) => {
  console.log('Shtting down');
  res.send('Shtting down');
  process.exit(0);
});

const port = parseInt(process.argv[2]);

app.listen(port, () => {
  console.log(`Agent listening at http://localhost:${port}`);
})
