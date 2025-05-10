import React from 'react';
import { createRoot } from 'react-dom/client';
import MemoList from '../components/MemoList';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<MemoList />);
}
