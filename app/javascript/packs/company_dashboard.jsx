import React from 'react';
import { createRoot } from 'react-dom/client';
import CompanyDashboard from '../components/CompanyDashboard';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<CompanyDashboard />);
}
