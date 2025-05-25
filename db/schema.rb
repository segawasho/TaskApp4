# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2025_05_24_064725) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "categories", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_categories_on_user_id"
  end

  create_table "companies", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.string "company_code", null: false
    t.bigint "user_id", null: false
    t.index ["company_code"], name: "index_companies_on_company_code", unique: true
    t.index ["user_id"], name: "index_companies_on_user_id"
  end

  create_table "industries", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "sort_order", default: 0, null: false
    t.index ["sort_order"], name: "index_industries_on_sort_order"
  end

  create_table "memos", force: :cascade do |t|
    t.bigint "company_id", null: false
    t.string "title"
    t.text "body"
    t.date "memo_date"
    t.boolean "archived", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["company_id"], name: "index_memos_on_company_id"
    t.index ["user_id"], name: "index_memos_on_user_id"
  end

  create_table "progress_comments", force: :cascade do |t|
    t.bigint "task_id", null: false
    t.text "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["task_id"], name: "index_progress_comments_on_task_id"
    t.index ["user_id"], name: "index_progress_comments_on_user_id"
  end

  create_table "refresh_tokens", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "token", null: false
    t.datetime "expired_at", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["token"], name: "index_refresh_tokens_on_token", unique: true
    t.index ["user_id"], name: "index_refresh_tokens_on_user_id"
  end

  create_table "role_categories", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "sort_order", default: 0, null: false
    t.index ["sort_order"], name: "index_role_categories_on_sort_order"
  end

  create_table "roles", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "role_category_id"
    t.integer "sort_order", default: 0, null: false
    t.index ["role_category_id"], name: "index_roles_on_role_category_id"
    t.index ["sort_order"], name: "index_roles_on_sort_order"
  end

  create_table "statuses", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_statuses_on_user_id"
  end

  create_table "tasks", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.integer "company_id"
    t.integer "category_id"
    t.integer "status_id"
    t.date "due_date"
    t.integer "priority"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_done"
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_tasks_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name", limit: 20, null: false
    t.string "password_digest", null: false
    t.boolean "is_admin", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "email", null: false
    t.string "prefecture"
    t.string "city"
    t.string "utm_source"
    t.string "utm_medium"
    t.boolean "has_project_plan", default: false
    t.boolean "has_wbs_plan", default: false
    t.boolean "has_file_upload_plan", default: false
    t.boolean "has_full_package_plan", default: false
    t.boolean "has_annual_plan", default: false
    t.boolean "is_invited_user", default: false
    t.bigint "role_id", null: false
    t.bigint "industry_id"
    t.string "custom_role_description"
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "categories", "users"
  add_foreign_key "companies", "users"
  add_foreign_key "memos", "companies"
  add_foreign_key "memos", "users"
  add_foreign_key "progress_comments", "tasks"
  add_foreign_key "progress_comments", "users"
  add_foreign_key "refresh_tokens", "users"
  add_foreign_key "roles", "role_categories"
  add_foreign_key "statuses", "users"
  add_foreign_key "tasks", "users"
end
