"use client";
import React from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../coming-soon.css';

const PlaysPage = () => {
  return (
    <div className="coming-soon-page">
      <Header showAccountSwitcher={false} data={null} />
      
      <main className="coming-soon-main">
        <div className="coming-soon-container">
          <div className="coming-soon-content">
            <div className="coming-soon-icon">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <h1 className="coming-soon-title">Plays Coming Soon</h1>
            <p className="coming-soon-subtitle">
              Discover the magic of live theater with our upcoming collection of plays and performances!
            </p>
            
            <div className="coming-soon-features">
              <div className="feature-item">
                <div className="feature-icon">🎭</div>
                <h3>Drama Plays</h3>
                <p>Classic and contemporary dramatic performances</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">😄</div>
                <h3>Comedy Shows</h3>
                <p>Laugh out loud with hilarious comedy performances</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎼</div>
                <h3>Musical Theater</h3>
                <p>Spectacular musicals and Broadway-style shows</p>
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

export default PlaysPage; 