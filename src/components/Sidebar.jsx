import { BsSearch } from "react-icons/bs";
import SidebarMealContainer from "./SidebarMealContainer";
import { useState } from "react";

function Sidebar({toggleCreator, meals}) {
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
        <div className="sidebar-container">
            <div className="sidebar-inside-container">
                <div className="search-bar">
                    <BsSearch />
                    <input className="search-input" value={searchInput} placeholder="Search meal or ingredients" onChange={handleInputChange} onKeyDown={handleEnter}/>
                </div>
                <div className="enteries-container">
                    {filteredMeals.length > 0 ? filteredMeals.map((meal, index) => {
                        return(
                        <SidebarMealContainer meal={meal}/>
                        )
                    }) :
                    sortedMeals.map((meal, index) => {
                        return(
                        <SidebarMealContainer meal={meal}/>
                        )
                    })
                    }
                </div>
                <button className="add-button" onClick={toggleCreator}>+</button>
            </div>
        </div>
    )
}

export default Sidebar;