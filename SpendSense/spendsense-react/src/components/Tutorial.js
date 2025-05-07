import React, { useState, useRef, useEffect } from "react";
import "nes.css/css/nes.min.css";


const Tutorial = ({ 
  isOpen, 
  onClose, 
  tutorialSteps,
  onComplete = () => {}
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const tutorialRef = useRef(null);
  const overlayRef = useRef(null);
  
  // Reset to first step when tutorial is opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);
  
  // Effect to highlight a specific element if specified in the current step
  useEffect(() => {
    if (!isTutorialOpen) return;

    // Cleanup function to restore original styles
    return () => {
      if (overlayRef.current) {
        overlayRef.current.style.opacity = '';
      }
      if (tutorialRef.current) {
  if (!isTutorialOpen) return null;
        tutorialRef.current.style.opacity = '';
      }
    };
  }, [currentStep, isOpen, tutorialSteps]);
  
  if (!isOpen) return null;
  
  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Tutorial completed
      onComplete();
      onClose();
    }
  };
  
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const currentTutorialStep = tutorialSteps[currentStep];

  // Determine the position of the tooltip based on the step config
  let tooltipPosition = currentTutorialStep.tooltipPosition || "center";
  
  return (
    <div className="tutorial-overlay">
      
      {/* For center position, we use a full modal */}
      {tooltipPosition === "center" && (
        <div className="pointer-events-auto" style={{ position: "relative", width: "90%", maxWidth: "650px" }}>
          <div className="nes-dialog" style={{ 
            background: "#212529", 
            color: "#fff",
            border: "4px solid #fff",
            padding: "1rem",
            width: "100%"
          }}>
            <div className="title" style={{ 
              borderBottom: "4px solid #fff", 
              marginBottom: "1rem", 
              paddingBottom: "0.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <h2 style={{ margin: 0, color: "#fff" }}>{currentTutorialStep.title}</h2>
              <button 
                onClick={onClose}
                className="nes-btn is-error" 
                style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
              >
                <i className="nes-icon close" />
              </button>
            </div>
            
            {/* Step indicator */}
            <div style={{ textAlign: "center", marginBottom: "0.75rem" }}>
              <span className="nes-badge" style={{ padding: "1rem 1rem" }}>
                <span className="is-primary"> Step {currentStep + 1} of {tutorialSteps.length}</span>
              </span>
            </div>
            
            {/* Screenshot */}
            {currentTutorialStep.image && (
              <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                marginBottom: "1rem",
                border: "4px solid #fff",
                padding: "4px",
                background: "#000"
              }}>
                <img 
                  src={currentTutorialStep.image} 
                  alt={`Tutorial step ${currentStep + 1}`}
                  style={{ maxHeight: "260px", maxWidth: "100%" }}
                />
              </div>
            )}
            
            {/* Description */}
            <div style={{ 
              marginBottom: "1.5rem", 
              textAlign: "center", 
              padding: "0 1rem",
              minHeight: "60px"
            }}>
              <p className="nes-text">{currentTutorialStep.description}</p>
            </div>
            
            {/* Navigation buttons with NES.css styling */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className={`nes-btn ${currentStep === 0 ? "is-disabled" : ""}`}
                style={{ minWidth: "100px" }}
              >
                ◄ Prev
              </button>
              
              <button
                onClick={handleNext}
                className="nes-btn is-primary"
                style={{ minWidth: "100px" }}
              >
                {currentStep === tutorialSteps.length - 1 ? "Finish" : "Next ►"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* For positioned tooltips (when highlighting elements) */}
      {tooltipPosition !== "center" && (
        <div className="absolute pointer-events-auto" style={getPositionedTooltipStyle(tooltipPosition, currentTutorialStep)}>
          <div className="nes-container is-dark with-title">
            <p className="title" style={{ background: "#212529" }}>{currentTutorialStep.title}</p>
            
            {/* Description */}
            <div style={{ marginBottom: "1rem" }}>
              <p className="nes-text">{currentTutorialStep.description}</p>
            </div>
            
            {/* Step indicator and navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="nes-text is-disabled">Step {currentStep + 1}/{tutorialSteps.length}</span>
              
              <div>
                <button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className={`nes-btn is-small ${currentStep === 0 ? "is-disabled" : ""}`}
                  style={{ marginRight: "8px", fontSize: "0.75rem", padding: "0.15rem 0.3rem" }}
                >
                  ◄
                </button>
                
                <button
                  onClick={handleNext}
                  className="nes-btn is-primary is-small"
                  style={{ fontSize: "0.75rem", padding: "0.15rem 0.3rem" }}
                >
                  {currentStep === tutorialSteps.length - 1 ? "✓" : "►"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to calculate tooltip position
function getPositionedTooltipStyle(position, step) {
  // Default styles for tooltip
  let style = {
    zIndex: 1050,
    maxWidth: "300px",
    background: "#212529",
    color: "#fff",
    border: "4px solid #fff",
    boxShadow: "4px 4px 0 #000"
  };
  
  // Calculate position for the tooltip
  // We can enhance this with actual element positioning later
  switch (position) {
    case "top":
      return {
        ...style,
        bottom: "calc(50% + 100px)",
        left: "50%",
        transform: "translateX(-50%)"
      };
    case "bottom":
      return {
        ...style,
        top: "calc(50% + 100px)",
        left: "50%",
        transform: "translateX(-50%)"
      };
    case "left":
      return {
        ...style,
        right: "calc(50% + 100px)",
        top: "50%",
        transform: "translateY(-50%)"
      };
    case "right":
      return {
        ...style,
        left: "calc(50% + 100px)",
        top: "50%",
        transform: "translateY(-50%)"
      };
    case "topLeft":
      return {
        ...style,
        top: "10%",
        left: "25%"
      };
    case "topRight":
      return {
        ...style,
        top: "10%",
        right: "25%"
      };
    case "bottomLeft":
      return {
        ...style,
        bottom: "10%",
        left: "25%"
      };
    case "bottomRight":
      return {
        ...style,
        bottom: "10%",
        right: "25%"
      };
    default:
      // For specific positioning with element targeting
      return {
        ...style,
        ...(step.tooltipCoordinates || {})
      };
  }
}

export default Tutorial;