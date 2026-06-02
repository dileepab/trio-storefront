'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Icon from './Icon';

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
  const [open, setOpen] = useState(false);
  const [senderId, setSenderId] = useState(null);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState(() => [
    {
      id: 'hello',
      role: 'assistant',
      text: greeting(brandName),
    },
  ]);
  const bodyRef = useRef(null);

  const canSend = input.trim().length > 0 && !sending;

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
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: 'user', text },
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

      if (payload.reply || payload.imageUrl || payload.imageUrls?.length || payload.carouselProducts?.length) {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            text: payload.reply || '',
            imageUrls: payload.imageUrls || (payload.imageUrl ? [payload.imageUrl] : []),
            carouselProducts: payload.carouselProducts || [],
          },
        ]);
      } else if (payload.silentReason) {
        setMessages((prev) => [
          ...prev,
          {
            id: `support-${Date.now()}`,
            role: 'assistant',
            text: 'Our support team has picked up this conversation. Please wait for a team reply.',
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          text: 'Sorry, I could not reach the chat assistant right now. Please try again.',
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
          <div key={message.id} className={`chat-bub ${message.role === 'user' ? 'out' : 'in'}`}>
            {message.text && <div>{message.text}</div>}
            {message.imageUrls?.length > 0 && (
              <div className="chat-media-grid">
                {message.imageUrls.map((imageUrl) => (
                  <img key={imageUrl} src={imageUrl} alt="Chat attachment" className="chat-media"/>
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
        ))}
        {sending && <div className="chat-bub in chat-typing">Typing...</div>}
      </div>
      <div className="chat-deeplinks">
        <Link className="chat-deep fb" href={`https://m.me/${brandId}`} target="_blank">Messenger</Link>
        <Link className="chat-deep wa" href={`https://wa.me/94701234567?text=${deeplinkText}`} target="_blank">WhatsApp</Link>
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
    </div>
  );
}
