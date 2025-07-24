import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TenantBills from './TenantBills';
import AdminAddBill from './AdminAddBill';
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
        <div style={{ padding: "10px" }}>
          <div style={{ marginBottom: "10px" }}>
            Logged in as: <strong>{user.username}</strong> ({user.role})
            <button style={{ marginLeft: "10px" }} onClick={() => setUser(null)}>Logout</button>
          </div>

          <nav>
            
            {user.role === "ADMIN" && (
              <>
                {" | "}
                <Link to="/admin/add-bill">Add Bill</Link>
                {" | "}
                <Link to="/admin/view-bills">View Bills</Link>
              </>
            )}
          </nav>

          <Routes>
            <Route path="/" element={<TenantBills username={user.username} />} />
            {user.role === "ADMIN" && (
              <>
                <Route path="/admin/add-bill" element={<AdminAddBill />} />
                <Route path="/admin/view-bills" element={<AdminViewBills />} />
              </>
            )}
          </Routes>
        </div>
      )}
    </Router>
  );
}

export default App;
