import './globals.css';
import './storefront.css';

export const metadata = {
  title: 'Trio Storefront',
  description: 'Multi-brand storefront for Happy Buy, Cleopatra, and Modabella.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
