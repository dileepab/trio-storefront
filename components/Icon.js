// Tiny inline icon set (Lucide-style strokes).
const I = ({ children, size = 20, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

export default function Icon({ name, size = 20, fill = 'none' }) {
  switch (name) {
    case 'cart':     return <I size={size}><path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M3 4h2"/></I>;
    case 'heart':    return <I size={size} fill={fill}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></I>;
    case 'search':   return <I size={size}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></I>;
    case 'user':     return <I size={size}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></I>;
    case 'menu':     return <I size={size}><path d="M3 6h18M3 12h18M3 18h18"/></I>;
    case 'filter':   return <I size={size}><path d="M3 6h18M6 12h12M10 18h4"/></I>;
    case 'chevron':  return <I size={size}><path d="M9 6l6 6-6 6"/></I>;
    case 'chevron-d':return <I size={size}><path d="M6 9l6 6 6-6"/></I>;
    case 'star':     return <I size={size} fill="currentColor"><path d="M12 3l2.6 5.5 6 .9-4.3 4.2 1 6-5.3-2.8-5.3 2.8 1-6L3.4 9.4l6-.9z"/></I>;
    case 'truck':    return <I size={size}><path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></I>;
    case 'shield':   return <I size={size}><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/></I>;
    case 'rotate':   return <I size={size}><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/></I>;
    case 'msg':      return <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor"><path d="M12 2C6.5 2 2 6.1 2 11.2c0 2.9 1.5 5.5 3.8 7.2V22l3.4-1.9c.9.2 1.8.4 2.8.4 5.5 0 10-4.1 10-9.3S17.5 2 12 2zm1 12.4l-2.5-2.7L5.5 14.4l5.5-5.8 2.6 2.7 4.9-2.7-5.5 5.8z"/></svg>;
    default: return null;
  }
}
