'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Aos from 'aos';
import 'aos/dist/aos.css';
import './Dashboard.css';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);

  useEffect(() => {
    Aos.init({ duration: 600 });
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/login');
    } else {
      setReady(true);
    }
  }, [session, status, router]);

  if (!ready || status === 'loading') return null;

  const calculateBMI = (e) => {
    e.preventDefault();
    if (weight && height) {
      const heightInMeters = height / 100;
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      setBmi(bmiValue);
    }
  };

  const getBMICategory = (value) => {
    if (value < 18.5) return 'Underweight';
    if (value >= 18.5 && value <= 24.9) return 'Normal weight';
    if (value >= 25 && value <= 29.9) return 'Overweight';
    return 'Obese';
  };

  return (
    <div className="dashboard-container" data-aos="fade-in">
      <h1 className="dashboard-title">Dashboard</h1>
      <p className="welcome-message">Welcome back, {session.user?.name || session.user?.email}!</p>

      <div className="dashboard-grid">
        {/* Activity Tracker Mock */}
        <div className="dashboard-card" data-aos="fade-up" data-aos-delay="100">
          <h2>Activity Tracker</h2>
          <div className="activity-stats">
            <div className="stat">
              <span className="stat-value">12</span>
              <span className="stat-label">Workouts</span>
            </div>
            <div className="stat">
              <span className="stat-value">5</span>
              <span className="stat-label">Favorites</span>
            </div>
            <div className="stat">
              <span className="stat-value">3</span>
              <span className="stat-label">Streak (Days)</span>
            </div>
          </div>
        </div>

        {/* BMI Calculator */}
        <div className="dashboard-card" data-aos="fade-up" data-aos-delay="200">
          <h2>BMI Calculator</h2>
          <form onSubmit={calculateBMI} className="bmi-form">
            <div className="input-group">
              <label>Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                placeholder="e.g. 70"
              />
            </div>
            <div className="input-group">
              <label>Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                required
                placeholder="e.g. 175"
              />
            </div>
            <button type="submit" className="bmi-button">Calculate</button>
          </form>

          {bmi && (
            <div className="bmi-result" data-aos="zoom-in">
              <h3>Your BMI: <span>{bmi}</span></h3>
              <p>Category: <strong>{getBMICategory(bmi)}</strong></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
