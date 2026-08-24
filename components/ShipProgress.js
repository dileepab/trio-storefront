'use client';
import { brandVoice } from '@/lib/brands';
import { shippingFor } from '@/lib/shipping';

/**
 * Progress toward the brand's free-courier threshold.
 * Renders nothing when the brand has no threshold configured.
 */
export default function ShipProgress({ brandId, subtotal, deliveryRule = null }) {
  const { threshold, remaining, qualified, progress } = shippingFor(brandId, subtotal, deliveryRule);

  if (threshold === null) return null;

  const say = (text) => brandVoice(brandId, text);
  const fmt = (n) => n.toLocaleString('en-LK');
  const pct = Math.round(progress * 100);

  return (
    <div className={`ship-progress${qualified ? ' is-qualified' : ''}`}>
      <div className="ship-progress-label">
        {qualified ? (
          <>
            <span className="ship-progress-tick" aria-hidden="true">✓</span>
            {say('Free courier unlocked')}
          </>
        ) : (
          <>
            {say('Add')} <strong>LKR {fmt(remaining)}</strong> {say('more for free courier')}
          </>
        )}
      </div>
      <div
        className="ship-progress-track"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={say('Progress toward free courier')}
      >
        <div className="ship-progress-fill" style={{ width: `${pct}%` }}/>
      </div>
    </div>
  );
}
