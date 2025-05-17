import React, { useState } from 'react';
import { updatePassword } from '../utils/api';
import PinInputPad from './PinInputPad';
import PageLayout from './PageLayout';
import { useToast } from '../contexts/ToastContext';

const PasswordSettings = ( {user} ) => {
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

      </div>
    </PageLayout>
  );
};

export default PasswordSettings;
