import React, { useEffect, useState } from 'react';

function AdminViewBills() {
  const [bills, setBills] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    tenantName: '',
    monthYear: '',
    rent: '',
    water: '',
    electricity: ''
  });

  const fetchBills = () => {
    fetch("http://localhost:8080/api/tenants/all")
      .then(res => res.json())
      .then(data => setBills(data))
      .catch(err => console.error("Fetch error", err));
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this bill?")) {
      await fetch(`http://localhost:8080/api/tenants/deleteBill/${id}`, {
        method: 'DELETE'
      });
      fetchBills();
    }
  };

  const handleEdit = (bill) => {
    setEditId(bill.id);
    setEditForm({
      tenantName: bill.tenantName,
      monthYear: bill.monthYear,
      rent: bill.rent,
      water: bill.water,
      electricity: bill.electricity
    });
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    await fetch(`http://localhost:8080/api/tenants/updateBill/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm)
    });
    setEditId(null);
    fetchBills();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>All Tenant Bills</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tenant Name</th>
            <th>Month-Year</th>
            <th>Rent</th>
            <th>Water</th>
            <th>Electricity</th>
            <th>Paid</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bills.map(b => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{editId === b.id ? <input name="tenantName" value={editForm.tenantName} onChange={handleChange} /> : b.tenantName}</td>
              <td>{editId === b.id ? <input name="monthYear" value={editForm.monthYear} onChange={handleChange} /> : b.monthYear}</td>
              <td>{editId === b.id ? <input name="rent" value={editForm.rent} onChange={handleChange} /> : b.rent}</td>
              <td>{editId === b.id ? <input name="water" value={editForm.water} onChange={handleChange} /> : b.water}</td>
              <td>{editId === b.id ? <input name="electricity" value={editForm.electricity} onChange={handleChange} /> : b.electricity}</td>
              <td>{b.paid ? "✅" : "❌"}</td>
              <td>
                {editId === b.id ? (
                  <>
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setEditId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(b)}>Edit</button>
                    <button onClick={() => handleDelete(b.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminViewBills;
