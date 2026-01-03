'use client'
import React from 'react'
import './about.css'
import { GlobeHemisphereWest, ShieldCheck, UserFocus } from '@phosphor-icons/react'

export default function Page() {
  return (
    <div className='about-container'>
      {/* Hero Section */}
      <section className='about-hero'>
        <div className='about-hero-content'>
          <h1 className='about-title'>Our Heritage</h1>
          <p className='about-subtitle'>Purveyors of the Rare & Extraordinary</p>
        </div>
      </section>

      {/* Story Section */}
      <section className='about-section'>
        <div className='story-grid'>
          <div className='story-content'>
            <h2>The Art of Selection</h2>
            <p>
              LiquorLuxx was founded on a simple yet ambitious premise: to connect connoisseurs
              with the world's most exceptional spirits. We believe that every bottle tells a story—of
              tradition, craft, and the land from which it came.
            </p>
            <p>
              Our team of expert sommeliers and curators travels the globe, building relationships
              with heritage distilleries and uncovering hidden gems that define the pinnacle of
              liquid artistry. From the rolling hills of Scotland to the bourbon trails of Kentucky,
              we bring the world's finest right to your doorstep.
            </p>
            <p>
              We are not just a retailer; we are custodians of taste, ensuring that when you
              uncork a bottle from LiquorLuxx, you are experiencing history in a glass.
            </p>
          </div>
          <div className='story-image'>
            <img src="/images/bestsell1.jpg" alt="Fine Spirits Curation" />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className='about-section' style={{ background: 'var(--color-bg-secondary)' }}>
        <div className='section-header'>
          <h2 className='section-title' style={{ textAlign: 'center', marginBottom: '40px' }}>Our Values</h2>
        </div>
        <div className='values-grid'>
          <div className='value-card'>
            <div className='value-icon'>
              <ShieldCheck size={40} />
            </div>
            <h3>Authenticity Guaranteed</h3>
            <p>
              We stand behind every bottle we sell. Our rigorous authentication process
              ensures that you receive only genuine, premium products directly from
              trusted sources.
            </p>
          </div>
          <div className='value-card'>
            <div className='value-icon'>
              <GlobeHemisphereWest size={40} />
            </div>
            <h3>Global Sourcing</h3>
            <p>
              Our collection knows no borders. We tirelessly search every corner of the
              globe to find rare vintages and limited editions that are often unavailable
              elsewhere.
            </p>
          </div>
          <div className='value-card'>
            <div className='value-icon'>
              <UserFocus size={40} />
            </div>
            <h3>Concierge Service</h3>
            <p>
              We pride ourselves on providing a bespoke shopping experience. whether
              you are a seasoned collector or a curious novice, our experts are here to
              guide your journey.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
