import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import "../App.css"; 
import { initialJobs } from './JobSelect';
import PieChart from "./PieChart";

const salary_savings = initialJobs[0].salary * 40; // This is how much you've saved over your career

const categories = [
  "Phone",
  "Car",
  "House",
  "Thing",
];

// Placeholder objects
const items = {
  Phone: [
    { name: "phone 3", price: 1200 },
    { name: "phone 2", price: 800 },
    { name: "phone 1", price: 450 }
  ],
  Car: [
    { name: "Cool car", price: 55000 },
    { name: "car ", price: 18000 },  
    { name: "shit can", price: 2000 }
  ],
  House: [
    { name: "Mansion", price: 2000000 },
    { name: "House", price: 600000 },
    { name: "Homeless", price: 0 }
  ],  
  Thing: [
    { name: "thing good", price: 300 },
    { name: "thing ok", price: 200 },
    { name: "thing bad", price: 100 }
  ]
};

function EndShop({ budgetData, handleGoToEndScreen }) { // ✅ Accept budgetData as a prop
  const [activeCategories, setActiveCategories] = useState([]);
  const [money, setMoney] = useState(salary_savings); // Placeholder
  const itemRefs = useRef({});
  const [processedBudgetData, setProcessedBudgetData] = useState(null);

  // Process budget data to round values and ensure they add up to 100%
  useEffect(() => {
    if (budgetData) {
      const exactPercentages = Object.entries(budgetData).map(([key, value]) => ({
        key,
        value: value,
        floored: Math.floor(value),
        remainder: value - Math.floor(value),
      }));

      // Calculate the total floored percentage
      const totalFloored = exactPercentages.reduce((sum, item) => sum + item.floored, 0);

      // Calculate how many percentage points need to be distributed
      const pointsToDistribute = 100 - totalFloored;

      // Sort by remainder in descending order
      exactPercentages.sort((a, b) => b.remainder - a.remainder);

      // Distribute remaining points to the items with the largest remainders
      const adjustedPercentages = exactPercentages.map((item, index) => ({
        key: item.key,
        value: item.floored + (index < pointsToDistribute ? 1 : 0),
      }));

      // Convert back to an object
      const finalBudgetData = adjustedPercentages.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});

      setProcessedBudgetData(finalBudgetData);
    }
  }, [budgetData]);

  const handleCategoryClick = (category) => {
    // Retrieve element for category item
    const itemElement = itemRefs.current[category];
    
    if (!itemElement) return;
    
    if (activeCategories.includes(category)) {
      // Animate up
      gsap.to(itemElement, {
        duration: 0.5,
        y: -8,
        opacity: 0,
        height: 0,
        ease: "power2.inOut",
        onComplete: () => {
          setActiveCategories(arr => arr.filter(cat => cat !== category));
        }
      });
    } else {
      // Add category to active list 
      setActiveCategories(arr => [...arr, category]);
      
      // Animate down
      gsap.fromTo(itemElement,
        { y: -8, opacity: 0, height: 0 },
        { 
          duration: 0.5, 
          y: 0, 
          opacity: 1, 
          height: "auto", 
          ease: "power2.out"
        }
      );
    }
  };

  const handlePurchase = (price) => {
    if (money >= price) {
      setMoney(m => m - price);
    } else {
      setMoney(m => m); // No change if insufficient funds
    }
  };

  const isCategoryActive = (category) => activeCategories.includes(category);

  return (
    <div className="container-fluid d-flex flex-column align-items-center min-vh-100 p-3">
      {/* Display remaining money */}
      <div className="position-absolute start-0 m-3 bg-success bg-opacity-25 p-2 rounded border border-success">
        <span className="fw-bold">£{money.toLocaleString()}</span>
      </div>

      {/* Display budget data */}
      <div className="text-center mt-4 mb-4">
        <h1 className="fw-bold">Retirement Store</h1>
        <p className="text-secondary">Spend your pension money</p>
        {processedBudgetData && (
          <div className="mb-3">
            <p><strong>Budget Breakdown:</strong></p>
            <p>Wants: {processedBudgetData.Wants}%</p>
            <p>Needs: {processedBudgetData.Needs}%</p>
            <p>Savings: {processedBudgetData.Savings}%</p>
          </div>
        )}
      </div>

      {/* Shop grid container */}
      <div className="w-100" style={{ maxWidth: "900px" }}>
        {/* Categories row */}
        <div className="row g-0">
          {categories.map((category, i) => (
            <div key={i} className="col text-center">
              <div 
                className={`card rounded-0 border-end-0 h-100 ${
                  isCategoryActive(category) ? 'bg-primary text-white' : 'bg-white'
                }`}
                style={{ cursor: "pointer" }}
                onClick={() => handleCategoryClick(category)}
              >
                <div className="card-body py-3">
                  <h5 className="card-title m-0">{category}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shop Items */}
        <div className="row g-0">
          {categories.map((category, i) => (
            <div key={i} className="col">
              <div 
                ref={el => itemRefs.current[category] = el}
                className="overflow-hidden"
                style={{ 
                  height: isCategoryActive(category) ? 'auto' : 0,
                }}
              >
                <div className="d-flex flex-column gap-2 p-2">
                  {items[category]?.map((item, i) => (
                    <div 
                      key={i}
                      className="card rounded-0 text-center"
                      style={{ cursor: "pointer" }}
                      onClick={() => handlePurchase(item.price)}
                    >
                      <div className="card-body p-2">
                        <h6 className="card-title mb-1">{item.name}</h6>
                        <p className="card-text text-success mb-0">£{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* End screen button */}
      <button
        onClick={handleGoToEndScreen}
        className="btn btn-primary mt-auto mb-4"
      >
        Go to End Screen
      </button>
    </div>
  );
}

export default EndShop;