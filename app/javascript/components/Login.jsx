import React, { useState } from 'react';
import { loginUser } from '../utils/api';

const Login = ({ onLogin }) => {
  const [id, setId] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const user = await loginUser(id, pin);
    if (user) {
      onLogin(user); // 親コンポーネントに通知（user: {id, is_admin}）
    } else {
      setError('ログインに失敗しました');
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto text-center">
      <h2 className="text-xl font-bold mb-4">パスワードを入力</h2>
      <input
        type="text"
        placeholder="ユーザーID"
        value={id}
        onChange={(e) => setId(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="password"
        placeholder="PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <button
        onClick={handleLogin}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
      >
        ログイン
      </button>
    </div>
  );
};

export default Login;
