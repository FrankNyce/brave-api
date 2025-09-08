import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const BRAVE_API_KEY = process.env.BRAVE_API_KEY;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// Brave Search API base URL
const BRAVE_API_BASE = 'https://api.search.brave.com/res/v1';

// Headers for Brave API
const getBraveHeaders = () => ({
  'Accept': 'application/json',
  'Accept-Encoding': 'gzip',
  'X-Subscription-Token': BRAVE_API_KEY
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    braveApiConfigured: !!BRAVE_API_KEY
  });
});

// News search endpoint
app.get('/api/search/news', async (req, res) => {
  try {
    if (!BRAVE_API_KEY) {
      return res.status(500).json({ 
        error: 'Brave API key not configured',
        message: 'Please set BRAVE_API_KEY in your .env file'
      });
    }

    const { q, count = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    console.log(`News search: ${q}`);

    const url = `${BRAVE_API_BASE}/news/search?q=${encodeURIComponent(q)}&count=${count}`;
    const response = await fetch(url, {
      headers: getBraveHeaders()
    });

    if (!response.ok) {
      throw new Error(`Brave API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('News search error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch news',
      message: error.message 
    });
  }
});

// Web search endpoint
app.get('/api/search/web', async (req, res) => {
  try {
    if (!BRAVE_API_KEY) {
      return res.status(500).json({ 
        error: 'Brave API key not configured',
        message: 'Please set BRAVE_API_KEY in your .env file'
      });
    }

    const { q, count = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    console.log(`Web search: ${q}`);

    const url = `${BRAVE_API_BASE}/web/search?q=${encodeURIComponent(q)}&count=${count}`;
    const response = await fetch(url, {
      headers: getBraveHeaders()
    });

    if (!response.ok) {
      throw new Error(`Brave API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('Web search error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch web results',
      message: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Brave API configured: ${!!BRAVE_API_KEY}`);
  if (!BRAVE_API_KEY) {
    console.warn('⚠️  BRAVE_API_KEY not set. Please configure your API key in server/.env');
  }
});