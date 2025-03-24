import React from "react";
import "nes.css/css/nes.min.css";
import "../App.css"; 

function Home({ onStart }) {
  return (
    <div className="section-content home-section text-center is-pixelated">
      <h1>Welcome to SpendSense</h1>
      <button onClick={onStart} className="btn btn-primary btn-lg">
        Start Game
      </button>
    </div>
  );
}

export default Home;
