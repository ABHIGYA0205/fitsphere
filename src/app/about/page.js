"use client";
import "./about.css";
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ready, setReady] = useState(false);

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

  return (
    <div className="about-container" data-aos="zoom-out">
      <h1 className="about-title">
        About <span style={{ color: "#714CBD" }}>FitSphere</span>
      </h1>

      <p className="about-text">
        <strong>FitSphere</strong> is your personalized fitness companion, here to guide you on your journey toward better health and well-being...
      </p>

      <p className="about-text">
        Our mission is to make fitness accessible, motivating, and empowering...
      </p>

      <p className="about-text">
        Join our growing community of fitness enthusiasts and begin your transformation today...
      </p>
    </div>
  );
}
