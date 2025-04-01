import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

function CharacterSidebar() {
  const sidebarRef = useRef(null);
  const hoverAreaRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    const hoverArea = hoverAreaRef.current;

    // Initial setup - sidebar off-screen
    gsap.set(sidebar, { x: '-100%' });

    const handleMouseEnter = (e) => {
      if (!isOpen) {
        gsap.to(sidebar, {
          x: '0%',
          duration: 0.3,
          ease: 'power1.out'
        });
        setIsOpen(true);
      }
    };

    const handleMouseLeave = (e) => {
      // Only close if mouse is not over sidebar
      if (!sidebar.contains(e.relatedTarget)) {
        gsap.to(sidebar, {
          x: '-100%',
          duration: 0.3,
          ease: 'power1.in'
        });
        setIsOpen(false);
      }
    };

    // Hover area for triggering sidebar
    hoverArea.addEventListener('mouseenter', handleMouseEnter);
    
    // Sidebar leave event
    sidebar.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup
    return () => {
      hoverArea.removeEventListener('mouseenter', handleMouseEnter);
      sidebar.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isOpen]);

  return (
    <>
      {/* Invisible hover area */}
      <div 
        ref={hoverAreaRef}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: '20px',
          zIndex: 1000
        }}
      />

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
          boxShadow: '0 0 10px rgba(0,0,0,0.5)'
        }}
      >
        <img 
            src="images/sprite_base.png" 
            alt="Character" 
            style={{ width: '100%' }} 
        />

        <div>
          <h3>Wealth</h3>
          <div style={{
            width: '100%',
            height: '20px',
            backgroundColor: '#FFF',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '75%',
              height: '100%',
              backgroundColor: 'green'
            }} />
          </div>

        </div>
      </div>
    </>
  );
}

export default CharacterSidebar;