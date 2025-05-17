# TaskApp4 - タスク & メモ管理アプリ

## 🧩 概要

TaskApp4 は、Rails + React で構築された業務タスク＆メモ管理アプリです。  
JWT認証（PIN入力）によるログインを採用し、企業・カテゴリ別にタスクやメモを整理できます。  
SPA構成のため、快適な操作感でWebとモバイル両対応のモダンなUIを実現しています。

---

## 🚀 主な機能

- ✅ **PINのみでログイン**（ユーザーIDはURLで指定：例 `/login/segawa`）
- ✅ **タスク管理**
  - タスクの一覧表示・絞り込み（企業／カテゴリ／ステータス）
  - タスクの登録・編集・完了チェック
  - 今後対応：Excel出力
- ✅ **メモ管理**
  - メモの作成・編集・削除（企業別に分類）
  - 本文は TipTapエディタで装飾・リンク対応
  - 今後対応：TipTapエディタで表対応
- ✅ **マスタ管理機能**
  - 企業マスタ・カテゴリマスタ・ステータスマスタ
  - 今後対応：CSV取込・出力
- ✅ **ダッシュボード機能**
  - 企業別のタスク・メモ集約画面（閲覧のみ）
- ✅ **ユーザー管理（管理者）**
  - 一般ユーザーの情報編集、PIN再設定
  - 自分のパスワード変更（旧パスワード不要）
- ✅ **スマホUI対応**
  - TailwindCSSによるレスポンシブ対応
  - 数字ボタンでのPIN入力

---

## 🔐 認証仕様（JWT）

- ログインは `/login/:login_id` でユーザーIDをURLに指定し、PIN入力
- 成功すると JWT トークンを `localStorage.token` に保存
- トークンは API リクエストの `Authorization: Bearer xxx` で送信
- セッション確認用に `/api/me` エンドポイントあり
- ログアウト時は `token` を `localStorage` から削除し `/login/:login_id` へ戻る

---

## 💻 技術スタック

| 区分           | 使用技術                                |
|----------------|-----------------------------------------|
| フロントエンド | React 18, React Router v6, TailwindCSS |
| バックエンド   | Ruby on Rails 7（非APIモード）          |
| 認証           | JWT（PIN認証ベース）                   |
| データベース   | PostgreSQL                              |
| その他         | Webpacker構成（packs/components分割）   |

---

## 🔁 ルーティング概要

| URLパス | 用途 |
|--------|------|
| `/` | トップページ（ログイン後） |
| `/login/:login_id` | PIN入力画面 |
| `/tasks` | タスク画面 |
| `/memos` | メモ画面 |
| `/admin/users` | ユーザー一覧（管理者のみ） |
| `/settings/password` | パスワード変更画面（全ユーザー） |
| `/company_dashboard` | 企業別ダッシュボード（閲覧専用） |
| `/company_master` | 企業マスタ |
| `/category_master` | カテゴリマスタ |
| `/status_master` | ステータスマスタ |


---

## 🤖 GPT用アプリ定義メタデータ

```json
{
  "name": "TaskApp4",
  "description": "タスクとメモを管理するRails+ReactベースのSPAアプリケーション。JWTによるPIN認証を導入し、ユーザーはURL内のlogin_idを使用してログインする。",
  "tech_stack": {
    "frontend": ["React 18", "React Router v6", "TailwindCSS"],
    "backend": ["Ruby on Rails 7.0.8", "Webpacker"],
    "auth": "JWT (PIN-based login)",
    "database": "PostgreSQL"
  },
  "features": [
    "PINのみのJWTログイン（URLにlogin_id}）",
    "トークンのlocalStorage保存",
    "ログイン後にトップページへリダイレクト",
    "ユーザーごとのタスク・メモ表示",
    "企業・カテゴリ・ステータスマスタの管理",
    "管理者によるユーザー管理とPIN再設定",
    "自アカウントのパスワード変更",
    "スマホ対応のPINテンキーUI"
  ],
  "routes": {
    "login": "/login/:login_id",
    "api_login": "/api/login",
    "api_me": "/api/me",
    "admin_users": "/admin/users",
    "password_settings": "/settings/password",
    "root": "/",
    "fallback": "*path → home#top"
  }
}
```

---

## 📦 JWTトークン処理（lib配下）について

JWTのエンコード・デコード処理は `lib/json_web_token.rb` に定義されています。  
Railsアプリ全体で使えるよう、以下の設定を追加しています：

```rb
# config/application.rb
config.autoload_paths << Rails.root.join('lib')
```

以降、各コントローラからは `JsonWebToken.encode` / `decode` として利用可能です。

## 🧷 リポジトリ

[GitHub - segawasho/TaskApp4](https://github.com/segawasho/TaskApp4)
---

## 🛠 補足・実装上のルール（引き継ぎ用）

### 🔧 フロントエンド構成ルール
- `app/javascript/packs/` はすべて `createRoot().render()` 形式に統一（例：`admin.jsx`, `settings_password.jsx`）
- Reactコンポーネントは `app/javascript/components/` に保存し、packsからインポート
- TailwindCSSは PostCSS7 対応、`application.js` で読み込み
- PIN入力欄には表示/非表示トグルおよびテンキーUIを併設

### 🔐 ログイン・ユーザー状態管理
- JWTはログイン成功時に `localStorage.token` として保存
- ユーザー情報は `localStorage.user`（JSON文字列）として保存し、`App.jsx` 内で `setUser()`
- App初回レンダリング時に `/api/me` を叩いてログイン状態を取得（useEffect使用）
- `TopPage.jsx` などでは `user?.name` を条件に描画制御（「ようこそ、さん」問題の対策）

### 👤 管理者画面とユーザー操作
- `is_admin` は基本的に1ユーザーのみを予定（チェックボックスによる切り替えは非対応）
- 管理者は他ユーザーの `name`, `login_id`, `password` を一括更新可
- 通常ユーザーは `/settings/password` にて自分のPINを変更（旧パスワード不要）

### 🔁 UX対応
- タスクへのコメント送信は `Ctrl+Enter` / `⌘Cmd+Enter` でも実行可能
- PIN送信は `Ctrl+Enter` / `⌘Cmd+Enter` でも実行可能
- トークン失効時の401エラー対応や再認証リダイレクトは未実装

---


## 🧪 今後の拡張案（予定）

- トークンの有効期限と再ログイン誘導
- WBS構造によるタスク進捗管理
- TipTapの表対応、メモのファイル添付（S3を想定）
- Renderの有料プラン（Starter）を想定したデプロイ予定
  - S3などの外部ストレージと併用し、ストレージ制限に配慮
- Renderのsleep問題は、Renderの[cron job]機能や、無料のpingサービス（UptimeRobotなど）を使い回避

---
