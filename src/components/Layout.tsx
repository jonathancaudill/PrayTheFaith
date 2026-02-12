import { useState, useLayoutEffect } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import { useRouter } from 'preact-router';
import { Header } from './Header';
import { Menu } from './Menu';
import { useLiquidGL } from '../hooks/useLiquidGL';

type Props = {
  children: ComponentChildren;
  /** Use hero background (landscape) instead of content grey; defaults to true on home */
  hero?: boolean;
};

/** Shared liquidGL config for glass buttons */
const GLASS_BTN_OPTS: Partial<LiquidGLOptions> = {
  refraction: 0.006,
  bevelDepth: 0.03,
  bevelWidth: 0.1,
  frost: 0.6,
  shadow: false,
  specular: true,
  reveal: 'none',
};

export function Layout({ children, hero: heroProp }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [routerArgs] = useRouter();
  const pathname = (routerArgs?.url ?? '').split('?')[0] || (typeof window !== 'undefined' ? window.location.pathname : '');
  const hero = heroProp ?? (pathname === '/' || pathname === '');

  /* Instantly close menu on any route change — useLayoutEffect fires
     before paint so the browser never renders a "menu-open" frame on
     the new page, which prevents the slide-out animation entirely. */
  useLayoutEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  /* Initialise liquidGL on glass buttons whenever the route changes */
  useLiquidGL('.glass-btn', GLASS_BTN_OPTS, true, [pathname]);
  useLiquidGL('.glass-btn--menu', GLASS_BTN_OPTS, true, [pathname]);

  return (
    <div className={hero ? 'layout layout--hero' : 'layout'}>
      <Header menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((o) => !o)} />
      <Menu open={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} />
      <main className="layout__main">{children}</main>
    </div>
  );
}
