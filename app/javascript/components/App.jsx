import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import TopPage from './TopPage';
import AdminUserList from './AdminUserList';
import PasswordSettings from './PasswordSettings';
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
        <Route path="/admin/users" element={<AdminUserList />} />
        <Route path="/settings/password" element={<PasswordSettings />} />
        <Route path="*" element={user ? <TopPage user={user} /> : <p>ログインしてください</p>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
