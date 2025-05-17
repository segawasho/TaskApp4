import React, { useState } from 'react';
// React Router v6にて 下記useParamsが使える。
import { useParams, useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/api';

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

      {/* PIN キーパッド */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => {
              if (pin.length < 8) setPin(pin + num);
            }}
            className="py-4 bg-gray-200 rounded text-xl font-semibold hover:bg-gray-300"
          >
            {num}
          </button>
        ))}

        {/* 全削除ボタンを左下に */}
        <button
          onClick={() => setPin('')}
          className="py-4 bg-red-200 text-red-700 rounded text-sm font-medium hover:bg-red-300"
        >
          クリア
        </button>

        {/* 0ボタン */}
        <button
          onClick={() => {
            if (pin.length < 8) setPin(pin + '0');
          }}
          className="py-4 bg-gray-200 rounded text-xl font-semibold hover:bg-gray-300"
        >
          0
        </button>

        {/* ログインボタンをテンキー右下に */}
        <button
          onClick={handleLogin}
          className="py-4 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600"
        >
          ログイン
        </button>
      </div>


    </div>
  );
};

export default Login;
