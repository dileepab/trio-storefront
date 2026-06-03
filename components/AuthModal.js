'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { useI18n } from '@/lib/i18n';

export default function AuthModal({ isOpen, onClose, brandId }) {
  const { login, register } = useAuth();
  const { t } = useI18n();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  
  // Login fields
  const [loginIdent, setLoginIdent] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const isModa = brandId === 'modabella';

  const formatText = (text) => {
    return isModa ? text.toLowerCase() : text;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!loginIdent.trim() || !loginPassword.trim()) {
      setError(formatText('Please enter both your email/phone and password.'));
      return;
    }

    setLoading(true);
    try {
      login(loginIdent.trim(), loginPassword.trim());
      onClose();
    } catch (err) {
      setError(formatText(err.message || 'Login failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regAddress.trim() || !regPassword.trim()) {
      setError(formatText('All registration fields are required.'));
      return;
    }

    if (regPassword.length < 6) {
      setError(formatText('Password must be at least 6 characters long.'));
      return;
    }

    setLoading(true);
    try {
      register(regName.trim(), regEmail.trim(), regPhone.trim(), regAddress.trim(), regPassword.trim());
      onClose();
    } catch (err) {
      setError(formatText(err.message || 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="auth-header">
          <h2 className="auth-title-text">
            {formatText(tab === 'login' ? 'Welcome Back' : 'Create Account')}
          </h2>
          <button 
            onClick={onClose} 
            aria-label="Close" 
            style={{ background: 'transparent', border: 0, fontSize: '28px', color: 'var(--brand-muted)', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <div 
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`} 
            onClick={() => { setTab('login'); setError(''); }}
          >
            {formatText('Sign In')}
          </div>
          <div 
            className={`auth-tab ${tab === 'register' ? 'active' : ''}`} 
            onClick={() => { setTab('register'); setError(''); }}
          >
            {formatText('Register')}
          </div>
        </div>

        {/* Body */}
        <div className="auth-body">
          {error && <div className="auth-error">{error}</div>}

          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="form-grid">
              <div className="form-group">
                <label>{formatText('Email or phone number')}</label>
                <input 
                  type="text" 
                  value={loginIdent} 
                  onChange={(e) => setLoginIdent(e.target.value)} 
                  className="form-input" 
                  placeholder={formatText('demo@garmentos.lk or 0701234567')}
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>{formatText('Password')}</label>
                <input 
                  type="password" 
                  value={loginPassword} 
                  onChange={(e) => setLoginPassword(e.target.value)} 
                  className="form-input" 
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
              <button 
                type="submit" 
                className="btn primary lg full" 
                style={{ marginTop: '10px' }}
                disabled={loading}
              >
                {loading ? formatText('Signing In...') : formatText('Sign In')}
              </button>
              <div className="caption text-center" style={{ marginTop: '8px' }}>
                {formatText('Demo access password: ')} <strong>password123</strong>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="form-grid">
              <div className="form-group">
                <label>{formatText('Full Name')}</label>
                <input 
                  type="text" 
                  value={regName} 
                  onChange={(e) => setRegName(e.target.value)} 
                  className="form-input" 
                  placeholder={formatText('Enter your name')}
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>{formatText('Email Address')}</label>
                <input 
                  type="email" 
                  value={regEmail} 
                  onChange={(e) => setRegEmail(e.target.value)} 
                  className="form-input" 
                  placeholder="name@example.com"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>{formatText('Phone Number')}</label>
                <input 
                  type="tel" 
                  value={regPhone} 
                  onChange={(e) => setRegPhone(e.target.value)} 
                  className="form-input" 
                  placeholder="07XXXXXXXX"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>{formatText('Delivery Address')}</label>
                <textarea 
                  value={regAddress} 
                  onChange={(e) => setRegAddress(e.target.value)} 
                  className="form-input textarea" 
                  placeholder={formatText('Enter your shipping address')}
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>{formatText('Password')}</label>
                <input 
                  type="password" 
                  value={regPassword} 
                  onChange={(e) => setRegPassword(e.target.value)} 
                  className="form-input" 
                  placeholder="•••••••• (min 6 chars)"
                  disabled={loading}
                />
              </div>
              <button 
                type="submit" 
                className="btn primary lg full" 
                style={{ marginTop: '10px' }}
                disabled={loading}
              >
                {loading ? formatText('Registering...') : formatText('Create Account')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
