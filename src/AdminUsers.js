import React, { useState, useEffect } from 'react';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: '' });
  const [editId, setEditId] = useState(null);
  const [editUser, setEditUser] = useState({ username: '', password: '', role: '' });

  const fetchUsers = () => {
    fetch('http://localhost:8080/api/users/all')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Fetch error", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = async () => {
    await fetch('http://localhost:8080/api/users/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });
    setNewUser({ username: '', password: '', role: '' });
    fetchUsers();
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setEditUser({ username: user.username, password: user.password, role: user.role });
  };

  const handleEditChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleUpdateUser = async () => {
    await fetch(`http://localhost:8080/api/users/update/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editUser)
    });
    setEditId(null);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure to delete this user?')) {
      await fetch(`http://localhost:8080/api/users/delete/${id}`, {
        method: 'DELETE'
      });
      fetchUsers();
    }
  };

  return (
  <div
    style={{
      maxWidth: '900px',
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
      User Management
    </h2>

    <div
      style={{
        marginBottom: '32px',
        padding: '20px',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <h4 style={{ color: '#2563eb', marginBottom: '16px' }}>Add New User</h4>
      <input
        name="username"
        placeholder="Username"
        value={newUser.username}
        onChange={handleAddChange}
        style={{
          marginRight: '10px',
          padding: '8px',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          fontSize: '15px',
        }}
      />
      <input
        name="password"
        placeholder="Password"
        value={newUser.password}
        onChange={handleAddChange}
        style={{
          marginRight: '10px',
          padding: '8px',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          fontSize: '15px',
        }}
      />
      <input
        name="role"
        placeholder="Role"
        value={newUser.role}
        onChange={handleAddChange}
        style={{
          marginRight: '10px',
          padding: '8px',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          fontSize: '15px',
        }}
      />
      <button
        onClick={handleAddUser}
        style={{
          background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          padding: '8px 18px',
          fontWeight: 'bold',
          fontSize: '15px',
          cursor: 'pointer',
        }}
      >
        Add
      </button>
    </div>

    <h4 style={{ color: '#2563eb', marginBottom: '16px' }}>Existing Users</h4>
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        background: '#fff',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <thead>
        <tr style={{ background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)', color: '#fff' }}>
          <th style={{ padding: '12px' }}>ID</th>
          <th style={{ padding: '12px' }}>Username</th>
          <th style={{ padding: '12px' }}>Password</th>
          <th style={{ padding: '12px' }}>Role</th>
          <th style={{ padding: '12px' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, idx) => (
          <tr
            key={user.id}
            style={{
              background: idx % 2 === 0 ? '#f1f5f9' : '#fff',
              borderBottom: '1px solid #e2e8f0',
            }}
          >
            <td style={{ padding: '10px', textAlign: 'center' }}>{user.id}</td>
            <td style={{ padding: '10px' }}>
              {editId === user.id ? (
                <input
                  name="username"
                  value={editUser.username}
                  onChange={handleEditChange}
                  style={{
                    padding: '6px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    fontSize: '15px',
                  }}
                />
              ) : (
                user.username
              )}
            </td>
            <td style={{ padding: '10px' }}>
              {editId === user.id ? (
                <input
                  name="password"
                  value={editUser.password}
                  onChange={handleEditChange}
                  style={{
                    padding: '6px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    fontSize: '15px',
                  }}
                />
              ) : (
                user.password
              )}
            </td>
            <td style={{ padding: '10px' }}>
              {editId === user.id ? (
                <input
                  name="role"
                  value={editUser.role}
                  onChange={handleEditChange}
                  style={{
                    padding: '6px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    fontSize: '15px',
                  }}
                />
              ) : (
                user.role
              )}
            </td>
            <td style={{ padding: '10px', textAlign: 'center' }}>
              {editId === user.id ? (
                <>
                  <button
                    onClick={handleUpdateUser}
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
                    onClick={() => handleEdit(user)}
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
                    onClick={() => handleDelete(user.id)}
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
);
}

export default AdminUsers;
