require "rails_helper"

RSpec.describe GuestSampleDataService, type: :service do
  include ActiveSupport::Testing::TimeHelpers

  let(:user) { create(:user) }
  describe ".create_for" do
    context "1月の場合" do
      before do
        travel_to(Date.new(2025, 1, 15)) do
          GuestSampleDataService.create_for(user)
        end
      end

      it "読了済データを11件作成する" do
        expect(user.books.finished.count).to eq(11)
      end
    end

    context "2月以降の場合" do
      before do
        travel_to(Date.new(2025, 8, 15)) do
          GuestSampleDataService.create_for(user)
        end
      end

      it "読了済データを16件作成する" do
        expect(user.books.finished.count).to eq(16)
      end
    end

    context "共通仕様" do
      before do
        travel_to(Date.new(2025, 8, 15))
        GuestSampleDataService.create_for(user)
      end

      after do
        travel_back
      end

      it "読書中のデータを3件作成する" do
        expect(user.books.reading.count).to eq(3)
      end

      it "今月の読了済のデータが1件以上存在する" do
        this_month = user.books.finished.where(
          read_date: Time.zone.today.beginning_of_month..Time.zone.today,
        )
        expect(this_month.count).to be >= 1
      end

      it "去年に読了済のデータが1件以上存在する" do
        last_year_range =
          (Time.zone.today - 1.year).beginning_of_year..(Time.zone.today - 1.year).end_of_year

        last_year_books = user.books.finished.where(read_date: last_year_range)
        expect(last_year_books.count).to be >= 1
      end
    end
  end
end
