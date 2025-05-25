// App.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '../contexts/ToastContext';
import { ModalProvider } from '../contexts/ModalContext';
import AppRoutes from './AppRoutes'; // 分離したルーティング定義

// アプリ全体をToastとModalのコンテキストで包み、React Routerのルート定義もここに委譲する
const App = () => {
  return (
    <ToastProvider>
      <ModalProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ModalProvider>
    </ToastProvider>
  );
};

export default App;
