import React, { useState } from 'react';
// React Router v6にて 下記useParamsが使える。
import { useParams, useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/api';
import PinInputPad from './PinInputPad';

const Login = ({ onLogin }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const user = await loginUser(userId, pin);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      onLogin(user);
      navigate('/');
    } else {
      setError('ログインに失敗しました');
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto text-center">
      <h2 className="text-xl font-bold mb-4">PINを入力してください</h2>
      <div className="relative">
        <input
          type={showPin ? 'text' : 'password'}
          placeholder="PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          onKeyDown={(e) => {
            const isCtrlOrCmd = e.ctrlKey || e.metaKey; // Macの⌘は e.metaKey
            if (isCtrlOrCmd && e.key === 'Enter') {
              handleLogin(); // 送信関数を呼ぶ
            }
          }}
          className="w-full p-2 border rounded mb-2 pr-12"
        />
        <button
          type="button"
          onClick={() => setShowPin(!showPin)}
          className="absolute right-3 top-2 text-sm text-gray-500 hover:text-gray-700"
        >
          {showPin ? '非表示' : '表示'}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      {/* ✅ 共通のテンキーUIを使用 */}
      <PinInputPad value={pin} setValue={setPin} onSubmit={handleLogin} />

    </div>
  );
};

export default Login;
