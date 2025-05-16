export const loginUser = async (id, pin) => {
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login_id: id,  // ← ここを "login_id" に！
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


// 認証付きfetch（今ある authFetch もこうなってる想定）
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
