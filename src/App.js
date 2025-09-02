import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TenantBills from './TenantBills';
import TenantComplaints from './TenantComplaints';
import TenantOccupants from './TenantOccupants';
import AdminAddBill from './AdminAddBill';
import AdminUsers from './AdminUsers';
import AdminViewBills from './AdminViewBills';
import AdminPaidBillsReport from './AdminPaidBillsReport';
import AdminComplaints from './AdminComplaints';
import AdminOccupants from './AdminOccupants';
import Login from './Login';
import Registration from './Registration';
import ForgotReset from './ForgotReset';

function App() {
  const [user, setUser] = useState(null);
  const timerRef = useRef(null);

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    clearTimeout(timerRef.current);
  };

  // Inactivity auto-logout logic
  useEffect(() => {
    if (!user) return;

    const logoutAfterInactivity = () => {
      handleLogout();
      alert('You have been logged out due to inactivity.');
    };

    const resetTimer = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(logoutAfterInactivity, 5 * 60 * 1000); // 5 minutes
    };

    // List of events that indicate activity
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];

    events.forEach(event =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer(); // Start timer on mount

    return () => {
      clearTimeout(timerRef.current);
      events.forEach(event =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, [user]);

  return (
    <Router>
      {!user ? (
        <Routes>
          <Route path="/register" element={<Registration />} />
          <Route path="/forgot" element={<ForgotReset />} />
          <Route path="*" element={
            <Login setUser={(u)=>{ setUser(u); localStorage.setItem('user',JSON.stringify(u)); }} />
          } />
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
                onClick={handleLogout}
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
            {user.role === "ADMIN" ? (
              <>
                <Link to="/admin/add-bill" style={navLinkStyle}>Add Bill</Link>
                <Link to="/admin/view-bills" style={navLinkStyle}>View Bills</Link>
                <Link to="/admin/users" style={navLinkStyle}>Manage Users</Link>
                <Link to="/admin/paid-report" style={navLinkStyle}>Paid Report</Link>
                <Link to="/admin/complaints" style={navLinkStyle}>Complaints</Link>
                <Link to="/admin/occupants" style={navLinkStyle}>Occupants</Link>
              </>
            ) : (
              <>
                <Link to="/" style={navLinkStyle}>My Bills</Link>
                <Link to="/complaints" style={navLinkStyle}>Complaints</Link>
                <Link to="/occupants" style={navLinkStyle}>Occupants</Link>
              </>
            )}
          </nav>

          <Routes>
            <Route path="/" element={<TenantBills username={user.username} />} />
            <Route path="/complaints" element={<TenantComplaints username={user.username} />} />
            <Route path="/occupants" element={<TenantOccupants username={user.username} />} />
            {user.role === "ADMIN" && (
              <>
                <Route path="/admin/add-bill" element={<AdminAddBill />} />
                <Route path="/admin/view-bills" element={<AdminViewBills />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/paid-report" element={<AdminPaidBillsReport />} />
                <Route path="/admin/complaints" element={<AdminComplaints />} />
                <Route path="/admin/occupants" element={<AdminOccupants />} />
              </>
            )}
          </Routes>
        </div>
      )}
    </Router>
  );
}

// Reusable link style
const navLinkStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 'bold',
  margin: '0 18px',
  fontSize: '16px',
  letterSpacing: '1px',
};

export default App;