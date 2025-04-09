import React from "react";
import "nes.css/css/nes.min.css";
import "../App.css"; 

function Home({ onStart }) {
  return (
    <div className="section-content home-section text-center">
      <div>
      <img src="images/spendsense_logo.gif" alt="SpendSense Logo" style={{ width: "50vw", height: "25vh" }} />

      </div>
      <button onClick={onStart} className="nes-btn is-primary nes-pointer">
        Start Game
      </button>
    </div>
  );
}

export default Home;
