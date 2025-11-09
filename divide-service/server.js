const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3004;

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Division service is healthy' });
});

app.get('/divide', (req, res) => {
  try {
    const a = parseFloat(req.query.a);
    const b = parseFloat(req.query.b);

    if (isNaN(a) || isNaN(b)) {
      return res.status(400).json({ error: 'Invalid input: a and b must be numbers' });
    }

    if (b === 0) {
      return res.status(400).json({
        error: 'Division by zero is not allowed',
        operands: { a, b }
      });
    }

    const result = a / b;
    res.json({
      operation: 'division',
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
    service: 'Division Microservice',
    endpoint: '/divide?a=20&b=4',
    note: 'Division by zero returns error'
  });
});

app.listen(PORT, () => {
  console.log(`Division service listening on port ${PORT}`);
});
