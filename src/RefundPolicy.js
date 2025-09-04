import React from 'react';

// Latest Cancellation & Refund Policy (as provided) – adjusted for rent platform
export default function RefundPolicy(){
  const wrap = {maxWidth:900,margin:'40px auto',background:'#f8fafc',padding:'36px 44px',borderRadius:18,boxShadow:'0 4px 28px rgba(0,0,0,0.08)',lineHeight:1.55,fontSize:15,color:'#0f172a'};
  const h1 = {fontSize:30,marginTop:0,marginBottom:6,color:'#2563eb',letterSpacing:'0.5px'};
  const meta = {fontSize:12,color:'#64748b',marginBottom:24};
  const h2 = {fontSize:18,margin:'26px 0 8px',color:'#1e293b'};
  const list = {margin:'6px 0 12px 20px',padding:0};
  const small = {fontSize:11,color:'#64748b',marginTop:36,borderTop:'1px solid #e2e8f0',paddingTop:14};
  return (
    <div style={wrap}>
      <h1 style={h1}>Cancellation & Refund Policy</h1>
      <div style={meta}>Last updated on Apr 10th 2025</div>
      <p>This policy outlines the conditions under which refunds may be processed for payments made via the RENTPAY platform.</p>

      <h2 style={h2}>1. Nature of Service</h2>
      <p>RENTPAY handles digital payments for rent and utilities. These payments are tied to tenancy agreements and are non‑cancellable once processed.</p>

      <h2 style={h2}>2. Refund Eligibility</h2>
      <ul style={list}>
        <li>Bank‑Side Failures: debited but not received due to bank issues — bank initiates reversal.</li>
        <li>Gateway (Razorpay) Transaction Failures: failed after debit — refunded to the original payment method.</li>
        <li>Owner‑Side Reversals: duplicate or excess payment — excess refunded after verification.</li>
      </ul>

      <h2 style={h2}>3. Non‑Refundable Items</h2>
      <ul style={list}>
        <li>Monthly rent once credited</li>
        <li>Water, electricity, and miscellaneous charges once paid</li>
        <li>Maintenance charges incurred and documented</li>
        <li>Penalties or late fees for delayed payments</li>
      </ul>

      <h2 style={h2}>4. Refund Timeline</h2>
      <p>Approved refunds are initiated within 3–5 working days to the original payment method (bank posting may vary).</p>

      <h2 style={h2}>5. Evidence & Dispute Resolution</h2>
      <p>We may request payment confirmation screenshots, bank statement excerpts, and the Razorpay transaction ID. Lack of sufficient evidence may delay or void processing.</p>

      <h2 style={h2}>6. Contact</h2>
      <p>Customer Service / Owner: Mohanbabu Gopalreddy, 47, Kachanayakanahalli, Bengaluru, Karnataka 560105.</p>

      <h2 style={h2}>7. Disclaimer</h2>
      <p>All billing content and logic are managed solely by the Owner. Razorpay is a payment gateway and is not liable for billing disputes or refund decisions.</p>

      <div style={small}>This summary does not override statutory rights.</div>
    </div>
  );
}
