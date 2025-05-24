// 認証不要なPOST（例: 新規登録・ログイン）
export const apiPost = async (url, payload) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // ← Cookie送信
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json();
    throw data;
  }

  return await res.json();
};

// 認証付きfetch（Cookie送信のみで済む）
export const authFetch = async (url, options = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include', // ← これだけでOK
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
};

// ログイン（トークンはCookieにHttpOnlyで返ってくる）
export const loginUser = async (email, password) => {
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error('ログイン失敗');
    const data = await res.json();
    return data.user;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// ログアウト（Cookie削除）
export const logoutUser = async () => {
  await fetch('/api/logout', {
    method: 'DELETE',
    credentials: 'include',
  });
};

// 現在のユーザーを取得
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

// ユーザー一覧取得（管理者用）
export const fetchUsers = async () => {
  const res = await fetch('/api/users', {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('ユーザー一覧の取得に失敗しました');
  return await res.json();
};

// 管理者：ユーザーパスワード更新
export const updateUserPassword = async (id, password) => {
  const res = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user: { password } }),
  });

  if (!res.ok) throw new Error('パスワード更新失敗');
};

// ユーザー本人のパスワード更新
export const updatePassword = async (newPassword) => {
  const res = await fetch('/api/password', {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password: newPassword }),
  });

  if (!res.ok) throw new Error('パスワード変更失敗');
  return await res.json();
};
