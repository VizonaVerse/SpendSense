import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import JobSelect from './JobSelect';

function CharacterInfo({ 
  characterImage = "images/sprite_base.png", 
  initialMoney = 1000,
  initialProgress = 60,
  onMoneyChange = null,
  onProgressChange = null
}) {
  const [money, setMoney] = useState(initialMoney);
  const [progress, setProgress] = useState(initialProgress);
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  
  // Listen for external updates to money and progress
  useEffect(() => {
    setMoney(initialMoney);
  }, [initialMoney]);
  
  useEffect(() => {
    setProgress(initialProgress);
  }, [initialProgress]);

  // Set up sidebar animation
  useEffect(() => {
    const sidebar = sidebarRef.current;

    // Initial setup - sidebar off-screen
    gsap.set(sidebar, { x: '-100%' });

    // Toggle sidebar based on isOpen state
    if (isOpen) {
      gsap.to(sidebar, {
        x: '0%',
        duration: 0.3,
        ease: 'power1.out'
      });
    } else {
      gsap.to(sidebar, {
        x: '-100%',
        duration: 0.3,
        ease: 'power1.in'
      });
    }
  }, [isOpen]);
  
  // Functions to update money and progress
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

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Handle click outside to close sidebar
  const handleOutsideClick = (e) => {
    if (isOpen && sidebarRef.current && !sidebarRef.current.contains(e.target) && 
        !e.target.closest('.character-portrait')) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Add event listener for clicks outside the sidebar
    document.addEventListener('mousedown', handleOutsideClick);
    
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <>
      <div className="character-stats-container" style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        padding: '10px 20px',
        color: 'white',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
      }}>
        {/* Character Picture - now clickable */}
        <div 
          className="character-portrait" 
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            overflow: 'hidden',
            marginRight: '15px',
            cursor: 'pointer' // Add cursor to indicate it's clickable
          }}
          onClick={toggleSidebar}
        >
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
          {/* <div className="progress-container" style={{
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
              backgroundColor: 'rgba(15, 15, 15, 0.41)',
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
          </div> */}
          
          {/* Money Display */}
          {/* <div className="money-display" style={{
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
              fontWeight: 'bold', 
              color: 'black' 
            }}>
              £{money.toLocaleString()}
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
          </div> */}
        </div>
      </div>

      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: '300px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          zIndex: 1000,
          padding: '20px',
          boxShadow: '0 0 10px rgba(0,0,0,0.5)',
          overflowY: 'scroll', // Enable vertical scrolling
          scrollbarWidth: 'none', // For Firefox
          msOverflowStyle: 'none', // For Internet Explorer and Edge
          maxHeight: '100vh', // Limit the height to the viewport
        }}
      >
        <img 
          src={characterImage} 
          alt="Character" 
          style={{ width: '100%' }} 
        />

        <div>
          <h3>{JobSelect}*display current job</h3>
        </div>
      </div>
    </>
  );
}

export default CharacterInfo;