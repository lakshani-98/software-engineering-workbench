# Software Architecture Workbench

This project is a software engineering workbench for exploring solution architecture design from high-level user requirements.

## Structure

- `backend/` - Express API that analyzes requirements, chooses an architecture pattern, and generates solution details.
- `frontend/` - Vite + React app for entering requirements and visualizing the suggested architecture with tabs.

## Run locally

1. Open a terminal in `Assignment/backend` and run:
   ```powershell
   npm install
   npm start
   ```

   - To enable Gemini AI summarization, add `GEMINI_API_KEY` to the environment before starting.
   - Optionally set `GEMINI_MODEL` to a Gemini model name such as `gemini-1.5-mini`.

2. Open another terminal in `Assignment/frontend` and run:
   ```powershell
   npm install
   npm run dev -- --host
   ```

3. Open the browser at the local frontend URL shown by Vite.

## Features

- Free-form requirement entry with example scenarios
- Non-functional constraint chips and scale selection
- Architecture design output across Overview, Components, Decisions, Risks, and Diagram tabs
- Local architecture reasoning plus optional Gemini integration

## Notes

- The backend includes a rule-based advisor and will call Gemini only when `GEMINI_API_KEY` is provided.
- The frontend uses a responsive React interface and renders a simple visual diagram for component relationships.
