import { useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import { useRouter } from 'preact-router';
import { Header } from './Header';
import { Menu } from './Menu';

type Props = {
  children: ComponentChildren;
  /** Use hero background (landscape) instead of content grey; defaults to true on home */
  hero?: boolean;
};

export function Layout({ children, hero: heroProp }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [routerArgs] = useRouter();
  const pathname = (routerArgs?.url ?? '').split('?')[0] || (typeof window !== 'undefined' ? window.location.pathname : '');
  const hero = heroProp ?? (pathname === '/' || pathname === '');

  return (
    <div className={hero ? 'layout layout--hero' : 'layout'}>
      <Header menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((o) => !o)} />
      <Menu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="layout__main">{children}</main>
    </div>
  );
}
