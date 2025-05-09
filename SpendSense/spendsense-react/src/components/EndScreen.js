import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';


function EndScreen({ onEndScreen, isVisible, lifeExpectancy, finalWealth, savings, wants, needs, formData, username }) {
  const [showCounter, setShowCounter] = useState(true);
  const [counterValue, setCounterValue] = useState(lifeExpectancy);
  const counterRef = useRef(null);
  const timelineRef = useRef(null);
  const [ending, setEnding] = useState("Good");
  const containerRef = useRef(null);
  const statsListRef = useRef([]);

  function calculateHappinessScore(savings) {
    const pieSavings = parseFloat(savings) / 100;
    const LE = Math.abs(parseFloat(lifeExpectancy) - 100) * -50;
    const S = Math.abs(pieSavings - 0.2) * - 500;
    const happinessScore = 2500 + parseFloat(finalWealth) / 1000 + LE + S;
    return Math.round(happinessScore);
  }

  // show counter 
  useEffect(() => {
    if (isVisible) {
      const happinessScore = calculateHappinessScore(savings);

      // Submit user form data with happiness score
      if (formData.username) {
        console.log('Form data:', formData);
        console.log('Request body:', JSON.stringify({ ...formData, final_money: happinessScore }));
        fetch(`${API_BASE_URL}/api/userform/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...formData, final_money: happinessScore }),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to submit form data');
            }
            console.log('Form data submitted successfully with happiness score:', happinessScore);
          })
          .catch(error => console.error('Error submitting form data:', error));
      }

      // Update leaderboard with happiness score
      if (formData.username) {
        fetch(`${API_BASE_URL}/api/userdataupdate/${formData.username}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "token": process.env.REACT_APP_API_TOKEN,
          },
          body: JSON.stringify({ final_money: happinessScore }),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error("Failed to update happiness score");
            }
            return response.json();
          })
          .then(data => {
            console.log("Happiness score updated successfully:", data);
          })
          .catch(error => {
            console.error("Error updating happiness score:", error);
          });
      }

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
  }, [isVisible, showCounter, formData, savings]);

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
          <p className="text-secondary mb-5">The average person lives to 75! Have you beaten the average persons score?</p>
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
                {/* <li ref={addToStatsListRef} className="list-group-item">Total Earnings: {finalWealth} </li> */}
                {/* <li ref={addToStatsListRef} className="list-group-item">Savings: {savings}</li> */}
                <li ref={addToStatsListRef} className="list-group-item">Total Years Lived: {counterValue}</li>
                <li ref={addToStatsListRef} className="list-group-item">Final Happiness Score: {calculateHappinessScore(savings)}</li>
              </ul>
            </div>
            {/* Conditional Messages */}
            {parseFloat(lifeExpectancy) < 75 && (
              <div className="alert alert-danger mt-4 w-50">
                <strong>Oh no!</strong> You lived a shorter life than the average person. Try to make better choices next time!
              </div>
            )}
            {Math.abs((parseFloat(savings) / 100) - 0.2) > 0.1 && (
              <div className="alert alert-warning mt-4 w-50">
                <strong>Heads up!</strong> Your savings habits were not ideal. Aim to save around 20% of your income for a better future.
              </div>
            )}
            {Math.abs((parseFloat(wants) / 100) - 0.3) > 0.1 && (
              <div className="alert alert-warning mt-4 w-50">
                <strong>Heads up!</strong> Your habits were not ideal. Aim to spend around 30% of your income on your wants for a better future.
              </div>
            )}
            {Math.abs((parseFloat(needs) / 100) - 0.5) > 0.1 && (
              <div className="alert alert-warning mt-4 w-50">
                <strong>Heads up!</strong> Your habits were not ideal. Aim to spend around 50% of your income on your needs for a better future.
              </div>
            )}
            {/* placeholder button*/}
            {/* <button
              onClick={() => {
                const nextEnding =
                  ending === "Good" ? "Mid" : ending === "Mid" ? "Bad" : "Good";
                setEnding(nextEnding);
                onEndScreen(nextEnding);
              }}
              className="btn btn-dark mt-4"
            >
              Change Ending
            </button> */}
            {/* replay button*/}
            <h2></h2>
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