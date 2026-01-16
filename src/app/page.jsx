'use client'
import Hero from "./components/Hero/Hero";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiAward, FiTruck, FiShield, FiGift } from "react-icons/fi";
import { FaApple } from "react-icons/fa";
import { SiZelle, SiCashapp } from "react-icons/si";
import { BiTransfer } from "react-icons/bi";
import { PiBank } from "react-icons/pi";
import Link from "next/link";

export default function Home() {
  const navigation = useRouter();

  // Hero banner data
  const heroes = [
    {
      title: "Introducing",
      subtitle: "ANGEL'S ENVY",
      description: "Port Wine Barrel Finished Bourbon",
      image: "/images/banner3.jpg",
    },
    {
      title: "Limited Quantities",
      subtitle: "W.L. WELLER",
      description: "Get it while supplies last!",
      image: "/images/banner2.jpg",
    },
    {
      title: "PGA CHAMPIONSHIP",
      subtitle: "LIMITED EDITION",
      description: "Official Bourbon Partner",
      image: "/images/banner4.jpg",
    },
    {
      title: "Rare Collection",
      subtitle: "PAPPY VAN WINKLE",
      description: "Delivered to your door",
      image: "/images/banner1.jpg",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-rotate hero banners
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % heroes.length);
        setIsTransitioning(false);
      }, 500);
    }, 6000);

    return () => clearInterval(timer);
  }, [heroes.length]);

  // Features data
  const features = [
    {
      icon: <FiTruck />,
      title: "Free Shipping",
      description: "On orders over $500"
    },
    {
      icon: <FiAward />,
      title: "Authenticity Guaranteed",
      description: "100% genuine products"
    },
    {
      icon: <FiShield />,
      title: "Secure Packaging",
      description: "Safe & protected delivery"
    },
    {
      icon: <FiGift />,
      title: "Gift Wrapping",
      description: "Premium presentation"
    }
  ];

  // Brand showcase data
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch('/api/product-models');
        if (res.ok) {
          const data = await res.json();
          setBrands(
            data
              .filter((b) => b.image)
              .map((b) => ({
                name: b.label,
                slug: b.value,
                image: b.image,
              }))
          );
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };
    fetchBrands();
  }, []);


  return (
    <main className="home-page">
      {/* Hero Banner Section */}
      <section className="hero-banner">
        <div className="hero-slides">
          {heroes.map((hero, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentIndex ? 'active' : ''} ${isTransitioning ? 'transitioning' : ''}`}
              style={{ backgroundImage: `url(${hero.image})` }}
            >
              <div className="hero-overlay"></div>
              <div className="hero-content">
                <span className="hero-label">{hero.title}</span>
                <h1 className="hero-title">{hero.subtitle}</h1>
                <p className="hero-description">{hero.description}</p>
                <button
                  className="hero-cta"
                  onClick={() => navigation.push('/shop')}
                >
                  Shop Now
                  <FiArrowRight className="cta-arrow" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Hero Indicators */}
        <div className="hero-indicators">
          {heroes.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setIsTransitioning(false);
                }, 300);
              }}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <div className="scroll-mouse">
            <div className="scroll-wheel"></div>
          </div>
          <span>Scroll to Explore</span>
        </div>
      </section>

      {/* Features Bar */}
      <section className="features-bar">
        <div className="features-container">
          {features.map((feature, index) => (
            <div key={index} className="feature-item">
              <div className="feature-icon">{feature.icon}</div>
              <div className="feature-text">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Payment Methods Preview */}
      <section className="payment-preview-section">
        <div className="payment-preview-content">
          <span className="section-label">Secure Checkout</span>
          <div className="payment-icons-row">
            <div className="payment-item">
              <FaApple className="payment-icon-lg" />
              <span>Apple Pay</span>
            </div>
            <div className="payment-item">
              <SiZelle className="payment-icon-lg" />
              <span>Zelle</span>
            </div>
            <div className="payment-item">
              <SiCashapp className="payment-icon-lg" />
              <span>Cash App</span>
            </div>
            <div className="payment-item">
              <BiTransfer className="payment-icon-lg" />
              <span>E-Transfer</span>
            </div>
            <div className="payment-item">
              <PiBank className="payment-icon-lg" />
              <span>Chime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Showcase */}
      <section className="brands-section">
        <div className="section-header">
          <span className="section-label">Premium Selection</span>
          <h2 className="section-title">Shop by Brand</h2>
          <p className="section-description">
            Explore our curated collection of the world&apos;s finest spirits
          </p>
        </div>
        <div className="brands-grid">
          {brands.map((brand, index) => (
            <Link
              key={index}
              href={`/shop?brand=${brand.slug}`}
              className="brand-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="brand-image">
                <img src={brand.image} alt={brand.name} />
                <div className="brand-overlay"></div>
              </div>
              <div className="brand-info">
                <h3>{brand.name}</h3>
                <span className="brand-cta">
                  Explore Collection
                  <FiArrowRight />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Hero Component (Products Section) */}
      <Hero />

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="cta-content">
          <span className="cta-label">Personalize It!</span>
          <h2 className="cta-title">Custom Engraving Available</h2>
          <p className="cta-description">
            Choose from our Engraving Collection and add a special message to send a memorable gift!
          </p>
          <button
            className="cta-button"
            onClick={() => navigation.push('/shop')}
          >
            Shop Engraving Collection
            <FiArrowRight />
          </button>
        </div>
        <div className="cta-decoration">
          <div className="deco-circle"></div>
          <div className="deco-circle"></div>
        </div>
      </section>
    </main>
  );
}
