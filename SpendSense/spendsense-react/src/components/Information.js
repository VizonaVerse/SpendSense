import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

function Information() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navRef = useRef(null);
  const overlayRef = useRef(null);
  const menuButtonRef = useRef(null);

  const createButtonSqueeze = (buttonElement) => {
    gsap.to(buttonElement, {
      scale: 0.9,
      duration: 0.1,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: 1
    });
  };

  const openNav = () => {
    setIsNavOpen(true);
    
    // GSAP Animations
    if (navRef.current && overlayRef.current) {
      gsap.timeline()
        .to(overlayRef.current, {
          opacity: 0.5,
          duration: 0.3,
          ease: 'power1.inOut'
        })
        .fromTo(navRef.current, 
          { x: '100%', opacity: 0 },
          { 
            x: '0%', 
            opacity: 1,
            duration: 0.3,
            ease: 'power1.out'
          },
          0
        );
    }
  };

  const closeNav = () => {
    if (navRef.current && overlayRef.current) {
      gsap.timeline()
        .to(overlayRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power1.inOut'
        })
        .to(navRef.current, {
          x: '100%',
          opacity: 0,
          duration: 0.3,
          ease: 'power1.in',
          onComplete: () => setIsNavOpen(false)
        }, 0);
    }
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

    // Menu button hover animation
    const menuButton = menuButtonRef.current;
    if (menuButton) {
      const buttonTimeline = gsap.timeline({ paused: true });
      buttonTimeline.to(menuButton, {
        scale: 1.1,
        duration: 0.2,
        ease: 'power1.out'
      });

      const handleMouseEnter = () => buttonTimeline.play();
      const handleMouseLeave = () => buttonTimeline.reverse();

      menuButton.addEventListener('mouseenter', handleMouseEnter);
      menuButton.addEventListener('mouseleave', handleMouseLeave);

      // Cleanup event listeners
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        menuButton.removeEventListener('mouseenter', handleMouseEnter);
        menuButton.removeEventListener('mouseleave', handleMouseLeave);
      };
    }

    // Cleanup for when no menu button
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNavOpen]);

  const handleNewGame = (event) => {
    event.preventDefault();
    createButtonSqueeze(event.currentTarget);
    window.location.reload();
  };

  const handleButtonClick = (callback) => (event) => {
    event.preventDefault();
    createButtonSqueeze(event.currentTarget);
    callback && callback(event);
  };

  return (
    <>
      {/* Solid Top Navigation Bar */}
      <div 
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100%',
          height: '60px',
          backgroundColor: 'black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          zIndex: 100,
          color: 'white'
        }}
      >
        {/* Logo or Title */}
        <div 
          style={{ 
            fontSize: '24px', 
            fontWeight: 'bold'
          }}
        >
          Game Title
        </div>

        {/* Menu Button */}
        <button
          ref={menuButtonRef}
          id="open-menu-button"
          onClick={handleButtonClick(openNav)}
          style={{ 
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            width: '10vmin',
            height: '10vmin',
            maxHeight: '128px',
            maxWidth: '128px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img
            src="images/menu.png"
            alt="Menu"
            style={{ 
              width: '100%', 
              height: '100%', 
              imageRendering: "pixelated",
              objectFit: 'contain'
            }}
          />
        </button>
      </div>

      {/* Main Content Container - Pushed Down by Navbar */}
      <div 
        style={{
          paddingTop: '0px', // No additional padding needed due to sticky positioning
        }}
      >
        {/* Your main page content goes here */}
      </div>

      {/* Rest of the existing side navigation code remains the same */}
      <nav 
        id="navbar" 
        ref={navRef}
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          width: '300px',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.8)',
          transform: 'translateX(100%)', 
          opacity: 0,
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <ul 
          style={{ 
            listStyle: 'none', 
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
            gap: '20px' 
          }}
        >
          <li>
            <button
              className="nes-btn is-success"
              onClick={handleButtonClick(closeNav)}
              style={{ width: '200px' }}
            >
              Continue
            </button>
          </li>
          <li>
            <button
              className="nes-btn is-primary"
              onClick={handleButtonClick(handleNewGame)}
              style={{ width: '200px' }}
            >
              New Game
            </button>
          </li>
          <li>
            <button
              className="nes-btn is-primary"
              onClick={handleButtonClick(() => {
                console.log("About Us clicked");
              })}
              style={{ width: '200px' }}
            >
              About Us
            </button>
          </li>
          <li>
            <button
              className="nes-btn is-primary"
              onClick={handleButtonClick(() => {
                console.log("About Us clicked");
              })}
              style={{ width: '200px' }}
            >
              API 1
            </button>
          </li>

          <li>
            <button
              className="nes-btn is-primary"
              onClick={handleButtonClick(() => {
                console.log("About Us clicked");
              })}
              style={{ width: '200px' }}
            >
              API 2
            </button>
          </li>
        </ul>
      </nav>

      <div 
        id="overlay" 
        ref={overlayRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'black',
          opacity: 0,
          zIndex: 1000,
          display: isNavOpen ? 'block' : 'none'
        }}
      ></div>
    </>
  );
}

export default Information;