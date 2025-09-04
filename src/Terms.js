import React from 'react';

// Latest Terms & Conditions (as provided) – streamlined for display
export default function Terms() {
  const wrap = {maxWidth:900,margin:'40px auto',background:'#f8fafc',padding:'36px 44px',borderRadius:18,boxShadow:'0 4px 28px rgba(0,0,0,0.08)',lineHeight:1.55,fontSize:15,color:'#0f172a'};
  const h1 = {fontSize:30,marginTop:0,marginBottom:6,color:'#2563eb',letterSpacing:'0.5px'};
  const meta = {fontSize:12,color:'#64748b',marginBottom:24};
  const h2 = {fontSize:18,margin:'26px 0 8px',color:'#1e293b'};
  const list = {margin:'6px 0 12px 20px',padding:0};
  const small = {fontSize:11,color:'#64748b',marginTop:36,borderTop:'1px solid #e2e8f0',paddingTop:14};
  return (
    <div style={wrap}>
      <h1 style={h1}>Terms & Conditions</h1>
      <div style={meta}>Last updated on Apr 10th 2025</div>
      <p>These Terms govern your use of the RENTPAY platform operated by Mohanbabu Gopalreddy ("we", "us", "our"). By accessing or using the platform, you agree to these Terms. If you do not agree, do not use the service.</p>

      <h2 style={h2}>1. Service Overview</h2>
      <p>RENTPAY is a digital platform for tenants residing in properties owned or managed by Mohanbabu Gopalreddy. It facilitates monthly rent payments, utility billing, and miscellaneous charges.</p>

      <h2 style={h2}>2. Billing Structure</h2>
      <p>Monthly bills may include:</p>
      <ul style={list}>
        <li>Fixed Rent Amount (as agreed at move‑in)</li>
        <li>Water Charges (usage or flat rate)</li>
        <li>Electricity Charges (manual bill uploaded by owner)</li>
        <li>Miscellaneous Charges (prior balances, maintenance, penalties, late fees)</li>
      </ul>

      <h2 style={h2}>3. Payment Timeline</h2>
      <p>Tenants are expected to pay dues by the end of each billing cycle or the schedule communicated in the app.</p>

      <h2 style={h2}>4. Changes</h2>
      <p>Content, features, or these Terms may change without prior notice. Continued use signifies acceptance.</p>

      <h2 style={h2}>5. Accuracy of Information</h2>
      <p>Information is provided on a reasonable‑effort basis without warranty of completeness or suitability. Use is at your own risk.</p>

      <h2 style={h2}>6. User Responsibility</h2>
      <p>Users must use the platform lawfully and ensure it meets their needs. Misuse or misrepresentation may result in suspension or legal action.</p>

      <h2 style={h2}>7. Intellectual Property</h2>
      <p>All content, design, graphics, and layout are owned or licensed by us. Unauthorized use is prohibited.</p>

      <h2 style={h2}>8. Trademarks</h2>
      <p>Third‑party trademarks (e.g., Razorpay) remain the property of their respective owners.</p>

      <h2 style={h2}>9. Prohibited Use</h2>
      <p>No tampering, reverse engineering, automated scraping, or unlawful activity.</p>

      <h2 style={h2}>10. External Links</h2>
      <p>Links (if any) are for convenience only; we neither control nor endorse third‑party content.</p>

      <h2 style={h2}>11. Linking to RENTPAY</h2>
      <p>Linking requires prior written consent.</p>

      <h2 style={h2}>12. Limitation of Liability</h2>
      <p>We are not liable for indirect or consequential losses. Aggregate liability is limited to the amount you paid in the preceding 3 months.</p>

      <h2 style={h2}>13. Payment Authorization</h2>
      <p>We are not responsible for failed transactions due to card limits, bank rules, or authorization issues.</p>

      <h2 style={h2}>14. Governing Law</h2>
      <p>Governed by the laws of India. Exclusive jurisdiction: courts of Bengaluru, Karnataka.</p>

      <h2 style={h2}>15. Contact</h2>
      <p>Owner: Mohanbabu Gopalreddy, 47, Kachanayakanahalli, Bengaluru, Karnataka 560105.</p>

      <div style={small}>Disclaimer: Content supplied by Mohanbabu Gopalreddy. Razorpay is not liable for this content or related disputes.</div>
    </div>
  );
}
