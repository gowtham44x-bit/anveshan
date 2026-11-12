import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://supermanxo777.app.n8n.cloud/webhook/india-lake-monitor-ai';

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    system: 'All India Lake Monitoring System (AILMS)',
    engine: 'n8n-groq-diagnostic-engine',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Proxy route for n8n AI Lake Diagnosis (Groq LLM + Tavily news)
app.post('/api/diagnose', async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    console.log(`[AILMS Express] Forwarding diagnosis request for: ${payload.lake || 'Unknown Lake'}`);

    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!n8nResponse.ok) {
      const errText = await n8nResponse.text();
      console.error(`[AILMS Express] n8n returned error ${n8nResponse.status}: ${errText}`);
      return res.status(n8nResponse.status).json({
        error: 'n8n workflow error',
        status: n8nResponse.status,
        details: errText
      });
    }

    const data = await n8nResponse.json();
    console.log(`[AILMS Express] Received AI diagnosis for ${data.lake || payload.lake}: Score ${data.score}`);
    return res.json(data);
  } catch (error: any) {
    console.error('[AILMS Express] Error proxying to n8n webhook:', error);
    return res.status(500).json({
      error: 'Failed to contact n8n webhook engine',
      message: error?.message || String(error)
    });
  }
});

// In production, serve Vite built assets
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🌊 AILMS Express Backend Running on http://localhost:${PORT}`);
  console.log(`🔗 n8n Target: ${N8N_WEBHOOK_URL}`);
  console.log(`=======================================================`);
});
