import { route } from 'preact-router';

type Props = {
  open: boolean;
  onClose: () => void;
};

function NavLink({ href, children }: { href: string; children: string; onClose: () => void }) {
  return (
    <a
      href={href}
      className="menu__link glass-btn--menu"
      onClick={(e) => {
        e.preventDefault();
        route(href);
      }}
    >
      {children}
    </a>
  );
}

export function Menu({ open, onClose }: Props) {
  return (
    <div className={`menu ${open ? 'menu--open' : ''}`} role="dialog" aria-modal="true" aria-label="Navigation">
      <div className="menu__panel">
        <p className="menu__title">our lady</p>
        <nav className="menu__nav">
          <NavLink href="/" onClose={onClose}>home</NavLink>
          <NavLink href="/guided" onClose={onClose}>guided rosary</NavLink>
          <NavLink href="/mysteries" onClose={onClose}>mysteries for today</NavLink>
          <NavLink href="/encouragement" onClose={onClose}>encouragement</NavLink>
          <a href="#" className="menu__link glass-btn--menu">donate</a>
        </nav>
        <a
          href="/mysteries"
          className="menu__cta glass-btn"
          onClick={(e) => {
            e.preventDefault();
            route('/mysteries');
          }}
        >
          today's mysteries →
        </a>
      </div>
      <div className="menu__backdrop" onClick={onClose} aria-hidden />
    </div>
  );
}
