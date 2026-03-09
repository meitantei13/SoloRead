class Tag < ApplicationRecord
  belongs_to :user, optional: true

  has_many :note_tags, dependent: :destroy
  has_many :notes, through: :note_tags

  validates :name, presence: true
  validates :name, uniqueness: { scope: :is_default }, if: :is_default?
  validates :name, uniqueness: { scope: :user_id }, unless: :is_default?

  validate :tags_limit

  private

    # デフォルトタグと同じ名前は登録不可
    def tags_limit
      return if is_default?

      if Tag.where(name: name, is_default: true).exists?
        errors.add(:name, "デフォルトタグと同じ名前は登録できません")
      end
    end
end
