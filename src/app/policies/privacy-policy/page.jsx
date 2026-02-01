'use client';
import React from 'react';
import '../policies.css';

export default function PrivacyPolicy() {
  return (
    <div className="policy-container">
      <header className="policy-header">
        <h1 className="policy-title">Privacy Policy</h1>
        <p className="policy-date">Last Updated: January 2026</p>
      </header>

      <div className="policy-content">
        <section>
          <h2>1. Introduction</h2>
          <p>
            Velvet Casks ("we," "our," or "us") respects your privacy and is committed to protecting it through our compliance with this policy.
            This policy describes the types of information we may collect from you or that you may provide when you visit the website
            Velvet Casks.com (our "Website") and our practices for collecting, using, maintaining, protecting, and disclosing that information.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <p>We collect several types of information from and about users of our Website, including information:</p>
          <ul>
            <li>By which you may be personally identified, such as name, postal address, e-mail address, telephone number ("personal information");</li>
            <li>About your internet connection, the equipment you use to access our Website, and usage details.</li>
            <li>Age verification information to ensure compliance with legal purchasing age requirements.</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>We use information that we collect about you or that you provide to us, including any personal information:</p>
          <ul>
            <li>To present our Website and its contents to you.</li>
            <li>To provide you with information, products, or services that you request from us.</li>
            <li>To fulfill any other purpose for which you provide it, such as processing orders and shipping.</li>
            <li>To notify you about changes to our Website or any products or services we offer or provide though it.</li>
            <li>To allow you to participate in interactive features on our Website.</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Security</h2>
          <p>
            We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure.
            All information you provide to us is stored on our secure servers behind firewalls. Payment transactions are processed through secure gateways and are not stored on our servers.
          </p>
        </section>

        <section>
          <h2>5. Contact Information</h2>
          <p>
            To ask questions or comment about this privacy policy and our privacy practices, contact us at:
            <a href="mailto:support@velvetcasks.com"> support@velvetcasks.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
