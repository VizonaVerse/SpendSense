import React from "react";

function Home({ onStart }) {
  return (
    <div className="section-content home-section text-center">
      <h1>Welcome to SpendSense</h1>
      <button onClick={onStart} className="btn btn-primary btn-lg">
        Start Game
      </button>
    </div>
  );
}

export default Home;
