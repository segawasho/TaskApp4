import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo-tasknote.png';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-2">
        {/* 左（空白スペースや戻るボタンなどがあればここ） */}
        <div className="w-1/5"></div>

        {/* 中央ロゴ */}
        <div className="w-3/5 text-center">
          <Link to="/">
            <img src={logo} alt="TaskNote ロゴ" className="h-10 mx-auto cursor-pointer" />
          </Link>
        </div>

        {/* 右端ハンバーガー */}
        <div className="w-1/5 flex justify-end">
          <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* ドロップダウンメニュー */}
      {menuOpen && (
        <div className="bg-white border-t border-gray-200 shadow-md">
          <Link
            to="/"
            className="block px-4 py-3 text-gray-800 hover:bg-gray-100"
            onClick={() => setMenuOpen(false)}
          >
            ホーム
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
