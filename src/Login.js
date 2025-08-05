import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch('http://vgrpay.uk/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      const data = await res.json();
      setUser(data); // store { username, role }
      if (data.role === 'ADMIN') {
        navigate('/admin/view-bills');
      } else {
        navigate('/');
      }
    } else {
      alert('❌ Invalid credentials');
    }
  };

  return (
  <div
    style={{
      maxWidth: '350px',
      margin: '80px auto',
      padding: '36px 28px',
      background: '#f8fafc',
      borderRadius: '16px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
      textAlign: 'center',
    }}
  >
    <h2
      style={{
        color: '#2563eb',
        marginBottom: '28px',
        letterSpacing: '1px',
        fontWeight: 'bold',
      }}
    >
      Login
    </h2>
    <input
      placeholder="Username"
      value={username}
      onChange={e => setUsername(e.target.value)}
      style={{
        width: '100%',
        padding: '12px',
        marginBottom: '16px',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        fontSize: '16px',
        background: '#fff',
      }}
    />
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={e => setPassword(e.target.value)}
      style={{
        width: '100%',
        padding: '12px',
        marginBottom: '24px',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        fontSize: '16px',
        background: '#fff',
      }}
    />
    <button
      onClick={handleLogin}
      style={{
        width: '100%',
        padding: '12px',
        background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        fontWeight: 'bold',
        fontSize: '17px',
        letterSpacing: '1px',
        cursor: 'pointer',
        transition: 'background 0.2s',
      }}
    >
      Login
    </button>
  </div>
);
}

export default Login;
