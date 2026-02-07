import { PTFLogo } from './PTFLogo';

type Props = {
  menuOpen: boolean;
  onMenuToggle: () => void;
  showFreeRosaryLink?: boolean;
};

const API_BASE = typeof import.meta.env !== 'undefined' && import.meta.env?.VITE_API_URL
  ? (import.meta.env as { VITE_API_URL: string }).VITE_API_URL
  : '';

export function Header({ menuOpen, onMenuToggle, showFreeRosaryLink = true }: Props) {
  return (
    <header class="header">
      <PTFLogo open={menuOpen} onClick={onMenuToggle} aria-label={menuOpen ? 'Close menu' : 'Open menu'} />
      {showFreeRosaryLink && (
        <a href={API_BASE ? '/#/donate' : '#'} className="header__link glass-btn">
          get your free rosary
        </a>
      )}
    </header>
  );
}
