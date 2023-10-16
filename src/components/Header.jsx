import {IoIosLogOut} from 'react-icons/io';
import { motion } from 'framer-motion';

function Header({ profile, logout, toggleSidebar, darkMode, setDarkMode }) {

    const handleModeSwitch = () => {
        setDarkMode(!darkMode);
    }

    return (
        <div className="app-header">
            <div className="left-container">
                <h1>SmartMeal</h1>
                <div className="menu">
                    <h1 className={`${darkMode && "dark"}`} onClick={toggleSidebar}>&#9776;</h1>
                </div>
            </div>
            <div className="right-container">
                <div className={`app-mode ${darkMode && "dark"}`} onClick={handleModeSwitch}>
                    <motion.div className={`choice-circle ${darkMode && "dark"}`} animate={{ x: darkMode ? "100%" : "0%"}} transition={{ duration: 0.5 }}></motion.div>
                </div>
                {profile && (
                    <>
                        <p>{profile.name}</p>
                        <IoIosLogOut className={`logout-icon ${darkMode && "dark"}`} onClick={logout}/>
                    </>
                )}
            </div>

        </div>
    );
}

export default Header;