import React, { useState, useEffect } from "react";
import "nes.css/css/nes.min.css";

const Tutorial = ({ 
  isOpen, 
  onClose, 
  tutorialSteps,
  onComplete = () => {}
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightElement, setHighlightElement] = useState(null);
  
  // Reset to first step when tutorial is opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);
  
  // Effect to highlight a specific element if specified in the current step
  useEffect(() => {
    if (!isOpen) return;
    
    const currentTutorialStep = tutorialSteps[currentStep];
    
    // If this step has a selector to highlight
    if (currentTutorialStep.highlightSelector) {
      const element = document.querySelector(currentTutorialStep.highlightSelector);
      if (element) {
        // Save original styles
        const originalZIndex = element.style.zIndex || '';
        const originalPosition = element.style.position || '';
        const originalOutline = element.style.outline || '';
        const originalFilter = element.style.filter || '';
        
        // Apply highlight styles with NES.css inspired pixelated outline
        element.style.position = 'relative';
        element.style.zIndex = '999';
        element.style.outline = '4px solid #fff'; // White pixel outline
        element.style.filter = 'drop-shadow(0 0 2px #fff) drop-shadow(0 0 5px #fd5)'; // Glowing effect
        
        // Save element reference for cleanup
        setHighlightElement({
          element,
          originalStyles: {
            zIndex: originalZIndex,
            position: originalPosition,
            outline: originalOutline,
            filter: originalFilter
          }
        });
      }
    } else {
      // Clear any existing highlight
      if (highlightElement) {
        resetHighlightedElement();
      }
    }
    
    // Cleanup function to restore original styles
    return () => {
      if (highlightElement) {
        resetHighlightedElement();
      }
    };
  }, [currentStep, isOpen, tutorialSteps]);
  
  const resetHighlightedElement = () => {
    if (highlightElement) {
      const { element, originalStyles } = highlightElement;
      element.style.zIndex = originalStyles.zIndex;
      element.style.position = originalStyles.position;
      element.style.outline = originalStyles.outline;
      element.style.filter = originalStyles.filter;
      setHighlightElement(null);
    }
  };
  
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
  
  // For center position, we use a full modal
  if (tooltipPosition === "center") {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0, 0, 0, 0.7)" }}>
        <div className="nes-dialog" id="tutorial-dialog" style={{ 
          maxWidth: "650px", 
          background: "#212529", 
          color: "#fff",
          border: "4px solid #fff",
          padding: "1rem",
          position: "relative",
          width: "90%"
        }}>
          {/* Dialog header with title */}
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
              ×
            </button>
          </div>
          
          {/* Step indicator */}
          <div style={{ textAlign: "center", marginBottom: "0.75rem" }}>
            <span className="nes-badge">
              <span className="is-primary">Step {currentStep + 1} of {tutorialSteps.length}</span>
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
    );
  } else {
    // For positioned tooltips (when highlighting elements)
    // Create positioning based on tooltipPosition
    let tooltipStyle = {
      position: "fixed",
      zIndex: 1000,
      maxWidth: "300px",
      background: "#212529",
      color: "#fff",
      border: "4px solid #fff",
      padding: "1rem",
      boxShadow: "4px 4px 0 #000"
    };
    
    // Position the tooltip
    switch (tooltipPosition) {
      case "top":
        tooltipStyle = {
          ...tooltipStyle,
          bottom: "75%",
          left: "50%",
          transform: "translateX(-50%)"
        };
        break;
      case "bottom":
        tooltipStyle = {
          ...tooltipStyle,
          top: "75%",
          left: "50%",
          transform: "translateX(-50%)"
        };
        break;
      case "left":
        tooltipStyle = {
          ...tooltipStyle,
          right: "75%",
          top: "50%",
          transform: "translateY(-50%)"
        };
        break;
      case "right":
        tooltipStyle = {
          ...tooltipStyle,
          left: "75%",
          top: "50%",
          transform: "translateY(-50%)"
        };
        break;
      default:
        tooltipStyle = {
          ...tooltipStyle,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        };
    }
    
    return (
      <div className="fixed inset-0 z-40 pointer-events-none">
        {/* Semi-transparent overlay */}
        <div 
          className="absolute inset-0 pointer-events-auto" 
          onClick={onClose}
          style={{ 
            background: "rgba(0, 0, 0, 0.5)",
            backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.1) 5px, rgba(0,0,0,0.1) 10px)" // Pixelated pattern
          }} 
        />
        
        {/* NES.css styled tooltip */}
        <div 
          className="nes-container is-dark with-title pointer-events-auto"
          style={tooltipStyle}
        >
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
    );
  }
};

export default Tutorial;