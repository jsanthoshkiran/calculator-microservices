const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Environment variables with fallbacks for local testing
const ADD_SERVICE_URL = process.env.ADD_SERVICE_URL || 'http://localhost:3001';
const SUB_SERVICE_URL = process.env.SUB_SERVICE_URL || 'http://localhost:3002';
const MUL_SERVICE_URL = process.env.MUL_SERVICE_URL || 'http://localhost:3003';
const DIV_SERVICE_URL = process.env.DIV_SERVICE_URL || 'http://localhost:3004';

const PORT = process.env.PORT || 3000;

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Gateway is healthy' });
});

// Info endpoint
app.get('/info', (req, res) => {
  res.json({
    service: 'Calculator API Gateway',
    version: '1.0.0',
    endpoints: {
      add: '/add?a=5&b=3',
      subtract: '/subtract?a=10&b=4',
      multiply: '/multiply?a=6&b=7',
      divide: '/divide?a=20&b=4'
    },
    microservices: {
      add: ADD_SERVICE_URL,
      subtract: SUB_SERVICE_URL,
      multiply: MUL_SERVICE_URL,
      divide: DIV_SERVICE_URL
    }
  });
});

// Addition endpoint
app.get('/add', async (req, res) => {
  try {
    const { a, b } = req.query;
    if (!a || !b) {
      return res.status(400).json({ error: 'Parameters a and b are required' });
    }
    const response = await axios.get(`${ADD_SERVICE_URL}/add`, { params: { a, b } });
    res.json(response.data);
  } catch (error) {
    console.error('Add service error:', error.message);
    res.status(500).json({ error: 'Addition service unavailable', details: error.message });
  }
});

// Subtraction endpoint
app.get('/subtract', async (req, res) => {
  try {
    const { a, b } = req.query;
    if (!a || !b) {
      return res.status(400).json({ error: 'Parameters a and b are required' });
    }
    const response = await axios.get(`${SUB_SERVICE_URL}/subtract`, { params: { a, b } });
    res.json(response.data);
  } catch (error) {
    console.error('Subtract service error:', error.message);
    res.status(500).json({ error: 'Subtraction service unavailable', details: error.message });
  }
});

// Multiplication endpoint
app.get('/multiply', async (req, res) => {
  try {
    const { a, b } = req.query;
    if (!a || !b) {
      return res.status(400).json({ error: 'Parameters a and b are required' });
    }
    const response = await axios.get(`${MUL_SERVICE_URL}/multiply`, { params: { a, b } });
    res.json(response.data);
  } catch (error) {
    console.error('Multiply service error:', error.message);
    res.status(500).json({ error: 'Multiplication service unavailable', details: error.message });
  }
});

// Division endpoint
app.get('/divide', async (req, res) => {
  try {
    const { a, b } = req.query;
    if (!a || !b) {
      return res.status(400).json({ error: 'Parameters a and b are required' });
    }
    const response = await axios.get(`${DIV_SERVICE_URL}/divide`, { params: { a, b } });
    res.json(response.data);
  } catch (error) {
    console.error('Divide service error:', error.message);
    res.status(500).json({ error: 'Division service unavailable', details: error.message });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Calculator Microservices',
    description: 'A DevOps workshop project demonstrating microservices architecture',
    try: 'Visit /info for available endpoints',
    example: '/add?a=10&b=5'
  });
});

app.listen(PORT, () => {
  console.log(`Gateway is listening on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});