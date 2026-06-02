import Icon from './Icon';

const ITEMS = {
  happybuy:  [['truck','COD island-wide'],['rotate','7-day return'],['shield','Real product photos']],
  cleopatra: [['shield','Authenticity'],['truck','Island-wide'],['rotate','7-day return']],
  modabella: [['truck','free shipping over LKR 8,000'],['rotate','7-day returns'],['shield','cod available']],
};

export default function TrustStrip({ brand }) {
  const items = ITEMS[brand] || ITEMS.modabella;
  return (
    <div className="trust">
      {items.map(([ic, label]) => (
        <div className="trust-item" key={label}>
          <Icon name={ic} size={16}/>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
