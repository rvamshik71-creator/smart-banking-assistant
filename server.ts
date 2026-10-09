import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());

// Initialize GoogleGenAI SDK with server-side API key
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System prompt defining the persona and function-execution guidance
const SYSTEM_INSTRUCTION = `You are ConSentinel's autonomous Smart Banking Assistant.
You specialize in conversational treasury management, liquidity optimization, fraud detection, and multi-account banking.

Your user is Alex Rivera, founder and treasury manager with:
- Operating Checking: $24,850.00
- High-Yield Vault (5.20% APY): $185,200.00
- Treasury Reserve: $450,000.00

When responding:
1. Provide concise, clear, and highly competent financial intelligence (2-4 sentences or structured bullets).
2. If the user asks to transfer, sweep, freeze, or adjust limits, confirm the action clearly and specify the exact parameters.
3. Be professional, reassuring, and data-driven with exact dollar amounts and percentages.
4. If an anomaly is mentioned, detail the safety measures taken.`;

// API endpoint for Smart Banking Assistant
app.post('/api/assistant', async (req, res) => {
  try {
    const { prompt, context } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `User request: ${prompt}\n\nCurrent banking context: ${JSON.stringify(context || {})}`,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });

        const reply = response.text || "I've analyzed your treasury request and confirmed your balances remain protected.";
        res.json({ reply, source: 'gemini' });
        return;
      } catch (err: any) {
        console.warn('Gemini API request failed, falling back to heuristic engine:', err?.message || err);
      }
    }

    // Heuristic fallback engine if API key is unconfigured or rate limited
    const lower = prompt.toLowerCase();
    let fallbackReply = "I have scanned your financial accounts. All balances are verified safe and synchronized with our 5.20% APY depository network.";

    if (lower.includes('audit') || lower.includes('fraud') || lower.includes('suspicious')) {
      fallbackReply = "Ledger scan complete. I flagged 1 suspect charge attempt ($2,850.00 Berlin merchant draft) outside your primary geographic profile and applied an autonomous freeze. All other transactions are verified safe.";
    } else if (lower.includes('forecast') || lower.includes('future') || lower.includes('bills')) {
      fallbackReply = "Based on upcoming recurring drafts and expected receivables, your estimated cash balance will bottom out at $19,420.00 on Nov 14th before your next invoice settlement. Your minimum liquidity buffer remains at +31%.";
    } else if (lower.includes('sweep') || lower.includes('transfer') || lower.includes('vault')) {
      fallbackReply = "Autonomous sweep executed. $500.00 transferred from Operating Checking to your High-Yield Vault earning 5.20% APY. Your updated vault balance is $185,700.00.";
    } else if (lower.includes('spend') || lower.includes('breakdown') || lower.includes('expense')) {
      fallbackReply = "Your current monthly breakdown: Operational & Cloud Services at 55% ($13,660.00), High-Yield Reserves at 30% ($7,450.00), and Discretionary at 15% ($3,720.00). Overall burn is down 8.4% from last month.";
    } else if (lower.includes('freeze') || lower.includes('card') || lower.includes('lock')) {
      fallbackReply = "Emergency killswitch toggled. Card ending in ••8201 has been frozen across all payment networks. No further merchant transactions will be authorized until you unlock it.";
    }

    res.json({ reply: fallbackReply, source: 'fallback' });
  } catch (error: any) {
    console.error('Assistant endpoint error:', error);
    res.status(500).json({ error: 'Internal assistant error', details: error?.message });
  }
});

// Setup Vite in middleware mode for dev or serve dist in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const PORT = Number(process.env.PORT) || 3000;

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ConSentinel Banking server running on port ${PORT}`);
  });
}

startServer();
