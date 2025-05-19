
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
  - タスクの登録・編集・完了チェック・削除（削除時はモーダル確認あり）
  - コメント投稿／編集／削除（削除時はモーダル確認あり）
  - タブ切り替え（未完了・完了・すべて）をフィルターUI内に統合
- ✅ **メモ管理**
  - メモの作成・編集・削除（企業別に分類）
  - 本文は TipTapエディタで装飾・リンク対応（編集時は共通モーダル非使用）
  - 削除・アーカイブ時のみ共通モーダルで確認表示
- ✅ **マスタ管理機能**
  - 企業マスタ・カテゴリマスタ・ステータスマスタ
  - 今後対応：CSV取込・出力
- ✅ **ダッシュボード機能**
  - 企業別のタスク・メモ集約画面（閲覧のみ）
- ✅ **ユーザー管理（管理者）**
  - 一般ユーザーの情報編集、PIN再設定
  - 自分のパスワード変更（旧パスワード不要）
  - 各データ（タスク、メモ、マスタ等）に `user_id` を保持し、ログインユーザーに紐付くデータのみ表示
- ✅ **スマホUI対応**
  - TailwindCSSによるレスポンシブ対応
  - 数字ボタンでのPIN入力
- ✅ **共通トースト通知／モーダル確認UI**
  - ToastContext / ModalContext による状態管理
  - 成功・失敗時にトースト表示、削除やアーカイブ確認にはモーダル使用（一部メモ詳細モーダルのみ複雑なため、未使用）
- ✅ **ダッシュボード機能**
  - タスクの集計を視覚化し、TopPageに統合表示
  - ステータス別（円グラフ）、期限別（棒グラフ）、企業別タスク（表形式）
  - `/api/dashboard/summary` でJWT認証下のユーザーに紐づくタスクを集計・返却
  - 表示は `Dashboard.jsx` 経由で `<TopPage />` に読み込み
  - グラフ描画に Chart.js + react-chartjs-2 を使用
  - `chart.js@4.4.0`, `react-chartjs-2@5.2.0`, `chartjs-plugin-datalabels` を導入
  - 期限判定は日本時間（JST）で正確に分類
  - Rails側(application.rb)で `Time.zone.today` を使用し、`due_date` を DATE型比較

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

## 🛠 補足・実装上のルール（引き継ぎ用）

### 🔧 フロントエンド構成ルール
- `app/javascript/packs/` はすべて `createRoot().render()` 形式に統一
- Reactコンポーネントは `app/javascript/components/` に保存
- TailwindCSSは PostCSS7 対応、`application.js` で読み込み
- ToastContext / ModalContext による共通UI制御を導入（タスク・メモの削除等に活用）

### 🔐 ログイン・ユーザー状態管理
- JWTはログイン成功時に `localStorage.token` に保存
- ユーザー情報は `localStorage.user` にJSONで保存し、`App.jsx` 内で `setUser()`
- App初回で `/api/me` を叩いてログイン状態確認
- 各データには `user_id` を保持、API側でもログインユーザーに限定したデータのみ返却

### 👤 管理者画面とユーザー操作
- `is_admin` は主に1ユーザー（チェック切替ではなく固定）
- 管理者は他ユーザーの `name`, `login_id`, `password` を一括編集可
- 通常ユーザーは `/settings/password` にて自分のPINを変更（旧パス不要）

### 🔁 UX対応
- コメント・PINは `Ctrl+Enter` / `⌘Cmd+Enter` 送信対応
- 削除操作などにはモーダルで確認、成功・失敗時にトースト通知表示
- モバイル操作を考慮し、各画面の下部にフッターナビを固定（高さぶん余白調整済）

---

## 🤖 ChatGPT利用時の補足

- コード補助やREADME編集時に **Canvas（サイドエディタ機能）ではなく、通常のテキストベースで対応希望**
- Canvasはページが重くなるため、使用しないようにしてください
- ファイルのアップロードや構造整理などはこれまで通りテキストで丁寧に進行してください

---

## 🔄 直近の改善ポイント（2025年5月18日）

- ✅ **ToastContext / ModalContext を導入し、アプリ全体の通知・確認モーダルを統一**
  - トースト：保存成功／失敗、削除、復元、通信エラー時などに通知
  - モーダル：削除・保存時の確認UIを共通化（`useModal()`で表示）
- ✅ **Header / Footer を全ページで共通化**
  - `PageLayout.jsx` を導入し、`<Header>`, `<FooterNav>` の固定表示と余白管理を共通化
- ✅ **パスワード変更・ユーザー管理画面も共通UI対応**
  - `/settings/password`（一般ユーザー）
  - `/admin/users`（管理者専用）で保存・失敗時に共通トースト使用
- ✅ **旧記述（alertやlocalなモーダル）を全て削除**し、`contexts/` 経由に統一

---

## 🧪 今後の拡張案（予定）

- トークンの有効期限と再ログイン誘導
- WBS構造によるタスク進捗管理
- TipTapの表対応、メモのファイル添付（S3を想定）
- Renderの有料プラン（Starter）を想定したデプロイ予定
  - S3などの外部ストレージと併用し、ストレージ制限に配慮
  - 無料プランのsleep回避には、Renderの[cron job]機能や、無料のpingサービス（UptimeRobotなど）を使い回避

---

## 🧷 リポジトリ

[GitHub - segawasho/TaskApp4](https://github.com/segawasho/TaskApp4)
