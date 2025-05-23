import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
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
import { ToastProvider, useToast } from '../contexts/ToastContext';
import { ModalProvider } from '../contexts/ModalContext';

const AppRoutes = ({ user, setUser }) => {
  return (
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
  );
};

const AppInner = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser || null);
      } catch (err) {
        setUser(null);
        showToast('ログインしてください', 'error');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  return <AppRoutes user={user} setUser={setUser} />;
};

const App = () => {
  return (
    <ToastProvider>
      <ModalProvider>
        <BrowserRouter>
          <AppInner />
        </BrowserRouter>
      </ModalProvider>
    </ToastProvider>
  );
};

export default App;
