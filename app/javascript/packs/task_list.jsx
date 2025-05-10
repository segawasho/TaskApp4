import React from 'react';
import { createRoot } from 'react-dom/client';
import TaskList from '../components/TaskList';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<TaskList />);
}
