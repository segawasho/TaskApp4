import React from 'react';
import { createRoot } from 'react-dom/client';
import StatusMaster from '../components/StatusMaster';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<StatusMaster />);
}
