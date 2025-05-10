import React from 'react';
import { createRoot } from 'react-dom/client';
import CompanyMaster from '../components/CompanyMaster';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<CompanyMaster />);
}
