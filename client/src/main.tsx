import ReactDom from 'react-dom/client';
import { StrictMode } from 'react';
import './globals.css';
import AppRouter from './router/AppRouter';

ReactDom.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
);
