/** Set VITE_BUYMEACOFFEE_URL in .env (e.g. https://buymeacoffee.com/yourusername) */
const BUYMEACOFFEE_URL =
  (typeof import.meta.env !== 'undefined' && (import.meta.env as { VITE_BUYMEACOFFEE_URL?: string }).VITE_BUYMEACOFFEE_URL) ||
  'https://buymeacoffee.com';

export function Donate() {
  return (
    <div className="donate-page page-content">
      <h1 className="page-title donate-title">Support Me</h1>
      <p className="donate-subtitle">
        Feel free to buy me a coffee to help keep this site going. Also feel free to{' '}
        <a href="https://github.com/jonathancaudill/PrayTheFaith" target="_blank" rel="noopener noreferrer" className="donate-link">
          contribute on GitHub
        </a>
        .
      </p>
      <a
        href={BUYMEACOFFEE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="donate-cta glass-btn"
      >
        <span>buy me a coffee</span>
      </a>
    </div>
  );
}
