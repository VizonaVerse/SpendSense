import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import "../App.css";
import "../App.js";

const categories = ["Phone", "Leisure", "Car", "House"];

const defaultItems = {
  Phone: [],
  Leisure: [],
  Car: [
    {
       name: "BMW X5", 
       price: 70000,
       image: process.env.PUBLIC_URL + "/images/bmw.jpeg"     
      },

    { name: "Volvo", 
      price: 18000, 
      image: process.env.PUBLIC_URL + "/images/volvo.jpeg"
    },

    { name: "VW Polo", 
      price: 2000,
      image: process.env.PUBLIC_URL + "/images/polo.jpeg" 
    
    }
  ],
  House: [
    { 
      name: "Small Country Cottage", 
      price: 75000, 
      image: process.env.PUBLIC_URL + "/images/cottage.jpeg"
    },

    { 
      name: "3-Bedroom Suburban Home", 
      price: 250000, 
      image: process.env.PUBLIC_URL + "/images/3-bedroom.jpg"
    },

    { name: "Luxury City Penthouse", 
      price: 750000, 
      image: process.env.PUBLIC_URL + "/images/penthouse.jpeg"
    }
  ],
};

function EndShop({ username, formData, netPay, netPay2, budgetData, handleGoToEndScreen, onMoneyChange }) {
  const salary_savings = (netPay * 10 + netPay2 * 30) * (budgetData.Savings / 100);
  const [activeCategories, setActiveCategories] = useState([]);
  const [money, setMoney] = useState(salary_savings);
  const [dynamicItems, setDynamicItems] = useState(defaultItems);
  const [loadingLeisure, setLoadingLeisure] = useState(true);
  const [loadingPhone, setLoadingPhone] = useState(true);
  const itemRefs = useRef({});

  useEffect(() => {
    let isSubmitted = false;

    const submitFormData = async () => {
      if (isSubmitted) return; // Prevent duplicate submissions
      isSubmitted = true;

      try {
        const response = await fetch('http://localhost:8000/api/userform/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error('Failed to submit form data');
        }
        console.log('Form data submitted successfully');
      } catch (error) {
        console.error('Error submitting form data:', error);
      }
    };

    if (formData.username) {
      submitFormData();
    }
  }, [formData]);

  useEffect(() => {
    if (username) {
      fetch(`http://localhost:8000/api/userdataupdate/${username}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "token": process.env.REACT_APP_API_TOKEN, //passes token to backend
        },
        body: JSON.stringify({ final_money: salary_savings }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update money");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Money updated successfully:", data);
        })
        .catch((error) => {
          console.error("Error updating money:", error);
        });
    }
  }, [money, username]);

  useEffect(() => {
    if (onMoneyChange) onMoneyChange(money);
  }, [money, onMoneyChange]);

  const fetchLeisureItems = () => {
    setLoadingLeisure(true);
    fetch('https://dummyjson.com/products?limit=30')
      .then(res => res.json())
      .then(data => {
        const leisureProducts = data.products.map(item => ({
          name: item.title,
          price: Math.round(item.price),
          image: item.thumbnail
        }));

        const lowItems = leisureProducts.filter(item => item.price > 20 && item.price < 100);
        const mediumItems = leisureProducts.filter(item => item.price >= 100 && item.price <= 500);
        const highItems = leisureProducts.filter(item => item.price > 500);

        const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];

        const randomLow = pickRandom(lowItems);
        const randomMedium = pickRandom(mediumItems);
        const randomHigh = pickRandom(highItems);

        const sortedLeisure = [randomLow, randomMedium, randomHigh].filter(Boolean);

        setDynamicItems(prev => ({
          ...prev,
          Leisure: sortedLeisure
        }));
        setLoadingLeisure(false);
      })
      .catch(err => {
        console.error('Error fetching Leisure products:', err);
        setLoadingLeisure(false);
      });
  };

  const fetchPhoneItems = () => {
    setLoadingPhone(true);
    fetch('https://dummyjson.com/products/category/smartphones')
      .then(res => res.json())
      .then(data => {
        const phoneProducts = data.products.map(item => ({
          name: item.title,
          price: Math.round(item.price),
          image: item.thumbnail
        }));

        const lowItems = phoneProducts.filter(item => item.price < 500);
        const mediumItems = phoneProducts.filter(item => item.price >= 500 && item.price <= 1000);
        const highItems = phoneProducts.filter(item => item.price > 1000);

        const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];

        const randomLow = pickRandom(lowItems);
        const randomMedium = pickRandom(mediumItems);
        const randomHigh = pickRandom(highItems);

        const sortedPhones = [randomLow, randomMedium, randomHigh].filter(Boolean);

        setDynamicItems(prev => ({
          ...prev,
          Phone: sortedPhones
        }));

        setLoadingPhone(false);
      })
      .catch(err => {
        console.error('Error fetching Phone products:', err);
        setLoadingPhone(false);
      });
  };


  const fetchDynamicItems = () => {
    fetchLeisureItems();
    fetchPhoneItems();
  };

  useEffect(() => {
    fetchDynamicItems();
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
      setMoney((m) => {
        const newMoney = m - price;
        if (onMoneyChange) onMoneyChange(newMoney);
        return newMoney;
      });
    }
  };

  const isCategoryActive = (category) => activeCategories.includes(category);

  return (
    <div className="end-shop-section">
      <div className="shop-card d-flex flex-column align-items-center">
        {/* Header */}
        <div className="w-100 text-center mb-2">
          <h2 className="fw-bold">Retirement Game Store</h2>
          <p className="text-secondary mb-1">Spend your pension money</p>
          <h5 className="text-success fw-bold mb-1">Wallet: £{money.toLocaleString()}</h5>

          {budgetData && (
            <div className="small mb-2">
              <p className="mb-0">
                <strong>Budget:</strong> Wants {budgetData.Wants}%, Needs {budgetData.Needs}%, Savings {budgetData.Savings}%
              </p>
            </div>
          )}

          <button onClick={fetchDynamicItems} className="btn btn-outline-primary btn-sm mb-2">
            🔄 Reroll Items
          </button>
        </div>

        {/* Category Tabs */}
        <div className="d-flex justify-content-center flex-wrap gap-2 mb-3">
          {categories.map((category, i) => (
            <button
              key={i}
              className={`btn ${isCategoryActive(category) ? 'btn-primary' : 'btn-outline-primary'} px-4 py-2 rounded-pill`}
              onClick={() => handleCategoryClick(category)}
              style={{ fontSize: "0.8rem" }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Items Area */}
        <div className="items-area w-100" style={{ maxWidth: "1100px" }}>
          {categories.map((category, i) => (
            <div
              key={i}
              ref={el => itemRefs.current[category] = el}
              className="overflow-hidden mb-5"
              style={{ display: isCategoryActive(category) ? 'block' : 'none' }}
            >
              <div className="row g-4 m-0">
                {((category === "Leisure" && loadingLeisure) || (category === "Phone" && loadingPhone)) ? (
                  <div className="text-center w-100">Loading...</div>
                ) : (
                  dynamicItems[category]?.map((item, idx) => (
                    <div key={idx} className="col-12 col-sm-6 col-md-4">
                      <div
                        className="card h-100 shadow-sm border-0 d-flex flex-column p-2"
                        style={{ cursor: "pointer", maxHeight: "200px" }} 
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="card-img-top"
                            style={{
                              objectFit: "contain",
                              maxHeight: "100px", 
                              width: "100%",
                            }}
                          />
                        )}
                        <div className="card-body d-flex flex-column justify-content-between p-2 flex-grow-1">
                          <div>
                            <h6
                              className="card-title mb-1"
                              style={{
                                fontSize: "0.9rem",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              <span title={item.name}>{item.name}</span>
                            </h6>
                            <p className="card-text text-success fw-bold" style={{ fontSize: "0.85rem" }}>
                              £{item.price.toLocaleString()}
                            </p>
                          </div>
                          <button
                            className="btn btn-success btn-sm mt-2"
                            onClick={() => handlePurchase(item.price)}
                          >
                            Buy
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        {/* End Game Button */}
        <button
          onClick={handleGoToEndScreen}
          className="btn btn-danger mt-5"
          style={{ fontSize: "1.2rem", padding: "10px 30px" }}
        >
          🏁 Finish Shopping
        </button>
      </div>
    </div>
  );
}

export default EndShop;
