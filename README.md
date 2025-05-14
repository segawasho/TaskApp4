# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...


💡 lib配下の読み込み設定
JWT関連の共通処理（lib/json_web_token.rb）を使用するため、
config/application.rb に以下を追記しています：

config.autoload_paths << Rails.root.join('lib')

これにより JsonWebToken.encode(...) などを各コントローラで利用可能になります。
