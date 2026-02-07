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
        {open ? (
          <span className="ptf-logo__x">
            <span className="ptf-logo__x-line ptf-logo__x-line--1" />
            <span className="ptf-logo__x-line ptf-logo__x-line--2" />
          </span>
        ) : (
          <span className="ptf-logo__letters">
            <span className="ptf-logo__row">
              <span className="ptf-logo__char">p</span>
              <span className="ptf-logo__line" />
            </span>
            <span className="ptf-logo__row">
              <span className="ptf-logo__char">t</span>
              <span className="ptf-logo__line ptf-logo__line--long" />
            </span>
            <span className="ptf-logo__row">
              <span className="ptf-logo__char">f</span>
            </span>
          </span>
        )}
      </span>
    </button>
  );
}
