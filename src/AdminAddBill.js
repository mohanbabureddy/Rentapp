import React, { useState } from 'react';

const AdminAddBill = () => {
  const [formData, setFormData] = useState({
    tenantName: '',
    monthYear: '',
    rent: '',
    water: '',
    electricity: '',
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:8080/api/tenants/addBill', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(formData),
    });
    alert('Bill added!');
  };

  return (
    <div>
      <h2>Add Bill</h2>
      <form onSubmit={handleSubmit}>
        <input name="tenantName" placeholder="Tenant Name" onChange={handleChange} />
        <input name="monthYear" placeholder="Month-Year" onChange={handleChange} />
        <input name="rent" placeholder="Rent" onChange={handleChange} />
        <input name="water" placeholder="Water Bill" onChange={handleChange} />
        <input name="electricity" placeholder="Electricity Bill" onChange={handleChange} />
        <button type="submit">Add Bill</button>
      </form>
    </div>
  );
};

export default AdminAddBill;
