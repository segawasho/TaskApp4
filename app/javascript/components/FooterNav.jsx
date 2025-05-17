import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const FooterNav = ({ user }) => {
  const location = useLocation();

  const navItems = [
    {
      path: '/tasks',
      label: '📋 タスク一覧',
      bgColor: 'bg-blue-500',
    },
    {
      path: '/memos',
      label: '📝 メモ一覧',
      bgColor: 'bg-green-500',
    },
    {
      path: '/',
      label: '🏠 ホーム',
      bgColor: 'bg-gray-600',
    },
  ];

  return (
    <footer className="fixed bottom-0 left-0 w-full h-14 z-50">
      <div className="flex h-full text-center bg-white shadow-inner">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-1 h-full flex flex-col items-center justify-center text-xs font-medium ${item.bgColor} text-white ${
                isActive ? 'opacity-100' : 'opacity-100 hover:opacity-100'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </footer>
  );
};

export default FooterNav;
