import {IoIosLogOut} from 'react-icons/io';

function Header({ profile, logout }) {
    return (
        <div className="app-header">
            <div className="left-container">
                <h1>SmartMeal</h1>
                <div className="menu">
                    <h1>&#9776;</h1>
                </div>
            </div>
            {profile && (
                <div className="right-container">
                    <p>{profile.name}</p>
                    <IoIosLogOut className="logout-icon" onClick={logout}/>
                </div>
            )}
        </div>
    );
}

export default Header;