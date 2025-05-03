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
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
        {errors.name && <small className="text-danger">{errors.name}</small>}
      </div>
      <div>
        <label>Username:</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} />
        {errors.username && <small className="text-danger">{errors.username}</small>}
      </div>
      <div>
        <label>Age:</label>
        <input type="number" name="age" value={formData.age} onChange={handleChange} />
        {errors.age && <small className="text-danger">{errors.age}</small>}
      </div>
      <div>
        <label>Location:</label>
        <input type="text" name="location" value={formData.location} onChange={handleChange} />
        {errors.location && <small className="text-danger">{errors.location}</small>}
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="full_time_education"
            checked={formData.full_time_education}
            onChange={handleChange}
          />
          Full Time Education
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
