import React, { useState, useEffect } from 'react';

function CharacterStatsDisplay({ 
  characterImage = "images/sprite_base.png", 
  characterMoney = 0,
  characterProgress = 0,
  onMoneyChange = null,
  onProgressChange = null
}) {
  const [money, setMoney] = useState(characterMoney);
  const [progress, setProgress] = useState(characterProgress);
  
  // Listen for external updates to money and progress
  useEffect(() => {
    setMoney(characterMoney);
  }, [characterMoney]);
  
  useEffect(() => {
    setProgress(characterProgress);
  }, [characterProgress]);
  
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
      color: 'rgba(255, 255, 255, 0)',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
    }}>
      {/* Character Picture */}
      <div className="character-portrait" style={{
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        overflow: 'hidden',
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
      
      {/* Stats wrapper */}
      <div className="stats-wrapper" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: '-10px',
        width: '300px'
      }}>
        {/* Progress Bar */}
        <div className="progress-container" style={{
          width: '100%',
          marginBottom: '10px'
        }}>
          <div className="progress-label" style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '5px',
            fontSize: '14px'
          }}>
            <span style={{ color: 'black'}}>
                Progress
            </span>
            <span style={{ color: 'black'}}>
                {progress}%
            </span>
          </div>
          <div className="progress-bar-bg" style={{
            width: '100%',
            height: '12px',
            backgroundColor: 'rgba(15, 15, 15, 0.21)',
            borderRadius: '6px',
            overflow: 'hidden'
          }}>
            <div className="progress-bar-fill" style={{
              height: '100%',
              width: `${progress}%`,
              color: 'black',
              backgroundColor: '#4CAF50',
              borderRadius: '6px',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
        
        {/* Money Display */}
        <div className="money-display" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          backgroundColor: 'rgba(70, 166, 66, 0.47)',
          padding: '5px 12px',
          borderRadius: '15px',
          border: '3px solid green',
          width: 'fit-content'
        }}>
          <span style={{ 
            fontSize: '16px',  
            color: 'black' 
          }}>
              £{Number.isInteger(money || 0) ? (money || 0).toLocaleString() : (money || 0).toFixed(2).toLocaleString()} {/* Fallback to 0 if money is null or undefined */}
          </span>
          <img
            src="images/coin.png"
            alt="Coins"
            style={{
              width: '30px',
              height: '30px',
              imageRendering: 'pixelated'
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default CharacterStatsDisplay;