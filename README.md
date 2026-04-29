# Software Architecture Workbench

An AI-powered web tool that generates solution architecture recommendations from free-form system requirements. Describe your system, select a scale and non-functional constraints, and receive a structured architecture design including component breakdowns, architectural decision records, risk assessments, and a visual system diagram.

---

## 🎥 Demo

> <img width="1310" height="615" alt="image" src="https://github.com/user-attachments/assets/056cf048-3ef4-4af9-8934-143ac2beda7e" />
<img width="1331" height="622" alt="image" src="https://github.com/user-attachments/assets/7e02a5df-aa34-482a-811e-18c188504480" />
<img width="1332" height="626" alt="image" src="https://github.com/user-attachments/assets/1e2eacf3-3eb9-4585-b65c-39bb4f87c6b4" />




---

## ✨ Features

- 🤖 **AI-Generated Architecture** — Uses Google Gemini 2.5 Flash to analyse requirements and recommend an appropriate architecture pattern from a catalogue of ten recognised styles.
- 📑 **Five Structured Output Views** — Overview, Components, Decisions, Risks, and Diagram tabs provide a complete picture of the recommended design.
- ⚙️ **Non-Functional Constraint Support** — Toggle constraints such as High Availability, GDPR, Low Latency, Cost-Optimized, and Regulatory Compliance to influence the recommendation.
- 📊 **Interactive SVG Diagram** — A visual architecture diagram rendered from the AI output, with a fullscreen mode for closer inspection.
- 🔁 **Intelligent Fallback** — If the Gemini API is unavailable, a built-in deterministic rule-based engine generates a complete design automatically.
- 💡 **Example Scenarios** — Four pre-built scenarios let you explore the tool instantly without typing any requirements.
- 🏷️ **Source Transparency** — Every result is badged as either Gemini-powered or rule-based so you always know how the design was produced.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| 🖥️ Frontend | React 18, JavaScript (JSX) |
| 🎨 Styling | Custom CSS (dark theme) |
| 🔧 Backend | Node.js, Express.js |
| 🤖 AI Model | Google Gemini 2.5 Flash |
| 📐 Diagrams | Inline SVG (React-rendered) |

---

## 📁 Project Structure

```
architecture-workbench/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main application component
│   │   ├── main.jsx         # React entry point
│   │   └── styles.css       # Global styles
│   └── package.json
│
├── backend/
│   ├── index.js             # Express server & API routes
│   ├── aiClient.js          # Google Gemini 2.5 Flash integration
│   ├── architectureAdvisor.js  # Rule-based fallback engine
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- A Google Gemini API key (optional — the rule-based engine works without one)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/architecture-workbench.git
cd architecture-workbench
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```dotenv
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

> If `GEMINI_API_KEY` is not set, the tool will automatically use the rule-based advisor instead.

### 3. Install & Run the Backend

```bash
cd backend
npm install
npm start
```

The backend will start at `http://localhost:4000`.

### 4. Install & Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:5173`.

---

## 🧠 How It Works

1. Enter your system requirements in plain English and select a scale (Startup / Growth / Enterprise).
2. Optionally toggle non-functional constraints such as GDPR, High Availability, or Low Latency.
3. Click **Design Architecture** — the request is sent to the backend.
4. The backend calls **Google Gemini 2.5 Flash** with a structured prompt containing a pattern catalogue, your requirements, and a strict JSON schema.
5. The response is parsed, validated, and repaired if necessary, then returned to the frontend.
6. If Gemini is unavailable, the **rule-based fallback engine** generates a complete design deterministically.
7. The result is displayed across five tabs — Overview, Components, Decisions, Risks, and Diagram.

---

## 🏗️ Supported Architecture Patterns

| Pattern | Best For |
|---|---|
| Monolithic | Simple apps, small teams, fast delivery |
| Layered / N-Tier | Traditional web apps, enterprise systems |
| Microservices | Large teams, complex domains, independent scaling |
| Event-Driven | Real-time systems, async workflows |
| Service-Oriented (SOA) | Legacy integration, cross-domain services |
| CQRS | Complex domains, audit requirements |
| Event Sourcing | Audit trails, compliance, temporal queries |
| Serverless / FaaS | Variable workloads, startup cost sensitivity |
| Data-Centric | Analytics platforms, ML pipelines |
| Modular Monolith | Mid-size teams, modularity without overhead |

---

## ⚠️ Non-Functional Constraints

| Constraint | Effect on Design |
|---|---|
| 🟢 High Availability | Adds redundancy, failover, and uptime-focused components |
| 🔒 GDPR | Adds Security & Compliance component and privacy decisions |
| 💰 Cost-Optimized | Prefers serverless and managed services, flags cost risks |
| ⚡ Low Latency | Favours event-driven patterns and caching layers |
| 📋 Regulatory Compliance | Adds audit logging, access controls, and governance decisions |
