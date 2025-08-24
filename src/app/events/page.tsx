"use client";
import React from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../coming-soon.css';

const EventsPage = () => {
  return (
    <div className="coming-soon-page">
      <Header showAccountSwitcher={false} data={null} />
      
      <main className="coming-soon-main">
        <div className="coming-soon-container">
          <div className="coming-soon-content">
            <div className="coming-soon-icon">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 14H10V16H8V14Z" fill="currentColor"/>
                <path d="M12 14H14V16H12V14Z" fill="currentColor"/>
                <path d="M16 14H18V16H16V14Z" fill="currentColor"/>
                <path d="M8 18H10V20H8V18Z" fill="currentColor"/>
                <path d="M12 18H14V20H12V18Z" fill="currentColor"/>
                <path d="M16 18H18V20H16V18Z" fill="currentColor"/>
              </svg>
            </div>
            
            <h1 className="coming-soon-title">Events Coming Soon</h1>
            <p className="coming-soon-subtitle">
              Get ready for an amazing lineup of live events, concerts, and performances!
            </p>
            
            <div className="coming-soon-features">
              <div className="feature-item">
                <div className="feature-icon">🎵</div>
                <h3>Live Concerts</h3>
                <p>Experience the best live music performances</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎭</div>
                <h3>Theater Shows</h3>
                <p>Drama, comedy, and musical performances</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎪</div>
                <h3>Special Events</h3>
                <p>Comedy shows, magic performances, and more</p>
              </div>
            </div>
            
            <div className="coming-soon-cta">
              <p className="notification-text">Be the first to know when we launch!</p>
              <div className="email-signup">
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  className="email-input"
                />
                <button className="notify-button">Notify Me</button>
              </div>
            </div>
            
            <div className="coming-soon-links">
              <Link href="/" className="back-link">
                ← Back to Home
              </Link>
              <Link href="/movies" className="movies-link">
                Browse Movies →
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer data={null} />
    </div>
  );
};

export default EventsPage; 