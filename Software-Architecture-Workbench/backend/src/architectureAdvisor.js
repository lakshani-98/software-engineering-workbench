const constraintDescriptions = {
  'High availability': 'Targets > 99.95% uptime and resilient service topology.',
  GDPR: 'Requires strong privacy, data protection, and auditability.',
  'Cost-optimized': 'Prioritizes lower operations cost and pay-as-you-go infrastructure.',
  'Low latency': 'Needs fast request and event response times.',
  'Regulatory compliance': 'Requires documented controls and policy enforcement.',
};

function normalizeConstraint(constraint) {
  const normalized = constraint.toLowerCase();
  if (normalized.includes('availability')) return 'High availability';
  if (normalized.includes('gdpr') || normalized.includes('privacy')) return 'GDPR';
  if (normalized.includes('cost')) return 'Cost-optimized';
  if (normalized.includes('latency')) return 'Low latency';
  if (normalized.includes('compliance')) return 'Regulatory compliance';
  return constraint;
}

function determineArchitecture({ requirements, scale, constraints }) {
  const lower = requirements.toLowerCase();
  const isRealtime = /real-time|real time|streaming|event-driven|low latency/.test(lower);
  const isDataHeavy = /analytics|machine learning|big data|reporting|etl|data lake/.test(lower);
  const isIntegration = /api|integration|external|third-party|payment|connect/.test(lower);
  const isSecurity = /secure|compliance|audit|gdpr|privacy/.test(lower) || constraints.includes('GDPR') || constraints.includes('Regulatory compliance');
  const isAvailability = constraints.includes('High availability');
  const isCostOptimized = constraints.includes('Cost-optimized');

  if (isRealtime && scale === 'Enterprise') {
    return 'Event-driven microservice architecture';
  }
  if (isDataHeavy && isIntegration) {
    return 'Modular data-centric architecture';
  }
  if (isSecurity && isAvailability) {
    return 'Secure layered architecture with API gateway';
  }
  if (isIntegration && scale !== 'Startup') {
    return 'Service-oriented microservices architecture';
  }
  if (isRealtime) {
    return 'Event-driven architecture with streaming services';
  }
  if (isCostOptimized && scale === 'Startup') {
    return 'Modular layered architecture';
  }
  return 'Modular layered architecture';
}

function propertyValues(architecture, scale, constraints) {
  const scalability = architecture.includes('microservice') || architecture.includes('event-driven') ? 'High' : scale === 'Enterprise' ? 'Medium to high' : 'Medium';
  const availability = constraints.includes('High availability') ? 'High' : 'Medium';
  const deployment = architecture.includes('microservice') ? 'Cloud-native with container orchestration' : 'Platform-based with managed services';
  const dataModel = architecture.includes('data-centric') ? 'Event and analytic-friendly data mesh' : 'Relational / document hybrid with clear bounded contexts';

  return { scalability, availability, deployment, dataModel };
}

function chooseComponents(architecture, scale, constraints) {
  const baseComponents = [
    { id: 'ui', title: 'User Interface', type: 'Presentation', description: 'Frontend experience for users and administrators.', color: '#5C6BC0', stack: 'React, TypeScript, Tailwind CSS' },
    { id: 'api', title: 'API Layer', type: 'Integration', description: 'Manages requests, authorization, and data access.', color: '#FF7043', stack: 'Node.js, Express, GraphQL/REST' },
    { id: 'service', title: 'Business Services', type: 'Application', description: 'Implements core domain logic and workflows.', color: '#66BB6A', stack: 'Node.js, Python, Spring Boot' },
    { id: 'data', title: 'Data Store', type: 'Persistence', description: 'Stores transactional and reference data securely.', color: '#29B6F6', stack: 'PostgreSQL, MongoDB, Redis' },
    { id: 'ops', title: 'Observability', type: 'Cross-cutting', description: 'Provides monitoring, logging, and incident detection.', color: '#AB47BC', stack: 'Prometheus, Grafana, ELK' },
  ];

  const extras = [];
  if (architecture.includes('microservice')) {
    extras.push({ id: 'gateway', title: 'API Gateway', type: 'Infrastructure', description: 'Routes traffic, enforces policies, and secures services.', color: '#8D6E63', stack: 'Kong, AWS API Gateway, Istio' });
    extras.push({ id: 'events', title: 'Event Bus', type: 'Integration', description: 'Supports asynchronous communication and eventual consistency.', color: '#FFCA28', stack: 'Kafka, RabbitMQ, AWS SNS/SQS' });
  }

  if (architecture.includes('data-centric')) {
    extras.push({ id: 'analytics', title: 'Analytics Engine', type: 'Data', description: 'Processes data for reporting and machine learning.', color: '#7E57C2', stack: 'Databricks, Snowflake, Apache Spark' });
    extras.push({ id: 'dataLake', title: 'Data Lake', type: 'Storage', description: 'Holds raw and curated data for insight generation.', color: '#388E3C', stack: 'AWS S3, Azure Data Lake, Google Cloud Storage' });
  }

  if (constraints.includes('GDPR') || constraints.includes('Regulatory compliance')) {
    extras.push({ id: 'security', title: 'Security & Compliance', type: 'Governance', description: 'Ensures data privacy, audit trails, and access controls.', color: '#D32F2F', stack: 'Auth0, Keycloak, Vault' });
  }

  if (extras.length) {
    return [...baseComponents, ...extras];
  }
  return baseComponents;
}

function buildDecisions(architecture, scale, constraints) {
  const decisions = [];
  decisions.push({
    title: 'Architecture model selection',
    decision: architecture,
    reason: `The system fits a ${architecture.toLowerCase()} because the requirements emphasize ${scale === 'Enterprise' ? 'enterprise readiness and operational scale' : 'rapid development and flexible deployment'}, and the chosen constraints require secure, maintainable boundaries.`,
    pros: [
      'Supports independent component evolution',
      'Improves fault isolation and scalability',
      'Aligns capabilities with business needs',
    ],
    cons: [
      'Adds integration and deployment complexity',
      'Requires stronger observability and orchestration',
      'Can increase initial implementation effort',
    ],
  });

  if (constraints.includes('High availability')) {
    decisions.push({
      title: 'Availability strategy',
      decision: 'Redundant deployment and failover design',
      reason: 'High availability constraints demand redundant services and automated recovery to reduce downtime risk.',
      pros: ['Improves uptime', 'Supports planned maintenance without user impact'],
      cons: ['Requires more infrastructure', 'Increases cost and operational overhead'],
    });
  }

  if (constraints.includes('GDPR') || constraints.includes('Regulatory compliance')) {
    decisions.push({
      title: 'Compliance and privacy',
      decision: 'Data governance with audit logging',
      reason: 'Privacy regulations require explicit safeguards, logging, and the ability to demonstrate control of personal data.',
      pros: ['Reduces regulatory risk', 'Builds trust with customers'],
      cons: ['Requires extra implementation and review', 'May slow release cadence'],
    });
  }

  if (architecture.includes('data-centric')) {
    decisions.push({
      title: 'Data strategy',
      decision: 'Separate analytics pipeline',
      reason: 'Data-heavy workloads perform best when analytical and transactional concerns are separated.',
      pros: ['Improves performance', 'Supports advanced analytics'],
      cons: ['Adds data synchronization needs', 'Requires additional tooling'],
    });
  }

  return decisions;
}

function buildRisks(architecture, scale, constraints) {
  const risks = [
    {
      id: 'integration-complexity',
      title: 'Integration complexity',
      severity: 'Medium',
      impact: 'High coordination effort across services or layers.',
      mitigation: 'Define clear APIs, use shared contracts, and implement automated integration tests.',
    },
    {
      id: 'operational-overhead',
      title: 'Operational overhead',
      severity: architecture.includes('microservice') ? 'High' : 'Medium',
      impact: 'Requires observability, deployment pipelines, and robust monitoring.',
      mitigation: 'Invest in DevOps tooling, central logging, and strong runbooks.',
    },
  ];

  if (constraints.includes('Cost-optimized')) {
    risks.push({
      id: 'cost-management',
      title: 'Cost management',
      severity: 'High',
      impact: 'Without careful design, cloud bills can grow quickly.',
      mitigation: 'Choose serverless or managed services, and monitor usage with budgets.',
    });
  }

  if (constraints.includes('GDPR') || constraints.includes('Regulatory compliance')) {
    risks.push({
      id: 'compliance-risk',
      title: 'Compliance risk',
      severity: 'High',
      impact: 'Non-compliance could lead to fines and reputational damage.',
      mitigation: 'Use consent management, data classification, and regular compliance audits.',
    });
  }

  if (architecture.includes('event-driven')) {
    risks.push({
      id: 'eventual-consistency',
      title: 'Eventual consistency',
      severity: 'Medium',
      impact: 'Data across services may lag before converging.',
      mitigation: 'Design for idempotency, reconciliation, and compensating actions.',
    });
  }

  return risks;
}

function buildDiagram(architecture, constraints) {
  const nodes = [
    { id: 'ui', label: 'User Interface', x: 50, y: 40 },
    { id: 'gateway', label: 'API Gateway', x: 250, y: 40 },
    { id: 'service', label: 'Application Services', x: 250, y: 200 },
    { id: 'data', label: 'Data Store', x: 450, y: 200 },
  ];

  const edges = [
    { from: 'ui', to: 'gateway' },
    { from: 'gateway', to: 'service' },
    { from: 'service', to: 'data' },
  ];

  if (architecture.includes('microservice')) {
    nodes.splice(2, 0, { id: 'events', label: 'Event Bus', x: 250, y: 360 });
    edges.push({ from: 'service', to: 'events' }, { from: 'events', to: 'service' });
  }

  if (architecture.includes('data-centric')) {
    nodes.push({ id: 'analytics', label: 'Analytics Engine', x: 450, y: 360 });
    edges.push({ from: 'data', to: 'analytics' });
  }

  if (constraints.includes('GDPR') || constraints.includes('Regulatory compliance')) {
    nodes.push({ id: 'security', label: 'Security & Compliance', x: 650, y: 40 });
    edges.push({ from: 'gateway', to: 'security' });
  }

  return { nodes, edges };
}

function generateArchitectureDesign({ requirements, scale, constraints, systemName }) {
  const normalizedConstraints = Array.from(new Set(constraints.map(normalizeConstraint)));
  const architecture = determineArchitecture({ requirements, scale, constraints: normalizedConstraints });
  const properties = propertyValues(architecture, scale, normalizedConstraints);
  const components = chooseComponents(architecture, scale, normalizedConstraints);
  const decisions = buildDecisions(architecture, scale, normalizedConstraints);
  const risks = buildRisks(architecture, scale, normalizedConstraints);
  const diagram = buildDiagram(architecture, normalizedConstraints);

  return {
    systemName,
    architecture,
    overview: {
      pattern: architecture,
      summary: `For ${systemName}, the recommended architecture is ${architecture}. This design balances ${properties.scalability.toLowerCase()} scalability, ${properties.availability.toLowerCase()} availability, and a ${properties.deployment.toLowerCase()} deployment model.`,
      properties,
      constraints: normalizedConstraints.map((constraint) => ({ name: constraint, description: constraintDescriptions[constraint] || 'Custom constraint.' })),
    },
    components,
    decisions,
    risks,
    diagram,
  };
}

module.exports = { generateArchitectureDesign };
