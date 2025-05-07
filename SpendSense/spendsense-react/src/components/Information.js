import React, { useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import { gsap } from 'gsap';

function Information({ goToSection }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navRef = useRef(null);
  const overlayRef = useRef(null);
  const menuButtonRef = useRef(null);
  const key = "owjYqZHGuOkkgh4msnV9xD3aij9zs6YmKbGU7bYXO7k=";
  const [users, setUsers] = useState([]);

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

  useEffect(() => {
    fetch(`http://localhost:8000/api/userdata/?key=${key}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': process.env.REACT_APP_API_TOKEN,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched data:', data);

        // Ensure `data` is an array before setting it
        if (Array.isArray(data)) {
            setUsers(data);
          } else {
            console.error('Expected an array but got:', data);
          }
        })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

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
      <div>
        {/* Menu Button */}
        <button
          ref={menuButtonRef}
          id="open-menu-button"
          class="nes-pointer"
          onClick={handleButtonClick(openNav)}
          style={{
            position: "fixed",
            top: "1vmin",
            right: "1vmin", // Changed from left to right
            zIndex: 1000,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            width: '10vmin',
            height: '10vmin',
            minWidth: '64px',
            minHeight: '64px',
            maxWidth: '128px',
            maxHeight: '128px',
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
            <Link to="/about-us" style={{ textDecoration: 'none' }}>
              <button
              className="nes-btn is-primary"
              style={{ width: '200px' }}
              >
              About Us
              </button>
            </Link>
            </li>
            <li>
            <Link to="/learn" style={{ textDecoration: 'none' }}>
              <button
              className="nes-btn is-warning"
              style={{ width: '200px' }}
              >
              Know Your Money
              </button>
            </Link>
            </li>
            <li>
            <div style={{
              marginTop: '20px',
              padding: '10px',
              color: 'white',
              maxHeight: '300px', // Set a fixed height for the leaderboard
              overflowY: 'auto', // Enable vertical scrolling
              borderRadius: '5px',
              scrollbarWidth: 'thin',
              scrollbarColor: 'white transparent',
            }}>
              <h5>Leaderboard</h5>
              <ul>
                {users.slice().sort((a, b) => b.final_money - a.final_money).slice(0, 10).map((user, index) => (
                  <li key={index} style={{ marginBottom: '10px' }} className="leaderboard-item">
                    <div><strong>Username:</strong> {user.username}</div>
                    <div><strong>Money:</strong> £{user.final_money}</div>
                  </li>
                ))}
              </ul>
            </div>
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