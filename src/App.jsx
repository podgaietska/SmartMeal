import './App.css';
import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContainer from './components/MainContainer';
import Creator from './components/Creator';
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useState, useEffect } from "react";
import axios from "axios";
import useMediaQuery from './hooks/useMediaQuery';

function App() {
  const [user, setUser] = useState(localStorage.user ? JSON.parse(localStorage.user) : null);
  const [profile, setProfile] = useState(null);
  const [creatorVivsible, setCreatorVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [ingredients, setIngredients] = useState([]);
  const [ingredient, setIngredient] = useState("");
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleCreator = () => {
    setCreatorVisible(!creatorVivsible);
    setIngredients([]);
    setIngredient("");
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);

  };

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setProfile(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const res = await fetch(
          `https://44nk63vvowipjox3hfmkqfuzu40svihc.lambda-url.ca-central-1.on.aws/?email=${profile.email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Access-Token": `${user.access_token}`,
            },
          }
        );
        const data = await res.json();

        const processedMeals = data.map(meal => {
          return {
              ...meal,
              title: extractTitle(meal.meal_recipe),
              ingredients: extractIngredients(meal.meal_recipe),
          };
      });

        setMeals(processedMeals);
      };
      if (profile)
        fetchData();
    }
  }, [profile]);

  function extractTitle(meal_recipe) {
    const lines = meal_recipe.split('\n');
    for (const line of lines) {
        if (line.trim() !== '') {
            return line.trim();
        }
    }
    return null; 
}

function extractIngredients(meal_recipe) {
    const lines = meal_recipe.split('\n');
    const ingredients = [];
    let ingredientsSection = false;
    for (const line of lines) {
        if (line.startsWith('- ')) {
            ingredientsSection = true;
            ingredients.push(line.substring(2).trim());
        } else if (ingredientsSection && line.trim() === '') {
            break;
        }
    }
    return ingredients;
}

  const logOut = () => {
    googleLogout();
    setProfile(null);
    localStorage.removeItem("user");
    setUser(null);
  };

  const login = useGoogleLogin({
    onSuccess: (response) => {
      setUser(response)
      localStorage.setItem("user", JSON.stringify(response));
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  const addMeal = async (meal) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://3n2c2rj6ig5mf5entrfzhzfqlm0xgegr.lambda-url.ca-central-1.on.aws/?email=${profile.email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Token": `${user.access_token}`,
          },
          body: JSON.stringify(meal),
        }
      );
      if (!res.ok) {
        throw new Error(`An error occurred: ${res.statusText}`);
      }

      const data = await res.json();

      const processedMeal = (meal) => {
        return {
            ...meal,
            title: extractTitle(meal.meal_recipe),
            ingredients: extractIngredients(meal.meal_recipe),
        };
    };

      setMeals([...meals, processedMeal(data)]);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      toggleCreator();
    }
  }

  const isWindow = useMediaQuery("(min-width: 780px)");

  useEffect(() => {
    if (!isWindow) {
      setSidebarVisible(false);
    } else{
      setSidebarVisible(true);
    }
  }, [isWindow]);


  return (
    <div className={`App ${darkMode && "dark"}`}>
      {profile ? (
        <>
        {creatorVivsible && <Creator toggleCreator={toggleCreator} setIngredient={setIngredient} setIngredients={setIngredients} ingredient={ingredient} ingredients={ingredients} addMeal={addMeal} loading={loading} darkMode={darkMode}/>}
        <Header profile={profile} logout={logOut} toggleSidebar={toggleSidebar} darkMode={darkMode} setDarkMode={setDarkMode}/>
        <div className="main">
          {sidebarVisible && <Sidebar toggleCreator={toggleCreator} meals={meals} darkMode={darkMode}/>}
          <MainContainer meals={meals} sidebarVisible={sidebarVisible} darkMode={darkMode}/>
        </div>
        </>
      ) : (
        <div className="login-container">
            <h1>SmartMeal</h1>
            <button onClick={() => login()}>Login with <img src={"/logo123.png"} alt=""/></button>
        </div>
      )}
    </div>
  );
}

export default App;
