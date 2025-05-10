import React from 'react';
import { createRoot } from 'react-dom/client';
import CategoryMaster from '../components/CategoryMaster';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<CategoryMaster />);
}
