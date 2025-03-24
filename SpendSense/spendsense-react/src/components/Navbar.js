import React, { useState, useRef, useEffect } from 'react';

function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navRef = useRef(null);
  const overlayRef = useRef(null);

  const openNav = () => {
    setIsNavOpen(true);
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  // Handle clicks outside the navbar to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        navRef.current && 
        !navRef.current.contains(event.target) && 
        overlayRef.current && 
        overlayRef.current.contains(event.target)
      ) {
        closeNav();
      }
    };

    // Add event listener when navbar is open
    if (isNavOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNavOpen]);

  const handleNewGame = (event) => {
    window.location.reload();
  };

  return (
    <>
      <button
        id="open-menu-button"
        onClick={openNav}
        style={{ 
          position: "fixed", 
          top: "10px", 
          left: "10px", 
          zIndex: 1000,
          background: 'none',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <img
          src="images/menu.png"
          alt="Menu"
          style={{ width: "64px", height: "64px", imageRendering: "pixelated" }}
        />
      </button>

      <nav 
        id="navbar" 
        ref={navRef}
        className={`navbar ${isNavOpen ? 'show' : ''}`}
      >
        <ul>
          <li>
            <button 
              id="close-menu-button" 
              onClick={closeNav}
              className="close-button"
            >
              <section className="icon-list">
                <i className="nes-icon close is-medium"></i> 
              </section>
            </button>
          </li>
          <li>
            <button
              className="nes-btn is-success"
              onClick={closeNav}
            >
              Continue
            </button>
          </li>
          <li>
            <button
              className="nes-btn is-primary"
              onClick={handleNewGame}
            >
              New Game
            </button>
          </li>
          <li>
            <button
              className="nes-btn is-primary"
              onClick={() => {
                console.log("About Us clicked");
              }}
            >
              About Us
            </button>
          </li>
        </ul>
      </nav>

      <div 
        id="overlay" 
        ref={overlayRef}
        className={`overlay ${isNavOpen ? 'show' : ''}`}
      ></div>
    </>
  );
}

export default Navbar;