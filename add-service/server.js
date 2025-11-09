const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Addition service is healthy' });
});

// Addition operation
app.get('/add', (req, res) => {
  try {
    const a = parseFloat(req.query.a);
    const b = parseFloat(req.query.b);

    if (isNaN(a) || isNaN(b)) {
      return res.status(400).json({ error: 'Invalid input: a and b must be numbers' });
    }

    const result = a + b;
    res.json({
      operation: 'addition',
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
    service: 'Addition Microservice',
    version: '1.0.0',
    endpoint: '/add?a=5&b=3'
  });
});

app.listen(PORT, () => {
  console.log(`Addition service listening on port ${PORT}`);
});
