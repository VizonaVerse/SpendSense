import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// Tutorial component with interactive element highlighting
const Tutorial = ({ 
  isOpen, 
  onClose, 
  tutorialSteps,
  // Optional callback for when user completes the tutorial
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
        const originalBoxShadow = element.style.boxShadow || '';
        
        // Apply highlight styles
        element.style.position = 'relative';
        element.style.zIndex = '999';
        
        // Save element reference for cleanup
        setHighlightElement({
          element,
          originalStyles: {
            zIndex: originalZIndex,
            position: originalPosition,
            boxShadow: originalBoxShadow
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
      element.style.boxShadow = originalStyles.boxShadow;
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
  let tooltipClass = "fixed bg-gray-900 border-2 border-yellow-400 rounded-lg p-4 max-w-md shadow-lg";
  
  switch (tooltipPosition) {
    case "top":
      tooltipClass += " bottom-3/4 left-1/2 transform -translate-x-1/2";
      break;
    case "bottom":
      tooltipClass += " top-3/4 left-1/2 transform -translate-x-1/2";
      break;
    case "left":
      tooltipClass += " right-3/4 top-1/2 transform -translate-y-1/2";
      break;
    case "right":
      tooltipClass += " left-3/4 top-1/2 transform -translate-y-1/2";
      break;
    default: // center or any other value
      tooltipClass = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
      break;
  }
  
  // For center position, we use a full modal
  if (tooltipPosition === "center") {
    return (
      <div className={tooltipClass}>
        <div className="bg-gray-900 border-4 border-yellow-400 rounded-lg p-6 max-w-2xl w-full mx-4 relative ">
          {/* Close button */}
          <button 
            onClick={onClose}
          >
            <X size={20} />
          </button>
          
          {/* Step indicator */}
          <div className="text-center mb-2 text-white">
            <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
              Step {currentStep + 1} of {tutorialSteps.length}
            </span>
          </div>
          
          {/* Title */}
          <h2 className="text-2xl font-bold text-center mb-4 text-yellow-400">
            {currentTutorialStep.title}
          </h2>
          
          {/* Screenshot */}
          {currentTutorialStep.image && (
            <div className="flex justify-center mb-4">
              <div className="border-2 border-gray-600 rounded-md overflow-hidden">
                <img 
                  src={currentTutorialStep.image} 
                  alt={`Tutorial step ${currentStep + 1}`}
                  className="max-h-64"
                />
              </div>
            </div>
          )}
          
          {/* Description */}
          <div className="text-white mb-6 text-center px-4">
            {currentTutorialStep.description}
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center px-4 py-2 rounded ${
                currentStep === 0 
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <ChevronLeft size={20} className="mr-1" />
              Previous
            </button>
            
            <button
              onClick={handleNext}
              className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            >
              {currentStep === tutorialSteps.length - 1 ? "Finish" : "Next"}
              {currentStep < tutorialSteps.length - 1 && <ChevronRight size={20} className="ml-1" />}
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    // For positioned tooltips (when highlighting elements)
    return (
      <div className="fixed inset-0 z-40 pointer-events-none">
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30 pointer-events-auto" onClick={onClose} />
        
        {/* Tooltip */}
        <div className={tooltipClass + " z-50 pointer-events-auto"}>
          {/* Title */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-yellow-400">
              {currentTutorialStep.title}
            </h3>
            <button 
              onClick={onClose}
              className="p-1 bg-red-500 rounded-full hover:bg-red-600 text-white"
            >
              <X size={16} />
            </button>
          </div>
          
          {/* Description */}
          <div className="text-white text-sm mb-3">
            {currentTutorialStep.description}
          </div>
          
          {/* Step indicator */}
          <div className="flex justify-between items-center text-xs text-gray-300">
            <span>Step {currentStep + 1} of {tutorialSteps.length}</span>
            
            <div className="flex space-x-2">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className={`p-1 rounded ${
                  currentStep === 0 
                    ? "text-gray-500 cursor-not-allowed" 
                    : "text-blue-400 hover:text-blue-300"
                }`}
              >
                <ChevronLeft size={16} />
              </button>
              
              <button
                onClick={handleNext}
                className="p-1 text-green-400 hover:text-green-300 rounded"
              >
                {currentStep === tutorialSteps.length - 1 ? "Finish" : <ChevronRight size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Tutorial;