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
          { x: '100%', opacity: 0 }, // Changed from '-100%' to '100%'
          { 
            x: '0%', 
            opacity: 1,
            duration: 0.3,
            ease: 'power1.out'
          },
          0 // start at the same time as overlay animation
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
          x: '100%', // Changed from '-100%' to '100%'
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
      // Define timeline within the scope
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
      <button
        ref={menuButtonRef}
        id="open-menu-button"
        onClick={handleButtonClick(openNav)}
        style={{ 
          position: "fixed", 
          top: "1vmin", 
          right: "1vmin", // Changed from left to right
          zIndex: 1000,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          width: '12vmin',
          height: '12vmin',
          maxWidth: '64px',
          maxHeight: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <img
          src="images/info.png"
          alt="Menu"
          style={{ 
            width: '100%', 
            height: '100%', 
            imageRendering: "pixelated",
            objectFit: 'contain'
          }}
        />
      </button>

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
        <div 
          style={{
            display: 'flex',
            justifyContent: 'flex-start', 
            padding: '15px'
          }}
        >
          <button 
            id="close-menu-button" 
            onClick={handleButtonClick(closeNav)}
            className="close-button"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <section 
              className="icon-list" 
              style={{ 
                filter: 'invert(1)', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <i className="nes-icon close is-medium"></i> 
            </section>
          </button>
        </div>

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