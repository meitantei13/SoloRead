class Genre < ApplicationRecord
  belongs_to :user, optional: true
  has_many :books, dependent: :nullify

  validates :name, presence: true

  # デフォルトジャンルの名前重複を防ぐ
  validates :name, uniqueness: { scope: :is_default }, if: :is_default?

  # 同一ユーザーで同じユーザージャンル名の作成を防ぐ
  validates :name, uniqueness: { scope: :user_id }, unless: :is_default?
end
