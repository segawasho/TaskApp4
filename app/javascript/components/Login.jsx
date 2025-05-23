import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/api'; // loginUserをapi.jsから呼び出し

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    const user = await loginUser(email, password);
    if (user) {
      onLogin(user); // App側のuseStateに反映
      navigate('/');
    } else {
      setError('ログインに失敗しました');
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto text-center">
      <h2 className="text-xl font-bold mb-4">ログイン</h2>

      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />

      <div className="relative">
        <input
          type={showPass ? 'text' : 'password'}
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleLogin();
          }}
          className="w-full p-2 border rounded mb-2 pr-12"
        />
        <button
          type="button"
          onClick={() => setShowPass(!showPass)}
          className="absolute right-3 top-2 text-sm text-gray-500 hover:text-gray-700"
        >
          {showPass ? '非表示' : '表示'}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <button
        onClick={handleLogin}
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        ログイン
      </button>
    </div>
  );
};

export default Login;
