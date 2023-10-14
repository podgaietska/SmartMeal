import { BsSearch } from "react-icons/bs";

function Sidebar({toggleCreator}) {
    return (
        <div className="sidebar-container">
            <div className="sidebar-inside-container">
                <div className="search-bar">
                    <BsSearch />
                    <p>Search by week or recipies</p>
                </div>
                <div className="enteries-container">
                    <div className="week-container">
                        <div className="colored-identifier">
                            <div className="circle"></div>
                        </div>
                        <div className="text-container">
                            <h3>Oct. 2 - Oct. 9</h3>
                            <p>Speghetti, French toast, Eggs and Bacon...</p>
                        </div>
                    </div>
                </div>
                <button className="add-button" onClick={toggleCreator}>+</button>
            </div>
        </div>
    )
}

export default Sidebar;