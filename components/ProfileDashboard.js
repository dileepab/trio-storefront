'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { useCart } from '@/lib/cartContext';
import { useI18n } from '@/lib/i18n';

export default function ProfileDashboard({ isOpen, onClose, brandId }) {
  const { currentUser, updateProfile, logout } = useAuth();
  const { orders, getOrderStatus } = useCart();
  const { t } = useI18n();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !currentUser) return null;

  const isModa = brandId === 'modabella';
  const formatText = (text) => {
    return isModa ? text.toLowerCase() : text;
  };

  // Filter orders that belong to this logged-in user and this brand storefront
  const userOrders = orders.filter(o => o.userId === currentUser.id && o.brandId === brandId);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      setError(formatText('All fields are required.'));
      return;
    }

    setLoading(true);
    try {
      updateProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });
      setSuccess(formatText('Profile updated successfully!'));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(formatText(err.message || 'Failed to update profile.'));
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    logout();
    onClose();
  };

  const fmt = (num) => num.toLocaleString('en-LK');

  const getStatusClass = (status) => {
    if (status === 'Pending') return 'pending';
    if (status.includes('Shipped')) return 'shipped';
    return 'delivered';
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="profile-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="auth-header">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <h2 className="auth-title-text">{formatText('My Account')}</h2>
            <span className="caption">— {formatText(`Hello, ${currentUser.name}`)}</span>
          </div>
          <button 
            onClick={onClose} 
            aria-label="Close" 
            style={{ background: 'transparent', border: 0, fontSize: '28px', color: 'var(--brand-muted)', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>

        {/* Split Layout Body */}
        <div className="auth-body" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <div className="form-grid-2">
            {/* Left Column: Profile settings form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderRight: '1px solid var(--brand-border-subtle)', paddingRight: '20px' }}>
              <h3 className="h3" style={{ fontSize: '16px', margin: '0 0 4px', borderBottom: '1px solid var(--brand-border-subtle)', paddingBottom: '6px' }}>
                {formatText('Profile Details')}
              </h3>

              {error && <div className="auth-error">{error}</div>}
              {success && <div className="caption" style={{ background: '#D9EAD3', color: '#274E13', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>{success}</div>}

              <form onSubmit={handleUpdateProfile} className="form-grid" style={{ gap: '12px' }}>
                <div className="form-group">
                  <label>{formatText('Full Name')}</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="form-input"
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>{formatText('Email Address')}</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="form-input"
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>{formatText('Phone Number')}</label>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    className="form-input"
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>{formatText('Delivery Address')}</label>
                  <textarea 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    className="form-input textarea"
                    style={{ minHeight: '60px' }}
                    disabled={loading}
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button type="submit" className="btn primary lg flex-1" disabled={loading}>
                    {loading ? formatText('Saving...') : formatText('Save Changes')}
                  </button>
                  <button type="button" onClick={handleSignOut} className="btn secondary lg" style={{ background: 'var(--brand-surface-2)', border: '1px solid var(--brand-border-subtle)', color: 'var(--brand-text)' }}>
                    {formatText('Sign Out')}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Order History Ledger */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingLeft: '4px' }}>
              <h3 className="h3" style={{ fontSize: '16px', margin: '0 0 4px', borderBottom: '1px solid var(--brand-border-subtle)', paddingBottom: '6px' }}>
                {formatText('Order History')}
              </h3>

              {userOrders.length === 0 ? (
                <div className="text-center" style={{ padding: '40px 10px', color: 'var(--brand-muted)', fontSize: '14px' }}>
                  {formatText("You haven't placed any orders yet.")}
                </div>
              ) : (
                <div className="order-ledger" style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                  {userOrders.map((order) => {
                    const status = getOrderStatus(order);
                    return (
                      <div className="order-row" key={order.id}>
                        <div className="order-row-head">
                          <span className="order-number">{order.orderNumber}</span>
                          <span className="order-date">
                            {new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className={`order-status-badge ${getStatusClass(status)}`}>
                            {formatText(status)}
                          </span>
                        </div>
                        <div className="order-items-summary">
                          {order.items.map((item) => (
                            <div className="order-item-summary" key={item.key}>
                              <span>{formatText(item.title)} ({item.size}) <span style={{ color: 'var(--brand-muted)' }}>× {item.qty}</span></span>
                              <span className="price">LKR {fmt(item.price * item.qty)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="order-total-row">
                          <span>{formatText('Total Amount')}</span>
                          <span className="price">LKR {fmt(order.totalAmount)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
