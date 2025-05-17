import React, { useEffect, useState } from 'react';
import { authFetch } from '../utils/api';
import PageLayout from './PageLayout';
import { useToast } from '../contexts/ToastContext';
import { useModal } from '../contexts/ModalContext';


const CategoryMaster = ({ user }) => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState('');
  const { showToast } = useToast();
  const { openModal, closeModal } = useModal();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    authFetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => {
        console.error('カテゴリ取得エラー:', err);
        showToast('カテゴリ一覧の取得に失敗しました', 'error');
      });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    authFetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCsrfToken()
      },
      body: JSON.stringify({ category: { name: newCategoryName } })
    })
      .then(res => res.json())
      .then(() => {
        setNewCategoryName('');
        fetchCategories();
        showToast('カテゴリを追加しました', 'success');
      })
      .catch(err => {
        console.error('作成エラー:', err);
        showToast('カテゴリの追加に失敗しました', 'error');
      });
  };

  const handleEditClick = (category) => {
    setEditingCategoryId(category.id);
    setEditedCategoryName(category.name);
  };

  const handleUpdate = (id) => {
    authFetch(`/api/categories/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCsrfToken()
      },
      body: JSON.stringify({ category: { name: editedCategoryName } })
    })
    .then(() => {
      setEditingCategoryId(null);
      setEditedCategoryName('');
      fetchCategories();
      showToast('カテゴリを更新しました', 'success');
    })
    .catch(err => {
      console.error('更新エラー:', err);
      showToast('カテゴリの更新に失敗しました', 'error');
    });
  };

  const handleRestore = (id) => {
    authFetch(`/api/categories/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCsrfToken()
      },
      body: JSON.stringify({ category: { deleted_at: null } })
    })
    .then(() => {
      fetchCategories();
      showToast('カテゴリを復元しました', 'success');
    })
    .catch(err => {
      console.error('復元エラー:', err);
      showToast('カテゴリの復元に失敗しました', 'error');
    });
  };

  const handleDelete = (id) => {
    openModal(
      <div className="text-center space-y-4">
        <p>このカテゴリを削除してもよろしいですか？</p>
        <div className="flex justify-center gap-4">
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded"
            onClick={() => {
              authFetch(`/api/categories/${id}`, {
                method: 'DELETE',
                headers: { 'X-CSRF-Token': getCsrfToken() }
              })
                .then(() => {
                  fetchCategories();
                  showToast('カテゴリを削除しました', 'success');
                })
                .catch(err => {
                  console.error('削除エラー:', err);
                  showToast('カテゴリの削除に失敗しました', 'error');
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

  const activeCategories = categories.filter(c => !c.deleted_at);
  const deletedCategories = categories.filter(c => c.deleted_at);

  return (
    <PageLayout>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-bold text-gray-800">カテゴリマスタ管理</h2>

        <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow space-y-4">
          <input className="w-full border rounded px-3 py-2"
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="新規カテゴリ名を入力"
            required
          />
          <div className="flex justify-end ml-auto">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center min-w-[80px]" type="submit">追加</button>
      </div>
        </form>

        <h3>有効なカテゴリ</h3>
        <ul className="space-y-2">
          {activeCategories.map((category) => (
            <li className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white border px-4 py-2 rounded shadow-sm space-y-2 sm:space-y-0 sm:space-x-4" key={category.id}>
              {editingCategoryId === category.id ? (
                <>
                  <input className="w-full border rounded px-3 py-2"
                    type="text"
                    value={editedCategoryName}
                    onChange={(e) => setEditedCategoryName(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400 text-center min-w-[80px]" type="button" onClick={() => handleUpdate(category.id)}>保存</button>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400 text-center min-w-[80px]" type="button" onClick={() => setEditingCategoryId(null)}>キャンセル</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:space-x-4">
                  <span className="text-gray-800">{category.name}</span>
                  <div className="flex gap-2 justify-end ml-auto">
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400" type="button" onClick={() => handleEditClick(category)}>編集</button>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400" type="button" onClick={() => handleDelete(category.id)}>削除</button>
                  </div>
                </div>
                </>
              )}
            </li>
          ))}
        </ul>

        <h3>削除済みカテゴリ</h3>
        <ul className="space-y-2">
          {deletedCategories.map((category) => (
            <li className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white border px-4 py-2 rounded shadow-sm space-y-2 sm:space-y-0 sm:space-x-4" key={category.id}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:space-x-4">
                <span className="text-gray-800">{category.name}</span>
                <div className="flex justify-end ml-auto">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center min-w-[80px]" type="button" onClick={() => handleRestore(category.id)}>復元</button>
                </div>
              </div>
            </li>
          ))}
        </ul>

      </div>
    </PageLayout>
  );
};

export default CategoryMaster;
