function Creator({toggleCreator}) {
    return (
        <div className="creator-container">
            <div className="creator-window">
                <div className="close-button">
                    <h1 onClick={toggleCreator}>&times;</h1>
                </div>
                <h2>Generate Meal Plan</h2>
                <form className="creator-form">
                    <div className="form-group">
                        <label htmlFor="start-date">Start Date</label>
                        <input type="date" name="start-date" id="start-date"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="end-date">End Date</label>
                        <input type="date" name="end-date" id="end-date"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="diet">Number of Meals</label>
                        <select name="diet" id="diet">
                            <option value="none">4</option>
                            <option value="vegetarian">5</option>
                        </select>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Creator;