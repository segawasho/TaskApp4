import React, { useEffect, useState } from 'react';
import Login from './Login';
import TopPage from './TopPage';
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

  return user ? <TopPage user={user} /> : <Login onLogin={setUser} />;
};

export default App;
