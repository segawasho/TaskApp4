import React from 'react';
import { createRoot } from 'react-dom/client';
import TopPage from '../components/TopPage';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<TopPage />);
}
