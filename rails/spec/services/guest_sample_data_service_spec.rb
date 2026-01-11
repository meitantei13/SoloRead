require "rails_helper"

RSpec.describe GuestSampleDataService, type: :service do
  describe ".create_for" do
    let(:user) { create(:user) }

    before do
      GuestSampleDataService.create_for(user)
    end

    it "読了済のデータを13件作成する" do
      expect(user.books.published.count).to eq(13)
    end

    it "下書きのデータを3件作成する" do
      expect(user.books.draft.count).to eq(3)
    end

    it "今月の読了済のデータが1件以上存在する" do
      this_month = user.books.published.where(
        read_date: Time.zone.today.beginning_of_month..Time.zone.today,
      )
      expect(this_month.count).to be >= 1
    end

    it "去年に読了済のデータが1件以上存在する" do
      last_year_range =
        (Time.zone.today - 1.year).beginning_of_year..(Time.zone.today - 1.year).end_of_year

      last_year_books = user.books.published.where(read_date: last_year_range)
      expect(last_year_books.count).to be >= 1
    end

    it "1月の場合とそれ以外の月でデータの数が正しいこと" do
      today = Time.zone.today

      this_month_count = user.books.published.where(
        read_date: today.beginning_of_month..today,
      ).count

      this_year_count = user.books.published.where(
        read_date: today.beginning_of_year..today,
      ).count

      if today.month == 1
        expect(this_year_count).to eq(this_month_count)
      else
        expect(this_year_count).to be > this_month_count
      end
    end
  end
end
