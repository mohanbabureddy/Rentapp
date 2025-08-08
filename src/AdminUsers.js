import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:8080/api/users';

const styles = {
  container: {
    maxWidth: '900px',
    margin: '40px auto',
    padding: '32px',
    background: '#f8fafc',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
  header: {
    color: '#2563eb',
    textAlign: 'center',
    marginBottom: '24px',
    letterSpacing: '1px',
  },
  card: {
    marginBottom: '32px',
    padding: '20px',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  input: {
    marginRight: '10px',
    padding: '8px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '15px',
  },
  btnPrimary: {
    background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 18px',
    fontWeight: 'bold',
    fontSize: '15px',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  th: {
    padding: '12px',
    background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)',
    color: '#fff',
  },
  td: {
    padding: '10px',
    textAlign: 'center',
  },
  actionBtn: {
    borderRadius: '4px',
    padding: '6px 14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginRight: '6px',
  },
  actionsCol: {
    width: '180px',
    minWidth: '180px',
    maxWidth: '180px',
  },
};

function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: '' });
  const [editId, setEditId] = useState(null);
  const [editUser, setEditUser] = useState({ username: '', password: '', role: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auth guard: must be ADMIN
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) return navigate('/login', { replace: true });
    const { role } = JSON.parse(stored);
    if (role !== 'ADMIN') navigate('/', { replace: true });
  }, [navigate]);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/all`);
      if (!res.ok) throw new Error('Failed to fetch users');
      setUsers(await res.json());
    } catch (err) {
      console.error(err);
      setError('Unable to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handlers
  const handleAddChange = e => {
    setNewUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.password || !newUser.role) {
      return alert('All fields are required to add a user');
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (!res.ok) throw new Error('Add failed');
      setNewUser({ username: '', password: '', role: '' });
      await fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Error adding user');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = user => {
    setEditId(user.id);
    setEditUser({ username: user.username, password: user.password, role: user.role });
  };

  const handleEditChange = e => {
    setEditUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateUser = async () => {
    if (!editUser.username || !editUser.password || !editUser.role) {
      return alert('All fields are required to update');
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/update/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editUser),
      });
      if (!res.ok) throw new Error('Update failed');
      setEditId(null);
      await fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Error updating user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/delete/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Error deleting user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>User Management</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <div style={styles.card}>
        <h4 style={{ color: '#2563eb', marginBottom: '16px' }}>Add New User</h4>
        <input
          name="username"
          placeholder="Username"
          value={newUser.username}
          onChange={handleAddChange}
          style={styles.input}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={handleAddChange}
          style={styles.input}
        />
        <input
          name="role"
          placeholder="Role"
          value={newUser.role}
          onChange={handleAddChange}
          style={styles.input}
        />
        <button disabled={loading} onClick={handleAddUser} style={styles.btnPrimary}>
          {loading ? 'Please wait…' : 'Add'}
        </button>
      </div>

      {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}

      <h4 style={{ color: '#2563eb', marginBottom: '16px' }}>Existing Users</h4>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Password</th>
            <th style={styles.th}>Role</th>
            <th style={{ ...styles.th, ...styles.actionsCol }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, idx) => (
            <tr
              key={u.id}
              style={{
                background: idx % 2 === 0 ? '#f1f5f9' : '#fff',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <td style={styles.td}>{u.id}</td>

              <td style={styles.td}>
                {editId === u.id ? (
                  <input
                    name="username"
                    value={editUser.username}
                    onChange={handleEditChange}
                    style={styles.input}
                  />
                ) : (
                  u.username
                )}
              </td>

              <td style={styles.td}>
                {editId === u.id ? (
                  <input
                    name="password"
                    type="password"
                    value={editUser.password}
                    onChange={handleEditChange}
                    style={styles.input}
                  />
                ) : (
                  '••••••••'
                )}
              </td>

              <td style={styles.td}>
                {editId === u.id ? (
                  <input
                    name="role"
                    value={editUser.role}
                    onChange={handleEditChange}
                    style={styles.input}
                  />
                ) : (
                  u.role
                )}
              </td>

              <td style={{ ...styles.td, ...styles.actionsCol }}>
                {editId === u.id ? (
                  <>
                    <button
                      onClick={handleUpdateUser}
                      style={{ ...styles.actionBtn, background: '#2563eb', color: '#fff' }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      style={{
                        ...styles.actionBtn,
                        background: '#f1f5f9',
                        color: '#2563eb',
                        border: '1px solid #2563eb',
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(u)}
                      style={{ ...styles.actionBtn, background: '#38bdf8', color: '#fff' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      style={{ ...styles.actionBtn, background: '#ef4444', color: '#fff' }}
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