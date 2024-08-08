import express from 'express';

const app = express();
const port = 3000;

app.get('/health', (req, res) => {
  res.send({
    message: 'Health check - OK!',
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
