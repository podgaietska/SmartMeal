import { BsSearch } from "react-icons/bs";

function Sidebar({toggleCreator, meals}) {

    const sortedMeals = [...meals].sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

    return (
        <div className="sidebar-container">
            <div className="sidebar-inside-container">
                <div className="search-bar">
                    <BsSearch />
                    <p>Search by week or recipies</p>
                </div>
                <div className="enteries-container">
                    {sortedMeals.map((meal, index) => {
                        return(
                        <div className="meal-container">
                            <div className="colored-identifier">
                                <div className="circle"></div>
                            </div>
                            <div className="text-container">
                                <p>{meal.title}</p>
                                <span>{meal.meal_type}</span>
                            </div>
                        </div>
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