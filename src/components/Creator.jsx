import { BsSearch } from "react-icons/bs";
import { useState } from "react";
import { toast } from "react-toastify";

function Creator({toggleCreator, setIngredient, setIngredients, ingredient, ingredients, addMeal, loading}) {
    const [mealType, setMealType] = useState("Dinner");

    const handleEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setIngredients([...ingredients, ingredient]);
            setIngredient("");
            console.log(ingredients)
        }
    };

    const removeIngredient = (e) => {
        const newIngredients = ingredients.filter((ingredient) => ingredient !== e.target.previousSibling.innerText);
        setIngredients(newIngredients);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const newMeal = {
            mealType: mealType,
            ingredients: ingredients
        }

        toast.promise(addMeal(newMeal), {
            pending: "Generating...",
            success: "Meal Successfully Generated!",
            error: "Oops! Something went wrong. Please try again."
        });
    }

    return (
        <div className="creator-container">
            <div className="creator-window">
                <div className="close-button">
                    <h1 onClick={toggleCreator}>&times;</h1>
                </div>
                <h2>Describe Your Meal</h2>
                <form className="creator-form" methos="POST" onSubmit={handleSubmit}>
                    <div className="col left">
                        <div className="form-group">
                            <label htmlFor="meals">Meal Type</label>
                            <select className="drop-down-input" name="diet" id="diet" value={mealType} onChange={(e) => setMealType(e.target.value)}>
                                <option value="Dinner">Dinner</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Breakfast">Breakfast</option>
                                <option value="Snack">Snack</option>
                            </select>
                        </div>
                    </div>
                    <div className="col rigth">
                        <div className="search-bar">
                            <BsSearch />
                            <input className="ingredient-search" value={ingredient} placeholder="Input an ingredient and press Enter" onChange={(e) => {setIngredient(e.target.value)}} onKeyDown={handleEnter}/>
                        </div>
                        <div className="ingredients-container">
                            <div className="ingredients-list">
                                {ingredients.map((ingredient) => { return (
                                <div className="ingredient">
                                    <p className="ingredient-name">{ingredient}</p>
                                    <p className="ingredient-delete" onClick={removeIngredient}>x</p>
                                </div>
                                )})}
                            </div>
                        </div>
                    </div>
                    {loading ? (
                        <button disabled={true} type="submit" className="create-weeks-meals-btn">Generating...</button>
                    )
                    : ( 
                        <button type="submit" className="create-weeks-meals-btn">Generate Meal</button>
                    )}
                </form>
            </div>
        </div>
    );
}

export default Creator;