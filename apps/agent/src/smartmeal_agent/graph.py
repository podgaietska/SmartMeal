"""SmartMeal agent graph.

A single node that turns the user's ingredients into a typed Recipe.
Intake/clarifying questions, tools, a validator loop and persistence are still to come.
"""

import os
from typing import Annotated

from langchain.chat_models import init_chat_model
from langchain_core.language_models import BaseChatModel
from langchain_core.messages import AIMessage, AnyMessage, SystemMessage
from langgraph.graph import END, START, StateGraph
from langgraph.graph.message import add_messages
from typing_extensions import TypedDict

from smartmeal_agent.schemas import Recipe

SYSTEM_PROMPT = (
    "You are SmartMeal, a home-cooking assistant. Create one recipe that uses the "
    "ingredients the user has. You may assume basic pantry staples (salt, pepper, oil, "
    "water). Give realistic quantities and clear, numbered-style steps."
)


class State(TypedDict, total=False):
    messages: Annotated[list[AnyMessage], add_messages]
    recipe: Recipe


def _default_model() -> BaseChatModel:
    model_name = os.environ.get("SMARTMEAL_MODEL")
    if not model_name:
        raise RuntimeError("Set SMARTMEAL_MODEL, e.g. 'openai:gpt-4.1-mini'. See .env.example.")
    return init_chat_model(model_name, temperature=0.4)


def build_graph(model: BaseChatModel | None = None):
    """Build the agent graph. Pass `model` to override the configured one (used in tests)."""

    def generate_recipe(state: State) -> State:
        llm = (model or _default_model()).with_structured_output(Recipe)
        recipe = llm.invoke([SystemMessage(SYSTEM_PROMPT), *state["messages"]])
        return {"recipe": recipe, "messages": [AIMessage(f"Here's a recipe: {recipe.title}")]}

    builder = StateGraph(State)
    builder.add_node("generate_recipe", generate_recipe)
    builder.add_edge(START, "generate_recipe")
    builder.add_edge("generate_recipe", END)
    return builder.compile()


graph = build_graph()
