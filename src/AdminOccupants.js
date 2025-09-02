import React, { useEffect, useState, useCallback } from 'react';
import { url, FETCH_CREDENTIALS } from './apiClient';

/*
  AdminOccupants
  Purpose: Allow ADMIN to view all occupants across tenants, open Aadhaar files, and mark them verified.
  Expected backend endpoints:
    GET  /api/admin/occupants -> [ { id, tenantUsername, name, aadharFileName, aadharUrl, uploadedAt, verified } ]
    PATCH /api/tenants/occupants/verify/{id} -> { status: 'ok', id, verified: true }
*/

export default function AdminOccupants() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(null);
  const [search, setSearch] = useState('');
  const [showOnlyPending, setShowOnlyPending] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch(url.adminOccupantsAll(), { credentials: FETCH_CREDENTIALS });
      if (!res.ok) {
        let snippet='';
        try { snippet = (await res.text()).slice(0,160); } catch{}
        throw new Error(`HTTP ${res.status} ${res.statusText} ${snippet}`.trim());
      }
      const data = await res.json();
      const arr = Array.isArray(data) ? data : (Array.isArray(data.content) ? data.content : []);
      const sorted = arr.slice().sort((a,b)=>{
        const ad = a.uploadedAt? new Date(a.uploadedAt).getTime():0;
        const bd = b.uploadedAt? new Date(b.uploadedAt).getTime():0;
        return bd - ad;
      });
      setItems(sorted);
    } catch (e) {
      const isNetwork = /Failed to fetch|NetworkError/i.test(e.message);
      setError(e.message + (isNetwork? ' -> Network/CORS issue?' : ''));
    } finally { setLoading(false); }
  }, []);

  useEffect(()=>{ load(); }, [load]);

  const handleVerify = async (id) => {
    if (!window.confirm('Mark this Aadhaar as verified?')) return;
    setVerifying(id);
    try {
  let res = await fetch(url.occupantVerify(id), { method: 'PATCH', credentials: FETCH_CREDENTIALS });
      if (!res.ok) {
        const txt = await res.text().catch(()=> '');
        throw new Error(`Verify failed (${res.status}) ${txt.slice(0,160)}`);
      }
      const body = await res.json().catch(()=>({}));
      if (body.status === 'already verified') {
        // no change but treat as success
      }
      // update local state
      setItems(prev => prev.map(it => it.id===id ? { ...it, verified: true } : it));
    } catch(e) {
      console.error(e); alert(e.message || 'Could not verify');
    } finally {
      setVerifying(null);
    }
  };

  const filtered = items.filter(it => {
    if (showOnlyPending && it.verified) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (it.name||'').toLowerCase().includes(q) || (it.tenantUsername||'').toLowerCase().includes(q);
  });

  return (
    <div style={wrap}>
      <h2 style={heading}>All Occupants (Admin)</h2>
      <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:16 }}>
        <input
          placeholder="Search by tenant or name"
          value={search}
          onChange={e=> setSearch(e.target.value)}
          style={searchInput}
        />
        <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:14 }}>
          <input type="checkbox" checked={showOnlyPending} onChange={e=> setShowOnlyPending(e.target.checked)} />
          Show only pending
        </label>
        <button onClick={load} disabled={loading} style={refreshBtn}>{loading? 'Refreshing…':'Refresh'}</button>
      </div>
      {error && (
        <div style={{ color:'#b91c1c', marginBottom:12, fontSize:13, lineHeight:1.4 }}>{error}</div>
      )}
      {loading ? <p>Loading…</p> : (
        <>
          <div style={{ fontSize:13, color:'#475569', marginBottom:8 }}>{filtered.length} of {items.length} shown</div>
          <table style={table}>
            <thead>
              <tr style={{ background:'linear-gradient(90deg,#2563eb,#38bdf8)', color:'#fff' }}>
                <th style={thTd}>Tenant</th>
                <th style={thTd}>Name</th>
                <th style={thTd}>File</th>
                <th style={thTd}>Uploaded</th>
                <th style={thTd}>Status</th>
                <th style={thTd}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((it, idx)=>{
                const fileName = it.aadharFileName || '';
                return (
                  <tr key={it.id || idx} style={{ background: idx%2? '#fff':'#f1f5f9', borderBottom:'1px solid #e2e8f0' }}>
                    <td style={thTd}>{it.tenantUsername || '-'}</td>
                    <td style={{ ...thTd, fontWeight:500 }}>{it.name}</td>
                    <td style={thTd}>
                      {it.aadharUrl ? <a href={it.aadharUrl} target="_blank" rel="noreferrer" style={{ color:'#2563eb', fontWeight:600 }}>{truncate(fileName || 'Open', 26)}</a> : <em style={{ color:'#94a3b8' }}>N/A</em>}
                    </td>
                    <td style={thTd}>{it.uploadedAt ? new Date(it.uploadedAt).toLocaleString(): ''}</td>
                    <td style={thTd}>
                      {it.verified ? (
                        <span style={{ background:'#dcfce7', color:'#166534', padding:'4px 10px', borderRadius:20, fontSize:12, fontWeight:600 }}>VERIFIED</span>
                      ) : (
                        <span style={{ background:'#fde68a', color:'#92400e', padding:'4px 10px', borderRadius:20, fontSize:12, fontWeight:600 }}>PENDING</span>
                      )}
                    </td>
                    <td style={thTd}>
                      {!it.verified && (
                        <button
                          onClick={()=>handleVerify(it.id)}
                          disabled={verifying===it.id}
                          style={{ background:'#16a34a', color:'#fff', border:'none', borderRadius:6, padding:'6px 12px', fontWeight:'bold', cursor: verifying===it.id?'not-allowed':'pointer', opacity: verifying===it.id?0.6:1 }}
                        >{verifying===it.id? 'Verifying…':'Verify'}</button>
                      )}
                      {it.verified && <span style={{ fontSize:12, color:'#64748b' }}>—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

function truncate(str,len){ if(!str) return ''; return str.length>len? str.slice(0,len-1)+'…':str; }

const wrap = { maxWidth:'1100px', margin:'40px auto', padding:'32px', background:'#f8fafc', borderRadius:16, boxShadow:'0 4px 24px rgba(0,0,0,0.08)' };
const heading = { color:'#2563eb', marginBottom:24, textAlign:'center', fontWeight:'bold' };
const table = { width:'100%', borderCollapse:'collapse', background:'#fff', borderRadius:12, overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.05)' };
const thTd = { padding:'10px', textAlign:'center', fontSize:14 };
const searchInput = { padding:'10px 14px', border:'1px solid #cbd5e1', borderRadius:8, fontSize:14 };
const refreshBtn = { background:'#38bdf8', color:'#fff', border:'none', borderRadius:8, padding:'10px 18px', fontWeight:'bold', cursor:'pointer' };
