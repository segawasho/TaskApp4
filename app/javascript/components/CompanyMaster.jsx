import React, { useEffect, useState } from 'react';
import { authFetch } from '../utils/api';
import PageLayout from './PageLayout';
import { useToast } from '../contexts/ToastContext';
import { useModal } from '../contexts/ModalContext';


const CompanyMaster = ({ user }) => {
  const [companies, setCompanies] = useState([]);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyCode, setNewCompanyCode] = useState('');
  const [editingCompanyId, setEditingCompanyId] = useState(null);
  const [editedCompanyCode, setEditedCompanyCode] = useState('');
  const [editedCompanyName, setEditedCompanyName] = useState('');
  const { showToast } = useToast();
  const { openModal, closeModal } = useModal();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = () => {
    authFetch('/api/companies')
      .then(res => {
        if (!res.ok) throw new Error('取得失敗');
        return res.json();
      })
      .then(data => setCompanies(data))
      .catch(err => {
        console.error('企業取得エラー:', err);
        showToast('企業一覧の取得に失敗しました', 'error');
      });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    authFetch('/api/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCsrfToken()
      },
      body: JSON.stringify({
        company: {
          company_code: newCompanyCode,
          name: newCompanyName
        }
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('作成失敗');
        return res.json();
      })
      .then(() => {
        setNewCompanyName('');
        setNewCompanyCode('');
        fetchCompanies();
        showToast('企業を追加しました', 'success');
      })
      .catch(err => {
        console.error('作成エラー:', err);
        showToast('企業の追加に失敗しました', 'error');
      });
  };


  const handleEditClick = (company) => {
    setEditingCompanyId(company.id);
    setEditedCompanyCode(company.company_code);
    setEditedCompanyName(company.name);
  };

  const handleUpdate = (id) => {
    authFetch(`/api/companies/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCsrfToken()
      },
      body: JSON.stringify({
        company: {
          company_code: editedCompanyCode,
          name: editedCompanyName
        }
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('更新失敗');
        return res.json();
      })
      .then(() => {
        setEditingCompanyId(null);
        setEditedCompanyName('');
        setEditedCompanyCode('');
        fetchCompanies();
        showToast('企業情報を更新しました', 'success');
      })
      .catch(err => {
        console.error('更新エラー:', err);
        showToast('企業情報の更新に失敗しました', 'error');
      });
  };


  const handleRestore = (id) => {
    authFetch(`/api/companies/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCsrfToken()
      },
      body: JSON.stringify({ company: { deleted_at: null } })
    })
      .then(() => {
        fetchCompanies();
        showToast('企業を復元しました', 'success');
      })
      .catch(err => {
        console.error('復元エラー:', err);
        showToast('企業の復元に失敗しました', 'error');
      });
  };

  const handleDelete = (id) => {
    openModal(
      <div className="text-center space-y-4">
        <p>この企業を削除してもよろしいですか？</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              authFetch(`/api/companies/${id}`, {
                method: 'DELETE',
                headers: {
                  'X-CSRF-Token': getCsrfToken()
                }
              })
                .then(() => {
                  fetchCompanies();
                  showToast('企業を削除しました', 'success');
                })
                .catch(() => {
                  showToast('企業の削除に失敗しました', 'error');
                })
                .finally(() => {
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


  const getCsrfToken = () => {
    const tag = document.querySelector('meta[name="csrf-token"]');
    return tag ? tag.getAttribute('content') : '';
  };

  const activeCompanies = companies.filter(c => !c.deleted_at);
  const deletedCompanies = companies.filter(c => c.deleted_at);

  return (
    <PageLayout>

      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-bold text-gray-800">企業マスタ管理</h2>

        <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow space-y-4">
          <input
            className="w-full border rounded px-3 py-2"
            type="number"
            value={newCompanyCode}
            onChange={(e) => setNewCompanyCode(e.target.value)}
            placeholder="新規企業コード"
            required
          />
          <input
            className="w-full border rounded px-3 py-2"
            type="text"
            value={newCompanyName}
            onChange={(e) => setNewCompanyName(e.target.value)}
            placeholder="新規企業名を入力"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            追加
          </button>
        </form>

        <h3 className="text-lg font-semibold text-gray-700">有効な企業</h3>
        <ul className="space-y-2">
          {activeCompanies.map((company) => (
            <li key={company.id} className="bg-white border px-4 py-2 rounded shadow-sm space-y-2 sm:space-y-0">
              {editingCompanyId === company.id ? (
                <>
                  <input
                    className="w-full border rounded px-2 py-1"
                    type="number"
                    value={editedCompanyCode}
                    onChange={(e) => setEditedCompanyCode(e.target.value)}
                  />
                  <input
                    className="w-full border rounded px-2 py-1"
                    type="text"
                    value={editedCompanyName}
                    onChange={(e) => setEditedCompanyName(e.target.value)}
                  />
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400"
                    onClick={() => handleUpdate(company.id)}
                  >
                    保存
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400"
                    onClick={() => {
                      setEditingCompanyId(null);
                      setEditedCompanyName('');
                      setEditedCompanyCode('');
                    }}>
                    キャンセル
                  </button>
                </>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:space-x-4">
                    <span className="text-gray-800">{company.company_code}：{company.name}</span>
                    <div className="flex gap-2">
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400"
                        onClick={() => handleEditClick(company)}
                      >
                        編集
                      </button>
                      <button
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400"
                        onClick={() => handleDelete(company.id)}
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        <h3 className="text-lg font-semibold text-gray-700">削除済み企業</h3>
        <ul className="space-y-2">
          {deletedCompanies.map((company) => (
            <li key={company.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white border px-4 py-2 rounded shadow-sm space-y-2 sm:space-y-0 sm:space-x-4">
              {company.company_code}：
              {company.name}
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => handleRestore(company.id)}
              >
                復元
              </button>
            </li>
          ))}
        </ul>

      </div>
    </PageLayout>
  );
};

export default CompanyMaster;
