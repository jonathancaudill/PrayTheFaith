type Props = {
  open: boolean;
  onClick: () => void;
  className?: string;
  'aria-label'?: string;
};

export function PTFLogo({ open, onClick, className = '', 'aria-label': ariaLabel = 'Menu' }: Props) {
  return (
    <button
      type="button"
      className={`ptf-logo ${open ? 'ptf-logo--open' : ''} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-expanded={open}
    >
      <span className="ptf-logo__inner" aria-hidden>
        <span className="ptf-logo__text">p.t.f</span>
      </span>
    </button>
  );
}
