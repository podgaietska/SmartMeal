# SmartMeal

A cooking agent that turns the ingredients you already have into a recipe.

> **Rebuild in progress.** SmartMeal is being rebuilt as a LangGraph agent with Supabase and a new
> React + TypeScript UI. Right now the agent generates a single structured recipe, and the web app
> is a placeholder.

## Tech stack

- **Agent:** Python 3.12, [LangGraph](https://langchain-ai.github.io/langgraph/), LangChain chat models (OpenAI by default), managed with [uv](https://docs.astral.sh/uv/)
- **Web:** Vite, React, TypeScript
- **CI:** GitHub Actions

## Repository layout

```
apps/
  agent/   LangGraph agent (Python)
  web/     Web app (Vite + React + TypeScript)
```

## Getting started

### Agent

```bash
cd apps/agent
cp .env.example .env    # set SMARTMEAL_MODEL and that provider's API key
uv sync --extra openai
uv run langgraph dev    # API on http://localhost:2024 and LangGraph Studio in the browser
```

See [apps/agent/README.md](apps/agent/README.md) for lint and test commands.

### Web

```bash
cd apps/web
npm install
npm run dev
```
