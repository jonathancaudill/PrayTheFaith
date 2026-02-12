import { route } from 'preact-router';

type Props = {
  open: boolean;
  onClose: () => void;
  pathname: string;
};

function NavLink({ href, children, onClose, pathname }: { href: string; children: string; onClose: () => void; pathname: string }) {
  const isCurrent = (pathname || '/') === (href || '/');
  return (
    <a
      href={href}
      className="menu__link glass-btn--menu"
      onClick={(e) => {
        e.preventDefault();
        if (isCurrent) {
          onClose();
        } else {
          route(href);
        }
      }}
    >
      {children}
    </a>
  );
}

export function Menu({ open, onClose, pathname }: Props) {
  return (
    <div className={`menu ${open ? 'menu--open' : ''}`} role="dialog" aria-modal="true" aria-label="Navigation">
      <div className="menu__panel" onClick={onClose}>
        <p className="menu__title">dedicated to Our Lady</p>
        <nav className="menu__nav" onClick={(e) => e.stopPropagation()}>
          <NavLink href="/" onClose={onClose} pathname={pathname}>home</NavLink>
          <NavLink href="/guided" onClose={onClose} pathname={pathname}>guided rosary</NavLink>
          <NavLink href="/mysteries" onClose={onClose} pathname={pathname}>mysteries for today</NavLink>
          <NavLink href="/encouragement" onClose={onClose} pathname={pathname}>encouragement</NavLink>
          <NavLink href="/donate" onClose={onClose} pathname={pathname}>donate</NavLink>
        </nav>
      </div>
      <div className="menu__backdrop" onClick={onClose} aria-hidden />
    </div>
  );
}
