from langchain_core.messages import HumanMessage
from langchain_core.runnables import RunnableLambda

from smartmeal_agent.graph import build_graph
from smartmeal_agent.schemas import Ingredient, Recipe

FAKE_RECIPE = Recipe(
    title="Garlic Chicken and Rice",
    meal_type="dinner",
    servings=2,
    total_minutes=35,
    ingredients=[Ingredient(name="chicken thighs", quantity="400 g")],
    steps=["Season the chicken.", "Cook until done."],
)


class FakeModel:
    """Stands in for a chat model: with_structured_output returns a canned Recipe."""

    def __init__(self):
        self.prompts = []

    def with_structured_output(self, schema):
        assert schema is Recipe

        def respond(messages):
            self.prompts.append(messages)
            return FAKE_RECIPE

        return RunnableLambda(respond)


def test_graph_returns_structured_recipe():
    model = FakeModel()
    graph = build_graph(model=model)

    result = graph.invoke({"messages": [HumanMessage("I have chicken, rice and garlic")]})

    assert result["recipe"] == FAKE_RECIPE
    assert result["messages"][-1].content == "Here's a recipe: Garlic Chicken and Rice"
    sent = model.prompts[0]
    assert sent[0].type == "system"
    assert sent[-1].content == "I have chicken, rice and garlic"


def test_graph_module_imports_without_model_configured(monkeypatch):
    monkeypatch.delenv("SMARTMEAL_MODEL", raising=False)
    import importlib

    import smartmeal_agent.graph as graph_module

    importlib.reload(graph_module)
    assert graph_module.graph is not None
