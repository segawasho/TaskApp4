import React, { useState } from 'react';
import { updatePassword } from '../utils/api';
import Header from './Header';
import FooterNav from './FooterNav';
import PinInputPad from './PinInputPad';
import Toast from './Toast';

const PasswordSettings = ( {user} ) => {
  const [newPassword, setNewPassword] = useState('');
  const [toast, setToast] = useState(null);

  const handleSubmit = async () => {
    try {
      await updatePassword(newPassword);
      setToast({ message: 'パスワードを変更しました', type: 'success' });
      setNewPassword('');
    } catch (err) {
      setToast({ message: 'パスワードの変更に失敗しました', type: 'error' });
    }
  };

  return (
    <div>
      <Header user={user} />
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

        <FooterNav user={user} />
      </div>

      {/* ✅ トースト表示 */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default PasswordSettings;
