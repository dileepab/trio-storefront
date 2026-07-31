import './globals.css';
import './storefront.css';

export const metadata = {
  title: 'Trio Storefront',
  description: 'Multi-brand storefront for Happy Buy, Cleopatra, and Modabella.',
};

// No maximumScale / userScalable: capping zoom blocks low-vision shoppers
// (WCAG 1.4.4). The iOS "focusing an input zooms the page" problem that these
// used to guard against is handled properly in globals.css, by keeping form
// controls at >=16px on small screens.
export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
