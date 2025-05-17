import React, { useEffect, useState } from 'react';
import { authFetch } from '../utils/api';
import CommentSection from '../components/CommentSection';
import PageLayout from './PageLayout';
import { useToast } from '../contexts/ToastContext';
import { useModal } from '../contexts/ModalContext';

const TaskList = ({user}) => {
  const [tasks, setTasks] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState(1);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedDueDate, setEditedDueDate] = useState('');
  const [editedPriority, setEditedPriority] = useState('');
  const [newTaskCompanyId, setNewTaskCompanyId] = useState('');
  const [newTaskCategoryId, setNewTaskCategoryId] = useState('');
  const [newTaskStatusId, setNewTaskStatusId] = useState('');
  const [editedCompanyId, setEditedCompanyId] = useState('');
  const [editedCategoryId, setEditedCategoryId] = useState('');
  const [editedStatusId, setEditedStatusId] = useState('');
  const [filterCompanyId, setFilterCompanyId] = useState('');
  const [filterCategoryId, setFilterCategoryId] = useState('');
  const [filterStatusId, setFilterStatusId] = useState('');
  const [showDoneFilter, setShowDoneFilter] = useState('not_done'); // デフォルト：未完了のみ
  const [sortKey, setSortKey] = useState('created_desc');
  const [showCreateForm, setShowCreateForm] = useState(true);
  const [showFilter, setShowFilter] = useState(true);
  const { showToast } = useToast();
  const { openModal, closeModal } = useModal();


  useEffect(() => {
    fetchTasks();
    fetchMasterData();
  }, []);

  const fetchTasks = () => {
    authFetch('/api/tasks')
      .then(response => response.json())
      .then(data => {
        // 自分のタスクのみ
        setTasks(data.filter(task => task.user_id === user.id));
      })
      .catch(error => console.error('Error fetching tasks:', error));
  };

  const handleCreateTask = (e) => {
    e.preventDefault();

    authFetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task: {
          title: newTaskTitle,
          description: newTaskDescription,
          due_date: newTaskDueDate,
          priority: newTaskPriority,
          company_id: newTaskCompanyId,
          category_id: newTaskCategoryId,
          status_id: newTaskStatusId
        }
      })
    })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(() => {
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskDueDate('');
      setNewTaskPriority('');
      setNewTaskCompanyId('');
      setNewTaskCategoryId('');
      setNewTaskStatusId('');
      showToast('新規タスクを追加しました', 'success');
      fetchTasks();
    })
    .catch((error) => {
      console.error('Error creating task:', error);
      showToast('新規タスクの追加に失敗しました', 'error');
    });
  };

  const handleUpdate = (id) => {
    authFetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task: {
          title: editedTitle,
          description: editedDescription,
          due_date: editedDueDate,
          priority: editedPriority,
          company_id: editedCompanyId,
          category_id: editedCategoryId,
          status_id: editedStatusId
        }
      })
    })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(() => {
      setEditingTaskId(null);
      setEditedTitle('');
      setEditedTitle('');
      setEditedDescription('');
      setEditedDueDate('');
      setEditedPriority('');
      setEditedCompanyId('');
      setEditedCategoryId('');
      setEditedStatusId('');
      showToast('タスクを更新しました', 'success');
      fetchTasks();
    })
    .catch(error => {
      console.error('Error updating task:', error);
      showToast('タスクの更新に失敗しました', 'error');
    });
  };

  const handleDelete = (id) => {
    openModal(
      <div className="text-center space-y-4">
        <p>このタスクを削除してもよろしいですか？</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              authFetch(`/api/tasks/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
              })
                .then((response) => {
                  if (!response.ok) throw new Error('Network response was not ok');
                  setTasks(tasks.filter(task => task.id !== id));
                  showToast('タスクを削除しました', 'success');
                  closeModal();
                })
                .catch((error) => {
                  console.error('Error deleting task:', error);
                  showToast('タスクの削除に失敗しました', 'error');
                  closeModal();
                });
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded"
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


  const fetchMasterData = async () => {
    try {
      const [companiesRes, categoriesRes, statusesRes] = await Promise.all([
        authFetch('/api/companies'),
        authFetch('/api/categories'),
        authFetch('/api/statuses'),
      ]);
      const [companies, categories, statuses] = await Promise.all([
        companiesRes.json(),
        categoriesRes.json(),
        statusesRes.json(),
      ]);
      // 自分の企業、カテゴリ、ステータスのみ
      setCompanies(companies.filter(c => !c.deleted_at && c.user_id === user.id));
      setCategories(categories.filter(c => !c.deleted_at && c.user_id === user.id));
      setStatuses(statuses.filter(s => !s.deleted_at && s.user_id === user.id));
    } catch (error) {
      console.error('マスタデータの取得に失敗しました:', error);
      showToast('マスタデータの取得に失敗しました', 'error');
    }
  };

  const toggleDone = (task) => {
    const newIsDone = !task.is_done;

    authFetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task: { is_done: newIsDone } }),
    })
      .then(res => {
        if (!res.ok) throw new Error('更新失敗');
        return res.json();
      })
      .then(() => {
        fetchTasks();
        showToast(
          newIsDone ? 'タスクを完了にしました' : 'タスクを未完了に戻しました',
          'success'
        );
      })
      .catch(err => {
        console.error('完了状態更新エラー:', err);
        showToast('完了状態の更新に失敗しました', 'error');
      });
  };


  // 優先度ごとの色分け
  const getPriorityClass = (priority) => {
    switch (priority) {
      case '高':
        return 'bg-red-100 text-red-800';
      case '中':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 締切日の色分け（本日以前）
  const getDueDateClass = (dueDate) => {
    if (!dueDate) return 'bg-gray-100 text-gray-800';

    const today = new Date();
    today.setHours(0, 0, 0, 0); // 時刻を 00:00 にリセット

    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0); // 同様にリセット

    const diffDays = Math.floor((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return 'bg-red-100 text-red-800'; // 今日以前
    } else if (diffDays === 1) {
      return 'bg-yellow-100 text-yellow-800'; // 明日
    } else {
      return 'bg-gray-100 text-gray-800'; // それ以外
    }
  };






  return (
    <PageLayout>


      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800">タスク一覧</h1>

        {/* 新規登録 */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-700">新規タスク作成</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-400"
          >
            {showCreateForm ? '非表示' : '表示'}
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateTask} className="space-y-4 bg-white p-4 rounded shadow mt-2">
            <h2 className="text-lg font-semibold text-gray-700">新規タスク作成</h2>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="新しいタスク名を入力"
              className="w-full border rounded px-3 py-2"
            />
            <textarea
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="タスク詳細（任意）"
              className="w-full border rounded px-3 py-2"
            ></textarea>
            <div className="flex flex-wrap gap-3">
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="border rounded px-3 py-2"
              />
              <select value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value)} className="border rounded px-3 py-2">
                <option value="高">高</option>
                <option value="中">中</option>
                <option value="低">低</option>
              </select>
              <select value={newTaskCompanyId} onChange={(e) => setNewTaskCompanyId(Number(e.target.value))} className="border rounded px-3 py-2">
                <option value="">企業を選択</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </select>
              <select value={newTaskCategoryId} onChange={(e) => setNewTaskCategoryId(Number(e.target.value))} className="border rounded px-3 py-2">
                <option value="">カテゴリを選択</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <select value={newTaskStatusId} onChange={(e) => setNewTaskStatusId(Number(e.target.value))} className="border rounded px-3 py-2">
                <option value="">ステータスを選択</option>
                {statuses.map(status => (
                  <option key={status.id} value={status.id}>{status.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              追加
            </button>
          </form>
        )}

        {/* フィルター */}
        <div className="flex items-center justify-between mt-8">
          <h2 className="text-lg font-semibold text-gray-700">フィルター</h2>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-400"
          >
            {showFilter ? '非表示' : '表示'}
          </button>
        </div>

        {showFilter && (

          <div className="bg-white p-4 rounded shadow space-y-3 mt-2">
            <h2 className="text-lg font-semibold text-gray-700">フィルター</h2>
            <div className="flex flex-wrap gap-4">
              <label className="flex flex-col text-sm text-gray-600">
                企業
                <select value={filterCompanyId} onChange={(e) => setFilterCompanyId(e.target.value)} className="border rounded px-2 py-1">
                  <option value="">すべて</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>{company.name}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col text-sm text-gray-600">
                カテゴリ
                <select value={filterCategoryId} onChange={(e) => setFilterCategoryId(e.target.value)} className="border rounded px-2 py-1">
                  <option value="">すべて</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col text-sm text-gray-600">
                ステータス
                <select value={filterStatusId} onChange={(e) => setFilterStatusId(e.target.value)} className="border rounded px-2 py-1">
                  <option value="">すべて</option>
                  {statuses.map(status => (
                    <option key={status.id} value={status.id}>{status.name}</option>
                  ))}
                </select>
              </label>
            </div>


            <label className="block text-sm text-gray-600">
              並び替え
              <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} className="border rounded px-2 py-1">
                <option value="created_desc">登録順</option>
                <option value="updated_desc">更新順</option>
                <option value="due_date_asc">締切日順</option>
                <option value="priority_asc">優先順</option>
              </select>
            </label>

            <div className="flex gap-2 mt-4">
              {[
                { key: 'not_done', label: '未完了' },
                { key: 'done', label: '完了' },
                { key: 'all', label: 'すべて' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setShowDoneFilter(key)}
                  className={`px-3 py-1 rounded border text-sm transition
                    ${showDoneFilter === key
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}
                  `}
                >
                  {label}
                </button>
              ))}
            </div>

          </div>
        )}


        {/* タスクリスト */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tasks
            .filter(task => {
              return (
                (filterCompanyId === '' || task.company_id === Number(filterCompanyId)) &&
                (filterCategoryId === '' || task.category_id === Number(filterCategoryId)) &&
                (filterStatusId === '' || task.status_id === Number(filterStatusId)) &&
                (showDoneFilter === 'not_done' ? !task.is_done :
                showDoneFilter === 'done' ? task.is_done : true)
              );
            })
            .sort((a, b) => {
              if (sortKey === 'updated_desc') {
                return new Date(b.updated_at) - new Date(a.updated_at);
              }
              if (sortKey === 'due_date_asc') {
                return new Date(a.due_date || '9999-12-31') - new Date(b.due_date || '9999-12-31');
              }
              if (sortKey === 'priority_asc') {
                const priorityMap = { 高: 1, 中: 2, 低: 3 };
                return priorityMap[a.priority] - priorityMap[b.priority];
              }
              return b.id - a.id; // 登録順
            })
            .map(task => (
              <li key={task.id} className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm space-y-2 min-h-[460px] flex flex-col justify-between">
                {editingTaskId === task.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="タイトル"
                    />
                    <textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="詳細"
                    ></textarea>
                    <input
                      type="date"
                      value={editedDueDate}
                      onChange={(e) => setEditedDueDate(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    />
                    <div className="flex flex-wrap gap-2">
                      <select value={editedPriority} onChange={(e) => setEditedPriority(e.target.value)} className="border rounded px-2 py-1">
                        <option value="高">高</option>
                        <option value="中">中</option>
                        <option value="低">低</option>
                      </select>
                      <select value={editedCompanyId} onChange={(e) => setEditedCompanyId(Number(e.target.value))} className="border rounded px-2 py-1">
                        <option value="">企業を選択</option>
                        {companies.map(company => (
                          <option key={company.id} value={company.id}>{company.name}</option>
                        ))}
                      </select>
                      <select value={editedCategoryId} onChange={(e) => setEditedCategoryId(Number(e.target.value))} className="border rounded px-2 py-1">
                        <option value="">カテゴリを選択</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                      <select value={editedStatusId} onChange={(e) => setEditedStatusId(Number(e.target.value))} className="border rounded px-2 py-1">
                        <option value="">ステータスを選択</option>
                        {statuses.map(status => (
                          <option key={status.id} value={status.id}>{status.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdate(task.id)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">更新</button>
                      <button onClick={() => setEditingTaskId(null)} className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">キャンセル</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start flex-wrap sm:flex-nowrap gap-2">
                      <div className="flex-1 min-w-0">

                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className={`text-xs px-2 py-1 rounded ${getPriorityClass(task.priority)}`}>
                            優先度: {task.priority}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${getDueDateClass(task.due_date)}`}>
                            締切: {task.due_date || '未設定'}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            {task.company?.name || '企業: 未設定'}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            {task.category?.name || 'カテゴリ: 未設定'}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            {task.status?.name || 'ステータス: 未設定'}
                          </span>
                        </div>



                        <h3 className="text-lg font-semibold text-gray-800 break-words">{task.title}</h3>
                        {task.description && (
                          <p className="text-base text-gray-500 font-medium leading-relaxed break-words">
                            詳細: {task.description}
                          </p>
                        )}

                      </div>

                      {/* 完了状態ボタン */}
                      {!task.is_done ? (
                        <button
                          onClick={() => {
                            if (window.confirm('このタスクを完了にしますか？')) {
                              toggleDone(task);
                            }
                          }}
                          className="bg-green-500 text-white text-sm px-4 py-2 rounded hover:bg-green-600 whitespace-nowrap min-w-[80px]"
                        >
                          完了
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (window.confirm('未完了に戻しますか？')) {
                              toggleDone(task);
                            }
                          }}
                          className="bg-yellow-500 text-white text-sm px-4 py-2 rounded hover:bg-yellow-600 whitespace-nowrap min-w-[100px]"
                        >
                          未完了に戻す
                        </button>
                      )}

                    </div>


                    <div className="flex gap-2 text-sm">
                      <button
                        onClick={() => {
                          setEditingTaskId(task.id);
                          setEditedTitle(task.title);
                          setEditedDescription(task.description || '');
                          setEditedDueDate(task.due_date || '');
                          setEditedPriority(task.priority || '高');
                          setEditedCompanyId(task.company_id || '');
                          setEditedCategoryId(task.category_id || '');
                          setEditedStatusId(task.status_id || '');
                        }}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        削除
                      </button>
                    </div>


                    <div className="mt-2 max-h-[100px] overflow-y-auto border-t pt-2">
                      <CommentSection taskId={task.id} user={user} />
                    </div>

                  </>
                )}
              </li>
          ))}
        </ul>
      </div>

    </PageLayout>
  );
};

export default TaskList;
