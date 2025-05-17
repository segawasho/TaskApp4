import React, { useState } from 'react';
import { updatePassword } from '../utils/api';
import FooterNav from './FooterNav';
import PinInputPad from './PinInputPad';

const PasswordSettings = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    try {
      await updatePassword(newPassword);
      setMessage('パスワードを変更しました');
      setIsSuccess(true); // 成功時はtrueに
      setNewPassword('');

      // 3秒後にメッセージを消す（成功時のみ）
      setTimeout(() => {
        setMessage('');
        setIsSuccess(false);
      }, 3000);
    } catch (err) {
      setMessage('パスワードの変更に失敗しました');
      setIsSuccess(false);
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

      {/* ✅ PINテンキーUI */}
      <PinInputPad value={newPassword} setValue={setNewPassword} onSubmit={handleSubmit} />

      {/* ✅ メッセージ表示（成功なら緑、失敗なら赤） */}
      {message && (
        <p className={`mt-4 text-center text-sm font-medium ${isSuccess ? 'text-green-600' : 'text-red-500'}`}>
          {message}
        </p>
      )}
      <FooterNav />
    </div>
  );
};

export default PasswordSettings;
