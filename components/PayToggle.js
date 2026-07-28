'use client';
import { brandVoice } from '@/lib/brands';

const OPTIONS = [
  { key: 'COD', label: 'Cash on delivery', hint: 'Pay at the door' },
  { key: 'Bank', label: 'Bank transfer', hint: 'Instant confirmation' },
];

/**
 * Segmented COD / bank-transfer control. Uses a radiogroup rather than two
 * loose radio inputs so the whole tile is a target, not just the 13px dot.
 */
export default function PayToggle({ brandId, value, onChange }) {
  const say = (text) => brandVoice(brandId, text);

  return (
    <div className="pay-toggle" role="radiogroup" aria-label={say('Payment method')}>
      {OPTIONS.map(option => (
        <button
          key={option.key}
          type="button"
          role="radio"
          aria-checked={value === option.key}
          className={`pay-option${value === option.key ? ' is-on' : ''}`}
          onClick={() => onChange(option.key)}
        >
          <span className="pay-option-label">{say(option.label)}</span>
          <span className="pay-option-hint">{say(option.hint)}</span>
        </button>
      ))}
    </div>
  );
}
