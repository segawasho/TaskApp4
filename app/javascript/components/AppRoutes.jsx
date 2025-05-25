import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/api';
import AdminRoute from './AdminRoute';

import SignupForm from './SignupForm';
import Login from './Login';
import TopPage from './TopPage';
import AdminUserList from './AdminUserList';
import PasswordSettings from './PasswordSettings';
import TaskList from './TaskList';
import MemoList from './MemoList';
import CompanyDashboard from './CompanyDashboard';
import CompanyMaster from './CompanyMaster';
import CategoryMaster from './CategoryMaster';
import StatusMaster from './StatusMaster';

// 実際のルーティングとログインユーザー判定を行うコンポーネント
const AppRoutes = () => {
  const location = useLocation(); // 現在のパスを取得
  const [user, setUser] = useState(null); // ログインユーザー
  const [loading, setLoading] = useState(true); // 初期表示ローディング制御

  useEffect(() => {
    const fetchUser = async () => {
      // ログイン・サインアップページではチェック不要
      if (['/login', '/signup'].includes(location.pathname)) {
        setLoading(false);
        return;
      }

      const currentUser = await getCurrentUser(location.pathname);
      if (currentUser) {
        setUser(currentUser);
      } else {
        console.warn('トークン無効または期限切れ');
        setUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, [location.pathname]);

  if (loading) return <p>Loading...</p>; // 認証中の一瞬のブランク防止

  return (
    <Routes>
      {/* 非ログイン用ルート */}
      <Route path="/login" element={<Login onLogin={setUser} />} />
      <Route path="/signup" element={<SignupForm onSignup={setUser} />} />

      {/* ログイン済ルート */}
      {user ? (
        <>
          <Route path="/" element={<TopPage user={user} />} />
          <Route path="/admin/users" element={
            <AdminRoute user={user}>
              <AdminUserList user={user} />
            </AdminRoute>
          }/>
          <Route path="/settings/password" element={<PasswordSettings user={user} />} />
          <Route path="/tasks" element={<TaskList user={user} />} />
          <Route path="/memos" element={<MemoList user={user} />} />
          <Route path="/company_dashboard" element={<CompanyDashboard user={user} />} />
          <Route path="/company_master" element={<CompanyMaster user={user} />} />
          <Route path="/category_master" element={<CategoryMaster user={user} />} />
          <Route path="/status_master" element={<StatusMaster user={user} />} />
          <Route path="*" element={<TopPage user={user} />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
};

export default AppRoutes;
