class RedesignUsersTable < ActiveRecord::Migration[7.0]
  def change
    remove_column :users, :login_id, :string

    # email: 一旦 null OK にする
    add_column :users, :email, :string
    add_index  :users, :email, unique: true

    # 後の migration で null: false に変更予定

    # role_id / industry_id は保留
    add_column :users, :prefecture, :string
    add_column :users, :city, :string

    add_column :users, :utm_source, :string
    add_column :users, :utm_medium, :string

    add_column :users, :has_project_plan, :boolean, default: false
    add_column :users, :has_wbs_plan, :boolean, default: false
    add_column :users, :has_file_upload_plan, :boolean, default: false
    add_column :users, :has_full_package_plan, :boolean, default: false
    add_column :users, :has_annual_plan, :boolean, default: false
    add_column :users, :is_invited_user, :boolean, default: false

    change_column_null :users, :is_admin, false
    change_column_default :users, :is_admin, from: nil, to: false
  end
end
