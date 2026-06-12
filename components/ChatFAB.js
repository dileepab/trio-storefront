'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Icon from './Icon';
import { useAuth } from '@/lib/authContext';

function getOrCreateSenderId() {
  const key = 'trio_storefront_chat_sender_id';
  const existing = window.localStorage.getItem(key);

  if (existing) {
    return existing;
  }

  const value = `web-${window.crypto?.randomUUID ? window.crypto.randomUUID() : Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(key, value);
  return value;
}

function chatTitle(brandId) {
  if (brandId === 'modabella') return "questions? we're here.";
  if (brandId === 'cleopatra') return 'Speak to a stylist';
  return 'Chat with us';
}

function greeting(brandName) {
  return `Hi. How can I help with ${brandName || 'your order'} today?`;
}

export default function ChatFAB({ brand }) {
  const brandId = brand?.id || 'happybuy';
  const brandName = brand?.name || 'Happy Buy';
  const { currentUser, isHydrated: authHydrated } = useAuth();
  
  const formatText = (text) => {
    return brandId === 'modabella' ? text.toLowerCase() : text;
  };

  const renderMessageText = (text) => {
    const formatted = formatText(text);
    if (!formatted) return null;
    
    const lines = formatted.split('\n');
    return lines.map((line, index) => {
      const match = line.match(/^([A-Za-z\s/]+:)(.*)$/);
      if (match) {
        const [, label, value] = match;
        return (
          <div key={index} style={{ margin: '2px 0' }}>
            <span style={{ fontWeight: '600', opacity: 0.95 }}>{label}</span>{value}
          </div>
        );
      }
      if (line.trim().toLowerCase() === 'order summary') {
        return (
          <div key={index} style={{ fontWeight: '700', fontSize: '14.5px', borderBottom: '1.5px solid var(--brand-border-subtle)', paddingBottom: '6px', marginBottom: '8px', textTransform: brandId === 'modabella' ? 'lowercase' : 'uppercase', letterSpacing: '0.05em' }}>
            📋 {line}
          </div>
        );
      }
      return <div key={index} style={{ marginTop: line.trim() ? '4px' : '0' }}>{line}</div>;
    });
  };

  const [open, setOpen] = useState(false);
  const [senderId, setSenderId] = useState(null);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  
  const defaultGreeting = useMemo(() => [{
    id: 'hello',
    role: 'assistant',
    text: greeting(brandName),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }], [brandName]);

  const [messages, setMessages] = useState([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [activePreviewImageUrl, setActivePreviewImageUrl] = useState(null);
  const bodyRef = useRef(null);

  const canSend = input.trim().length > 0 && !sending;

  // Resolve persistent history key based on login status and brand ID
  const historyKey = useMemo(() => {
    const userId = currentUser ? currentUser.id : 'guest';
    return `trio_chat_history_${brandId}_${userId}`;
  }, [currentUser, brandId]);

  // Load persistent history on mount or when user session changes
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(historyKey);
      if (storedHistory) {
        setMessages(JSON.parse(storedHistory));
      } else {
        setMessages(defaultGreeting);
      }
      setHistoryLoaded(true);
    } catch (e) {
      console.error('Failed to load chat history:', e);
      setMessages(defaultGreeting);
    }
  }, [historyKey, defaultGreeting]);

  // Save history when messages update
  useEffect(() => {
    if (historyLoaded && messages.length > 0) {
      try {
        localStorage.setItem(historyKey, JSON.stringify(messages));
      } catch (e) {
        console.error('Failed to save chat history:', e);
      }
    }
  }, [messages, historyKey, historyLoaded]);

  useEffect(() => {
    setSenderId(getOrCreateSenderId());
  }, []);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, sending, open]);

  const deeplinkText = useMemo(
    () => encodeURIComponent(`Hi ${brandName}, I need help with an order.`),
    [brandName]
  );

  async function sendMessage(event) {
    event.preventDefault();
    const text = input.trim();

    if (!text || sending) {
      return;
    }

    const stableSenderId = senderId || getOrCreateSenderId();
    if (!senderId) {
      setSenderId(stableSenderId);
    }

    setInput('');
    setSending(true);
    const messageTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: 'user', text, time: messageTime },
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          senderId: stableSenderId,
          channel: 'web',
          brand: brandId,
        }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Chat failed.');
      }

      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (payload.reply || payload.imageUrl || payload.imageUrls?.length || payload.carouselProducts?.length) {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            text: payload.reply || '',
            imageUrls: payload.imageUrls || (payload.imageUrl ? [payload.imageUrl] : []),
            carouselProducts: payload.carouselProducts || [],
            time: replyTime,
          },
        ]);
      } else if (payload.silentReason) {
        setMessages((prev) => [
          ...prev,
          {
            id: `support-${Date.now()}`,
            role: 'assistant',
            text: 'Our support team has picked up this conversation. Please wait for a team reply.',
            time: replyTime,
          },
        ]);
      }
    } catch {
      const errorTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          text: 'Sorry, I could not reach the chat assistant right now. Please try again.',
          time: errorTime,
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  if (!open) {
    return (
      <button className="fab" aria-label="Chat with us" onClick={() => setOpen(true)}>
        <Icon name="msg" size={22}/>
      </button>
    );
  }

  return (
    <div className="chat-panel">
      <div className="chat-head">
        <div>
          <div className="chat-title">{chatTitle(brandId)}</div>
          <div className="chat-sub">{sending ? 'Typing...' : 'AI assistant online'}</div>
        </div>
        <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close">×</button>
      </div>
      <div className="chat-body" ref={bodyRef}>
        {messages.map((message) => (
          <div 
            key={message.id} 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              width: '100%', 
              alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
              margin: '2px 0'
            }}
          >
            <div className={`chat-bub ${message.role === 'user' ? 'out' : 'in'}`}>
              {message.text && <div>{renderMessageText(message.text)}</div>}
              {message.imageUrls?.length > 0 && (
                <div className="chat-media-grid">
                  {message.imageUrls.map((imageUrl) => (
                    <div 
                      key={imageUrl} 
                      onClick={() => setActivePreviewImageUrl(imageUrl)} 
                      title="Click to zoom size chart" 
                      style={{ cursor: 'zoom-in', display: 'block' }}
                    >
                      <img src={imageUrl} alt="Chat attachment" className="chat-media" style={{ display: 'block' }}/>
                    </div>
                  ))}
                </div>
              )}
              {message.carouselProducts?.length > 0 && (
                <div className="chat-product-list">
                  {message.carouselProducts.slice(0, 4).map((product) => (
                    <div key={product.id} className="chat-product">
                      {product.imageUrl && <img src={product.imageUrl} alt={product.name}/>}
                      <div>
                        <div className="chat-product-name">{product.name}</div>
                        <div className="caption">LKR {Number(product.price).toLocaleString('en-LK')}</div>
                        <div className="caption">Sizes {product.sizes || '-'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {message.time && (
              <span 
                className="chat-time" 
                style={{ 
                  fontSize: '9px', 
                  color: 'var(--brand-muted)', 
                  opacity: 0.75,
                  marginTop: '2px', 
                  padding: '0 4px', 
                  alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start' 
                }}
              >
                {message.time}
              </span>
            )}
          </div>
        ))}
        {sending && (
          <div 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              width: '100%', 
              alignItems: 'flex-start',
              margin: '2px 0' 
            }}
          >
            <div className="chat-bub in chat-typing">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>
      <form className="chat-input" onSubmit={sendMessage}>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type a message..."
          maxLength={1000}
        />
        <button className="chat-send" aria-label="Send" disabled={!canSend}>→</button>
      </form>

      {/* Image Preview Backdrop Modal */}
      {activePreviewImageUrl && (
        <div 
          className="auth-overlay" 
          onClick={() => setActivePreviewImageUrl(null)} 
          style={{ zIndex: 110, padding: '20px' }}
        >
          <div 
            style={{ 
              position: 'relative', 
              maxWidth: '90%', 
              maxHeight: '90%', 
              background: 'var(--brand-surface)', 
              borderRadius: 'var(--radius-lg)', 
              padding: '8px', 
              boxShadow: 'var(--shadow-lift)',
              border: '1px solid var(--brand-border-subtle)',
              animation: 'scaleIn 0.3s var(--ease-out) forwards',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setActivePreviewImageUrl(null)} 
              style={{ 
                position: 'absolute', top: '-16px', right: '-16px', 
                width: '32px', height: '32px', borderRadius: '50%', 
                background: 'var(--brand-primary)', color: 'var(--brand-text-on-primary)', 
                border: 0, fontSize: '20px', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' 
              }}
              aria-label="Close preview"
            >
              ×
            </button>
            <img 
              src={activePreviewImageUrl} 
              alt="Size chart preview" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '80vh', 
                borderRadius: 'var(--radius)', 
                objectFit: 'contain',
                display: 'block'
              }} 
            />
            <div className="caption" style={{ marginTop: '8px', fontWeight: '500', color: 'var(--brand-muted)' }}>
              {formatText('Click anywhere to close')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
