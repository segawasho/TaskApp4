import React, { useEffect, useState } from 'react';
import { authFetch } from '../utils/api';
import PageLayout from './PageLayout';
import { useToast } from '../contexts/ToastContext';
import { useModal } from '../contexts/ModalContext';

const StatusMaster = ({ user }) => {
  const [statuses, setStatuses] = useState([]);
  const [newStatusName, setNewStatusName] = useState('');
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [editedStatusName, setEditedStatusName] = useState('');
  const { showToast } = useToast();
  const { openModal, closeModal } = useModal();

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = () => {
    authFetch('/api/statuses')
      .then(res => res.json())
      .then(data => {
        setStatuses(data);
      })
      .catch(err => {
        console.error('ステータス一覧取得エラー:', err);
        showToast('ステータス一覧の取得に失敗しました', 'error');
      });
  };


  const handleCreate = (e) => {
    e.preventDefault();
    authFetch('/api/statuses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCsrfToken()
      },
      body: JSON.stringify({ status: { name: newStatusName } })
    })
    .then(res => res.json())
    .then(() => {
      setNewStatusName('');
      fetchStatuses();
      showToast('ステータスを追加しました', 'success');
    })
    .catch(err => {
      console.error('追加エラー:', err);
      showToast('ステータスの追加に失敗しました', 'error');
    });
  };

  const handleEditClick = (status) => {
    setEditingStatusId(status.id);
    setEditedStatusName(status.name);
  };

  const handleUpdate = (id) => {
    authFetch(`/api/statuses/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCsrfToken()
      },
      body: JSON.stringify({ status: { name: editedStatusName } })
    })
    .then(() => {
      setEditingStatusId(null);
      setEditedStatusName('');
      fetchStatuses();
      showToast('ステータスを更新しました', 'success');
    })
    .catch(err => {
      console.error('更新エラー:', err);
      showToast('ステータスの更新に失敗しました', 'error');
    });
  };

  const handleRestore = (id) => {
    authFetch(`/api/statuses/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCsrfToken()
      },
      body: JSON.stringify({ status: { deleted_at: null } })
    })
    .then(() => {
      fetchStatuses();
      showToast('ステータスを復元しました', 'success');
    })
    .catch(err => {
      console.error('復元エラー:', err);
      showToast('ステータスの復元に失敗しました', 'error');
    });
  };

  const handleDelete = (id) => {
    openModal(
      <div className="text-center space-y-4">
        <p>このステータスを削除してもよろしいですか？</p>
        <div className="flex justify-center gap-4">
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded"
            onClick={() => {
              authFetch(`/api/statuses/${id}`, {
                method: 'DELETE',
                headers: { 'X-CSRF-Token': getCsrfToken() }
              })
                .then(() => {
                  fetchStatuses();
                  showToast('ステータスを削除しました', 'success');
                })
                .catch(err => {
                  console.error('削除エラー:', err);
                  showToast('ステータスの削除に失敗しました', 'error');
                })
                .finally(() => closeModal());
            }}
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


  const getCsrfToken = () => {
    const tag = document.querySelector('meta[name="csrf-token"]');
    return tag ? tag.getAttribute('content') : '';
  };

  const activeStatuses = statuses.filter(c => !c.deleted_at);
  const deletedStatuses = statuses.filter(c => c.deleted_at);

  return (
    <PageLayout>

      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-bold text-gray-800">ステータスマスタ管理</h2>

        <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow space-y-4">
          <input
            className="w-full border rounded px-3 py-2"
            type="text"
            value={newStatusName}
            onChange={(e) => setNewStatusName(e.target.value)}
            placeholder="新規ステータス名を入力"
            required
          />
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 min-w-[80px]">追加</button>
          </div>
        </form>

        <h3 className="text-lg font-semibold text-gray-700">有効なステータス</h3>
        <ul className="space-y-2">
          {activeStatuses.map((status) => (
            <li key={status.id} className="bg-white border px-4 py-2 rounded shadow-sm space-y-2 sm:space-y-0">
              {editingStatusId === status.id ? (
                <>
                  <input
                    className="w-full border rounded px-2 py-1"
                    type="text"
                    value={editedStatusName}
                    onChange={(e) => setEditedStatusName(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400 min-w-[80px]" onClick={() => handleUpdate(status.id)}>保存</button>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400 min-w-[80px]" onClick={() => setEditingStatusId(null)}>キャンセル</button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <span className="text-gray-800">{status.name}</span>
                  <div className="flex gap-2 sm:ml-auto mt-2 sm:mt-0">
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400" onClick={() => handleEditClick(status)}>編集</button>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400" onClick={() => handleDelete(status.id)}>削除</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        <h3 className="text-lg font-semibold text-gray-700">削除済みステータス</h3>
        <ul className="space-y-2">
          {deletedStatuses.map((status) => (
            <li key={status.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white border px-4 py-2 rounded shadow-sm space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-gray-800">{status.name}</span>
              <div className="flex justify-end sm:ml-auto mt-2 sm:mt-0">
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 min-w-[80px]" onClick={() => handleRestore(status.id)}>復元</button>
              </div>
            </li>
          ))}
        </ul>

      </div>
    </PageLayout>
  );
};

export default StatusMaster;
