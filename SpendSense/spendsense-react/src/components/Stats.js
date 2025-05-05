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
  const age = 55;

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
        width: '550px'
      }}>
        {/* Progress and Life Expectancy Bars */}
        <div className="bars-container" style={{
          display: 'flex',
          justifyContent: 'space-between', // Align bars horizontally
          alignItems: 'center', // Align bars vertically
          gap: '20px', // Add spacing between the bars
          width: '100%',
          marginBottom: '10px' // Add spacing below the bars
        }}>
          {/* Progress Bar */}
          <div className="progress-container" style={{
            width: '50%', // Adjust width as needed
          }}>
            <div className="progress-label" style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '5px',
              fontSize: '14px'
            }}>
              <span style={{ color: 'black' }}>
                Progress
              </span>
              <span style={{ color: 'black' }}>
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

          {/* Life Expectancy Bar */}
          <div className="life-expectancy-container" style={{
            width: '50%', // Adjust width as needed
            position: 'relative' // Ensure the container is positioned relative for absolute positioning of the icon
          }}>
            <div className="life-expectancy-label" style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '5px',
              fontSize: '14px'
            }}>
              <span style={{ color: 'black' }}>
                Life Expectancy
              </span>
              <span style={{ color: 'black' }}>
                {age}
              </span>
            </div>
            <div className="life-expectancy-bar-bg" style={{
              width: '100%',
              height: '4px',
              backgroundColor: 'rgba(15, 15, 15, 0.21)',
              borderRadius: '6px',
              overflow: 'hidden',
              position: 'relative', // Ensure the bar background is positioned relative
              zIndex: 1 // Set the bar background behind the heart icon
            }}>
              <div className="life-expectancy-bar-fill" style={{
                height: '100%',
                width: `${age}%`, // Dynamically set the width based on age
                color: 'black',
                backgroundColor: age <= 55 ? 'red' : '#4CAF50', // Red if age < 55, green otherwise
                borderRadius: '6px',
                transition: 'width 0.3s ease',
                zIndex: 1 // Ensure the bar fill stays behind the heart icon
              }} />
            </div>
            <i className="nes-icon is-small heart" style={{
              position: 'absolute',
              top: '20px', // Adjust the vertical position of the heart icon
              left: `calc(${age}% - 10px)`, // Dynamically position the heart icon based on age
              transition: 'left 0.3s ease', // Smooth transition for the heart icon
              zIndex: 2 // Bring the heart icon in front of the bar
            }}></i>
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
} export default CharacterStatsDisplay;