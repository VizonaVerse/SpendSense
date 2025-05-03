import React, { useState } from 'react';
import axios from 'axios';

function Leaderboard({ onSubmit, onSkip }) {

    useEffect(() => {
        async function fetchPeopleData() {
            const url = 'http://localhost:8000/api/userdata/?key=owjYqZHGuOkkgh4msnV9xD3aij9zs6YmKbGU7bYXO7k=';
            const response = await fetch(url);
            const data = await response.json();
        }
    }, []);
    return (
        <div className="section-content text-center">
            <h2>Leaderboard goes here</h2>
        </div>
    );
}
export default Leaderboard;