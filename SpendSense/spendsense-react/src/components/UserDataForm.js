import React, { useState } from 'react';
import axios from 'axios';

function UserDataForm({ onSubmit, onSkip }) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    age: '',
    location: '',
    full_time_education: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.age.trim()) newErrors.age = 'Age is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Pass formData to App.js
    if (onSubmit) {
      onSubmit(formData);
    }
  };

    return (
      <>
        <form onSubmit={handleSubmit} className="user-form">
          <div>
            <label htmlFor="name">Name:</label>
            <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} data-testid="name-input" />
            {errors.name && <small className="text-danger" data-testid="name-error">{errors.name}</small>}
          </div>
    
          <div>
            <label htmlFor="username">Username:</label>
            <input id="username" type="text" name="username" value={formData.username} onChange={handleChange} data-testid="username-input" />
            {errors.username && <small className="text-danger" data-testid="username-error">{errors.username}</small>}
          </div>
    
          <div>
            <label htmlFor="age">Age:</label>
            <input id="age" type="number" name="age" value={formData.age} onChange={handleChange} data-testid="age-input" />
            {errors.age && <small className="text-danger" data-testid="age-error">{errors.age}</small>}
          </div>
    
          <div>
            <label htmlFor="location">Location:</label>
            <input id="location" type="text" name="location" value={formData.location} onChange={handleChange} data-testid="location-input" />
            {errors.location && <small className="text-danger" data-testid="location-error">{errors.location}</small>}
          </div>
    
          <div>
  <label>Are you currently in a full-time education?</label>
  
  <label>
    <input
      type="radio"
      className="nes-radio"
      name="education_status"
      value="yes"
      checked={formData.full_time_education === true}
      onChange={() => setFormData({ ...formData, full_time_education: true })}
    />
    <span>Yes</span>
  </label>

  <label>
    <input
      type="radio"
      className="nes-radio"
      name="education_status"
      value="no"
      checked={formData.full_time_education === false}
      onChange={() => setFormData({ ...formData, full_time_education: false })}
    />
      <span>No</span>
    </label>
  </div>
          <div className="submit-button-wrapper">
            <button type="submit">Submit</button>
          </div>
        </form>
    
        <div className="skip-button-wrapper">
          <button type="button" onClick={onSkip} className="btn btn-secondary">
            Skip
          </button>
        </div>
      </>
    );   
}

export default UserDataForm;
