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

ActiveRecord::Schema[8.1].define(version: 2026_03_27_023521) do
  create_table "active_storage_attachments", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.bigint "record_id", null: false
    t.string "record_type", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.string "content_type"
    t.datetime "created_at", null: false
    t.string "filename", null: false
    t.string "key", null: false
    t.text "metadata"
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "books", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "author", comment: "著者"
    t.text "content", comment: "感想"
    t.datetime "created_at", null: false
    t.bigint "genre_id"
    t.string "image_url"
    t.date "read_date", comment: "読了日"
    t.integer "status", comment: "ステータス （10:未保存, 20：読書中, 30:読了済）"
    t.string "title", comment: "書名"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["genre_id"], name: "index_books_on_genre_id"
    t.index ["user_id"], name: "index_books_on_user_id"
  end

  create_table "genres", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.boolean "is_default", default: false, null: false
    t.string "name", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.index ["user_id", "name"], name: "index_genres_on_user_id_and_name", unique: true
    t.index ["user_id"], name: "index_genres_on_user_id"
  end

  create_table "note_tags", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "note_id", null: false
    t.bigint "tag_id", null: false
    t.datetime "updated_at", null: false
    t.index ["note_id", "tag_id"], name: "index_note_tags_on_note_id_and_tag_id", unique: true
    t.index ["note_id"], name: "index_note_tags_on_note_id"
    t.index ["tag_id"], name: "index_note_tags_on_tag_id"
  end

  create_table "notes", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "book_id", null: false
    t.text "content", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["book_id"], name: "index_notes_on_book_id"
    t.index ["user_id"], name: "index_notes_on_user_id"
  end

  create_table "tags", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.boolean "is_default", default: false, null: false
    t.string "name", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.index ["name", "user_id"], name: "index_tags_on_name_and_user_id", unique: true
    t.index ["user_id"], name: "index_tags_on_user_id"
  end

  create_table "users", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.boolean "allow_password_change", default: false
    t.datetime "confirmation_sent_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "created_at", null: false
    t.string "email"
    t.datetime "email_change_sent_at"
    t.string "email_change_token"
    t.string "encrypted_password", default: "", null: false
    t.string "image"
    t.boolean "is_guest", default: false, null: false
    t.string "name"
    t.string "nickname"
    t.string "provider", default: "email", null: false
    t.datetime "remember_created_at"
    t.datetime "reset_password_sent_at"
    t.string "reset_password_token"
    t.text "tokens"
    t.string "uid", default: "", null: false
    t.string "unconfirmed_email"
    t.datetime "updated_at", null: false
    t.integer "yearly_reading_goal"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["email_change_token"], name: "index_users_on_email_change_token", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["uid", "provider"], name: "index_users_on_uid_and_provider", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "books", "genres"
  add_foreign_key "books", "users"
  add_foreign_key "genres", "users"
  add_foreign_key "note_tags", "notes"
  add_foreign_key "note_tags", "tags"
  add_foreign_key "notes", "books"
  add_foreign_key "notes", "users"
  add_foreign_key "tags", "users"
end
