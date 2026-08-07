import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Remove legacy locally-stored hackathons so they no longer surface in any portal.
['hc_created_hackathons', 'hc_organizer_hackathons', 'hc_global_hackathons'].forEach((key) => {
  localStorage.removeItem(key);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
