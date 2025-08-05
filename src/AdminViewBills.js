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
  <div
    style={{
      maxWidth: '1000px',
      margin: '40px auto',
      padding: '32px',
      background: '#f8fafc',
      borderRadius: '16px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    }}
  >
    <h2
      style={{
        color: '#2563eb',
        textAlign: 'center',
        marginBottom: '24px',
        letterSpacing: '1px',
      }}
    >
      All Tenant Bills
    </h2>
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: '#fff',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          minWidth: '800px'
        }}
      >
        <thead>
          <tr style={{ background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)', color: '#fff' }}>
            <th style={{ padding: '12px', minWidth: '60px' }}>ID</th>
            <th style={{ padding: '12px', minWidth: '140px' }}>Tenant Name</th>
            <th style={{ padding: '12px', minWidth: '120px' }}>Year - Month</th>
            <th style={{ padding: '12px', minWidth: '80px' }}>Rent</th>
            <th style={{ padding: '12px', minWidth: '80px' }}>Water</th>
            <th style={{ padding: '12px', minWidth: '110px' }}>Electricity</th>
            <th style={{ padding: '12px', minWidth: '70px' }}>Paid</th>
            <th style={{ padding: '12px', minWidth: '140px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((b, idx) => (
            <tr
              key={b.id}
              style={{
                background: idx % 2 === 0 ? '#f1f5f9' : '#fff',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <td style={{ padding: '10px', textAlign: 'center' }}>{b.id}</td>
              <td style={{ padding: '10px' }}>
                {editId === b.id ? (
                  <input
                    name="tenantName"
                    value={editForm.tenantName}
                    onChange={handleChange}
                    style={{
                      padding: '6px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      fontSize: '15px',
                      maxWidth: '120px',
                    }}
                  />
                ) : (
                  b.tenantName
                )}
              </td>
              <td style={{ padding: '10px' }}>
                {editId === b.id ? (
                  <input
                    name="monthYear"
                    value={editForm.monthYear}
                    onChange={handleChange}
                    style={{
                      padding: '6px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      fontSize: '15px',
                      maxWidth: '100px',
                    }}
                  />
                ) : (
                  b.monthYear
                )}
              </td>
              <td style={{ padding: '10px' }}>
                {editId === b.id ? (
                  <input
                    name="rent"
                    value={editForm.rent}
                    onChange={handleChange}
                    style={{
                      padding: '6px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      fontSize: '15px',
                      maxWidth: '70px',
                    }}
                  />
                ) : (
                  b.rent
                )}
              </td>
              <td style={{ padding: '10px' }}>
                {editId === b.id ? (
                  <input
                    name="water"
                    value={editForm.water}
                    onChange={handleChange}
                    style={{
                      padding: '6px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      fontSize: '15px',
                      maxWidth: '70px',
                    }}
                  />
                ) : (
                  b.water
                )}
              </td>
              <td style={{ padding: '10px' }}>
                {editId === b.id ? (
                  <input
                    name="electricity"
                    value={editForm.electricity}
                    onChange={handleChange}
                    style={{
                      padding: '6px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      fontSize: '15px',
                      maxWidth: '90px',
                    }}
                  />
                ) : (
                  b.electricity
                )}
              </td>
              <td style={{ padding: '10px', textAlign: 'center', fontSize: '18px' }}>
                {b.paid ? (
                  <span style={{ color: '#22c55e' }}>✅</span>
                ) : (
                  <span style={{ color: '#ef4444' }}>❌</span>
                )}
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                {editId === b.id ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      style={{
                        background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '6px 14px',
                        marginRight: '6px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      style={{
                        background: '#f1f5f9',
                        color: '#2563eb',
                        border: '1px solid #2563eb',
                        borderRadius: '4px',
                        padding: '6px 14px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(b)}
                      style={{
                        background: '#38bdf8',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '6px 14px',
                        marginRight: '6px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      style={{
                        background: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '6px 14px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
}

export default AdminViewBills;
