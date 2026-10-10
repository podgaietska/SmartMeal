# SmartMeal agent

A LangGraph agent that turns the ingredients you have into a recipe.

## Run locally

```bash
cd apps/agent
cp .env.example .env    # set SMARTMEAL_MODEL and that provider's API key
uv sync
uv run langgraph dev    # API on http://localhost:2024 and LangGraph Studio in the browser
```

## Checks

```bash
uv run ruff check . && uv run ruff format --check .
uv run pytest
```

Tests use a fake model, so they need no API key.
