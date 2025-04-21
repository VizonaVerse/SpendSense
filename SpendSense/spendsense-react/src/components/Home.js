import React from "react";
import "nes.css/css/nes.min.css";
import "../App.css"; 

function Home({ onStart }) {
  return (
    <div className="section-content text-center">
      <div>
      <img src="images/spendsense_logo.gif" alt="SpendSense Logo" style={{ height: "25vmin" }} />

      </div>
      <button onClick={onStart} className="nes-btn is-primary nes-pointer">
        Start Game
      </button>
    </div>
  );
}

export default Home;
