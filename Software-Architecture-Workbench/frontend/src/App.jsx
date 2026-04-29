import { useMemo, useState, useEffect, useCallback } from 'react';

const exampleScenarios = [
  {
    title: 'Enterprise billing platform',
    text: 'A global billing platform for subscription management, invoices, payments, partner integrations, and compliance reporting.',
  },
  {
    title: 'Real-time collaboration tool',
    text: 'A web and mobile collaboration suite with live chat, shared documents, presence, and notifications.',
  },
  {
    title: 'Analytics pipeline',
    text: 'Ingest customer events, run analytics, produce dashboards, and support machine learning predictions.',
  },
  {
    title: 'Regulated healthcare records',
    text: 'A patient records system with secure access, audit logs, compliance controls, and cross-system APIs.',
  },
];

const nonFunctionalOptions = ['High availability', 'GDPR', 'Cost-optimized', 'Low latency', 'Regulatory compliance'];
const scaleOptions = ['Startup', 'Growth', 'Enterprise'];
const tabs = ['Overview', 'Components', 'Decisions', 'Risks', 'Diagram'];

function severityClass(level) {
  if (level === 'High') return 'severity-high';
  if (level === 'Medium') return 'severity-medium';
  return 'severity-low';
}

function FullscreenDiagramModal({ diagram, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    // Prevent body scroll while modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fs-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Fullscreen diagram">
      <div className="fs-modal" onClick={(e) => e.stopPropagation()}>
        <div className="fs-header">
          <span className="fs-title">System Diagram</span>
          <button className="fs-close-btn" onClick={onClose} aria-label="Close fullscreen">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Close</span>
          </button>
        </div>
        <div className="fs-body">
          <svg viewBox="0 0 1000 600" className="diagram-svg fs-diagram-svg">
            {diagram.edges.map((edge, index) => {
              const from = diagram.nodes.find((node) => node.id === edge.from);
              const to = diagram.nodes.find((node) => node.id === edge.to);
              if (!from || !to) return null;
              const x1 = from.x + 70;
              const y1 = from.y + 30;
              const x2 = to.x;
              const y2 = to.y + 30;
              return (
                <g key={index}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} className="diagram-line" />
                  <polygon
                    points={`${x2 - 8},${y2 - 4} ${x2},${y2} ${x2 - 8},${y2 + 4}`}
                    fill="#345"
                  />
                </g>
              );
            })}
            {diagram.nodes.map((node) => (
              <g key={node.id}>
                <rect x={node.x} y={node.y} width="140" height="60" rx="10" className="diagram-node" />
                <text x={node.x + 70} y={node.y + 30} textAnchor="middle" alignmentBaseline="middle" className="diagram-text">
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <div className="fs-hint">Press <kbd>Esc</kbd> or click outside to close</div>
      </div>
    </div>
  );
}

function DiagramView({ diagram }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const openFullscreen = useCallback(() => setIsFullscreen(true), []);
  const closeFullscreen = useCallback(() => setIsFullscreen(false), []);

  if (!diagram || !diagram.nodes) return <p>No diagram data available.</p>;

  return (
    <div className="diagram-wrapper">
      <div className="diagram-toolbar">
        <span className="diagram-toolbar-label">System Architecture Diagram</span>
        <button
          type="button"
          className="fullscreen-btn"
          onClick={openFullscreen}
          aria-label="View diagram fullscreen"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M1 1h4.5M1 1v4.5M1 1l4 4M15 1h-4.5M15 1v4.5M15 1l-4 4M1 15h4.5M1 15v-4.5M1 15l4-4M15 15h-4.5M15 15v-4.5M15 15l-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Fullscreen
        </button>
      </div>

      <svg viewBox="0 0 1000 600" className="diagram-svg">
        {diagram.edges.map((edge, index) => {
          const from = diagram.nodes.find((node) => node.id === edge.from);
          const to = diagram.nodes.find((node) => node.id === edge.to);
          if (!from || !to) return null;
          const x1 = from.x + 70;
          const y1 = from.y + 30;
          const x2 = to.x;
          const y2 = to.y + 30;
          return (
            <g key={index}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} className="diagram-line" />
              <polygon
                points={`${x2 - 8},${y2 - 4} ${x2},${y2} ${x2 - 8},${y2 + 4}`}
                fill="#345"
              />
            </g>
          );
        })}
        {diagram.nodes.map((node) => (
          <g key={node.id}>
            <rect x={node.x} y={node.y} width="140" height="60" rx="10" className="diagram-node" />
            <text x={node.x + 70} y={node.y + 30} textAnchor="middle" alignmentBaseline="middle" className="diagram-text">
              {node.label}
            </text>
          </g>
        ))}
      </svg>

      {isFullscreen && (
        <FullscreenDiagramModal diagram={diagram} onClose={closeFullscreen} />
      )}
    </div>
  );
}

function App() {
  const [systemName, setSystemName] = useState('');
  const [requirements, setRequirements] = useState('');
  const [scale, setScale] = useState('Growth');
  const [constraints, setConstraints] = useState([]);
  const [activeTab, setActiveTab] = useState('Overview');
  const [design, setDesign] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleToggleConstraint = (constraint) => {
    setConstraints((current) =>
      current.includes(constraint) ? current.filter((item) => item !== constraint) : [...current, constraint]
    );
  };

  const handleExample = (scenario) => {
    setSystemName('');
    setRequirements(scenario.text);
    setScale('Growth');
    setConstraints([]);
    setActiveTab('Overview');
    setDesign(null);
    setError(null);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setDesign(null);

    try {
      const response = await fetch('http://localhost:4000/api/design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemName: systemName.trim() || 'Unnamed System',
          requirements,
          scale,
          constraints,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Unable to build architecture.');
      }
      setDesign(payload);
      setActiveTab('Overview');
    } catch (err) {
      setError(err.message || 'Request failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const properties = design?.overview?.properties || {};
  const summarizedDiagram = useMemo(() => design?.diagram || null, [design]);

  return (
    <div className="page-shell">
      <header className="hero-bar">
        <div>
          <h1>Software Architecture Workbench</h1>
          <p>Design solution architecture from free-form requirements and non-functional constraints.</p>
        </div>
      </header>

      <main className="workspace-grid">
        <section className="left-panel">
          <div className="panel-card">
            <h2>Project Details</h2>

            <div className="input-group">
              <label>System/Project Name</label>
              <input
                type="text"
                value={systemName}
                onChange={(event) => setSystemName(event.target.value)}
                placeholder="e.g., E-Commerce Platform, Chat App, Analytics Dashboard..."
              />
            </div>

            <div className="input-group">
              <label>Requirements</label>
              <textarea
                value={requirements}
                onChange={(event) => setRequirements(event.target.value)}
                placeholder="Describe the system, users, business goals, and constraints..."
                rows="8"
              />
            </div>

            <div className="section-heading">Non-functional constraints</div>
            <div className="chips-row">
              {nonFunctionalOptions.map((constraint) => (
                <button
                  key={constraint}
                  type="button"
                  className={constraints.includes(constraint) ? 'chip chip-selected' : 'chip'}
                  onClick={() => handleToggleConstraint(constraint)}
                >
                  {constraint}
                </button>
              ))}
            </div>

            <div className="section-heading">Platform scale</div>
            <div className="scale-row">
              {scaleOptions.map((option) => (
                <label key={option} className="scale-pill">
                  <input
                    type="radio"
                    name="scale"
                    value={option}
                    checked={scale === option}
                    onChange={() => setScale(option)}
                  />
                  {option}
                </label>
              ))}
            </div>

            <div className="section-heading">Try an example</div>
            <div className="examples-grid">
              {exampleScenarios.map((scenario) => (
                <button key={scenario.title} type="button" className="example-card" onClick={() => handleExample(scenario)}>
                  <strong>{scenario.title}</strong>
                  <span>{scenario.text}</span>
                </button>
              ))}
            </div>

            <button type="button" className="primary-button" disabled={isLoading || !requirements.trim()} onClick={handleSubmit}>
              {isLoading ? 'Designing architecture…' : 'Design Architecture'}
            </button>
            {error && <div className="error-banner">{error}</div>}
          </div>
        </section>

        <section className="right-panel">
          <div className="tabs-bar">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={activeTab === tab ? 'tab-button active' : 'tab-button'}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="panel-card output-card">
            {!design && <div className="empty-state">Type or click an example and then hit Design Architecture.</div>}

            {design && activeTab === 'Overview' && (
              <div>
                <div className="source-badge" title={design.source === 'gemini' ? 'Powered by Gemini AI' : 'Local rule-based engine'}>
                  {design.source === 'gemini' ? '🤖 Gemini-powered' : '⚙️ Rule-based'}
                </div>
                <h2>{design.architecture}</h2>
                <p>{design.overview.summary}</p>

                <div className="property-grid">
                  <div className="property-card">
                    <span>Scalability</span>
                    <strong>{properties.scalability}</strong>
                  </div>
                  <div className="property-card">
                    <span>Availability</span>
                    <strong>{properties.availability}</strong>
                  </div>
                  <div className="property-card">
                    <span>Deployment</span>
                    <strong>{properties.deployment}</strong>
                  </div>
                  <div className="property-card">
                    <span>Data model</span>
                    <strong>{properties.dataModel}</strong>
                  </div>
                </div>

                {design.overview.constraints && design.overview.constraints.length > 0 && (
                  <div className="constraint-list">
                    {design.overview.constraints.map((constraint) => (
                      <div key={constraint.name} className="constraint-item">
                        <strong>{constraint.name}</strong>
                        <p>{constraint.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {design && activeTab === 'Components' && (
              <div className="cards-grid">
                {design.components.map((component) => (
                  <div key={component.id} className="component-card" style={{ borderColor: component.color }}>
                    <div className="component-pill" style={{ background: component.color }}>
                      {component.type}
                    </div>
                    <h3>{component.title}</h3>
                    <p>{component.description}</p>
                    <div className="tech-stack">Recommended stack: {component.stack}</div>
                  </div>
                ))}
              </div>
            )}

            {design && activeTab === 'Decisions' && (
              <div className="decision-list">
                {design.decisions.map((decision, index) => (
                  <div key={index} className="decision-card">
                    <h3>{decision.title}</h3>
                    <p className="decision-reason">{decision.reason}</p>
                    <div className="decision-split">
                      <div>
                        <strong>Pros</strong>
                        <ul>{decision.pros.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
                      </div>
                      <div>
                        <strong>Cons</strong>
                        <ul>{decision.cons.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {design && activeTab === 'Risks' && (
              <div className="risk-list">
                {design.risks.map((risk) => (
                  <div key={risk.id} className="risk-card">
                    <div className="risk-meta">
                      <strong>{risk.title}</strong>
                      <span className={severityClass(risk.severity)}>{risk.severity}</span>
                    </div>
                    <p>{risk.impact}</p>
                    <p className="risk-mitigation">Mitigation: {risk.mitigation}</p>
                  </div>
                ))}
              </div>
            )}

            {design && activeTab === 'Diagram' && <DiagramView diagram={summarizedDiagram} />}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;