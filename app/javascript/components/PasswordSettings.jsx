import React, { useState } from 'react';
import { updatePassword } from '../utils/api';

const PasswordSettings = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    try {
      await updatePassword(newPassword);
      setMessage('パスワードを変更しました');
      setNewPassword('');
    } catch (err) {
      setMessage('パスワードの変更に失敗しました');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">パスワード変更</h2>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={8}
        placeholder="新しいパスワード（数字4〜8桁）"
        className="border px-3 py-2 w-full mb-4"
        value={newPassword}
        onChange={(e) => {
          const val = e.target.value;
          if (/^\d*$/.test(val) && val.length <= 8) {
            setNewPassword(val);
          }
        }}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        変更する
      </button>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default PasswordSettings;
