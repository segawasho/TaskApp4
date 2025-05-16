import React from 'react';
import { createRoot } from 'react-dom/client';
import PasswordSettings from '../components/PasswordSettings';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<PasswordSettings />);
}
