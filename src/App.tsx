import { useEffect } from 'preact/hooks';
import { Router, Route } from 'preact-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { GuidedRosary } from './pages/GuidedRosary';
import { MysteriesToday } from './pages/MysteriesToday';
import { Mystery } from './pages/Mystery';
import { Encouragement } from './pages/Encouragement';

export function App() {
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const path = typeof window !== 'undefined' ? window.location.pathname : '';
      if (/^\/mysteries\/[^/]+\/\d+$/.test(path)) return;
      e.preventDefault();
    };
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    return () => window.removeEventListener('wheel', handleWheel, true);
  }, []);

  return (
    <Layout>
      <Router>
        <Route path="/" component={Home} />
        <Route path="/guided" component={GuidedRosary} />
        <Route path="/mysteries" component={MysteriesToday} />
        <Route path="/mysteries/:set/:index" component={Mystery} />
        <Route path="/encouragement" component={Encouragement} />
      </Router>
    </Layout>
  );
}
