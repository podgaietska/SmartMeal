import {motion} from 'framer-motion';
import Overlay from './Overlay';
import {useState} from 'react';

function RecipeCard({meal}) {
    const [opened, setOpened] = useState(false);
    const paragraphByIndex = {0: "first", 1: "second", 2: "third", 3: "fourth"};
    
    const paragraphs = meal.meal_recipe.split('\n\n'); // split by double newline for paragraphs
     console.log(paragraphs);

    const openCard = () => {
        setOpened(true);
    };

    const closeCard = () => {
        setOpened(false);
    };

    const openedCardVariants = {
        open: { opacity: 1, transition: {staggeredChildren: 0.5, delayChildren: 0.2} },
        closed: {opacity: 0}
    }

    return (
        <div>
        <motion.div className="recipe-card" whileHover={{ scale : 1.1 }} onClick={openCard}>
            <div className="recipe-text">
                <h3>{meal.title}</h3>
                {meal.ingredients.map((ingredient, index) => {
                    return (
                        <p key={index}>- {ingredient}</p>
                    )
                })}
            </div>
        </motion.div>
        {opened && (
            <Overlay close={() => setOpened(false)}>
                <motion.div className="creator-window" variants={openedCardVariants}>
                    <div className="close-button">
                        <h1 onClick={closeCard}>&times;</h1>
                    </div>
                    <div className="meal-recipe">
                        {paragraphs.map((paragraph, pIndex) => {
                            return (
                                <div className={`paragraph ${paragraphByIndex[pIndex]}`}>
                                    {pIndex === 2 && <h4>Ingredients:</h4>}
                                    {pIndex === 3 && <h4>Step by step instructions:</h4>}
                                    {paragraph.split('\n').map((line, lIndex) => (
                                        <p key={lIndex}>{line}</p>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </Overlay>
        )}
        </div>
    );
}

export default RecipeCard;