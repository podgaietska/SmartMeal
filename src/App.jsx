import './App.css';
import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContainer from './components/MainContainer';
import Creator from './components/Creator';
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [user, setUser] = useState(localStorage.user ? JSON.parse(localStorage.user) : null);
  const [profile, setProfile] = useState(null);
  const [isVivsible, setIsVisible] = useState(false);

  const toggleCreator = () => {
    setIsVisible(!isVivsible);
  }

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

  const logOut = () => {
    googleLogout();
    setProfile(null);
    localStorage.removeItem("user");
    setUser(null);
  };

  const login = useGoogleLogin({
    onSuccess: (response) => {
      setUser(response)
      console.log(response);
      localStorage.setItem("user", JSON.stringify(response));
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  return (
    <div className="App">
      {user ? (
        <>
        {isVivsible && <Creator toggleCreator={toggleCreator}/>}
        <Header profile={profile} logout={logOut}/>
        <div className="main">
          <Sidebar toggleCreator={toggleCreator}/>
          <MainContainer />
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
