import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TenantBills from './TenantBills';
import AdminAddBill from './AdminAddBill';
import AdminUsers from './AdminUsers';
import AdminViewBills from './AdminViewBills';
import Login from './Login';

function App() {
  const [user, setUser] = useState(null); // 👈 holds { username, role }

  return (
    <Router>
      {!user ? (
        <Routes>
          <Route path="*" element={<Login setUser={setUser} />} />
        </Routes>
      ) : (
        <div
          style={{
            maxWidth: '1100px',
            margin: '40px auto',
            padding: '32px',
            background: '#f8fafc',
            borderRadius: '16px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            <div style={{ fontWeight: 'bold', color: '#2563eb', fontSize: '20px', letterSpacing: '1px' }}>
              Rent Management
            </div>
            <div>
              Logged in as: <strong>{user.username}</strong> ({user.role})
              <button
                style={{
                  marginLeft: '16px',
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
                onClick={() => setUser(null)}
              >
                Logout
              </button>
            </div>
          </div>

          <nav
            style={{
              marginBottom: '32px',
              padding: '12px 0',
              background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            {user.role === "ADMIN" && (
              <>
                <Link
                  to="/admin/add-bill"
                  style={{
                    color: '#fff',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    margin: '0 18px',
                    fontSize: '16px',
                    letterSpacing: '1px',
                  }}
                >
                  Add Bill
                </Link>
                <Link
                  to="/admin/view-bills"
                  style={{
                    color: '#fff',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    margin: '0 18px',
                    fontSize: '16px',
                    letterSpacing: '1px',
                  }}
                >
                  View Bills
                </Link>
                <Link
                  to="/admin/users"
                  style={{
                    color: '#fff',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    margin: '0 18px',
                    fontSize: '16px',
                    letterSpacing: '1px',
                  }}
                >
                  Manage Users
                </Link>
              </>
            )}
            {user.role !== "ADMIN" && (
              <Link
                to="/"
                style={{
                  color: '#fff',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  margin: '0 18px',
                  fontSize: '16px',
                  letterSpacing: '1px',
                }}
              >
                My Bills
              </Link>
            )}
          </nav>

          <Routes>
            <Route path="/" element={<TenantBills username={user.username} />} />
            {user.role === "ADMIN" && (
              <>
                <Route path="/admin/add-bill" element={<AdminAddBill />} />
                <Route path="/admin/view-bills" element={<AdminViewBills />} />
                <Route path="/admin/users" element={<AdminUsers />} />
              </>
            )}
          </Routes>
        </div>
      )}
    </Router>
  );
}

export default App;

