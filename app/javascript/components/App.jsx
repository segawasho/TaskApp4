import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import { getCurrentUser } from '../utils/api';
import { ToastProvider } from '../contexts/ToastContext';
import { ModalProvider } from '../contexts/ModalContext';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ローディング中か

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      } else {
        console.warn('トークン無効または期限切れ');
        setUser(null); // 明示的にnullに
      }
      setLoading(false);
    };

    fetchUser();
  }, []);





  if (loading) return <p>Loading...</p>; // 初回読み込み防止

  return (
    <ToastProvider>
      <ModalProvider>
        <BrowserRouter>
          <>
            <Routes>
              <Route path="/login" element={<Login onLogin={setUser} />} />
              <Route path="/signup" element={<SignupForm onSignup={setUser} />} />
              {user ? (
                <>
                  <Route path="/" element={<TopPage user={user} />} />
                  <Route path="/admin/users" element={<AdminUserList user={user} />} />
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
                <Route path="*" element={<p>ログインしてください</p>} />
              )}
            </Routes>
          </>
        </BrowserRouter>
      </ModalProvider>
    </ToastProvider>
  );
};

export default App;
