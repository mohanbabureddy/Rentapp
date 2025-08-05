import React, { useEffect, useState, useCallback } from 'react';

function TenantBills({ username }) {
  const [bills, setBills] = useState([]);

  const fetchBills = useCallback(async () => {
    try {
      const response = await fetch(`http://vgrpay.uk/api/tenants/${username}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setBills(data);
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  }, [username]);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  const payNow = (bill) => {
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
      handler: async function (response) {
        alert(`✅ Payment successful!\nPayment ID: ${response.razorpay_payment_id}`);

        try {
          await fetch(`http://vgrpay.uk/api/tenants/markPaid/${bill.id}`, {
            method: 'PUT'
          });

          await fetch('http://vgrpay.uk/api/tenants/logSuccess', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tenantName: username,
              paymentId: response.razorpay_payment_id
            })
          });

          fetchBills(); // Refresh bill data
        } catch (err) {
          console.error("Error after payment success:", err);
        }
      },
      prefill: {
        name: username,
        email: '',
        contact: '',
      },
      theme: {
        color: "#3399cc"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      alert(`❌ Payment failed: ${response.error.description}`);
      fetch('http://localhost:8080/api/tenants/logFailure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response.error)
      });
    });

    rzp.open();
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
              key={idx}
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
                {Number(bill.rent || 0) +
                  Number(bill.water || 0) +
                  Number(bill.electricity || 0)}
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                {bill.paid ? (
                  <span style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '16px' }}>✅ Paid</span>
                ) : (
                  <button
                    onClick={() => payNow(bill)}
                    style={{
                      background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '7px 18px',
                      fontWeight: 'bold',
                      fontSize: '15px',
                      cursor: 'pointer',
                    }}
                  >
                    Pay
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
