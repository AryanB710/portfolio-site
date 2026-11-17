import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { NotFound } from './pages/NotFound';

// No router needed: anything other than "/" (or /index.html) is a 404.
const path = window.location.pathname.replace(/\/+$/, '');
const isHome = path === '' || path === '/index.html';

createRoot(document.getElementById('root')!).render(<StrictMode>{isHome ? <App /> : <NotFound />}</StrictMode>);
