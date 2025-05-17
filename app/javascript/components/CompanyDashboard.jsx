import React, { useEffect, useState } from 'react';
import { authFetch } from '../utils/api';
import Modal from './Modal';
import PageLayout from './PageLayout';
import { useToast } from '../contexts/ToastContext';


const CompanyDashboard = ( {user} ) => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [tasks, setTasks] = useState([]);
  const [memos, setMemos] = useState([]);
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [memoFilter, setMemoFilter] = useState({ title: '', body: '' });
  const [showTasks, setShowTasks] = useState(true);
  const [showMemos, setShowMemos] = useState(true);

  const { showToast } = useToast();

  useEffect(() => {
    authFetch('/api/companies')
      .then(res => {
        if (!res.ok) throw new Error('取得失敗');
        return res.json();
      })
      .then(data => setCompanies(data.filter(c => !c.deleted_at)))
      .catch(err => {
        console.error('企業取得エラー:', err);
        showToast('企業一覧の取得に失敗しました', 'error');
      });
  }, []);


  useEffect(() => {
    if (!selectedCompanyId) return;

    authFetch(`/api/tasks?company_id=${selectedCompanyId}`)
      .then(res => {
        if (!res.ok) throw new Error('タスク取得失敗');
        return res.json();
      })
      .then(setTasks)
      .catch(err => {
        console.error('タスク取得エラー:', err);
        showToast('タスクの取得に失敗しました', 'error');
      });

    authFetch(`/api/memos?company_id=${selectedCompanyId}`)
      .then(res => {
        if (!res.ok) throw new Error('メモ取得失敗');
        return res.json();
      })
      .then(setMemos)
      .catch(err => {
        console.error('メモ取得エラー:', err);
        showToast('メモの取得に失敗しました', 'error');
      });
  }, [selectedCompanyId]);


  const filteredMemos = memos.filter(memo =>
    memo.title.includes(memoFilter.title) &&
    memo.body.includes(memoFilter.body)
  );

  const getPriorityClass = (priority) => {
    switch (priority) {
      case '高': return 'bg-red-100 text-red-800';
      case '中': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDueDateClass = (dueDate) => {
    if (!dueDate) return 'bg-gray-100 text-gray-800';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((due - today) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'bg-red-100 text-red-800';
    if (diffDays === 1) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <PageLayout>
      <div className="p-6 space-y-8">
        <h2 className="text-xl sm:text-2xl font-bold">企業別ダッシュボード（閲覧専用）</h2>

        <select
          className="border px-3 py-2 mb-4"
          value={selectedCompanyId}
          onChange={(e) => {
            const val = e.target.value;
            setSelectedCompanyId(val === '' ? '' : Number(val));
          }}
        >
          <option value="">企業を選択してください</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {selectedCompanyId && (
          <>
            {/* タスクセクション */}
            <div className="border rounded p-4 bg-gray-50 shadow space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">タスク一覧</h3>
                <button className="text-sm text-blue-600 underline" onClick={() => setShowTasks(!showTasks)}>
                  {showTasks ? '非表示' : '表示'}
                </button>
              </div>
              {showTasks && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tasks.map(task => (
                    <li key={task.id} className="bg-white border rounded-lg p-4 shadow-sm space-y-2 min-h-[240px]">
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className={`px-2 py-1 rounded ${getPriorityClass(task.priority)}`}>
                          優先度: {task.priority}
                        </span>
                        <span className={`px-2 py-1 rounded ${getDueDateClass(task.due_date)}`}>
                          締切: {task.due_date || '未設定'}
                        </span>
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          {task.company?.name || '未設定'}
                        </span>
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          {task.category?.name || '未設定'}
                        </span>
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          {task.status?.name || '未設定'}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-gray-600">{task.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* メモセクション */}
            <div className="border rounded p-4 bg-gray-50 shadow space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">メモ一覧</h3>
                <button className="text-sm text-blue-600 underline" onClick={() => setShowMemos(!showMemos)}>
                  {showMemos ? '非表示' : '表示'}
                </button>
              </div>

              {showMemos && (
                <>
                  <div className="flex flex-wrap gap-4">
                    <p className="text-xl">検索</p>
                    <input
                      className="border px-2 py-1"
                      placeholder="タイトル"
                      value={memoFilter.title}
                      onChange={(e) => setMemoFilter({ ...memoFilter, title: e.target.value })}
                    />
                    <input
                      className="border px-2 py-1"
                      placeholder="本文"
                      value={memoFilter.body}
                      onChange={(e) => setMemoFilter({ ...memoFilter, body: e.target.value })}
                    />
                  </div>
                  <ul className="space-y-4">
                    {filteredMemos.map(memo => (
                      <li key={memo.id} className="bg-white border rounded p-4 shadow space-y-1 cursor-pointer"
                          onClick={() => setSelectedMemo(memo)}>
                        <div className="text-lg font-bold">{memo.title}</div>
                        <div className="text-sm text-gray-600">{companies.find(c => c.id === memo.company_id)?.name || '不明'} - {memo.memo_date}</div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* モーダル */}
            {selectedMemo && (
              <Modal>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{selectedMemo.title}</h3>
                  <p><strong>日付:</strong> {selectedMemo.memo_date}</p>
                  <p><strong>企業:</strong> {companies.find(c => c.id === selectedMemo.company_id)?.name || '不明'}</p>
                  <div dangerouslySetInnerHTML={{ __html: selectedMemo.body }} className="prose" />
                  <div className="flex justify-end mt-4">
                    <button
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      onClick={() => setSelectedMemo(null)}
                    >
                      閉じる
                    </button>
                  </div>
                </div>
              </Modal>
            )}

          </>
        )}

      </div>
    </PageLayout>
  );
};

export default CompanyDashboard;
