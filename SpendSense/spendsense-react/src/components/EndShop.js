import { useState, useRef } from "react";
import gsap from "gsap";
import "../App.css"; 

const categories = [
  "Phone",
  "Car",
  "House",
  "Leisure",
];

const items = {
  Phone: [
    { name: "Iphone 16 pro", price: 1000 },
    { name: "Samsung S25", price: 750 },
    { name: "Nokia", price: 80 }
  ],
  Car: [
    { name: "BMW X5", price: 70000 },
    { name: "Volvo ", price: 18000 },  
    { name: "VW Polo", price: 2000 }
  ],
  House: [
    { name: "House", price: 500000 },
    { name: "Flat", price: 250000 },
    { name: "Homeless", price: 0 }
  ], 
  Leisure: [
    { name: "Headphones", price: 200 },
    { name: "Shoes", price: 100 },
    { name: "Skateboard", price: 50 }
  ]
};

function EndShop({ salary, budgetData, handleGoToEndScreen }) { 
  const salary_savings = salary * 40 * budgetData.Savings/100;

  const [activeCategories, setActiveCategories] = useState([]);
  const [money, setMoney] = useState(salary_savings); 
  const itemRefs = useRef({});

  const handleCategoryClick = (category) => {
    
    const itemElement = itemRefs.current[category];
    
    if (!itemElement) return;
    
    if (activeCategories.includes(category)) {
      gsap.to(itemElement, {
        duration: 0.5,
        y: -8,
        // ✅ Define the handleNext function
        opacity: 0,
        height: 0,
        ease: "power2.inOut",
        onComplete: () => {
          setActiveCategories(arr => arr.filter(cat => cat !== category));
        }
      });
    } else {
      setActiveCategories(arr => [...arr, category]);
      
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
      setMoney(m => m);
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
        {budgetData && (
          <div className="mb-3">
            <p><strong>Budget Breakdown:</strong></p>
            <p>Wants: {budgetData.Wants}%</p>
            <p>Needs: {budgetData.Needs}%</p>
            <p>Savings: {budgetData.Savings}%</p>
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