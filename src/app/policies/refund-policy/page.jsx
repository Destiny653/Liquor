'use client';
import React from 'react';
import '../policies.css';

export default function RefundPolicy() {
  return (
    <div className="policy-container">
      <header className="policy-header">
        <h1 className="policy-title">Refund & Return Policy</h1>
        <p className="policy-date">Last Updated: January 2026</p>
      </header>

      <div className="policy-content">
        <section>
          <h2>1. Returns</h2>
          <p>
            Due to state regulations and legal restrictions on the sale of alcohol, <strong>we cannot accept returns of any alcohol products.</strong> All sales of spirits, wine, and other alcoholic beverages are final.
          </p>
          <p>
            However, we stand behind the quality of our products. If you believe your product is defective (e.g., corked wine or spoiled spirits), please contact us immediately.
          </p>
        </section>

        <section>
          <h2>2. Damaged or Incorrect Items</h2>
          <p>
            If you receive your order and items are damaged, broken, or incorrect, please notify us within <strong>48 hours</strong> of delivery.
            To expedite the resolution process, please:
          </p>
          <ul>
            <li>Take clear photos of the damaged package and bottles.</li>
            <li>Keep the original packaging until the claim is resolved.</li>
            <li>Email us at <a href="mailto:support@velvetcasks.com">support@velvetcasks.com</a> with your order number and photos.</li>
          </ul>
          <p>
            We will offer a replacement (subject to availability) or a full refund for the damaged or incorrect items.
          </p>
        </section>

        <section>
          <h2>3. Refunds</h2>
          <p>
            Once your refund request is approved, we will initiate a refund to your original method of payment.
            You will receive the credit within a certain amount of days, depending on your card issuer's policies (typically 5-10 business days).
          </p>
        </section>

        <section>
          <h2>4. Cancelled Orders</h2>
          <p>
            You may cancel your order for a full refund at any time <strong>before it has shipped</strong>.
            Once an order has been shipped, it cannot be cancelled or refunded unless it arrives damaged.
          </p>
        </section>

        <section>
          <h2>5. Gift Returns</h2>
          <p>
            If the item was marked as a gift when purchased and shipped directly to you, you may be eligible for a store credit
            in the event of damage or specific non-alcohol related returnable merchandise (e.g., accessories, glassware).
          </p>
        </section>
      </div>
    </div>
  );
}
