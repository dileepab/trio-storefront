import Icon from './Icon';

export default function Footer({ brand }) {
  const lower = brand.id === 'modabella';
  const t = (s, lc) => lower ? s.toLowerCase() : (lc || s);
  return (
    <footer className="sf-footer">
      <div className="sf-footer-inner">
        <div>
          <img src={`/logos/${brand.id}.svg`} alt={brand.name} className="sf-footer-logo"/>
          <p className="caption">
            {brand.id === 'happybuy' && "Sri Lanka's value fashion store. COD island-wide."}
            {brand.id === 'cleopatra' && 'Hand-finished bridal & heritage wear, made in Kandy.'}
            {brand.id === 'modabella' && 'considered tailoring, made in colombo.'}
          </p>
        </div>
        <div>
          <div className="sf-footer-label">{t('Shop')}</div>
          <a href="#">{t('New')}</a>
          <a href="#">{t('Sale')}</a>
          <a href="#">{t('Brands')}</a>
        </div>
        <div>
          <div className="sf-footer-label">{t('Help')}</div>
          <a href="#">{t('Shipping')}</a>
          <a href="#">{t('Returns')}</a>
          <a href="#">{t('Size guide')}</a>
        </div>
        <div>
          <div className="sf-footer-label">{t('Follow')}</div>
          <a href="#"><Icon name="msg" size={14}/> Messenger</a>
          <a href="#"><Icon name="msg" size={14}/> WhatsApp</a>
        </div>
      </div>
      <div className="sf-footer-base">
        <span>© 2026 {brand.name}</span>
        <span>{brand.domain}</span>
      </div>
    </footer>
  );
}
