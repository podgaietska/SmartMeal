import { BsSearch } from "react-icons/bs";
import SidebarMealContainer from "./SidebarMealContainer";
import { useState } from "react";

function Sidebar({toggleCreator, meals, darkMode}) {
    const [searchInput, setSearchInput] = useState("");
    const [filteredMeals, setFilteredMeals] = useState([]);

    const handleEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const filtered = sortedMeals.filter(meal => 
                meal.meal_recipe.toLowerCase().includes(searchInput.toLowerCase())
            );
            setFilteredMeals(sortMeals(filtered));
        }
    };

    const handleInputChange = (e) => {
        setSearchInput(e.target.value);
        // Reset the filtered meals if the search input is cleared
        if (e.target.value === "") {
            setFilteredMeals([]);
        }
    };

    const sortedMeals = [...meals].sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

    const sortMeals = (mealsToSort) => {
        return [...mealsToSort].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    };

    return (
        <div className={`sidebar-container ${darkMode && "dark"}`}>
            <div className="sidebar-inside-container">
                <div className={`search-bar ${darkMode && "dark"}`}>
                    <BsSearch class={`icon ${darkMode && "dark"}`}/>
                    <input className={`search-input ${darkMode && "dark"}`} value={searchInput} placeholder="Search meal or ingredients" onChange={handleInputChange} onKeyDown={handleEnter}/>
                </div>
                <div className="enteries-container">
                    {filteredMeals.length > 0 ? filteredMeals.map((meal, index) => {
                        return(
                        <SidebarMealContainer meal={meal} darkMode={darkMode}/>
                        )
                    }) :
                    sortedMeals.map((meal, index) => {
                        return(
                        <SidebarMealContainer meal={meal} darkMode={darkMode}/>
                        )
                    })
                    }
                </div>
                <button className={`add-button ${darkMode && "dark"}`} onClick={toggleCreator}>+</button>
            </div>
        </div>
    )
}

export default Sidebar;