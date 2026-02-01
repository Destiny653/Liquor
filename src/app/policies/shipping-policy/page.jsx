'use client';
import React from 'react';
import '../policies.css';

export default function ShippingPolicy() {
  return (
    <div className="policy-container">
      <header className="policy-header">
        <h1 className="policy-title">Shipping Policy</h1>
        <p className="policy-date">Last Updated: January 2026</p>
      </header>

      <div className="policy-content">
        <section>
          <h2>1. Adult Signature Required</h2>
          <p>
            <strong>WARNING:</strong> You must be 21 years of age or older to purchase alcohol.
            <strong>An adult signature (21+) is required upon delivery.</strong>
            Packages will not be left at the door. Please ensure an adult is available to sign for the package at the shipping address.
            We recommend shipping to a business address if possible to ensure someone is available to sign.
          </p>
        </section>

        <section>
          <h2>2. Shipping Destinations</h2>
          <p>
            We currently ship to most states within the United States. However, due to state regulations,
            we may not be able to ship to certain states. During checkout, if we cannot ship to your location,
            you will be notified. We do not ship to P.O. Boxes or APO/FPO addresses.
          </p>
        </section>

        <section>
          <h2>3. Processing Times</h2>
          <p>
            Orders are typically processed within <strong>24-48 hours</strong> of receipt, excluding weekends and holidays.
            During peak seasons (holidays, special releases), processing times may extend up to 3-5 business days.
            You will receive a tracking number via email once your order has officially shipped.
          </p>
        </section>

        <section>
          <h2>4. Shipping Rates & Methods</h2>
          <p>
            Shipping rates are calculated based on the weight of your order and the destination.
            We offer the following shipping methods:
          </p>
          <ul>
            <li><strong>Ground Shipping:</strong> 3-7 Business Days</li>
            <li><strong>Express Shipping:</strong> 2-3 Business Days</li>
            <li><strong>Overnight:</strong> Next Business Day (Order by 12 PM EST)</li>
          </ul>
        </section>

        <section>
          <h2>5. Damaged Items</h2>
          <p>
            While we take extreme care in packaging your bottles, breakage can occur during transit.
            If your order arrives damaged, please document the damage with photos and contact us immediately at
            <a href="mailto:support@velvetcasks.com"> support@velvetcasks.com</a> within 48 hours of delivery.
            We will arrange for a replacement or refund.
          </p>
        </section>
      </div>
    </div>
  );
}
