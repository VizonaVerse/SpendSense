import React from "react";
import "nes.css/css/nes.min.css";
import "../App.css"; 

function Home({ onStart }) {
  return (
    <div className="section-content text-center">
      <div>
        <img
          src="images/spendsense_logo.gif"
          alt="SpendSense Logo"
          style={{ height: "25vmin", animation: "pulse 2s infinite" }}
        />
      </div>
      <div>
        <button
          onClick={onStart}
          className="nes-btn is-primary nes-pointer"
          style={{ display: "block", margin: "10px auto", animation: "pulse 2s infinite" }}
        >
          Start Game
        </button>
        <button
          onClick={onStart}
          className="nes-btn is-primary nes-pointer"
          style={{ display: "block", margin: "10px auto", animation: "pulse 2s infinite" }}
        >
          Tutorial
        </button>
      </div>
    </div>
  );
}

export default Home;