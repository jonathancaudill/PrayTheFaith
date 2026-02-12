import { useEffect } from 'preact/hooks';
import { Router, Route, route } from 'preact-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { GuidedRosary } from './pages/GuidedRosary';
import { MysteriesToday } from './pages/MysteriesToday';
import { Mystery } from './pages/Mystery';
import { Encouragement } from './pages/Encouragement';
import { Donate } from './pages/Donate';

function RedirectToMystery({ set, index }: { set: string; index: string }) {
  useEffect(() => {
    /* Old URL used 0-based index; convert to 1-based m */
    const m = parseInt(index, 10) + 1;
    route(`/mysteries/${set}?m=${m}`, true);
  }, [set, index]);
  return null;
}

export function App() {
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const path = typeof window !== 'undefined' ? window.location.pathname : '';
      if (/^\/mysteries\/[^/]+$/.test(path)) return;
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
        <Route path="/mysteries/:set/:index" component={RedirectToMystery} />
        <Route path="/mysteries/:set" component={Mystery} />
        <Route path="/encouragement" component={Encouragement} />
        <Route path="/donate" component={Donate} />
      </Router>
    </Layout>
  );
}
