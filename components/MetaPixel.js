'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * Lets Meta see what happens on the site.
 *
 * Without it an ad can only be optimised for clicks, because clicks are the
 * last thing Meta observes. Every campaign that ran before this was buying
 * the cheapest click or the cheapest message, which is how the inbox filled
 * with conversations that never became orders.
 *
 * Purchases are reported from the server as well. Both carry the same event
 * id so Meta counts one sale, not two — see reportOrderConversion on the
 * platform, which uses `order-<id>` as its event id.
 */
export default function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!pixelId || typeof window.fbq !== 'function') return;

    // The snippet already fires PageView on load; firing again here would
    // double-count the landing page.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    window.fbq('track', 'PageView');
  }, [pathname, pixelId]);

  if (!pixelId) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window,document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixelId}');
        fbq('track', 'PageView');
      `}
    </Script>
  );
}
