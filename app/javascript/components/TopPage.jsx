import React from 'react';
// ログアウト用
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../utils/api';



const TopPage = ({ user }) => {

  // ログアウト用
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate(`/login/${user.login_id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-3xl w-full space-y-10">

        {/* メイン機能 */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">TaskApp</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <a href="/tasks" className="block bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-6 text-center shadow transition">
              <div className="text-xl font-semibold">📋 タスク一覧</div>
              <div className="text-sm mt-1">タスク管理・コメント</div>
            </a>
            <a href="/memos" className="block bg-green-500 hover:bg-green-600 text-white rounded-lg p-6 text-center shadow transition">
              <div className="text-xl font-semibold">📝 メモ一覧</div>
              <div className="text-sm mt-1">企業別メモを閲覧・編集</div>
            </a>
            <a href="/company_dashboard" className="block bg-purple-500 hover:bg-purple-600 text-white rounded-lg p-6 text-center shadow transition sm:col-span-2">
              <div className="text-xl font-semibold">🏢 企業一覧</div>
              <div className="text-sm mt-1">企業ごとのタスク・メモを一覧表示</div>
            </a>
          </div>
        </div>

        {/* サブ機能 */}
        {user?.is_admin && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">マスタ管理</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a href="/company_master" className="block border border-gray-300 rounded-md p-4 text-center hover:bg-gray-100 transition">
                <div className="font-medium text-gray-800">🏢 企業マスタ</div>
              </a>
              <a href="/category_master" className="block border border-gray-300 rounded-md p-4 text-center hover:bg-gray-100 transition">
                <div className="font-medium text-gray-800">📂 カテゴリマスタ</div>
              </a>
              <a href="/status_master" className="block border border-gray-300 rounded-md p-4 text-center hover:bg-gray-100 transition">
                <div className="font-medium text-gray-800">🚦 ステータスマスタ</div>
              </a>
            </div>
          </div>
        )}

        {/* パスワード変更 */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">ユーザー設定</h2>

          <div className="mt-6 space-y-4 text-center">
            <a
              href="/settings/password"
              className="inline-block px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              パスワード変更
            </a>

            {user?.is_admin && (
              <a
                href="/admin/users"
                className="inline-block ml-4 px-4 py-2 bg-yellow-200 rounded hover:bg-yellow-300"
              >
                ユーザー管理
              </a>
            )}
          </div>
        </div>

        {/* ようこそ表示 */}
        {user?.name && (
          // ログイン後すぐに localStorage に書き込んだ user データが、App.jsx の useEffect → setUser() に反映されるまでに 1フレーム遅れる
          // ログイン直後に TopPage.jsx に遷移しても user.name が一瞬 undefined になる現象がある。
          <p className="text-center text-gray-600 mb-4">
            ログイン中：{user.name}
          </p>
        )}

        {/* ログアウト */}
        {user?.name && (
          <div className="flex justify-end mb-4">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              ログアウト
            </button>
          </div>
        )}


      </div>
    </div>
  );
};

export default TopPage;
