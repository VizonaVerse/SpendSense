import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import "../App.css";
import "../App.js";

const categories = ["Phone", "Car", "House", "Leisure"];

const defaultItems = {
  Phone: [
    { name: "iPhone 16 Pro", price: 1000 },
    { name: "Samsung S25", price: 750 },
    { name: "Nokia", price: 80 }
  ],
  Car: [
    { name: "BMW X5", price: 70000 },
    { name: "Volvo", price: 18000 },
    { name: "VW Polo", price: 2000 }
  ],
  House: [],
  Leisure: [
    { name: "Headphones", price: 200 },
    { name: "Shoes", price: 100 },
    { name: "Skateboard", price: 50 }
  ]
};

async function fetchHousePrices() {
  const regionCodes = [
    "REGION^87490", // London
    "REGION^93917", // Manchester
    "REGION^94846", // Birmingham
    "REGION^109875", // Bristol
    "REGION^115084", // Leeds
  ];

  const shuffledRegions = regionCodes.sort(() => 0.5 - Math.random());
  const allHouses = [];

  for (const region of shuffledRegions) {
    const url = `https://uk-real-estate-rightmove.p.rapidapi.com/properties/search-sale?identifier=${region}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'd71124e312mshffd5539591ef548p1ecdb2jsn3c4fb844471d',
        'x-rapidapi-host': 'uk-real-estate-rightmove.p.rapidapi.com'
      }
    };

    try {
      const res = await fetch(url, options);
      const text = await res.text();
      if (!text) continue;

      const data = JSON.parse(text);
      const listings = data?.data?.properties || [];

      const formatted = listings
        .filter(p => p.price && p.address)
        .map(p => ({
          name: p.address,
          price: p.price
        }));

      allHouses.push(...formatted);

      if (allHouses.length >= 50) break;
    } catch (err) {
      console.error(`Failed fetching for region ${region}:`, err);
      continue;
    }
  }

  const getRandomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const under300k = allHouses.filter(h => h.price < 300000);
  const under600k = allHouses.filter(h => h.price >= 300000 && h.price < 600000);
  const over1M = allHouses.filter(h => h.price >= 1000000);

  return [
    getRandomFrom(under300k),
    getRandomFrom(under600k),
    getRandomFrom(over1M)
  ].filter(Boolean); 
}

function EndShop({netPay, netPay2, budgetData, handleGoToEndScreen }) { 
  const salary_savings = (netPay * 10 + netPay2 * 30 ) * budgetData.Savings/100;
  console.log("NetPay2", netPay2);
  const [activeCategories, setActiveCategories] = useState([]);
  const [money, setMoney] = useState(salary_savings);
  const [dynamicItems, setDynamicItems] = useState(defaultItems);
  const itemRefs = useRef({});

  useEffect(() => {
    async function loadHouseData() {
      const houseData = await fetchHousePrices(); 
      setDynamicItems(prev => ({
        ...prev,
        House: houseData
      }));
    }
  
    loadHouseData();
  }, []);
        
  const handleCategoryClick = (category) => {
    const itemElement = itemRefs.current[category];
    if (!itemElement) return;

    if (activeCategories.includes(category)) {
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
    }
  };

  const isCategoryActive = (category) => activeCategories.includes(category);

  return (

    <div className="container-fluid d-flex flex-column align-items-center min-vh-100 p-3">
    <div className="position-absolute start-0 m-3 bg-success bg-opacity-25 p-2 rounded border border-success">
        <span className="fw-bold">£{money.toLocaleString()}</span>
      </div>
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

      <div className="w-100" style={{ maxWidth: "900px" }}>
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

        <div className="row g-0">
          {categories.map((category, i) => (
            <div key={i} className="col">
              <div
                ref={el => itemRefs.current[category] = el}
                className="overflow-hidden"
                style={{ height: isCategoryActive(category) ? 'auto' : 0 }}
              >
                <div className="d-flex flex-column gap-2 p-2">
                  {dynamicItems[category]?.map((item, i) => (
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


