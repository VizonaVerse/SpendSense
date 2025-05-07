import React, { useState, useEffect } from "react";
import "nes.css/css/nes.min.css";
import "../App.css";
import Tutorial from "./Tutorial"; 

function Home({ onStart }) {
  // State to store our raining GIFs
  const [raindrops, setRaindrops] = useState([]);
  // State to control tutorial visibility
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  // Tutorial steps data with element highlighting
  const tutorialSteps = [
    {
      title: "Welcome to SpendSense!",
      image: "images/tutorial/welcome.png", // Replace with your actual screenshot
      description: "SpendSense helps you track your spending habits and save money through fun gameplay. Let's learn how to use it!",
      tooltipPosition: "center"
    },
    {
      title: "Game Logo",
      description: "This is the SpendSense logo. Coins will rain down as you save more money!",
      highlightSelector: "img[alt='SpendSense Logo']",
      tooltipPosition: "bottom"
    },
    {
      title: "Start Game Button",
      description: "Click this button to begin playing and start managing your finances.",
      highlightSelector: "button.nes-btn.is-primary",
      tooltipPosition: "right"
    },
    {
      title: "Tracking Expenses",
      image: "images/tutorial/expenses.png", // Replace with your actual screenshot
      description: "Add your expenses by category and see them visualized in fun ways. The more you save, the more coins you collect!",
      tooltipPosition: "center"
    },
    {
      title: "Setting Goals",
      image: "images/tutorial/goals.png", // Replace with your actual screenshot
      description: "Create savings goals and watch your progress. Each milestone unlocks new achievements and power-ups!",
      tooltipPosition: "center"
    },
    {
      title: "Ready to Play?",
      image: "images/tutorial/ready.png", // Replace with your actual screenshot
      description: "Now you're ready to start your financial journey with SpendSense! Click 'Finish' to close this tutorial and begin.",
      tooltipPosition: "center"
    }
  ];

  // Effect to create and manage the raining GIFs
  useEffect(() => {
    // Function to create a new raindrop
    const createRaindrop = () => {
      return {
        id: Date.now() + Math.random(),
        x: Math.random() * 100, // Random horizontal position (%)
        y: -15, // Start above the screen
        size: Math.random() * 30 + 30, // Random size between 30-60px
        speed: Math.random() * 3 + 2, // Random speed between 2-5
        rotation: Math.random() * 40 - 20, // Random rotation (-20 to 20 degrees)
        opacity: Math.random() * 0.4 + 0.6 // Random opacity between 0.6-1
      };
    };

    // Initial raindrops
    setRaindrops(Array.from({ length: 15 }, createRaindrop));

    // Interval to update raindrop positions
    const rainInterval = setInterval(() => {
      setRaindrops(prevRaindrops => {
        // Move existing raindrops down
        const updatedRaindrops = prevRaindrops.map(drop => ({
          ...drop,
          y: drop.y + drop.speed // This moves the GIF downward
        }));
        
        // Remove raindrops that have fallen off screen
        const filteredRaindrops = updatedRaindrops.filter(drop => drop.y < 120);
        
        // Add new raindrops occasionally
        if (Math.random() > 0.7) {
          filteredRaindrops.push(createRaindrop());
        }
        
        return filteredRaindrops;
      });
    }, 50);

    // Cleanup on unmount
    return () => clearInterval(rainInterval);
  }, []);

  // Open the tutorial
  const handleOpenTutorial = () => {
    setIsTutorialOpen(true);
  };

  // Close the tutorial
  const handleCloseTutorial = () => {
    setIsTutorialOpen(false);
  };

  // Auto-open tutorial based on URL parameter
  useEffect(() => {
    
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 relative overflow-hidden">
      {/* Rain effect - the GIFs falling from the sky */}
      {raindrops.map(drop => (
        <img
          key={drop.id}
          src="images/coinSpin1.gif" // Your GIF path
          alt=""
          className="absolute pointer-events-none"
          style={{
            left: `${drop.x}%`,
            top: `${drop.y}%`, 
            height: `${drop.size}px`,
            width: "auto", // Ensure proper aspect ratio
            transform: `rotate(${drop.rotation}deg)`,
            opacity: drop.opacity,
            zIndex: 0,
            position: "absolute" // Ensure absolute positioning works properly
          }}
        />
      ))}
      
      {/* Main content with higher z-index to appear above the rain */}
      <div className="section-content text-center relative z-10">
        <div>
          <img
            src="images/spendsense_logo.gif"
            alt="SpendSense Logo"
            style={{ height: "25vmin", zIndex: 100, position: "relative", marginBottom: "20px" }}
          />
        </div>
        <div>
          <button
            onClick={onStart}
            className="nes-btn is-primary nes-pointer"
            style={{ display: "block", margin: "25px auto", animation: "pulse 2s infinite" }}
          >
            Start Game
          </button>
          <button
            onClick={handleOpenTutorial}
            className="nes-btn is-success nes-pointer"
            style={{ display: "block", margin: "10px auto" }}
          >
            Tutorial
          </button>
        </div>
        
      </div>

      {/* Interactive Tutorial Component with NES.css styling */}
      <Tutorial 
        isOpen={isTutorialOpen} 
        onClose={handleCloseTutorial}
        tutorialSteps={tutorialSteps} 
      />
    </div>
  );
}

export default Home;