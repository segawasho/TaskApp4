import React, { useState } from 'react';
import { updatePassword } from '../utils/api';
import PageLayout from './PageLayout';
import { useToast } from '../contexts/ToastContext';

const PasswordSettings = ({ user }) => {
  const [newPassword, setNewPassword] = useState('');
  const { showToast } = useToast();

  const handleSubmit = async () => {
    try {
      await updatePassword(newPassword);
      showToast('パスワードを変更しました', 'success');
      setNewPassword('');
    } catch (err) {
      showToast('パスワードの変更に失敗しました', 'error');
    }
  };

  return (
    <PageLayout>
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">パスワード変更</h2>
        <input
          type="password"
          placeholder="新しいパスワード（8文字以上推奨）"
          className="border px-3 py-2 w-full mb-4"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          変更する
        </button>
      </div>
    </PageLayout>
  );
};

export default PasswordSettings;
