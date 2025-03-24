import React from "react";
import "nes.css/css/nes.min.css";
import "../App.css"; 

function Home({ onStart }) {
  return (
    <div className="section-content home-section text-center">
      <h1>Welcome to SpendSense</h1>
      <button onClick={onStart} className="nes-btn is-primary nes-pointer">
        Start Game
      </button>
    </div>
  );
}

export default Home;
