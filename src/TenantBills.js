import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function TenantBills({ username }) {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingBillId, setPayingBillId] = useState(null); // Track which bill is being paid
  const navigate = useNavigate();

  const fetchBills = useCallback(async () => {
    if (!username) return;
    try {
      const response = await fetch(`http://localhost:8080/api/tenants/${username}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setBills(data);
    } catch (error) {
      console.error("Error fetching bills:", error);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    if (!username) {
      // If username missing, force back to login
      navigate('/login', { replace: true });
      return;
    }
    fetchBills();
  }, [username, fetchBills, navigate]);

  const payNow = (bill) => {
    // Prevent duplicate payment triggers for the same bill
    if (payingBillId === bill.id) return;

    setPayingBillId(bill.id); // Mark this bill as being paid
    const totalAmount =
      (Number(bill.rent || 0) +
        Number(bill.water || 0) +
        Number(bill.electricity || 0)) * 100;

    const options = {
      key: "rzp_test_83AfjhlCGpYRkn",
      amount: totalAmount,
      currency: "INR",
      name: "Tenant Rent Billing",
      description: `Payment for ${bill.monthYear}`,
      handler: async (response) => {
        alert(`✅ Payment successful!\nPayment ID: ${response.razorpay_payment_id}`);
        try {
          await fetch(`http://localhost:8080/api/tenants/markPaid/${bill.id}`, { method: 'PUT' });
          await fetch('http://localhost:8080/api/tenants/logSuccess', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tenantName: username, paymentId: response.razorpay_payment_id })
          });
          fetchBills();
        } catch (err) {
          console.error("Error after payment success:", err);
        } finally {
          setPayingBillId(null); // Reset after payment
        }
      },
      prefill: { name: username, email: '', contact: '' },
      theme: { color: "#3399cc" }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (resp) => {
      alert(`❌ Payment failed: ${resp.error.description}`);
      fetch('http://localhost:8080/api/tenants/logFailure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resp.error)
      });
      setPayingBillId(null); // Reset if failed
    });
    rzp.open();
  };

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '40px' }}>Loading bills…</p>;
  }

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
          fontWeight: 'bold',
        }}
      >
        My Bills
      </h2>

      {bills.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#64748b' }}>
          No bills found for <strong>{username}</strong>.
        </p>
      ) : (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: '#fff',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            marginTop: '20px',
          }}
        >
          <thead>
            <tr style={{ background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)', color: '#fff' }}>
              <th style={{ padding: '12px' }}>Year - Month</th>
              <th style={{ padding: '12px' }}>Rent</th>
              <th style={{ padding: '12px' }}>Water</th>
              <th style={{ padding: '12px' }}>Electricity</th>
              <th style={{ padding: '12px' }}>Total</th>
              <th style={{ padding: '12px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill, idx) => (
              <tr
                key={bill.id || idx}
                style={{
                  background: idx % 2 === 0 ? '#f1f5f9' : '#fff',
                  borderBottom: '1px solid #e2e8f0',
                }}
              >
                <td style={{ padding: '10px', textAlign: 'center' }}>{bill.monthYear}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>{bill.rent}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>{bill.water}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>{bill.electricity}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  {Number(bill.rent || 0) + Number(bill.water || 0) + Number(bill.electricity || 0)}
                </td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  {bill.paid ? (
                    <span style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '16px' }}>✅ Paid</span>
                  ) : (
                    <button
                      onClick={() => payNow(bill)}
                      disabled={payingBillId === bill.id}
                      style={{
                        background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '7px 18px',
                        fontWeight: 'bold',
                        fontSize: '15px',
                        cursor: payingBillId === bill.id ? 'not-allowed' : 'pointer',
                        opacity: payingBillId === bill.id ? 0.6 : 1,
                      }}
                    >
                      {payingBillId === bill.id ? "Processing..." : "Pay"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TenantBills;