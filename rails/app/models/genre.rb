class Genre < ApplicationRecord
  belongs_to :user, optional: true
  has_many :books, dependent: :nullify

  validates :name, presence: true
end
