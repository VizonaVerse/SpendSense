import React, { useState, useEffect } from 'react';

function CharacterStatsDisplay({ 
  characterImage = "images/sprite_base.png", 
  initialMoney = 1000,
  initialProgress = 60,
  onMoneyChange = null,
  onProgressChange = null
}) {
  const [money, setMoney] = useState(initialMoney);
  const [progress, setProgress] = useState(initialProgress);
  
  // Listen for external updates to money and progress
  useEffect(() => {
    setMoney(initialMoney);
  }, [initialMoney]);
  
  useEffect(() => {
    setProgress(initialProgress);
  }, [initialProgress]);
  
  // Undefined functions to update money and progress
  const addMoney = (amount) => {
    const newMoney = money + amount;
    setMoney(newMoney);
    if (onMoneyChange) onMoneyChange(newMoney);
  };
  
  const updateProgress = (value) => {
    // Ensure progress stays between 0-100
    const newProgress = Math.max(0, Math.min(100, value));
    setProgress(newProgress);
    if (onProgressChange) onProgressChange(newProgress);
  };

  return (
    <div className="character-stats-container" style={{
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      padding: '10px 20px',
      backgroundColor: '#000',
      color: 'white',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
    }}>
      {/* Character Picture */}
      <div className="character-portrait" style={{
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        overflow: 'hidden',
        border: '2px solid gold',
        marginRight: '15px'
      }}>
        <img 
          src={characterImage}
          alt="Character"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            imageRendering: 'pixelated'
          }}
        />
      </div>
      
      {/* Money Display */}
      <div className="money-display" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '5px 12px',
        borderRadius: '15px',
        border: '1px solid gold',
        marginRight: '20px'
      }}>
        <span style={{ 
          fontSize: '16px', 
          fontWeight: 'bold', 
          color: 'gold' 
        }}>
          £{money.toLocaleString()}
        </span>
        <img
          src="images/coin.png"
          alt="Coins"
          style={{
            width: '18px',
            height: '18px',
            imageRendering: 'pixelated'
          }}
        />
      </div>
      
      {/* Progress Bar */}
      <div className="progress-container" style={{
        flex: 1,
        maxWidth: '300px'
      }}>
        <div className="progress-label" style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '5px',
          fontSize: '14px'
        }}>
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="progress-bar-bg" style={{
          width: '100%',
          height: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <div className="progress-bar-fill" style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: '#4CAF50',
            borderRadius: '6px',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>
    </div>
  );
}

export default CharacterStatsDisplay;