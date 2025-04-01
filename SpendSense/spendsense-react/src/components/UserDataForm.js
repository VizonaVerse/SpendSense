import React, { useState } from 'react';
import axios from 'axios';

function UserDataForm({ onSubmit, onSkip }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    location: '',
    full_time_education: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:8000/api/userform/',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Form submitted successfully:', response.data);
      if (onSubmit) {
        onSubmit();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
      </div>
      <div>
        <label>Age:</label>
        <input type="number" name="age" value={formData.age} onChange={handleChange} />
      </div>
      <div>
        <label>Location:</label>
        <input type="text" name="location" value={formData.location} onChange={handleChange} />
      </div>
      <div>
        <label>
          Full Time Education:
          <input type="checkbox" name="full_time_education" checked={formData.full_time_education} onChange={handleChange} />
        </label>
      </div>
      <div className="form-buttons">
        <button type="submit">Submit</button>
        <button type="button" onClick={onSkip} className="btn btn-secondary">
          Skip
        </button>
      </div>
    </form>
  );
}

export default UserDataForm;