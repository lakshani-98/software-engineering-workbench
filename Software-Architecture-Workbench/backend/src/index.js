const express = require('express');
const cors = require('cors');
const { callGeminiModel } = require('./aiClient');
const { generateArchitectureDesign } = require('./architectureAdvisor');

const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'architecture-workbench-backend' });
});

app.post('/api/design', async (req, res) => {
  try {
    console.log('\n>>> [BACKEND] /api/design endpoint called');
    const { requirements, scale, constraints, systemName } = req.body;
    
    console.log('[BACKEND] Input validation...');
    if (!requirements || typeof requirements !== 'string' || !requirements.trim()) {
      console.log('[BACKEND] ❌ Invalid requirements');
      return res.status(400).json({ error: 'Please provide a non-empty requirements string.' });
    }
    console.log('[BACKEND] ✅ Requirements valid (' + requirements.length + ' chars)');
    console.log('[BACKEND] Scale:', scale || 'Growth', '| System:', systemName || 'Unnamed System');

    let design = null;
    let source = 'unknown';

    // Try Gemini first (primary source)
    if (process.env.GEMINI_API_KEY) {
      console.log('[BACKEND] Attempting Gemini AI integration...');
      design = await callGeminiModel({
        requirements: requirements.trim(),
        scale: scale || 'Growth',
        constraints: Array.isArray(constraints) ? constraints : [],
        systemName: (systemName || 'Unnamed System').trim(),
      });
      if (design) {
        source = 'gemini';
        console.log('[BACKEND] ✅ Gemini returned architecture design');
      } else {
        console.log('[BACKEND] ⚠️  Gemini failed or returned null');
      }
    } else {
      console.log('[BACKEND] ⚠️  GEMINI_API_KEY not configured, skipping Gemini');
    }

    // Fallback to rule-based advisor if Gemini unavailable or failed
    if (!design) {
      console.log('[BACKEND] Falling back to rule-based architecture advisor...');
      design = generateArchitectureDesign({
        requirements: requirements.trim(),
        scale: scale || 'Growth',
        constraints: Array.isArray(constraints) ? constraints : [],
        systemName: (systemName || 'Unnamed System').trim(),
      });
      source = 'rule-engine';
      console.log('[BACKEND] ✅ Rule-based design generated');
    }

    design.source = source;
    console.log('[BACKEND] Responding with design (source: ' + source + ')');
    console.log('<<<');
    res.json(design);
  } catch (error) {
    console.error('[BACKEND] ❌ Design generation failed:', error.message);
    console.log('<<<');
    res.status(500).json({ error: 'Failed to generate architecture design.' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Architecture Workbench backend running on http://localhost:${port}`);
  if (process.env.GEMINI_API_KEY) {
    console.log('Gemini integration enabled.');
    console.log('Gemini integration enabled.');
  } else {
    console.log('Gemini not configured. Using rule-based advisor (set GEMINI_API_KEY to enable).');
  }
});
