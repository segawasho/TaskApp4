# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)


if RoleCategory.exists?
  puts "✅ 初期データ（RoleCategory, Role, Industry）は既に投入済みです。"
else
  role_categories = [
    { name: '会社員系', sort_order: 1 },
    { name: 'フリー系', sort_order: 2 },
    { name: 'クリエイティブ系', sort_order: 3 },
    { name: 'その他', sort_order: 4 }
  ]

  roles = {
    '会社員系' => %w[営業 経理 総務 エンジニア デザイナー],
    'フリー系' => %w[フリーランス 自営業 コンサルタント],
    'クリエイティブ系' => %w[イラストレーター 音楽家 映像クリエイター],
    'その他' => %w[学生 無職 その他]
  }

  industries = %w[
    建築
    製造
    教育
    IT
    飲食
    金融
    医療
    小売
    不動産
    運輸
    広告
    コンサルティング
    エンタメ
    公共サービス
    農業
    美容・理容
    該当なし
  ]

  ActiveRecord::Base.transaction do
    role_categories.each do |cat|
      rc = RoleCategory.find_or_create_by!(name: cat[:name]) do |r|
        r.sort_order = cat[:sort_order]
      end

      Role.find_or_create_by!(name: role_name, role_category: rc) do |r|
        r.sort_order = i + 1
      end
    end

    Industry.find_or_create_by!(name: name) do |ind|
      ind.sort_order = i + 1
    end
  end
end
