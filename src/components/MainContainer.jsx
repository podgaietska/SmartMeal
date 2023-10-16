
import RecipeCard from "./RecipeCard";
import RecipeList from "./RecipeList";

function Main({meals}) {

    const sortedMeals = [...meals].sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

    return (
        <div className="main-container">
            <div className="header">
                <p>All Meals</p>
            </div>
                <RecipeList meals={sortedMeals}/>
        </div>
    )
}

export default Main;