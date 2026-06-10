'use client';
import Link from 'next/link';
import './Navbar.css';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function Navbar() {
  const { data: session, status } = useSession();
  const user = session?.user;

  return (
    <nav className="navbar fade-in-down">
      <Link href="/" className="navbar-logo">
        <span className="logo-icon">M</span>
        <span className="logo-text">FitSphere</span>
      </Link>

      <ul className="navbar-links">
        <li><Link href="/workouts" className="nav-link">Workouts <span className="chevron"></span></Link></li>
        <li><Link href="/tutorials" className="nav-link">Tutorials <span className="chevron"></span></Link></li>
        <li><Link href="/favorites" className="nav-link">Favorites <span className="chevron"></span></Link></li>
        {user && <li><Link href="/dashboard" className="nav-link">Dashboard</Link></li>}
      </ul>

      <div className="navbar-actions">
        {!user && status !== 'loading' && (
          <>
            <Link href="/auth/login" className="login-link">Login</Link>
            <Link href="/auth/signup" className="btn-primary">Start Free Trial</Link>
          </>
        )}
        {user && (
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="btn-primary"
            aria-label="Log out"
          >
            Log Out
          </button>
        )}
      </div>
    </nav>
  );
}
