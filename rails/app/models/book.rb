class Book < ApplicationRecord
  belongs_to :user
  belongs_to :genre, optional: true
  enum :status, { unsaved: 10, reading: 20, finished: 30 }
  validates :title, :content, :read_date, presence: true, if: :finished?
  validate :verify_only_one_unsaved_status_is_allowed

  # 今月、今年分の本を取得するスコープ
  scope :finished_this_month, -> { where(read_date: Time.current.beginning_of_month..Time.current.end_of_month) }
  scope :finished_this_year, -> { where(read_date: Time.current.beginning_of_year..Time.current.end_of_year) }

  private

    def verify_only_one_unsaved_status_is_allowed
      if unsaved? && user.books.unsaved.present?
        raise StandardError, "未保存の記事は複数保有できません"
      end
    end
end
