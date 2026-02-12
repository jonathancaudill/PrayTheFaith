import { useState, useEffect } from 'preact/hooks';
const API_BASE = typeof import.meta.env !== 'undefined' && (import.meta.env as { VITE_API_URL?: string }).VITE_API_URL
  ? (import.meta.env as { VITE_API_URL: string }).VITE_API_URL
  : '';

interface EncouragementData {
  id: string;
  author_name: string;
  location: string;
  content: string;
}

export function Encouragement() {
  const [encouragement, setEncouragement] = useState<EncouragementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ author_name: '', location: '', content: '' });

  useEffect(() => {
    fetch(`${API_BASE}/api/encouragement`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => (data && data.author_name ? data : null))
      .then(setEncouragement)
      .catch(() => setEncouragement(null))
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = (e: Event) => {
    e.preventDefault();
    setError(null);
    fetch(`${API_BASE}/api/encouragement`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((r) => {
        if (!r.ok) throw new Error('Submission failed');
        setSubmitted(true);
        setForm({ author_name: '', location: '', content: '' });
      })
      .catch(() => setError('Something went wrong. Please try again.'));
  };

  return (
    <div className="encouragement-page page-content">
      <h1 className="page-title encouragement-title">Today's Encouragement</h1>

      {loading && <p className="encouragement-loading">Loading…</p>}

      {!loading && encouragement && (
        <>
          <p className="encouragement-source">
            From {encouragement.author_name} in {encouragement.location}
          </p>
          <div className="encouragement-body">
            {encouragement.content.split(/\n\n+/).map((para: string, i: number) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </>
      )}

      {!loading && !encouragement && !submitted && (
        <p className="encouragement-empty">No encouragement for today yet. Be the first to submit one below.</p>
      )}

      {submitted && (
        <p className="encouragement-thanks">Thank you. Your encouragement has been submitted for review.</p>
      )}

      <form className="encouragement-form" onSubmit={onSubmit}>
        <h2 className="encouragement-form-title">Share Your Encouragement</h2>
        <label className="encouragement-label">
          Your name
          <input
            type="text"
            value={form.author_name}
            onInput={(e) => setForm((f: { author_name: string; location: string; content: string }) => ({ ...f, author_name: (e.target as HTMLInputElement).value }))}
            required
            className="encouragement-input glass-input"
            placeholder="e.g. John"
          />
        </label>
        <label className="encouragement-label">
          Location
          <input
            type="text"
            value={form.location}
            onInput={(e) => setForm((f: { author_name: string; location: string; content: string }) => ({ ...f, location: (e.target as HTMLInputElement).value }))}
            required
            className="encouragement-input glass-input"
            placeholder="e.g. Dallas, TX"
          />
        </label>
        <label className="encouragement-label">
          Your encouragement
          <textarea
            value={form.content}
            onInput={(e) => setForm((f: { author_name: string; location: string; content: string }) => ({ ...f, content: (e.target as HTMLTextAreaElement).value }))}
            required
            rows={5}
            className="encouragement-input encouragement-textarea glass-input"
            placeholder="Write something to brighten someone's day…"
          />
        </label>
        {error && <p className="encouragement-error">{error}</p>}
        <button type="submit" className="encouragement-submit glass-btn"><span>Submit</span></button>
      </form>
    </div>
  );
}
