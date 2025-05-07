import { useState, useRef, useEffect } from "react";
import gsap from "gsap";

function EndScreen({ onEndScreen, isVisible, lifeExpectancy, finalWealth, savings }) {
  const [showCounter, setShowCounter] = useState(true);
  const [counterValue, setCounterValue] = useState(lifeExpectancy);
  const counterRef = useRef(null);
  const timelineRef = useRef(null);
  const [ending, setEnding] = useState("Good");
  const containerRef = useRef(null);
  const statsListRef = useRef([]);

  function calculateHappinessScore(savings) {
    const pieSavings = savings / 100;
    const LE = Math.abs(parseFloat(lifeExpectancy) - 70) * -50;
    const S = Math.abs(parseFloat(pieSavings / 100) - 0.2) - 500;
    const happinessScore = (finalWealth / 1000) + S + LE;
    return Math.max(0, Math.min(100, happinessScore));
  }

  // show counter 
  useEffect(() => {
    if (isVisible) {
      // only show ending after counter animation completes
      if (showCounter) {
        // hide ending initially
        if (containerRef.current) {
          gsap.set(containerRef.current, { opacity: 0 });
        }
      } else {
        animateEndScreen();
      }
    }
  }, [isVisible, showCounter]);

  // start the counter animation
  const startCounterAnimation = () => {
    const finalAge = lifeExpectancy; // Use lifeExpectancy from props
    const midpoint = Math.round(66 + (finalAge - 66) * 0.7);

    // Clear any existing animations
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // new timeline
    timelineRef.current = gsap.timeline({
      onComplete: () => {
        setShowCounter(false);
      }
    });

    // part 1/2 animation
    timelineRef.current.to(counterRef.current, {
      innerText: midpoint,
      duration: 1,
      ease: "power1.inOut",
      snap: { innerText: 1 },
      onUpdate: () => {
        setCounterValue(parseInt(counterRef.current.innerText, 10));
      }
    });

    // part 2/2 animation
    timelineRef.current.to(counterRef.current, {
      innerText: finalAge,
      duration: 1.4,
      ease: "power1.out",
      snap: { innerText: 1 },
      onUpdate: () => {
        const currentValue = parseInt(counterRef.current.innerText, 10);
        setCounterValue(currentValue);
        if (currentValue === finalAge) {
          counterRef.current.style.color = "red";
        }
      },
      onComplete: () => {
        setCounterValue(finalAge);
      }
    });

    // transition from counter to end
    timelineRef.current.to(".counter-section", {
      opacity: 0,
      duration: 0.5,
      ease: "power2.in"
    });
  };

  const animateEndScreen = () => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0.76, y: 40 },
      { opacity: 1, y: 0, duration: 0.5 }
    );

    // stats list stagger animation
    if (statsListRef.current.length > 0) {
      gsap.fromTo(
        statsListRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.6, duration: 0.6, delay: 0.5 }
      );
    }
  };

  const addToStatsListRef = (el) => {
    if (el && !statsListRef.current.includes(el)) {
      statsListRef.current.push(el);
    }
  };


  const getContainerClass = () => {
    switch (ending) {
      case "Good":
        return "bg-success";
      case "Mid":
        return "bg-warning";
      case "Bad":
        return "bg-danger";
      default:
        return "bg-primary";
    }
  };

  const createButtonSqueeze = (button) => {
    if (button) {
      gsap.to(button, { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 });
    }
  };

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
      {showCounter && isVisible ? (
        <div className=" w-100 d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-white">
          <h1 className="display-1 mb-4" ref={counterRef}>{counterValue}</h1>
          <button
            className="btn btn-outline-light btn-lg"
            onClick={startCounterAnimation}
          >
            Finish Story
          </button>
        </div>
      ) : (
        <div
          ref={containerRef}
          className={`section-content job-select-section text-center d-flex flex-column vh-100 ${getContainerClass()}`}
        >
          {/* Header */}
          <header className="w-100 py-3 bg-dark text-white text-center">
            {/* <h1>Ending: <strong>{ending}</strong></h1> */}
            <h1>The End!</h1>
          </header>
          {/* Stats */}
          <main className="flex-grow-1 d-flex flex-column justify-content-center align-items-center p-4">
            <div className="card p-4 shadow-lg text-center w-50">
              <h2 className="text-dark mb-3">Your Stats</h2>
              <ul className="list-group">
                {/* <li ref={addToStatsListRef} className="list-group-item">Total Earnings: ___ </li> */}
                {/* <li ref={addToStatsListRef} className="list-group-item">Savings: ___</li> */}
                {/* <li ref={addToStatsListRef} className="list-group-item">Debt: ___</li> */}
                <li ref={addToStatsListRef} className="list-group-item">Total Years Lived: {counterValue}</li>
                <li ref={addToStatsListRef} className="list-group-item">Final Happiness Score: {calculateHappinessScore(savings)}</li>
              </ul>
            </div>
            {/* placeholder button*/}
            <button
              onClick={() => {
                const nextEnding =
                  ending === "Good" ? "Mid" : ending === "Mid" ? "Bad" : "Good";
                setEnding(nextEnding);
                onEndScreen(nextEnding);
              }}
              className="btn btn-dark mt-4"
            >
              Change Ending
            </button>
            {/* replay button*/}
            <button
              className="nes-btn is-primary"
              onClick={handleButtonClick(handleNewGame)}
              style={{ width: '200px' }}
            >
              New Game
            </button>
          </main>
        </div>
      )}
    </>
  );
}

export default EndScreen;