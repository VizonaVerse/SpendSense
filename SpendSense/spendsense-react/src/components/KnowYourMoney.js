import React from 'react';
import { useNavigate } from "react-router-dom";

const KnowYourMoney = () => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate("/");
    }
    return (
        <div className="page" style={{ padding: '2rem', fontFamily: '"Press Start 2P", cursive' }}>
        <button
            onClick={handleBackClick}
            style={{
                padding: '10px 20px',
                marginBottom: '20px',
                backgroundColor: 'black',
                color: 'white',
                border: '2px solid white',
                fontSize: '12px',
                cursor: 'pointer',
                imageRendering: 'pixelated'
            }}
        >
            ← Back to Game
        </button>
        
            <h1> Know Your Money</h1>
            <p>Wlecome to your guide for understnading your finances</p>

            <section>
                <h2> Budgeting</h2>
                <p>How split your income between needs, wants and savings.</p>
            </section>

            <section> 
                <h2> Payslips</h2>
                <p>Understand the different components in the payslip</p>
            </section>

            <section>
                <h2> Pensions</h2>
                <p>Plan for retirement</p>
            </section>?
        </div>
    )
}

export default KnowYourMoney;