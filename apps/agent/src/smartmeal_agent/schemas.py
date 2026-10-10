from typing import Literal

from pydantic import BaseModel, Field

MealType = Literal["breakfast", "lunch", "dinner", "snack"]


class Ingredient(BaseModel):
    name: str = Field(description="Ingredient name, e.g. 'chicken thighs'")
    quantity: str = Field(description="Amount with unit, e.g. '400 g' or '2 tbsp'")


class Recipe(BaseModel):
    """A recipe the agent returns to the user."""

    title: str
    meal_type: MealType
    servings: int = Field(ge=1)
    total_minutes: int = Field(ge=1, description="Prep plus cook time")
    ingredients: list[Ingredient] = Field(min_length=1)
    steps: list[str] = Field(min_length=1, description="One instruction per step, in order")
