'use client';
import { useId, useRef, useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { useI18n } from '@/lib/i18n';
import { useDialog } from '@/lib/useDialog';

const TABS = ['login', 'register'];

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

  const uid = useId();
  const titleId = `${uid}-title`;
  const errorId = `${uid}-error`;
  const fid = (name) => `${uid}-${name}`;
  const tabRefs = useRef({});

  const { panelRef, dialogProps } = useDialog({
    isOpen,
    onClose,
    labelledBy: titleId,
  });

  if (!isOpen) return null;

  const isModa = brandId === 'modabella';

  const formatText = (text) => {
    return isModa ? text.toLowerCase() : text;
  };

  const selectTab = (next) => {
    setTab(next);
    setError('');
  };

  // Arrow-key navigation between the two tabs, per the ARIA tabs pattern
  const onTabKeyDown = (event) => {
    const index = TABS.indexOf(tab);
    let next = null;
    if (event.key === 'ArrowRight') next = TABS[(index + 1) % TABS.length];
    if (event.key === 'ArrowLeft') next = TABS[(index - 1 + TABS.length) % TABS.length];
    if (event.key === 'Home') next = TABS[0];
    if (event.key === 'End') next = TABS[TABS.length - 1];
    if (!next) return;
    event.preventDefault();
    selectTab(next);
    tabRefs.current[next]?.focus();
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

  // Every field gets a real label/control pairing. These used to be bare
  // <label> elements with no `for`, so each input's accessible name was empty
  // and a screen reader announced only "edit text".
  const field = (name, labelText, input) => (
    <div className="form-group">
      <label htmlFor={fid(name)}>{formatText(labelText)}</label>
      {input}
    </div>
  );

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div
        className="auth-card"
        ref={panelRef}
        {...dialogProps}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="auth-header">
          <h2 className="auth-title-text" id={titleId}>
            {formatText(tab === 'login' ? 'Welcome Back' : 'Create Account')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={formatText('Close')}
            style={{ background: 'transparent', border: 0, fontSize: '28px', color: 'var(--brand-muted)', cursor: 'pointer' }}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        {/* Tabs — real buttons in a tablist. As <div onClick> these were not
            focusable at all, so "Register" was unreachable by keyboard and
            account creation was impossible without a mouse. */}
        <div className="auth-tabs" role="tablist" aria-label={formatText('Sign in or register')}>
          {TABS.map(key => (
            <button
              key={key}
              type="button"
              role="tab"
              id={`${uid}-tab-${key}`}
              ref={(el) => { tabRefs.current[key] = el; }}
              aria-selected={tab === key}
              aria-controls={`${uid}-panel-${key}`}
              tabIndex={tab === key ? 0 : -1}
              className={`auth-tab ${tab === key ? 'active' : ''}`}
              onClick={() => selectTab(key)}
              onKeyDown={onTabKeyDown}
            >
              {formatText(key === 'login' ? 'Sign In' : 'Register')}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="auth-body">
          {/* role="alert" so validation failures are spoken when they appear */}
          {error && <div className="auth-error" id={errorId} role="alert">{error}</div>}

          {tab === 'login' ? (
            <form
              onSubmit={handleLoginSubmit}
              className="form-grid"
              role="tabpanel"
              id={`${uid}-panel-login`}
              aria-labelledby={`${uid}-tab-login`}
            >
              {field('login-ident', 'Email or phone number', (
                <input
                  id={fid('login-ident')}
                  type="text"
                  value={loginIdent}
                  onChange={(e) => setLoginIdent(e.target.value)}
                  className="form-input"
                  placeholder={formatText('demo@garmentos.lk or 0701234567')}
                  autoComplete="username"
                  aria-required="true"
                  aria-invalid={!!error}
                  disabled={loading}
                />
              ))}
              {field('login-password', 'Password', (
                <input
                  id={fid('login-password')}
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="form-input"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  aria-required="true"
                  aria-invalid={!!error}
                  disabled={loading}
                />
              ))}
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
            <form
              onSubmit={handleRegisterSubmit}
              className="form-grid"
              role="tabpanel"
              id={`${uid}-panel-register`}
              aria-labelledby={`${uid}-tab-register`}
            >
              {field('reg-name', 'Full Name', (
                <input
                  id={fid('reg-name')}
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="form-input"
                  placeholder={formatText('Enter your name')}
                  autoComplete="name"
                  aria-required="true"
                  disabled={loading}
                />
              ))}
              {field('reg-email', 'Email Address', (
                <input
                  id={fid('reg-email')}
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="form-input"
                  placeholder="name@example.com"
                  autoComplete="email"
                  aria-required="true"
                  disabled={loading}
                />
              ))}
              {field('reg-phone', 'Phone Number', (
                <input
                  id={fid('reg-phone')}
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="form-input"
                  placeholder="07XXXXXXXX"
                  autoComplete="tel"
                  aria-required="true"
                  disabled={loading}
                />
              ))}
              {field('reg-address', 'Delivery Address', (
                <textarea
                  id={fid('reg-address')}
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  className="form-input textarea"
                  placeholder={formatText('Enter your shipping address')}
                  autoComplete="street-address"
                  aria-required="true"
                  disabled={loading}
                />
              ))}
              {field('reg-password', 'Password', (
                <input
                  id={fid('reg-password')}
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="form-input"
                  placeholder="•••••••• (min 6 chars)"
                  autoComplete="new-password"
                  aria-required="true"
                  aria-describedby={`${uid}-pw-hint`}
                  disabled={loading}
                />
              ))}
              <p id={`${uid}-pw-hint`} className="caption" style={{ margin: '-8px 0 0' }}>
                {formatText('Must be at least 6 characters.')}
              </p>
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
