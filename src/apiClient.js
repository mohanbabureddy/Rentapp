// Centralized API endpoint helpers & fetch wrappers
// Configure via environment variables:
//   REACT_APP_API_BASE   e.g. http://localhost:8080
//   REACT_APP_API_PREFIX e.g. /api  (set to '' if backend has no /api)

const RAW_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080';
export const API_BASE = RAW_BASE.replace(/\/$/, '');
export const API_PREFIX = process.env.REACT_APP_API_PREFIX || '/api';
// Set REACT_APP_WITH_CREDENTIALS=true to send cookies (session auth) to API on different origin
export const FETCH_CREDENTIALS = (process.env.REACT_APP_WITH_CREDENTIALS === 'true') ? 'include' : 'same-origin';

// URL builders
export const url = {
  occupantsList: (tenant) => `${API_BASE}${API_PREFIX}/tenants/occupants/${encodeURIComponent(tenant)}`,
  occupantDelete: (id) => `${API_BASE}${API_PREFIX}/tenants/occupants/${id}`,
  // (Removed alternates after confirming controller mapping)
  tenantBills: (username) => `${API_BASE}${API_PREFIX}/tenants/${encodeURIComponent(username)}`,
  markBillPaid: (billId) => `${API_BASE}${API_PREFIX}/tenants/markPaid/${billId}`,
  logPaymentSuccess: () => `${API_BASE}${API_PREFIX}/tenants/logSuccess`,
  logPaymentFailure: () => `${API_BASE}${API_PREFIX}/tenants/logFailure`,
  complaintsList: (tenant) => `${API_BASE}${API_PREFIX}/tenants/complaints/${encodeURIComponent(tenant)}`,
  complaintsAdd: () => `${API_BASE}${API_PREFIX}/tenants/complaints`,
  adminUsersAll: () => `${API_BASE}${API_PREFIX}/users/all`,
  adminUserAdd: () => `${API_BASE}${API_PREFIX}/users/add`,
  adminUserUpdate: (id) => `${API_BASE}${API_PREFIX}/users/update/${id}`,
  adminUserDelete: (id) => `${API_BASE}${API_PREFIX}/users/delete/${id}`,
  // Admin occupants & verify
  adminOccupantsAll: () => `${API_BASE}${API_PREFIX}/admin/occupants`,
  occupantVerify: (id) => `${API_BASE}${API_PREFIX}/tenants/occupants/verify/${id}`,
  login: () => `${API_BASE}${API_PREFIX}/users/login`,
  registrationStart: () => `${API_BASE}${API_PREFIX}/users/registration/start`,
  registrationFinish: () => `${API_BASE}${API_PREFIX}/users/registration/finish`
};

// Generic JSON helper
export async function jsonFetch(input, init = {}) {
  const resp = await fetch(input, { credentials: FETCH_CREDENTIALS, ...init });
  let data = null;
  try { data = await resp.json(); } catch (_) { /* ignore */ }
  if (!resp.ok) {
    const msg = data?.error || data?.message || resp.statusText || 'Request failed';
    throw new Error(msg);
  }
  return data;
}

export function buildMultipart(formEntries) {
  const fd = new FormData();
  Object.entries(formEntries).forEach(([k,v])=>{ if(v!==undefined && v!==null) fd.append(k,v); });
  return fd;
}
