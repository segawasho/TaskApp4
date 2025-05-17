import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const FooterNav = () => {
  const location = useLocation();

  const navItems = [
    {
      path: '/tasks',
      label: 'タスク',
      bgColor: 'bg-blue-500',
    },
    {
      path: '/memos',
      label: 'メモ',
      bgColor: 'bg-green-500',
    },
    {
      path: '/',
      label: 'ホーム',
      bgColor: 'bg-gray-600', // お任せ：落ち着いたグレー系
    },
  ];

  return (
    <footer className="fixed bottom-0 left-0 w-full z-50">
      <div className="flex text-sm text-center divide-x divide-white">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-1 py-3 ${
                item.bgColor
              } text-white ${isActive ? 'opacity-100' : 'opacity-100 hover:opacity-100'}`}
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
