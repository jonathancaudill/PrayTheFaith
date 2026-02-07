import { route } from 'preact-router';

export function Home() {
  return (
    <div className="hero">
      <h1 className="hero__quote">
        Pray without<br />ceasing.
      </h1>
      <a
        href="/mysteries"
        className="hero__cta glass-btn"
        onClick={(e) => {
          e.preventDefault();
          route('/mysteries');
        }}
      >
        today's mysteries →
      </a>
    </div>
  );
}
