import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../utils/api';
import Modal from './Modal';
import PageLayout from './PageLayout';
import { useToast } from '../contexts/ToastContext';
import { useModal } from '../contexts/ModalContext';


const AdminUserList = () => {
  // 各種ステート管理
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState({});
  const [passwords, setPasswords] = useState({});
  const [showPasswordInput, setShowPasswordInput] = useState({});
  const [errors, setErrors] = useState({});
  const { showToast } = useToast();
  const { openModal, closeModal } = useModal();


  // 初期ユーザー読み込み（ID順でソート）
  useEffect(() => {
    const loadUsers = async () => {
      const data = await fetchUsers();
      const sorted = data.sort((a, b) => a.id - b.id);
      setUsers(sorted);
      const init = {};
      sorted.forEach((u) => {
        init[u.id] = { name: u.name, email: u.email };
      });
      setEditing(init);
    };
    loadUsers();
  }, []);

  // 編集の確認モーダル
  const handleConfirm = (user) => {
    openModal(
      <div className="text-center space-y-4">
        <p className="text-base font-semibold">
          「{editing[user.id]?.name}」さんの情報を上書きします。<br />よろしいですか？
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleSave(user)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            はい
          </button>
          <button
            onClick={closeModal}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            キャンセル
          </button>
        </div>
      </div>
    );
  };


  // 編集用のstate更新
  const handleChange = (id, field, value) => {
    setEditing((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  // パスワード入力欄表示切替
  const handlePasswordToggle = (id) => {
    setShowPasswordInput((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // パスワード入力
  const handlePasswordInput = (id, value) => {
    setPasswords((prev) => ({ ...prev, [id]: value }));
  };


  // 保存処理
  const handleSave = async (user) => {
    setErrors({});
    const updated = {
      name: editing[user.id].name,
      email: editing[user.id].email,
    };
    if (showPasswordInput[user.id] && passwords[user.id]) {
      updated.password = passwords[user.id];
    }

    try {
      const token = localStorage.getItem('jwt');
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user: updated }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrors((prev) => ({
          ...prev,
          [user.id]: data.error || '更新に失敗しました',
        }));
      } else {
        closeModal();
        showToast('ユーザー情報を保存しました', 'success');
        const refreshed = await fetchUsers();
        const sorted = refreshed.sort((a, b) => a.id - b.id);
        setUsers(sorted);
        const init = {};
        sorted.forEach((u) => {
          init[u.id] = { name: u.name, email: u.email };
        });
        setEditing(init);
        setPasswords((prev) => ({ ...prev, [user.id]: '' }));
        setShowPasswordInput((prev) => ({ ...prev, [user.id]: false }));
      }
    } catch (e) {
      setErrors((prev) => ({ ...prev, [user.id]: '通信に失敗しました' }));
      showToast('通信に失敗しました', 'error');
    }
  };

  return (
    <PageLayout>
      <div className="p-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">👤 ユーザー管理</h2>
        {/* モバイル用カード表示（〜md） */}
        <div className="block md:hidden space-y-6">
          {users.map((user) => {
            const edited = editing[user.id];
            const nameChanged = edited?.name !== user.name;
            const loginIdChanged = edited?.email !== user.email;
            const passwordChanged = showPasswordInput[user.id] && passwords[user.id];
            const canSave = nameChanged || loginIdChanged || passwordChanged;

            return (
              <div key={user.id} className="border rounded-md p-4 shadow-md">
                <div className="text-sm text-gray-500 mb-2">ID: {user.id}</div>

                <div className="mb-3">
                  <label className="text-sm block mb-1 font-medium">名前</label>
                  <div className="text-xs text-gray-500 mt-1">(※10文字まで)</div>
                  <input
                    type="text"
                    maxLength={10}
                    className="border rounded w-full px-2 py-1"
                    value={edited?.name || ''}
                    onChange={(e) => handleChange(user.id, 'name', e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="text-sm block mb-1 font-medium">ログインID</label>
                  <div className="text-xs text-gray-500 mt-1">(※半角英数字10文字まで)</div>
                  <input
                    type="text"
                    maxLength={50}
                    className="border rounded w-full px-2 py-1"
                    value={edited?.email || ''}
                    onChange={(e) => handleChange(user.id, 'email', e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="text-sm block font-medium mb-1">パスワード再設定</label>
                  <div className="text-xs text-gray-500 mt-1">(※半角数値4〜8文字)</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!showPasswordInput[user.id]}
                      onChange={() => handlePasswordToggle(user.id)}
                    />
                    <input
                      type="text" // type="number" は先頭0を消してしまうので "text" を使う
                      inputMode="numeric" // スマホで数字キーボード表示
                      pattern="[0-9]*" // 数字のみを許可（形式指定）
                      maxLength={8}    // 最大文字数8文字に制限
                      className="border rounded px-2 py-1 flex-1"
                      disabled={!showPasswordInput[user.id]}
                      value={passwords[user.id] || ''}
                      onChange={(e) => {
                        if (!showPasswordInput[user.id]) return;
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) {   // 数字以外を弾く（リアルタイムバリデーション）
                          handlePasswordInput(user.id, val);
                        }
                      }}
                    />
                  </div>
                </div>

                {errors[user.id] && (
                  <div className="text-red-500 text-sm mb-2">{errors[user.id]}</div>
                )}

                <div className="text-right">
                  <button
                    className={`px-4 py-1 rounded text-white ${
                      canSave ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'
                    }`}
                    onClick={() => canSave && handleConfirm(user)}
                    disabled={!canSave}
                  >
                    保存
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* PC用テーブル表示（md〜） */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">
                  ID
                </th>
                <th className="p-2 border">
                  名前
                  <div className="text-xs text-gray-500 mt-1">(※10文字まで)</div>
                </th>
                <th className="p-2 border">
                  ログインID
                  <div className="text-xs text-gray-500 mt-1">(※半角英数字10文字まで)</div>
                </th>
                <th className="p-2 border">
                  パスワード再設定
                  <div className="text-xs text-gray-500 mt-1">(※半角数値4〜8文字)</div>
                </th>
                <th className="p-2 border">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const edited = editing[user.id];
                const nameChanged = edited?.name !== user.name;
                const loginIdChanged = edited?.email !== user.email;
                const passwordChanged = showPasswordInput[user.id] && passwords[user.id];
                const canSave = nameChanged || loginIdChanged || passwordChanged;

                return (
                  <tr key={user.id} className="border-t">
                    <td className="p-2 text-center">{user.id}</td>
                    <td className="p-2">
                      <input
                        type="text"
                        maxLength={10}
                        className="border px-2 py-1 w-full"
                        value={edited?.name || ''}
                        onChange={(e) => handleChange(user.id, 'name', e.target.value)}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        maxLength={10}
                        className="border px-2 py-1 w-full"
                        value={edited?.email || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          // 半角英数字のみ許可（a〜z, A〜Z, 0〜9）
                          if (/^[a-zA-Z0-9]*$/.test(val)) {
                            handleChange(user.id, 'email', val);
                          }
                        }}
                      />
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!showPasswordInput[user.id]}
                          onChange={() => handlePasswordToggle(user.id)}
                        />
                        <input
                          type="text"                  // type="number" は先頭0を消してしまうので "text" を使う
                          inputMode="numeric"          // スマホで数字キーボード表示
                          pattern="[0-9]*"             // 数字のみを許可（形式指定）
                          maxLength={8}                // 最大文字数8文字に制限
                          className="border px-2 py-1 w-full"
                          disabled={!showPasswordInput[user.id]}
                          value={passwords[user.id] || ''}
                          onChange={(e) => {
                            if (!showPasswordInput[user.id]) return;
                            const val = e.target.value;
                            if (/^\d*$/.test(val)) {   // 数字以外を弾く（リアルタイムバリデーション）
                              handlePasswordInput(user.id, val);
                            }
                          }}
                        />
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      <button
                        className={`px-4 py-1 rounded text-white ${
                          canSave ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'
                        }`}
                        onClick={() => canSave && handleConfirm(user)}
                        disabled={!canSave}
                      >
                        保存
                      </button>
                      {errors[user.id] && (
                        <div className="text-red-500 text-sm mt-1">{errors[user.id]}</div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </PageLayout>
  );
};

export default AdminUserList;
