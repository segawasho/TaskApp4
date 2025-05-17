import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ローディング中か

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>; // 初回読み込み防止

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/login/:userId" element={<Login onLogin={setUser} />} />
      {user ? (
        <>
          <Route path="/" element={<TopPage user={user} />} />
          <Route path="/admin/users" element={<AdminUserList />} />
          <Route path="/settings/password" element={<PasswordSettings />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/memos" element={<MemoList />} />
          <Route path="/company_dashboard" element={<CompanyDashboard />} />
          <Route path="/company_master" element={<CompanyMaster />} />
          <Route path="/category_master" element={<CategoryMaster />} />
          <Route path="/status_master" element={<StatusMaster />} />
          <Route path="*" element={<TopPage user={user} />} />
        </>
      ) : (
        <Route path="*" element={<p>ログインしてください</p>} />
      )}
    </Routes>
    </BrowserRouter>
  );
};

export default App;
