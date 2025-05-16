
# TaskApp4 - タスク管理 & メモアプリ

## 🧑‍💻 概要説明

### 概要
このアプリは、チームまたは個人での業務タスクとメモを一元管理できるアプリケーションです。
ReactとRailsで構成されており、モダンなSPA（Single Page Application）として動作します。

### 主な機能
- ✅ JWT認証によるログイン（PINのみ入力、ユーザーIDはURLで指定）
- ✅ タスクの一覧・登録・編集・削除
- ✅ メモの作成・編集・削除（企業別に分類）
- ✅ 企業・カテゴリ・ステータスマスタ管理
- ✅ ログイン後のリダイレクト／ログアウト機能
- ✅ スマートフォン対応UI（TailwindCSS）

### 技術構成
- フロントエンド: React 18 + React Router v6 + Tailwind CSS
- バックエンド: Ruby on Rails 7（非APIモード、Webpacker構成）
- DB: PostgreSQL
- 認証: JWT（トークンは localStorage に保存）

---

## 🤖 GPT向けアプリ定義メタデータ

```json
{
  "name": "TaskApp4",
  "description": "タスクとメモを管理するRails+ReactベースのSPAアプリケーション。JWTによるPIN認証を導入し、ユーザーはURL内のlogin_idを使用してログインする。",
  "tech_stack": {
    "frontend": ["React 18", "React Router v6", "TailwindCSS"],
    "backend": ["Ruby on Rails 7.0", "Webpacker"],
    "auth": "JWT (PIN-based login)",
    "database": "PostgreSQL"
  },
  "features": [
    "PINのみのJWTログイン（URLに login_id）",
    "トークンのlocalStorage保存",
    "ログイン後にトップページへリダイレクト",
    "ユーザーごとのタスク・メモ表示",
    "企業・カテゴリ・ステータスマスタの管理",
    "ログアウトボタンによるトークン削除"
  ],
  "routes": {
    "login": "/login/:login_id",
    "api_login": "/api/login",
    "api_me": "/api/me",
    "root": "/",
    "fallback": "*path → home#top"
  }
}
```

💡 lib配下の読み込み設定
JWT関連の共通処理（lib/json_web_token.rb）を使用するため、
config/application.rb に以下を追記しています：

config.autoload_paths << Rails.root.join('lib')

これにより JsonWebToken.encode(...) などを各コントローラで利用可能になります。
