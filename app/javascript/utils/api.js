export const loginUser = async (id, pin) => {
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login_id: id,
        pin,
      }),
    });

    if (!res.ok) throw new Error('ログイン失敗');

    const data = await res.json();
    localStorage.setItem('token', data.token);
    return data.user;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// 認証付きfetch
export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  return fetch(url, { ...options, headers });
};

  // トークンの保存と取得
  // ログイン時に取得したJWTトークンをlocalStorageに保存し、トップページ読み込み時にそれを取得してログイン状態を確認する
export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const res = await fetch('/api/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('トークン無効');
    const user = await res.json();
    return user;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// ログアウト処理（共通化）
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};


// ユーザー一覧取得（管理者用）
export const fetchUsers = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/users', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('ユーザー一覧の取得に失敗しました');
  }

  return await res.json();
};


// 管理側でのパスワード更新
export const updateUserPassword = async (id, password) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ user: { password } }),
  });

  if (!res.ok) throw new Error('パスワード更新失敗');
};


// User 自身のパスワード変更
export const updatePassword = async (newPassword) => {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/password', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ password: newPassword }),
  });

  if (!res.ok) {
    throw new Error('パスワード変更失敗');
  }

  return await res.json();
};
