import RecipeCard from './RecipeCard';
import { useState, useEffect } from 'react';
import useMediaQuery from '../hooks/useMediaQuery';

function RecipeList({onUpdateObituary, meals, darkMode}) {
    const [fourColumns, setfourColumns] = useState([]);
    const [twoColumns, settwoColumns] = useState([]);

    const isWindow = useMediaQuery("(min-width: 1000px)");

    useEffect (() => {
        const fourColumns = meals.reduce(function (columns, item, index) {
          const columnIndex = index % 4;
          const rowIndex = Math.floor(index / 4);
          if (!columns[columnIndex]) {
              columns[columnIndex] = [];
          }
          columns[columnIndex][rowIndex] = item;
          return columns;
      }, []);

      const twoColumns = meals.reduce(function (columns, item, index) {
        const columnIndex = index % 2;
        const rowIndex = Math.floor(index / 2);
        if (!columns[columnIndex]) {
            columns[columnIndex] = [];
        }
        columns[columnIndex][rowIndex] = item;
        return columns;
    }, []);
        
        settwoColumns(twoColumns);
        setfourColumns(fourColumns);
      }, [meals]);

    if (meals.length === 0) return <div className="no-meals"><h1>No Meals Yet</h1></div>;

    return(
        <>
        {isWindow ? (
            <div className="recipes-list">
            {fourColumns.map((column) => (
                <div className="column">
                    {column.map((meal) => (
                    <RecipeCard meal={meal} darkMode={darkMode}/>
                    ))}
                </div>
            ))}
        </div>
        ) : (
            <div className="recipes-list">
            {twoColumns.map((column) => (
                <div className="column">
                    {column.map((meal) => (
                    <RecipeCard meal={meal} darkMode={darkMode}/>
            ))}
                </div>
            ))}
            </div>
        )}
    </>
    );
}

export default RecipeList;