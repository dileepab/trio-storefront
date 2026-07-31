import Icon from './Icon';

export default function Footer({ brand }) {
  const lower = brand.id === 'modabella';
  const t = (s, lc) => lower ? s.toLowerCase() : (lc || s);
  return (
    <footer className="sf-footer">
      <div className="sf-footer-inner">
        <div>
          <img src={brand.logo} alt={brand.name} className="sf-footer-logo"/>
          <p className="caption">
            {brand.id === 'happybuy' && "Sri Lanka's value fashion store. COD island-wide."}
            {brand.id === 'cleopatra' && 'Hand-finished bridal & heritage wear, made in Kandy.'}
            {brand.id === 'modabella' && 'considered tailoring, made in colombo.'}
          </p>
        </div>
        {/* Each column is a labelled nav so the groups are distinguishable
            rather than one undifferentiated run of links. */}
        <nav aria-label={t('Shop')}>
          <h2 className="sf-footer-label">{t('Shop')}</h2>
          <a href="#">{t('New')}</a>
          <a href="#">{t('Sale')}</a>
          <a href="#">{t('Brands')}</a>
        </nav>
        <nav aria-label={t('Help')}>
          <h2 className="sf-footer-label">{t('Help')}</h2>
          <a href="#">{t('Shipping')}</a>
          <a href="#">{t('Returns')}</a>
          <a href="#">{t('Size guide')}</a>
        </nav>
        <nav aria-label={t('Follow')}>
          <h2 className="sf-footer-label">{t('Follow')}</h2>
          <a href="#"><Icon name="msg" size={14}/> Messenger</a>
          <a href="#"><Icon name="msg" size={14}/> WhatsApp</a>
        </nav>
      </div>
      <div className="sf-footer-base">
        <span>© 2026 {brand.name}</span>
        <span>{brand.domain}</span>
      </div>
    </footer>
  );
}
