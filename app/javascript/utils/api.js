// 認証なしPOST
export const apiPost = async (url, payload) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include', // Cookie送信
  });

  if (!res.ok) {
    const data = await res.json();
    throw data;
  }

  return await res.json();
};

// ログイン
export const loginUser = async (email, password) => {
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (!res.ok) throw new Error('ログイン失敗');
    const data = await res.json();
    return data.user;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// 認証付きfetch（Cookie自動送信）
export const authFetch = async (url, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 401) {
    // トークン切れた → 再取得を試みる
    const refresh = await fetch('/api/refresh_token', {
      method: 'POST',
      credentials: 'include',
    });

    if (refresh.ok) {
      // リトライ
      return fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });
    }
  }

  return response;
};


// 現在のユーザー取得（/api/me）
export const getCurrentUser = async () => {
  try {
    const res = await fetch('/api/me', {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('トークン無効');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// ログアウト（サーバーに明示）
export const logoutUser = async () => {
  try {
    await fetch('/api/logout', {
      method: 'DELETE',
      credentials: 'include',
    });
  } catch (err) {
    console.error('ログアウト失敗', err);
  }
};

// ユーザー一覧取得（管理者用）
export const fetchUsers = async () => {
  const res = await authFetch('/api/users');
  if (!res.ok) throw new Error('ユーザー一覧の取得に失敗しました');
  return await res.json();
};

// 管理者によるパスワード更新
export const updateUserPassword = async (id, password) => {
  const res = await authFetch(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ user: { password } }),
  });
  if (!res.ok) throw new Error('パスワード更新失敗');
};

// 自分のパスワード更新
export const updatePassword = async (newPassword) => {
  const res = await authFetch('/api/password', {
    method: 'PATCH',
    body: JSON.stringify({ password: newPassword }),
  });
  if (!res.ok) throw new Error('パスワード変更失敗');
  return await res.json();
};
