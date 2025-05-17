import React from 'react';
import Header from './Header';
import FooterNav from './FooterNav';

const PageLayout = ({ user, children }) => {
  return (
    <div className="min-h-screen pt-16 pb-14 bg-gray-50"> {/* ← ここでヘッダー&フッター分の余白を確保 */}
      <Header user={user} />
      <main>{children}</main>
      <FooterNav user={user} />
    </div>
  );
};

export default PageLayout;
