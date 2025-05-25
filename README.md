
# TaskApp4 - タスク & メモ管理アプリ

## 🧩 概要

TaskApp4 は、Rails + React で構築された業務タスク＆メモ管理アプリです。  
JWT認証ログインを採用し、企業・カテゴリ別にタスクやメモを整理できます。  
SPA構成のため、快適な操作感でWebとモバイル両対応のモダンなUIを実現しています。

🔐 認証・ログイン機能（現行仕様）
✅ 概要
このアプリでは、**Rails + React構成の中でJWT認証（セッションレス）**を実現しています。将来的なAPIモードへの移行を見据えた構成になっています。
認証方式：JWT + Cookieベース
セッションレスなAPI認証
フロントエンドは credentials: 'include' を使ってJWTを送信
ユーザー状態は /api/me で取得
リフレッシュトークンによる再ログイン処理も一部導入済（拡張予定）
リフレッシュトークン方式->短命JWTと別のCookieでrefresh用トークンを分けることでセッション継続性と安全性を両立
XSS耐性->HttpOnly & Secure
CORS設定->credentials: true を許すオリジンだけに限定->CSRF被害の防止
JWTのexp / iatチェック->有効期限が切れたトークンを無効にする

| 要素         | 内容                                   |
| ---------- | ------------------------------------ |
| トークン形式     | JWT（短期） + Refreshトークン（長期）            |
| 保存場所（フロント） | HttpOnly Cookie（JavaScriptからアクセス不可）  |
| 認証維持の方式    | サーバー側で Cookie を解読し、current\_user を復元 |
| APIセキュリティ  | セッションレス、安全、CORS対応済（SameSite=Lax or strict）     |


✅ JWT保存場所
cookies.encrypted[:jwt]（HttpOnly, secure: false ※開発環境）
cookies.encrypted[:refresh_token]（同上）

✅ 実装内容（主要エンドポイント）
エンドポイント	概要	メソッド	備考
/api/login	ログイン（JWT + RefreshToken Cookie発行）	POST	/sessions#create
/api/logout	ログアウト（Cookie削除）	DELETE	実装拡張予定
/api/me	ログイン状態チェック（JWTからcurrent_user取得）	GET	/sessions#me
/api/users	ユーザー登録	POST	/registrations#create
/api/users　ユーザー更新　POST　/users#update
/api/password	パスワード更新（ログイン中）	PATCH	/users#update_password

✅ 認証フロー（詳細図：JWT + Refreshトークン運用）
1. ユーザーがログイン
[フロントエンド（React）]
    ↓
POST /api/login （email + password）
    ↓
[バックエンド（Rails）]
    - JWT（有効期限：15分）を発行
    - RefreshToken（有効期限：2週間）をDB保存
    - 両方を Cookie に保存（HttpOnly, SameSite: Lax）

Cookie:
  - jwt (短命トークン, expires_in=15分)
  - refresh_token (長期トークン, expires_in=2週間)

2. 各APIアクセス時の認証処理
[React]
    fetch('/api/any-protected-endpoint', {
      credentials: 'include'
    });

    ↓（自動で Cookie にある jwt を送信）

[ApplicationController（Rails）]
    - cookies.encrypted[:jwt] を読み取り
    - JWT を decode
    - user_id を取得 → current_user をセット

3. JWT の期限切れ時の自動再認証（未実装 or 一部実装中）
[JWTが期限切れの場合]
    ↓
/api/me 等で 401 Unauthorized が返る

    ↓（クライアント側で検知して）

[Reactが /api/refresh_token を叩く（※今後追加予定）]
    - RefreshTokenを使って新しいJWTを発行
    - Cookieに再保存（jwtだけ更新）

    ↓
再度APIアクセス → 成功

4. ログアウト処理
[Reactがログアウト操作]
    ↓
DELETE /api/logout
    - Cookieのjwt, refresh_tokenを削除
    - RefreshTokenモデルの該当レコードも削除（セキュアな多端末対応）
→ 次回アクセス時には /api/me が 401 を返すようになる

✅ 今後の強化予定
- /api/refresh_token の実装と、クライアントによる自動リカバリ処理
- 複数デバイス対応のため、RefreshTokenのテーブル構成強化
- Cookieオプションの本番環境対応（secure: true, domain設定）
- tokenの失効ログ記録、再発行ログなどのセキュリティ履歴


---

## 🚀 主な機能

- ✅ **ログイン**
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
  - `role`（職種）および`industry`（業種）はis_admin:true ユーザー(管理者)が自由に設定可
  - `role`（職種）および`industry`（業種）を新規会員登録(signup)時の選択肢として登録画面に表示
  - `role` は `role_categories`（親カテゴリ）に分類され、1つだけ選択可能
  - `industry` は `industry_categories` に分類され、任意選択（複数可）
  - `その他`を選ぶと自由記述欄（custom_role_description）も入力可能
  - 企業(company)マスタ・カテゴリ(category)マスタ・ステータス(status)マスタ
  - 各データ（タスク、メモ、マスタ等）に `user_id` を保持し、ログインユーザーに紐付くデータのみ表示
  - 今後対応：CSV取込・出力
- ✅ **ダッシュボード機能**
  - 企業別のタスク・メモ集約画面（閲覧のみ）→company_dashboard(※あまり使っていない)
  ✅ **パスワード変更**
  - ユーザーご自身のパスワード変更を行う画面（PasswordSettings.jsx）
- ✅ **ユーザー管理（管理者）**
  - 一般ユーザーの情報編集、パスワード再設定
  - 各データ（タスク、メモ、マスタ等）に `user_id` を保持し、ログインユーザーに紐付くデータのみ表示
- ✅ **UI対応**
  - TailwindCSSによるレスポンシブ対応
  - Header.jsx,Footer.jsx,PageLayout.jsx(メイン部分)でレイアウトを共通化している
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
  - ログインは `/login` にて **メールアドレス + パスワード** をPOST
  - 成功すると JWT アクセストークン + Refreshトークンを `HttpOnly Cookie` に保存（予定）
  - トークンは API リクエストの `Authorization: Bearer xxx` で送信（将来的にCookieベースへ移行）
  - セッション確認用に `/api/me` エンドポイントあり
  - ログアウト時は Cookie削除によりログアウト状態に

- トークンは API リクエストの `Authorization: Bearer xxx` で送信
- セッション確認用に `/api/me` エンドポイントあり

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
| `/signup`| 新規会員登録 |
| `/login` | ログイン画面 |
| `/tasks` | タスク画面 |
| `/memos` | メモ画面 |
| `/admin/users` | ユーザー一覧（管理者のみ） |
| `/settings/password` | パスワード変更画面（全ユーザー） |
| `/company_dashboard` | 企業別ダッシュボード（閲覧専用） |
| `/company_master` | 企業マスタ |
| `/category_master` | カテゴリマスタ |
| `/status_master` | ステータスマスタ |

---

## 📁 Reactルーティング構成ファイルの説明
### app/javascript/components/App.jsx
- 全体を ToastProvider, ModalProvider で囲んで、グローバルにトースト通知とモーダルを提供
- BrowserRouter でReact Routerを使えるようにする
- ルーティングの定義自体は AppRoutes.jsx に委譲（コード分離による保守性向上）
### app/javascript/components/AppRoutes.jsx
- このファイルは、ルーティング構成とログイン状態の制御を担当するコンポーネントです。
- useEffect で /api/me を叩いて JWT 認証状態を取得
- ログイン中かどうかに応じて表示するルートを切り替える
- user.is_admin に応じた管理者ページ制御もここで行う
- ローディング中は "Loading..." 表示で一瞬のブランクを防止
#### 主な特徴：
- 状況	表示されるページ
- 非ログイン	/login, /signup のみ表示可能
- ログイン済	/, /tasks, /memos, /admin/users などすべて使用可能
### app/javascript/components/AdminRoute.jsx
- このファイルは、管理者専用ページへのアクセス制御コンポーネントです。
- user が存在しなければ /login にリダイレクト
- user.is_admin !== true の場合は / に強制リダイレクト
- <AdminRoute>...</AdminRoute> のようにラップして使う
### ✅ 今後のAPIモード移行時のポイント
- これらの構成はAPIモードにしてもそのまま使える
- バックエンド側をAPI専用にしても、React側のルーティング・認証処理には影響なし
- getCurrentUser() を axios または fetch で叩くAPI先だけ変更すればOK

--
### 🧩 React コンポーネント構成図（親子関係）

App.jsx
├─ ToastProvider（トースト通知のコンテキスト）
├─ ModalProvider（モーダルUIのコンテキスト）
└─ BrowserRouter
    └─ AppRoutes.jsx
        ├─ Login.jsx（未ログイン時）
        ├─ SignupForm.jsx（未ログイン時）
        ├─ TopPage.jsx（ログイン後トップ）
        ├─ TaskList.jsx
        │   └─ CommentSection.jsx（進捗コメント）
        ├─ MemoList.jsx
        │   └─ MemoEditor.jsx（メモ作成・編集）
        ├─ CompanyDashboard.jsx
        │   └─ dashboards/
        │       ├─ Dashboard.jsx
        │       ├─ BarChart.jsx
        │       ├─ PieChart.jsx
        │       └─ CompanyTaskTable.jsx
        ├─ CompanyMaster.jsx
        ├─ CategoryMaster.jsx
        ├─ StatusMaster.jsx
        ├─ PasswordSettings.jsx
        ├─ AdminUserList.jsx（管理者専用）
        │   └─ AdminRoute.jsx（アクセス制御）
        ├─ PageLayout.jsx（共通レイアウト）
        │   ├─ Header.jsx
        │   ├─ FooterNav.jsx
        │   └─ Modal.jsx（各画面から呼び出し可能）
        └─ Toast.jsx（トースト表示）

--

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

## 次回APIモード作成時のバージョン構成

| コンポーネント        | バージョン                  | 評価と理由                                   |
| -------------- | ---------------------- | --------------------------------------- |
| **Ruby**       | 3.2.2                  | 安定かつRails 7.1との相性◎。将来的な互換性もOK           |
| **Rails**      | 7.1.3                  | Vite + API前提に最適。ActiveModel API系も充実     |
| **Node.js**    | 18.x.x                 | LTS（長期サポート）。npm 9 付きで安心。Vite/Reactとも相性◎ |
| **npm**        | 9.x.x                  | Yarnと違って学習コストが低く、今後普及が続く傾向              |
| **React**      | 18.2.0                 | モダンライブラリが完全対応済。19系はまだ時期尚早               |
| **Vite**       | 4.5.2                  | vite\_ruby 3.2.2 との互換性が安定しているバージョン      |
| **vite\_ruby** | 3.2.2（Gem）             | Rails公式推奨にも登場、十分に成熟済                    |
| **PostgreSQL** | 14                     | クラウドDB対応・日本語検索・CTE・jsonb等の機能十分          |
| **ロック方法**      | `package-lock.json` 管理 | Yarnよりnpmのほうが明示管理がしやすく、npm ci にも対応      |




## 🧷 リポジトリ

[GitHub - segawasho/TaskApp4](https://github.com/segawasho/TaskApp4)
