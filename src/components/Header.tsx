import { PTFLogo } from './PTFLogo';

type Props = {
  menuOpen: boolean;
  onMenuToggle: () => void;
  showFreeRosaryLink?: boolean;
};

export function Header({ menuOpen, onMenuToggle, showFreeRosaryLink = true }: Props) {
  return (
    <header class="header">
      <PTFLogo open={menuOpen} onClick={onMenuToggle} aria-label={menuOpen ? 'Close menu' : 'Open menu'} />
      {showFreeRosaryLink && (
        <a href="https://rosaryarmy.com/" target="_blank" rel="noopener noreferrer" className="header__link glass-btn">
          get a free rosary
        </a>
      )}
    </header>
  );
}
