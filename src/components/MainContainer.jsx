import RecipeList from "./RecipeList";

function Main({meals, sidebarVisible, darkMode}) {

    const sortedMeals = [...meals].sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

    return (
        <div className={`main-container ${sidebarVisible ? '' : 'full-screen'} ${darkMode && "dark"}`}>
            <div className={`header ${darkMode && "dark"}`}>
                <p>All Meals</p>
            </div>
                <RecipeList meals={sortedMeals} darkMode={darkMode}/>
        </div>
    )
}

export default Main;