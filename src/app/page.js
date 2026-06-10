'use client';
import '../app/HomePage.css';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image'; 

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <div className="home fade-in-up">
      <section className="hero">
        <div className="hero-badge">
          <span className="badge-new">NEW</span> FitSphere is now available in 47 countries &rarr;
        </div>

        <h1 className="hero-title">
          The complete <span className="gradient-text">fitness</span> system<br />
          for modern Gyms & Athletes.
        </h1>
        
        <p className="hero-subtitle">
          From boutique studios to global chains — members, billing, classes, biometrics, <br />
          member online payments and marketing in one platform.
        </p>

        <div className="hero-ctas">
          <Link href="/auth/signup" className="btn-primary-large">
            Start Your Journey &rarr;
          </Link>
          <Link href="/workouts" className="btn-secondary-large">
            Explore Workouts
          </Link>
        </div>

        <div className="hero-perks">
          <span>&check; 100+ Free Workouts</span>
          <span>&check; Track Your BMI</span>
          <span>&check; Save Favorites</span>
        </div>
      </section>

      <section className="features-preview">
        <h2 className="section-title">Everything you need to succeed</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Smart Dashboard</h3>
            <p>Track your daily progress and calculate your BMI instantly with our built-in health tools.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏋️</div>
            <h3>Extensive Workouts</h3>
            <p>Browse a massive library of exercises with visual guides and step-by-step instructions.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Personalized Library</h3>
            <p>Save your favorite routines and build a custom workout schedule that fits your goals.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
