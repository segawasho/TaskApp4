import React from 'react';
import { createRoot } from 'react-dom/client';
import AdminUserList from '../components/AdminUserList';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<AdminUserList />);
}
