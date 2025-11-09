const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3002;

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Subtraction service is healthy' });
});

app.get('/subtract', (req, res) => {
  try {
    const a = parseFloat(req.query.a);
    const b = parseFloat(req.query.b);

    if (isNaN(a) || isNaN(b)) {
      return res.status(400).json({ error: 'Invalid input: a and b must be numbers' });
    }

    const result = a - b;
    res.json({
      operation: 'subtraction',
      operands: { a, b },
      result: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

app.get('/', (req, res) => {
  res.json({
    service: 'Subtraction Microservice',
    endpoint: '/subtract?a=10&b=3'
  });
});

app.listen(PORT, () => {
  console.log(`Subtraction service listening on port ${PORT}`);
});