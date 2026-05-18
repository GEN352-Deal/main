import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import './ExchangePage.css';

const COURIERS = [
  { id: 'flash', name: 'Flash Express', price: 45, days: '1-2', logo: '⚡' },
  { id: 'kerry', name: 'Kerry Express', price: 55, days: '1-3', logo: '🟡' },
  { id: 'jt', name: 'J&T Express', price: 40, days: '2-3', logo: '🔴' },
  { id: 'thaipost', name: 'Thailand Post', price: 30, days: '3-5', logo: '📮' },
];

const STEPS_MEETUP = ['Method', 'Location', 'Time & Contact', 'Confirm'];
const STEPS_SHIP = ['Method', 'Addresses', 'Courier', 'Confirm'];

export default function ExchangePage() {
  const navigate = useNavigate();
  const [method, setMethod] = useState(null); // 'meetup' | 'ship'
  const [step, setStep] = useState(0);
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [phone, setPhone] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [courier, setCourier] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const steps = method === 'ship' ? STEPS_SHIP : STEPS_MEETUP;
  const progress = step / (steps.length - 1);

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => navigate('/chat'), 2000);
  };

  if (confirmed) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 72 }}>✅</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: 1 }}>DEAL CONFIRMED!</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          {method === 'meetup'
            ? 'Your meetup details have been sent to both parties.'
            : 'Shipping details confirmed. Track your item in Chat.'}
        </p>
      </div>
    );
  }

  return (
    <div className="exchange-page">
      <TopBar
        title="Arrange Exchange"
        showBack
        subtitle={method ? steps[step] : ''}
      />

      {/* Progress bar */}
      {method && (
        <div className="exchange-progress">
          <div className="exchange-progress-fill" style={{ width: `${progress * 100}%` }} />
          <div className="exchange-steps">
            {steps.map((s, i) => (
              <span key={s} className={`exchange-step-dot ${i <= step ? 'done' : ''}`}>{i + 1}</span>
            ))}
          </div>
        </div>
      )}

      <div className="page-content">
        <div className="exchange-body">

          {/* Step 0: Choose method */}
          {step === 0 && (
            <div className="exchange-section animate-fadeIn">
              <h3 className="exchange-section-title">How would you like to deal?</h3>
              <div className="method-cards">
                <button
                  className={`method-card ${method === 'meetup' ? 'method-active' : ''}`}
                  onClick={() => setMethod('meetup')}
                >
                  <span className="method-icon">🤝</span>
                  <div>
                    <div className="method-name">Meet in Person</div>
                    <div className="method-desc">Pick a location and time to meet up</div>
                  </div>
                  {method === 'meetup' && (
                    <svg className="method-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--lime)" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  )}
                </button>

                <button
                  className={`method-card ${method === 'ship' ? 'method-active' : ''}`}
                  onClick={() => setMethod('ship')}
                >
                  <span className="method-icon">📦</span>
                  <div>
                    <div className="method-name">Ship It</div>
                    <div className="method-desc">Send via courier — both parties ship</div>
                  </div>
                  {method === 'ship' && (
                    <svg className="method-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--lime)" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* MEETUP Steps */}
          {method === 'meetup' && step === 1 && (
            <div className="exchange-section animate-fadeIn">
              <h3 className="exchange-section-title">Set Meeting Location</h3>
              <div className="form-group" style={{ gap: 8, marginBottom: 16 }}>
                <label className="form-label">Address / Place name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Central World, Bangkok"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="map-placeholder">
                <div className="map-placeholder-inner">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>Tap to pin location</span>
                </div>
              </div>
              <div className="share-location-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
                </svg>
                Share Live Location
              </div>
            </div>
          )}

          {method === 'meetup' && step === 2 && (
            <div className="exchange-section animate-fadeIn">
              <h3 className="exchange-section-title">Date, Time & Contact</h3>
              <div className="form-group" style={{ gap: 8, marginBottom: 12 }}>
                <label className="form-label">Meeting Date & Time</label>
                <input type="datetime-local" className="input-field" value={time} onChange={(e) => setTime(e.target.value)} style={{ colorScheme: 'dark' }} />
              </div>
              <div className="form-group" style={{ gap: 8, marginBottom: 12 }}>
                <label className="form-label">Your Phone Number</label>
                <input type="tel" className="input-field" placeholder="+66 8x-xxxx-xxxx" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="info-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                </svg>
                <span>Phone numbers will only be shared with your deal partner after confirmation.</span>
              </div>
            </div>
          )}

          {method === 'meetup' && step === 3 && (
            <div className="exchange-section animate-fadeIn">
              <h3 className="exchange-section-title">Confirm Meetup</h3>
              <div className="confirm-card">
                <div className="confirm-row">
                  <span className="confirm-label">📍 Location</span>
                  <span className="confirm-val">{location || 'Central World, Bangkok'}</span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-label">📅 Time</span>
                  <span className="confirm-val">{time ? new Date(time).toLocaleString() : 'Jan 20, 2024 — 14:00'}</span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-label">📞 Contact</span>
                  <span className="confirm-val">{phone || 'Shared after confirmation'}</span>
                </div>
              </div>
              <div className="info-box" style={{ borderColor: 'rgba(200,255,0,0.25)', background: 'rgba(200,255,0,0.05)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--lime)" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span style={{ color: 'var(--lime)' }}>Both parties will receive a safety reminder to meet in a public place.</span>
              </div>
            </div>
          )}

          {/* SHIP Steps */}
          {method === 'ship' && step === 1 && (
            <div className="exchange-section animate-fadeIn">
              <h3 className="exchange-section-title">Shipping Addresses</h3>
              <div className="form-group" style={{ gap: 8, marginBottom: 16 }}>
                <label className="form-label">📤 Your Address (Sender)</label>
                <textarea className="input-field" rows={3} placeholder="Full address with postal code" value={fromAddress} onChange={(e) => setFromAddress(e.target.value)} style={{ resize: 'none' }} />
              </div>
              <div className="form-group" style={{ gap: 8 }}>
                <label className="form-label">📥 Partner's Address (Recipient)</label>
                <textarea className="input-field" rows={3} placeholder="Partner's address will be pre-filled" value={toAddress} onChange={(e) => setToAddress(e.target.value)} style={{ resize: 'none' }} />
              </div>
            </div>
          )}

          {method === 'ship' && step === 2 && (
            <div className="exchange-section animate-fadeIn">
              <h3 className="exchange-section-title">Choose Courier</h3>
              <div className="courier-list">
                {COURIERS.map((c) => (
                  <button
                    key={c.id}
                    className={`courier-card ${courier?.id === c.id ? 'courier-active' : ''}`}
                    onClick={() => setCourier(c)}
                  >
                    <span className="courier-logo">{c.logo}</span>
                    <div className="courier-info">
                      <span className="courier-name">{c.name}</span>
                      <span className="courier-days">{c.days} business days</span>
                    </div>
                    <div className="courier-price">
                      <span>฿{c.price}</span>
                    </div>
                    {courier?.id === c.id && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--lime)" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              <div className="shipping-options">
                <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>Drop-off preference</h4>
                {['Courier picks up from my address', 'I\'ll drop off at service point'].map((opt) => (
                  <label key={opt} className="radio-option">
                    <input type="radio" name="dropoff" style={{ accentColor: 'var(--pink)' }} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {method === 'ship' && step === 3 && (
            <div className="exchange-section animate-fadeIn">
              <h3 className="exchange-section-title">Confirm Shipment</h3>
              <div className="confirm-card">
                <div className="confirm-row">
                  <span className="confirm-label">📦 Courier</span>
                  <span className="confirm-val">{courier?.name || 'Flash Express'}</span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-label">💰 Shipping fee</span>
                  <span className="confirm-val" style={{ color: 'var(--lime)' }}>฿{courier?.price || 45}</span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-label">🕐 Est. delivery</span>
                  <span className="confirm-val">{courier?.days || '1-2'} business days</span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-label">📤 From</span>
                  <span className="confirm-val">{fromAddress || 'Bangkok 10400'}</span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-label">📥 To</span>
                  <span className="confirm-val">{toAddress || 'Bangkok 10120'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="exchange-footer">
        {step > 0 && (
          <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(s => s - 1)}>
            ← Back
          </button>
        )}
        {step < steps.length - 1 ? (
          <button className="btn-primary" style={{ flex: 2 }} onClick={() => setStep(s => s + 1)} disabled={step === 0 && !method}>
            Continue →
          </button>
        ) : (
          <button className="btn-primary" style={{ flex: 2, background: 'var(--lime)', color: '#000' }} onClick={handleConfirm}>
            ✓ Confirm Exchange
          </button>
        )}
      </div>
    </div>
  );
}
