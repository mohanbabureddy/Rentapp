import React, { useEffect, useState } from 'react';

function TenantBills({ username }) {
  const [bills, setBills] = useState([]);

  const fetchBills = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/tenants/${username}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setBills(data);
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  };

  useEffect(() => {
    fetchBills();
  }, [username]);

  const payNow = (bill) => {
    const totalAmount = (
      Number(bill.rent || 0) +
      Number(bill.water || 0) +
      Number(bill.electricity || 0)
    ) * 100;

    const options = {
      key: "rzp_test_83AfjhlCGpYRkn",
      amount: totalAmount,
      currency: "INR",
      name: "Tenant Rent Billing",
      description: `Payment for ${bill.monthYear}`,
      handler: function (response) {
        alert(`✅ Payment successful!\nPayment ID: ${response.razorpay_payment_id}`);

        fetch(`http://localhost:8080/api/tenants/markPaid/${bill.id}`, {
          method: 'PUT'
        });

        fetch('http://localhost:8080/api/tenants/logSuccess', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tenantName: username,
            paymentId: response.razorpay_payment_id
          })
        });
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
    <div style={{ padding: "20px" }}>
      <h2>Tenant Bill Viewer</h2>

      {bills.length === 0 ? (
        <p>No bills found for <strong>{username}</strong>.</p>
      ) : (
        <table border="1" style={{ marginTop: "20px", width: "100%" }}>
          <thead>
            <tr>
              <th>Month</th>
              <th>Rent</th>
              <th>Water</th>
              <th>Electricity</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill, idx) => (
              <tr key={idx}>
                <td>{bill.monthYear}</td>
                <td>{bill.rent}</td>
                <td>{bill.water}</td>
                <td>{bill.electricity}</td>
                <td>{Number(bill.rent || 0) + Number(bill.water || 0) + Number(bill.electricity || 0)}</td>
                <td>
                  {bill.paid ? (
                    <span style={{ color: 'green' }}>✅ Paid</span>
                  ) : (
                    <button onClick={() => payNow(bill)}>Pay</button>
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
