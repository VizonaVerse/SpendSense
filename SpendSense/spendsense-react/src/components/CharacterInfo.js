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
  const [selectedJob, setSelectedJob] = useState(null);
  
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
          <h3>{selectedJob}</h3>
        </div>
      </div>
    </>
  );
}

export default CharacterInfo;