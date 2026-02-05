class Book < ApplicationRecord
  belongs_to :user
  enum :status, { unsaved: 10, reading: 20, finished: 30 }
  validates :title, :content, :read_date, presence: true, if: :finished?
  validate :verify_only_one_unsaved_status_is_allowed

  private

    def verify_only_one_unsaved_status_is_allowed
      if unsaved? && user.books.unsaved.present?
        raise StandardError, "未保存の記事は複数保有できません"
      end
    end
end
