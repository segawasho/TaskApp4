import React, { useState, useEffect } from 'react';
import { authFetch } from '../utils/api';
import MemoEditor from './MemoEditor'
import Modal from './Modal'
import PageLayout from './PageLayout';

const MemoSection = (　{user}　) => {
  const [memos, setMemos] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [filters, setFilters] = useState({ companyId: '', title: '', body: '', archived: false });
  const [newMemo, setNewMemo] = useState({ title: '', memo_date: '', company_id: '' });
  const [newMemoBody, setNewMemoBody] = useState('');
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [editMemo, setEditMemo] = useState({ title: '', body: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [createError, setCreateError] = useState('');



  // 企業マスタ取得
  useEffect(() => {
    authFetch('/api/companies')
      .then(res => res.json())
      .then(data => setCompanies(data.filter(c => c.deleted_at === null)));
  }, []);

  // メモ一覧取得（フィルタ反映）
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.companyId) params.append('company_id', filters.companyId);
    if (filters.title) params.append('title', filters.title);
    if (filters.body) params.append('body', filters.body);
    if (filters.archived !== undefined) {
      params.append('archived', filters.archived ? 'true' : 'false');
    }

    authFetch(`/api/memos?${params.toString()}`)
      .then(res => res.json())
      .then(data => setMemos(data));
  }, [filters]);

  // メモ作成処理
  const handleCreate = () => {
    setCreateError(''); // エラー初期化

    authFetch('/api/memos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memo: { ...newMemo, body: newMemoBody } }),
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => {
          throw new Error(err.errors ? err.errors.join(', ') : 'メモ作成に失敗しました');
        });
      }
      return res.json();
      })
      .then(created => {
        setMemos([...memos, created]);
        setNewMemo({ title: '', memo_date: '', company_id: '' });
        setNewMemoBody('');
      })
      .catch(error => {
        console.error('Create error:', error);
        setCreateError(error.message);
      });
  };



  // メモ編集保存（PATCH）
  const handleUpdate = () => {
    authFetch(`/api/memos/${selectedMemo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memo: editMemo })
    })
      .then(res => res.json())
      .then(updated => {
        setMemos(memos.map(m => m.id === updated.id ? updated : m));
        setSelectedMemo(updated);
        setIsEditing(false);
      });
  };

  // メモアーカイブ処理
  const handleArchive = (id) => {
    authFetch(`/api/memos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memo: { archived: true } }),
    })
      .then(res => res.json())
      .then(updated => {
        setMemos(prev => prev.filter(m => m.id !== updated.id));
        setSelectedMemo(null);
      });
  };

  // メモアーカイブ復元処理
  const handleUnarchive = (id) => {
    authFetch(`/api/memos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memo: { archived: false } }),
    })
      .then(res => res.json())
      .then(updated => {
        setMemos(prev => prev.filter(m => m.id !== updated.id));
        setSelectedMemo(null);
      });
  };


  // メモ削除処理
  const handleDelete = (id) => {
    authFetch(`/api/memos/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setMemos(memos.filter(m => m.id !== id));
        setSelectedMemo(null);
      });
  };



  return (
    <PageLayout>
      <div className="p-4 space-y-6">
        <h2 className="text-xl font-semibold">メモ一覧</h2>

        <div className="border border-gray-300 bg-gray-50 rounded p-4 shadow-sm space-y-2">
          <h3 className="text-lg font-medium">検索フィルター</h3>

          {/* フィルターUI */}
          <div className="flex flex-wrap items-center gap-4">
            <label>
              企業：
              <select
                className="border border-gray-300 rounded px-2 py-1 ml-1"
                value={filters.companyId}
                onChange={(e) => setFilters({ ...filters, companyId: e.target.value })}
              >
                <option value="">すべて</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>

            <label>
              タイトル：
              <input
                type="text"
                className="border border-gray-300 rounded px-2 py-1 ml-1"
                value={filters.title}
                onChange={(e) => setFilters({ ...filters, title: e.target.value })}
              />
            </label>

            <label>
              本文：
              <input
                type="text"
                className="border border-gray-300 rounded px-2 py-1 ml-1"
                value={filters.body}
                onChange={(e) => setFilters({ ...filters, body: e.target.value })}
              />
            </label>
          </div>

          {/* アーカイブ切り替えフィルターUI */}
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded ${filters.archived ? 'bg-gray-200' : 'bg-gray-600 text-white'}`}
              onClick={() => setFilters({ ...filters, archived: false })}
            >
              通常メモ
            </button>
            <button
              className={`px-4 py-2 rounded ${filters.archived ? 'bg-yellow-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setFilters({ ...filters, archived: true })}
            >
              アーカイブ済み
            </button>
          </div>

        </div>


        {/* 新規メモ追加フォーム */}
        <div className="border border-gray-300 bg-gray-50 rounded p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">新規メモ追加</h3>
            <button
              className="text-sm text-blue-600 underline"
              onClick={() => setShowNewForm(!showNewForm)}
            >
              {showNewForm ? '非表示' : '表示'}
            </button>
          </div>

          {createError && (
            <div className="text-sm text-red-600 bg-red-100 border border-red-300 rounded p-2">
              {createError}
            </div>
          )}


          {showNewForm && (
            <div className="space-y-2">

              <input
                placeholder="タイトル"
                className="border border-gray-300 rounded px-2 py-1 w-full"
                value={newMemo.title}
                onChange={(e) => setNewMemo({ ...newMemo, title: e.target.value })}
              />

              <input
                type="date"
                className="border border-gray-300 rounded px-2 py-1"
                value={newMemo.memo_date}
                onChange={(e) => setNewMemo({ ...newMemo, memo_date: e.target.value })}
              />

              <select
                className="border border-gray-300 rounded px-2 py-1"
                value={newMemo.company_id}
                onChange={(e) => setNewMemo({ ...newMemo, company_id: e.target.value })}
              >
                <option value="">企業を選択</option>
                {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <MemoEditor content={newMemoBody} onChange={setNewMemoBody} />

              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleCreate}
              >
                追加
              </button>
            </div>
          )}
        </div>

        {/* 一覧表示（タイトルのみ） */}
        <div className="border border-gray-300 bg-gray-50 rounded p-4 shadow-sm">
          <h3 className="text-lg font-medium mb-2">検索結果</h3>
          <ul className="space-y-2">
            {memos.map((memo) => (
              <li key={memo.id}>
                <button
                  className="block w-full text-left border border-gray-200 rounded px-4 py-2 hover:bg-gray-50 shadow-sm"
                  onClick={() => setSelectedMemo(memo)}
                >
                  <div className="font-semibold text-gray-800">{memo.title}</div>
                  <div className="text-sm text-gray-500">{companies.find(c => c.id === memo.company_id)?.name || '不明'} - {memo.memo_date}</div>
                </button>
              </li>
            ))}
          </ul>
        </div>


        {/* 詳細モーダル表示 ※複雑なためModalContext.js(共通)は使わない */}
        {selectedMemo && (
          <Modal onClose={() => {
            setSelectedMemo(null);
            setIsEditing(false);
          }}>
            {isEditing ? (
              <div className="space-y-4">
                <input
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  value={editMemo.title}
                  onChange={(e) => setEditMemo({ ...editMemo, title: e.target.value })}
                />

                <MemoEditor
                  content={editMemo.body}
                  onChange={(value) => setEditMemo({ ...editMemo, body: value })}
                />

                <div className="flex gap-2">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={handleUpdate}
                  >
                    保存
                  </button>
                  <button
                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                    onClick={() => setIsEditing(false)}
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{selectedMemo.title}</h3>
                <p><strong>日付:</strong> {selectedMemo.memo_date}</p>
                <p><strong>企業:</strong> {companies.find(c => c.id === selectedMemo.company_id)?.name || '不明'}</p>
                <div dangerouslySetInnerHTML={{ __html: selectedMemo.body }} className="prose" />

                <div className="flex gap-2 mt-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => {
                      setEditMemo({ title: selectedMemo.title, body: selectedMemo.body });
                      setIsEditing(true);
                    }}
                  >
                    編集
                  </button>
                  {selectedMemo.archived ? (
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
                      onClick={() => {
                        if (window.confirm("アーカイブから復元しますか？")) {
                          handleUnarchive(selectedMemo.id);
                        }
                      }}
                    >
                      復元
                    </button>
                  ) : (
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-sm"
                      onClick={() => {
                        if (window.confirm("アーカイブしますか？")) {
                          handleArchive(selectedMemo.id);
                        }
                      }}
                    >
                      アーカイブ
                    </button>
                  )}

                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                    onClick={() => {
                      if (window.confirm("本当に削除しますか？")) {
                        handleDelete(selectedMemo.id);
                      }
                    }}
                  >
                    削除
                  </button>
                  <button
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 text-sm"
                    onClick={() => setSelectedMemo(null)}
                  >
                    閉じる
                  </button>
                </div>

              </div>
            )}
          </Modal>
        )}

      </div>
    </PageLayout>
  );

};

export default MemoSection;
