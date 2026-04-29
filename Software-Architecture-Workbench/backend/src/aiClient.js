const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

async function callGeminiModel({ requirements, scale, constraints, systemName }) {
  console.log('\n=== GEMINI ARCHITECTURE DESIGN ===');
  console.log('[1/7] Checking API key...');
  
  if (!process.env.GEMINI_API_KEY) {
    console.log('[1/7] ❌ GEMINI_API_KEY not set. Skipping Gemini integration.');
    return null;
  }
  console.log('[1/7] ✅ API key found');

  const model = process.env.GEMINI_MODEL || 'gemini-1.5-mini';
  const geminiUrl = `${GEMINI_BASE_URL}/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  
  console.log('[2/7] URL constructed:', geminiUrl.substring(0, 80) + '...');
  console.log('[2/7] Model:', model);
  console.log('[2/7] System:', systemName, '| Scale:', scale, '| Constraints:', constraints.join(', ') || 'None');

  const prompt = `You are a world-class software architect with expertise in enterprise systems design. Your task is to analyze specific system requirements and recommend the most appropriate architecture pattern.

## Available Architecture Patterns

### Core Patterns:
1. **Monolithic Architecture** - Single, tightly-integrated codebase. Best for: startups, simple CRUD applications, teams with tight scheduling.
2. **Layered/N-Tier Architecture** - Horizontal layers (presentation, business logic, persistence). Best for: traditional web apps, clear separation of concerns, enterprise applications.
3. **Microservices Architecture** - Independently deployable services per domain. Best for: large teams, complex domains, need for independent scalability, polyglot stacks.
4. **Event-Driven Architecture** - Services communicate via events or message brokers. Best for: real-time systems, complex workflows, asynchronous processing, reactive systems.
5. **Service-Oriented Architecture (SOA)** - Reusable services with enterprise service bus. Best for: legacy system integration, enterprise environments, cross-domain services.
6. **CQRS (Command Query Responsibility Segregation)** - Separate read and write models. Best for: complex domains, audit requirements, independent scaling of read/write.
7. **Event Sourcing** - All state changes recorded as immutable events. Best for: audit trails, temporal queries, event replay, compliance.
8. **Serverless/FaaS** - Function-as-a-Service architecture. Best for: variable workloads, startup costs concern, rapid iteration, simple stateless logic.
9. **Data-Centric Architecture** - Focuses on data pipeline and analytics. Best for: data lakes, analytics platforms, machine learning systems, ETL workflows.
10. **Modular Monolith** - Single process with strong module boundaries and APIs. Best for: mid-size teams, modularity without operational complexity.

## Analysis Framework

For the given requirements:
- **Name**: ${systemName}
- **Scale**: ${scale} (Startup=early stage; Growth=scaling up; Enterprise=mission-critical, complex)
- **Constraints**: ${constraints.length > 0 ? constraints.join(', ') : 'None specified'}
- **Requirements**: ${requirements}

Consider these factors when recommending:
- **Scalability**: Can the pattern handle expected growth horizontally and vertically?
- **Availability & Resilience**: Does it provide fault isolation and redundancy?
- **Operational Complexity**: Team size and operational maturity required?
- **Time-to-Market**: Speed of development and deployment?
- **Technology Heterogeneity**: Need for multiple languages/frameworks?
- **Data Management**: Consistency vs. eventual consistency trade-offs?
- **Monitoring & Observability**: How complex is operational visibility?

##Response Structure

IMPORTANT: Return ONLY valid JSON wrapped in triple backticks. NO other text before or after.

\`\`\`json
{
  "architecture": "The selected architecture pattern name",
  "overview": {
    "pattern": "Same as architecture field",
    "summary": "2-3 sentences explaining why this specific pattern fits these requirements best",
    "properties": {
      "scalability": "High/Medium/Low - based on the pattern's ability to scale",
      "availability": "High/Medium/Low - based on fault tolerance and redundancy",
      "deployment": "One-line description of deployment model",
      "dataModel": "One-line description of data management approach"
    }
  },
  "components": [
    {
      "id": "unique-id",
      "title": "Component name",
      "type": "Presentation/Integration/Application/Persistence/Cross-cutting/Infrastructure/Data/Storage/Governance",
      "description": "Brief description of purpose and responsibility",
      "color": "#RRGGBB",
      "stack": "Recommended technologies and frameworks"
    }
  ],
  "decisions": [
    {
      "title": "Key architectural decision",
      "decision": "What was decided",
      "reason": "Why this decision aligns with the requirements and scale",
      "pros": ["Advantage 1", "Advantage 2", "Advantage 3"],
      "cons": ["Tradeoff 1", "Tradeoff 2"]
    }
  ],
  "risks": [
    {
      "id": "risk-id",
      "title": "Potential risk or challenge",
      "severity": "High/Medium/Low",
      "impact": "What could go wrong",
      "mitigation": "Specific strategy to address this risk"
    }
  ],
  "diagram": {
    "nodes": [
      {"id": "node-id", "label": "Component Name", "x": 50, "y": 40},
      {"id": "node-id-2", "label": "Another Component", "x": 250, "y": 40}
    ],
    "edges": [
      {"from": "node-id", "to": "node-id-2"}
    ]
  }
}
\`\`\`

## Response Guidelines

- Recommend 1 primary architecture pattern, with rationale tied to scale and constraints
- Components: Include 6-10 components, each mapped to the chosen pattern
- Decisions: Explain 3-4 major decisions with clear pros/cons for stakeholder discussion
- Risks: Identify 3-5 concrete risks specific to this pattern and requirements
- Diagram: Place nodes at x/y coordinates that avoid overlap (x: 50-650, y: 40-360, spacing ~200px)
- Be specific: Reference explicit requirements from the input, not generic advice`;

  console.log('[3/7] Prompt prepared (' + prompt.length + ' chars)');

  try {
    console.log('[4/7] Sending request to Gemini API...');
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8000,
        },
      }),
    });

    console.log(`[5/7] Received response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[5/7] ❌ API error: ${response.status}`);
      console.error('[5/7] Error body:', errorBody.substring(0, 200));
      return null;
    }

    console.log('[5/7] ✅ HTTP 200 OK');
    
    const body = await response.json();
    console.log('[6/7] Response parsed as JSON');
    
    if (!body?.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('[6/7] ❌ Invalid response structure');
      console.error('[6/7] Response keys:', Object.keys(body));
      if (body?.candidates) console.error('[6/7] Candidates:', body.candidates.length);
      return null;
    }

    const content = body.candidates[0].content.parts[0].text;
    console.log('[6/7] ✅ Content extracted (' + content.length + ' chars)');
    console.log('[6/7] First 150 chars:', content.substring(0, 150));
    
    // Extract JSON from markdown code blocks
    console.log('[7/7] Extracting JSON...');
    let jsonStr = null;
    
    // Log raw content for debugging
    console.log('[7/7] Raw content first 100 chars:', JSON.stringify(content.substring(0, 100)));
    console.log('[7/7] Raw content last 100 chars:', JSON.stringify(content.substring(content.length - 100)));
    
    // Try multiple extraction strategies
    // Strategy 1: Extract from ```json ... ``` blocks (non-greedy first, then greedy)
    let codeBlockMatch = content.match(/```\s*json\s*([\s\S]*?)\s*```/);
    if (!codeBlockMatch) {
      // Try with greedy match in case there are multiple closing backticks
      codeBlockMatch = content.match(/```\s*json\s*([\s\S]*)\s*```/);
    }
    if (codeBlockMatch) {
      console.log('[7/7] ✅ Strategy 1: Found markdown json code block');
      jsonStr = codeBlockMatch[1].trim();
      // Remove trailing backticks if they got included
      jsonStr = jsonStr.replace(/```+\s*$/, '').trim();
    }
    
    // Strategy 2: Extract from ``` ... ``` blocks (without json label)
    if (!jsonStr) {
      codeBlockMatch = content.match(/```\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch) {
        console.log('[7/7] ✅ Strategy 2: Found markdown code block (no json label)');
        jsonStr = codeBlockMatch[1].trim();
        jsonStr = jsonStr.replace(/```+\s*$/, '').trim();
      }
    }
    
    // Strategy 3: Find opening { and closing }, counting nesting
    if (!jsonStr) {
      console.log('[7/7] Strategy 3: Attempting bracket-counting extraction...');
      const startIdx = content.indexOf('{');
      if (startIdx !== -1) {
        let braceCount = 0;
        let endIdx = -1;
        
        for (let i = startIdx; i < content.length; i++) {
          if (content[i] === '{') braceCount++;
          if (content[i] === '}') braceCount--;
          if (braceCount === 0) {
            endIdx = i + 1;
            break;
          }
        }
        
        if (endIdx > startIdx) {
          jsonStr = content.substring(startIdx, endIdx);
          console.log('[7/7] ✅ Strategy 3: Found complete JSON by bracket counting');
        }
      }
    }
    
    // Strategy 4: Raw greedy JSON extraction (last resort)
    if (!jsonStr) {
      console.log('[7/7] Strategy 4: Trying raw greedy extraction...');
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        console.log('[7/7] ✅ Strategy 4: Found raw JSON');
        jsonStr = jsonMatch[0];
      }
    }
    
    if (!jsonStr) {
      console.error('[7/7] ❌ Could not extract JSON with any strategy');
      console.error('[7/7] Full response (truncated):', content.substring(0, 300) + '...');
      return null;
    }

    console.log('[7/7] JSON extracted (' + jsonStr.length + ' chars)');
    
    // Check if JSON appears incomplete (ends abruptly)
    if (!jsonStr.trim().endsWith('}') && !jsonStr.trim().endsWith(']')) {
      console.log('[7/7] ⚠️  JSON appears incomplete, attempting repair...');
      
      // Count open/close braces to estimate what's missing
      const openBraces = (jsonStr.match(/\{/g) || []).length;
      const closeBraces = (jsonStr.match(/\}/g) || []).length;
      const openBrackets = (jsonStr.match(/\[/g) || []).length;
      const closeBrackets = (jsonStr.match(/\]/g) || []).length;
      
      console.log(`[7/7] Brace balance: open=${openBraces} close=${closeBraces}, brackets open=${openBrackets} close=${closeBrackets}`);
      
      // Add missing closing braces/brackets
      const missingBraces = openBraces - closeBraces;
      const missingBrackets = openBrackets - closeBrackets;
      
      if (missingBraces > 0 || missingBrackets > 0) {
        const repair = ']'.repeat(missingBrackets) + '}'.repeat(missingBraces);
        jsonStr = jsonStr + repair;
        console.log('[7/7] Added missing characters: ' + repair);
      }
    }

    try {
      const designJson = JSON.parse(jsonStr);
      console.log('===================================');
      console.log('✅ SUCCESS: Architecture design generated');
      console.log('   Pattern:', designJson.architecture);
      console.log('   Components:', designJson.components?.length || 0);
      console.log('   Decisions:', designJson.decisions?.length || 0);
      console.log('   Risks:', designJson.risks?.length || 0);
      console.log('===================================\n');
      return designJson;
    } catch (parseError) {
      console.error('[7/7] ❌ JSON parse error:', parseError.message);
      
      // Log context around the error
      const posMatch = parseError.message.match(/position (\d+)/);
      if (posMatch) {
        const pos = parseInt(posMatch[1]);
        const start = Math.max(0, pos - 150);
        const end = Math.min(jsonStr.length, pos + 150);
        console.error(`[7/7] Context around pos ${pos}:`);
        console.error(jsonStr.substring(start, end));
        console.error(' '.repeat(Math.min(pos - start, 150)) + '^');
      }
      
      return null;
    }
  } catch (error) {
    console.error('❌ GEMINI API CALL FAILED:', error.message);
    console.error('Stack:', error.stack);
    return null;
  }
}

module.exports = { callGeminiModel };
