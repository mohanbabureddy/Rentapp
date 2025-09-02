import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:8080/api/tenants';

const styles = {
  container: {
    maxWidth: '1000px',
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
    fontWeight: 'bold',
  },
  tableWrapper: { overflowX: 'auto' },
  table: {
    width: '100%',
    minWidth: '700px',
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
    minWidth: '80px',
    textAlign: 'center',
  },
  td: { padding: '10px', textAlign: 'center' },
  input: {
    padding: '6px',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    fontSize: '15px',
    maxWidth: '140px',
  },
  btn: {
    marginRight: '6px',
    padding: '8px 16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderRadius: '6px',
    border: 'none',
  },
  btnPrimary: { background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)', color: '#fff' },
  btnSecondary: { background: '#f1f5f9', color: '#2563eb', border: '1px solid #2563eb' },
  error: { color: 'red', textAlign: 'center', margin: '12px 0' },
  loading: { textAlign: 'center', margin: '12px 0' },
};

export default function AdminPaidBillsReport() {
  const navigate = useNavigate();
  const [month, setMonth] = useState('');
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totals, setTotals] = useState({ rent: 0, water: 0, electricity: 0 });

  // Auth guard: only ADMIN
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) return navigate('/login', { replace: true });
    const { role } = JSON.parse(stored);
    if (role !== 'ADMIN') navigate('/', { replace: true });
  }, [navigate]);

  const fetchReport = async () => {
    if (!month) return alert('Select a month');
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_BASE}/paid-bills/${month}`);
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      setBills(data);
      const agg = data.reduce((acc, b) => {
        acc.rent += Number(b.rent) || 0;
        acc.water += Number(b.water) || 0;
        acc.electricity += Number(b.electricity) || 0;
        return acc;
      }, { rent:0, water:0, electricity:0 });
      setTotals(agg);
    } catch (e) {
      console.error(e);
      setError('Unable to load report');
    } finally { setLoading(false); }
  };

  const exportCsv = () => {
    if (!bills.length) return alert('No data to export');
    const header = ['ID','Tenant','Month','Rent','Water','Electricity','Total'];
    const rows = bills.map(b => [b.id, b.tenantName, b.monthYear, b.rent, b.water, b.electricity, (Number(b.rent)||0)+(Number(b.water)||0)+(Number(b.electricity)||0)]);
    const footer = ['', '', 'Totals', totals.rent, totals.water, totals.electricity, totals.rent + totals.water + totals.electricity];
    const csv = [header, ...rows, footer].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paid-bills-${month}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Paid Bills Monthly Report</h2>
      {error && <div style={styles.error}>{error}</div>}
      {loading && <div style={styles.loading}>Loading...</div>}

      <div style={{ display:'flex', flexWrap:'wrap', gap:16, marginBottom:24, alignItems:'flex-end' }}>
        <div style={{ display:'flex', flexDirection:'column' }}>
          <label style={{ fontSize:13, fontWeight:600, color:'#334155', marginBottom:4 }}>Month</label>
          <input type="month" value={month} onChange={e=>setMonth(e.target.value)} style={{ ...styles.input, width:170 }} />
        </div>
        <button onClick={fetchReport} disabled={!month || loading} style={{ ...styles.btn, ...styles.btnPrimary }}>Fetch Report</button>
        <button onClick={() => { setBills([]); setTotals({ rent:0, water:0, electricity:0 }); setMonth(''); }} disabled={loading} style={{ ...styles.btn, ...styles.btnSecondary }}>Clear</button>
        <button onClick={exportCsv} disabled={!bills.length} style={{ ...styles.btn, background:'#16a34a', color:'#fff' }}>Export CSV</button>
        {bills.length > 0 && (
          <div style={{ fontSize:14, fontWeight:600, color:'#0f172a' }}>
            Totals ➜ Rent: {totals.rent} | Water: {totals.water} | Electricity: {totals.electricity} | Grand: {totals.rent + totals.water + totals.electricity}
          </div>
        )}
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              {['ID','Tenant','Month','Rent','Water','Electricity','Total'].map((h,i)=>(<th key={i} style={styles.th}>{h}</th>))}
            </tr>
          </thead>
          <tbody>
            {(!bills.length && !loading) && (
              <tr><td colSpan={7} style={{ ...styles.td, padding:24, fontStyle:'italic', color:'#64748b' }}>No data</td></tr>
            )}
            {bills.map((b, idx) => {
              const total = (Number(b.rent)||0)+(Number(b.water)||0)+(Number(b.electricity)||0);
              return (
                <tr key={b.id} style={{ background: idx % 2 === 0 ? '#f1f5f9' : '#fff', borderBottom:'1px solid #e2e8f0' }}>
                  <td style={styles.td}>{b.id}</td>
                  <td style={styles.td}>{b.tenantName}</td>
                  <td style={styles.td}>{b.monthYear}</td>
                  <td style={styles.td}>{b.rent}</td>
                  <td style={styles.td}>{b.water}</td>
                  <td style={styles.td}>{b.electricity}</td>
                  <td style={styles.td}>{total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
