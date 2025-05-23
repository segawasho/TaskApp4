import React, { useState, useEffect, useContext } from 'react';
import { apiPost } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import Header from './Header';

const SignupForm = ({ onSignup }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [showIndustries, setShowIndustries] = useState(false);

  const [form, setForm] = useState({
    email: '',
    name: '',
    password: '',
    password_confirmation: '',
    role_id: '',
    industry_id: '',
    custom_role_description: '',
  });

  const [roles, setRoles] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const resRoles = await fetch('/api/roles');
        const rolesData = await resRoles.json();
        setRoles(rolesData);

        const resIndustries = await fetch('/api/industries');
        const industriesData = await resIndustries.json();
        setIndustries(industriesData);
      } catch (e) {
        setError('マスターデータの取得に失敗しました');
      }
    };

    fetchMasterData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await apiPost('/api/signup', { user: form });
      onSignup(res.user); // App.jsxのuser stateを更新
      showToast('登録に成功しました');
      navigate('/');
    } catch (err) {
      const messages = err?.errors?.join('\n') || '登録に失敗しました';
      setError(messages);
      showToast(messages, 'error');
    }
  };


  return (
    <>
      <Header />
      <div className="max-w-xl mx-auto mt-24 p-6 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-6 text-center">会員登録</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="email" type="email" placeholder="メールアドレス" className="w-full border px-3 py-2 rounded" onChange={handleChange} required />
          <input name="name" placeholder="名前" className="w-full border px-3 py-2 rounded" onChange={handleChange} required />
          <input name="password" type="password" placeholder="パスワード" className="w-full border px-3 py-2 rounded" onChange={handleChange} required />
          <input name="password_confirmation" type="password" placeholder="パスワード確認" className="w-full border px-3 py-2 rounded" onChange={handleChange} required />

          {/* 職種選択 */}
          <div>
            <p className="font-semibold mb-2">職種を選択してください（1つまで）</p>
            {Object.entries(
              roles
                .sort((a, b) =>
                  a.role_category.sort_order === b.role_category.sort_order
                    ? a.sort_order - b.sort_order
                    : a.role_category.sort_order - b.role_category.sort_order
                )
                .reduce((acc, role) => {
                  const cat = role.role_category.name;
                  if (!acc[cat]) acc[cat] = [];
                  acc[cat].push(role);
                  return acc;
                }, {})
            ).map(([category, roleList]) => (
              <div key={category} className="mb-2">
                <p className="font-medium text-gray-700">◾️{category}</p>
                <div className="flex flex-wrap gap-4 pl-4 mt-1">
                  {roleList.map((role) => (
                    <label key={role.id} className="flex items-center space-x-1">
                      <input
                        type="radio"
                        name="role_id"
                        value={role.id}
                        checked={String(form.role_id) === String(role.id)}
                        onChange={handleChange}
                        required
                      />
                      <span>{role.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {/* その他の職種記述欄 */}
            {(() => {
              const selectedRole = roles.find((r) => String(r.id) === String(form.role_id));
              return selectedRole?.name?.includes('その他') ? (
                <input
                  name="custom_role_description"
                  placeholder="職種を自由に記述"
                  className="mt-2 w-full border px-3 py-2 rounded"
                  onChange={handleChange}
                  required
                />
              ) : null;
            })()}
          </div>

          {/* 業種選択（任意） */}
          <div className="mt-6">
            <button
              type="button"
              className="text-blue-600 underline text-sm"
              onClick={() => setShowIndustries((prev) => !prev)}
            >
              業種を選ぶ（任意）
            </button>

            {showIndustries && (
              <div className="mt-2">
                {industries.map((industry) => (
                  <label key={industry.id} className="block mb-1">
                    <input
                      type="radio"
                      name="industry_id"
                      value={industry.id}
                      checked={String(form.industry_id) === String(industry.id)}
                      onChange={handleChange}
                    />
                    <span className="ml-1">{industry.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>



          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            登録
          </button>
        </form>
      </div>
    </>
  );
};

export default SignupForm;
