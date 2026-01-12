class Book < ApplicationRecord
  belongs_to :user
  enum :status, { unsaved: 10, draft: 20, published: 30 }
  validates :title, :content, :read_date, presence: true, if: :published?
  validate :verify_only_one_unsaved_status_is_allowed

  # 今月、今年分の本を取得するスコープ
  scope :published,  -> { where(status: :published) }
  scope :this_month, -> { published.where(read_date: Time.current.beginning_of_month..Time.current.end_of_month) }
  scope :this_year, -> { published.where(read_date: Time.current.beginning_of_year..Time.current.end_of_year) }

  private

    def verify_only_one_unsaved_status_is_allowed
      if unsaved? && user.books.unsaved.present?
        raise StandardError, "未保存の記事は複数保有できません"
      end
    end
end
