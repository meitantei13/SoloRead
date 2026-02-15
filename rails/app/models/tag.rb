class Tag < ApplicationRecord
  belongs_to :user, optional: true

  has_many :note_tags, dependent: :destroy
  has_many :notes, through: :note_tags

  validates :name, presence: true
  validates :name, uniqueness: { scope: :is_default }, if: :is_default?
  validates :name, uniqueness: { scope: :user_id }, unless: :is_default?
end
