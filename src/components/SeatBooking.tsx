"use client";
import React, { useState, useEffect } from 'react';
import styles from './styles/SeatBooking.module.css';

interface SeatBookingProps {
  isOpen: boolean;
  onClose: () => void;
  movieName: string;
  theatreName: string;
  showtime: string;
  format: string;
}

interface SeatData {
  single_line: string;
  select_seats: any;
  prime: string;
  classic: string;
  classic_plus: string;
  submitbutton: string;
}

const SeatBooking: React.FC<SeatBookingProps> = ({
  isOpen,
  onClose,
  movieName,
  theatreName,
  showtime,
  format
}) => {
  const [seatData, setSeatData] = useState<SeatData | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number>(0);
  const [selectedType, setSelectedType] = useState<'classic' | 'classic_plus' | 'prime'>('classic');
  const [bookingStep, setBookingStep] = useState<'seats' | 'email' | 'confirmation'>('seats');
  const [isLoading, setIsLoading] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [emailStatus, setEmailStatus] = useState<string>('');

  const seatPrices = {
    classic: 250,
    classic_plus: 300,
    prime: 350
  };

  const seatTypeInfo = {
    classic: { name: 'Classic', color: '#3498db', icon: '🎬' },
    classic_plus: { name: 'Classic Plus', color: '#f39c12', icon: '⭐' },
    prime: { name: 'Prime', color: '#e74c3c', icon: '👑' }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSeatData();
    }
  }, [isOpen]);

  const fetchSeatData = async () => {
    try {
      const mockSeatData: SeatData = {
        single_line: "",
        select_seats: null,
        prime: "Prime Seats - ₹350",
        classic: "Classic Seats - ₹250", 
        classic_plus: "Classic Plus Seats - ₹300",
        submitbutton: "Confirm Booking"
      };
      setSeatData(mockSeatData);
    } catch (error) {
      console.error('Error fetching seat data:', error);
    }
  };

  const handleSeatNumberClick = (number: number) => {
    setSelectedSeats(number);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleConfirmBooking = async () => {
    if (selectedSeats === 0) {
      alert('Please select number of seats');
      return;
    }

    // Move to email step instead of direct confirmation
    setBookingStep('email');
  };

  const handleEmailSubmit = async () => {
    if (!email.trim()) {
      setEmailError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');
    setEmailStatus('');
    setIsLoading(true);

    try {
      // Prepare email content
      const emailSubject = `Hey User, Your booking is confirmed for the ${movieName}`;
      const emailBody = `Dear User,<br><br>Your booking has been successfully confirmed!<br><br>Booking Details:<br>🎬 Movie: ${movieName}<br>🏢 Theatre: ${theatreName}<br>🕐 Showtime: ${showtime} (${format})<br>💺 Number of Seats: ${selectedSeats}<br>🎫 Seat Type: ${selectedType.replace('_', ' ')}<br>💰 Total Amount: ₹${calculateTotal()}<br>🆔 Booking ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}<br><br>Thank you for choosing ShowTimeNow!<br><br>Best regards,<br>ShowTimeNow Team`;

      // Encode parameters for URL
      const encodedTo = encodeURIComponent(email);
      const encodedSubject = encodeURIComponent(emailSubject);
      const encodedBody = encodeURIComponent(emailBody);

      // Build URL with query parameters
      const apiUrl = `https://app.contentstack.com/automations-api/run/0ad6b2485c8c4e28b3e09d19ca482735?to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}`;

      console.log('Sending email request to:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const responseText = await response.text();
      console.log('Response body:', responseText);

      if (response.ok) {
        console.log('Email sent successfully');
        setEmailStatus('Email sent successfully via Contentstack!');
        setBookingConfirmed(true);
        setBookingStep('confirmation');
      } else {
        console.error('Failed to send email. Status:', response.status, 'Response:', responseText);
        
        // Try alternative email service as fallback
        try {
          console.log('Trying alternative email service...');
          const emailjsResponse = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: email,
              subject: `Hey User, Your booking is confirmed for the ${movieName}`,
              message: `
Dear User,

Your booking has been successfully confirmed!

Booking Details:
🎬 Movie: ${movieName}
🏢 Theatre: ${theatreName}
🕐 Showtime: ${showtime} (${format})
💺 Number of Seats: ${selectedSeats}
🎫 Seat Type: ${selectedType.replace('_', ' ')}
💰 Total Amount: ₹${calculateTotal()}
🆔 Booking ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}

Thank you for choosing ShowTimeNow!

Best regards,
ShowTimeNow Team
              `.trim()
            })
          });
          
          if (emailjsResponse.ok) {
            console.log('Email sent via alternative service');
            setEmailStatus('Email sent via alternative service!');
          } else {
            console.error('Alternative email service also failed');
            setEmailStatus('Email service temporarily unavailable, but booking confirmed!');
          }
        } catch (fallbackError) {
          console.error('Fallback email service error:', fallbackError);
          setEmailStatus('Email service temporarily unavailable, but booking confirmed!');
        }
        
        // Still show confirmation but log the error
        setBookingConfirmed(true);
        setBookingStep('confirmation');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setEmailStatus('Email service temporarily unavailable, but booking confirmed!');
      // Still show confirmation but log the error
      setBookingConfirmed(true);
      setBookingStep('confirmation');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = (): number => {
    return selectedSeats * seatPrices[selectedType];
  };

  const handleClose = () => {
    if (bookingConfirmed) {
      setSelectedSeats(0);
      setSelectedType('classic');
      setBookingStep('seats');
      setBookingConfirmed(false);
      setEmail('');
      setEmailError('');
      setEmailStatus('');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.movieInfo}>
            <div className={styles.movieIcon}>🎬</div>
            <div className={styles.movieDetails}>
              <h2>{movieName}</h2>
              <p>{theatreName} • {showtime} • {format}</p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={handleClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {bookingStep === 'seats' && (
          <div className={styles.seatSelection}>
            <div className={styles.selectionSection}>
              <div className={styles.sectionHeader}>
                <h3>Select Number of Seats</h3>
              </div>
              <div className={styles.seatNumbers}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
                  <button
                    key={number}
                    className={`${styles.seatNumberButton} ${
                      selectedSeats === number ? styles.selected : ''
                    }`}
                    onClick={() => handleSeatNumberClick(number)}
                  >
                    {number}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.selectionSection}>
              <div className={styles.sectionHeader}>
                <h3>Select Seat Type</h3>
              </div>
              <div className={styles.seatTypes}>
                {(['classic', 'classic_plus', 'prime'] as const).map((type) => (
                  <button
                    key={type}
                    className={`${styles.seatTypeButton} ${
                      selectedType === type ? styles.selected : ''
                    }`}
                    onClick={() => setSelectedType(type)}
                    style={{
                      '--seat-color': seatTypeInfo[type].color
                    } as React.CSSProperties}
                  >
                    <div className={styles.seatTypeIcon}>{seatTypeInfo[type].icon}</div>
                    <div className={styles.seatTypeInfo}>
                      <span className={styles.seatTypeName}>{seatTypeInfo[type].name}</span>
                      <span className={styles.seatTypePrice}>₹{seatPrices[type]}</span>
                    </div>
                    <div className={styles.seatTypeCheck}>
                      {selectedType === type && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

                          <div className={styles.bookingSummary}>
                <div className={styles.summaryHeader}>
                  <h3>Booking Summary</h3>
                </div>
              <div className={styles.summaryDetails}>
                <div className={styles.summaryRow}>
                  <span>Number of Seats</span>
                  <span className={styles.summaryValue}>{selectedSeats}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Seat Type</span>
                  <span className={styles.summaryValue}>
                    <span className={styles.seatTypeBadge} style={{ backgroundColor: seatTypeInfo[selectedType].color }}>
                      {seatTypeInfo[selectedType].icon} {seatTypeInfo[selectedType].name}
                    </span>
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Price per Seat</span>
                  <span className={styles.summaryValue}>₹{seatPrices[selectedType]}</span>
                </div>
              </div>
              
              <div className={styles.totalSection}>
                <div className={styles.totalRow}>
                  <span>Total Amount</span>
                  <span className={styles.totalAmount}>₹{calculateTotal()}</span>
                </div>
                <div className={styles.totalNote}>
                  *Including all applicable taxes and convenience fees
                </div>
              </div>

              <button 
                className={`${styles.confirmButton} ${selectedSeats === 0 ? styles.disabled : ''}`}
                onClick={handleConfirmBooking}
                disabled={selectedSeats === 0 || isLoading}
              >
                {isLoading ? (
                  <div className={styles.loadingSpinner}>
                    <div className={styles.spinner}></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    <span>Confirm Booking</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12,5 19,12 12,19"></polyline>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {bookingStep === 'email' && (
          <div className={styles.seatSelection}>
            <div className={styles.selectionSection}>
              <div className={styles.sectionHeader}>
                <h3>Enter Email Address</h3>
              </div>
              <div className={styles.emailInput}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  className={emailError ? styles.emailInputError : ''}
                />
                {emailError && <div className={styles.errorMessage}>{emailError}</div>}
              </div>
              <div className={styles.emailNote}>
                <p>We'll send your booking confirmation and tickets to this email address.</p>
              </div>
            </div>

            <div className={styles.bookingSummary}>
              <div className={styles.summaryHeader}>
                <h3>Booking Summary</h3>
              </div>
              <div className={styles.summaryDetails}>
                <div className={styles.summaryRow}>
                  <span>Number of Seats</span>
                  <span className={styles.summaryValue}>{selectedSeats}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Seat Type</span>
                  <span className={styles.summaryValue}>
                    <span className={styles.seatTypeBadge} style={{ backgroundColor: seatTypeInfo[selectedType].color }}>
                      {seatTypeInfo[selectedType].icon} {seatTypeInfo[selectedType].name}
                    </span>
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Price per Seat</span>
                  <span className={styles.summaryValue}>₹{seatPrices[selectedType]}</span>
                </div>
              </div>
              
              <div className={styles.totalSection}>
                <div className={styles.totalRow}>
                  <span>Total Amount</span>
                  <span className={styles.totalAmount}>₹{calculateTotal()}</span>
                </div>
                <div className={styles.totalNote}>
                  *Including all applicable taxes and convenience fees
                </div>
              </div>

              <button 
                className={`${styles.confirmButton} ${!email.trim() ? styles.disabled : ''}`}
                onClick={handleEmailSubmit}
                disabled={!email.trim() || isLoading}
              >
                {isLoading ? (
                  <div className={styles.loadingSpinner}>
                    <div className={styles.spinner}></div>
                    <span>Sending Email...</span>
                  </div>
                ) : (
                  <>
                    <span>Send Confirmation Email</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12,5 19,12 12,19"></polyline>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {bookingStep === 'confirmation' && (
          <div className={styles.confirmation}>
            <div className={styles.successAnimation}>
              <div className={styles.successIcon}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22,4 12,14.01 9,11.01"></polyline>
                </svg>
              </div>
            </div>
            <h2>Booking Confirmed!</h2>
            <p className={styles.confirmationSubtitle}>Your tickets have been successfully booked</p>
            
            <div className={styles.bookingDetails}>
              <div className={styles.detailCard}>
                <div className={styles.detailHeader}>
                  <span className={styles.detailIcon}>🎬</span>
                  <span className={styles.detailLabel}>Movie</span>
                </div>
                <span className={styles.detailValue}>{movieName}</span>
              </div>
              
              <div className={styles.detailCard}>
                <div className={styles.detailHeader}>
                  <span className={styles.detailIcon}>🏢</span>
                  <span className={styles.detailLabel}>Theatre</span>
                </div>
                <span className={styles.detailValue}>{theatreName}</span>
              </div>
              
              <div className={styles.detailCard}>
                <div className={styles.detailHeader}>
                  <span className={styles.detailIcon}>🕐</span>
                  <span className={styles.detailLabel}>Showtime</span>
                </div>
                <span className={styles.detailValue}>{showtime} ({format})</span>
              </div>
              
              <div className={styles.detailCard}>
                <div className={styles.detailHeader}>
                  <span className={styles.detailIcon}>💺</span>
                  <span className={styles.detailLabel}>Seats</span>
                </div>
                <span className={styles.detailValue}>{selectedSeats} {selectedType.replace('_', ' ')}</span>
              </div>
              
              <div className={styles.detailCard}>
                <div className={styles.detailHeader}>
                  <span className={styles.detailIcon}>💰</span>
                  <span className={styles.detailLabel}>Amount</span>
                </div>
                <span className={styles.detailValue}>₹{calculateTotal()}</span>
              </div>
              
              <div className={styles.detailCard}>
                <div className={styles.detailHeader}>
                  <span className={styles.detailIcon}>🆔</span>
                  <span className={styles.detailLabel}>Booking ID</span>
                </div>
                <span className={styles.detailValue}>{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
              </div>
            </div>
            
            <div className={styles.confirmationMessage}>
              <div className={styles.messageIcon}>📧</div>
              <p>{emailStatus || 'You will receive a confirmation email with your tickets shortly.'}</p>
            </div>
            
            <button className={styles.closeButton} onClick={handleClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatBooking; 