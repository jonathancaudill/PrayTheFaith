import { render } from 'preact';
import { App } from './App';
import './index.css';
import { Agentation } from 'agentation';

render(
  <>
    <App />
    {import.meta.env.DEV && <Agentation />}
  </>,
  document.getElementById('root')!
);
