require "rails_helper"

RSpec.describe "Api::V1::Current::Analytics", type: :request do
  describe "GET api/v1/currnet/analytics/summary" do
    subject { get(summary_api_v1_current_analytics_path, headers:) }

    let(:headers) { current_user.create_new_auth_token }
    let(:current_user) { create(:user) }
    let(:other_user) { create(:user) }

    before { create_list(:book, 3, user: other_user) }

    context "summary が正常に動く" do
      before do
        create(:book, read_date: "2026-02-20", user: current_user)
        create(:book, read_date: "2025-08-15", user: current_user)
        create(:book, read_date: "2025-06-24", user: current_user)
        create(:book, read_date: "2025-01-03", user: current_user)
      end

      it "正しい値が返る" do
        subject
        res = response.parsed_body
        expect(res["finished_this_month"]).to eq 1
        expect(res["finished_this_year"]).to eq 1
        expect(res["total_count"]).to eq 4
        expect(res["monthly_average"]).to eq 0.2
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe "GET api/vi/current/analytics/monthly_counts" do
    subject { get(monthly_counts_api_v1_current_analytics_path, headers:, params:) }

    let(:headers) { current_user.create_new_auth_token }
    let(:current_user) { create(:user) }
    let(:other_user) { create(:user) }
    let(:params) { { year: 2026 } }

    before do
      create(:book, read_date: "2025-11-30", user: current_user)
      create(:book, read_date: "2026-01-15", user: current_user)
      create(:book, read_date: "2026-02-03", user: current_user)
      create(:book, read_date: "2026-02-10", user: other_user)
    end

    it "ログインユーザーの指定した年のデータが返る" do
      subject
      res = response.parsed_body

      expect(res["counts"].length).to eq 12
      expect(res["counts"][0]).to eq({ "month" => 1, "count" => 1 })
      expect(res["counts"][1]).to eq({ "month" => 2, "count" => 1 })
      expect(response).to have_http_status(:ok)
    end
  end

  describe "GET api/vi/current/analytics/genre_counts" do
    subject { get(genre_counts_api_v1_current_analytics_path, headers:, params:) }

    let(:headers) { current_user.create_new_auth_token }
    let(:current_user) { create(:user) }
    let(:other_user) { create(:user) }
    let(:params) { {} }

    before do
      @novel = create(:genre, name: "小説", user: current_user)
      @hobby = create(:genre, name: "趣味", user: current_user)
      create(:book, genre: @novel, user: current_user, read_date: "2026-01-15")
      create(:book, genre: @hobby, user: current_user, read_date: "2026-01-20")
      create(:book, genre: @hobby, user: current_user, read_date: "2026-02-18")
      create(:book, genre: nil, user: current_user, read_date: "2026-01-20")
      create(:book, genre: @hobby, user: other_user, read_date: "2026-02-10")
    end

    context "年を指定しているとき" do
      let(:params) { { year: 2026 } }
      it "ログインユーザーのデータのみ正常に取得" do
        subject
        res = response.parsed_body
        expect(res["counts"].length).to eq 3
        expect(response).to have_http_status(:ok)
      end

      it "genre: nil が未分類となっている" do
        subject
        res = response.parsed_body
        expect(res["counts"]).to include(
          { "genre" => "未分類", "count" => 1 },
        )
        expect(response).to have_http_status(:ok)
      end
    end

    context "月を指定するとき" do
      let(:params) { { year: 2026, month: 1 } }

      it "正常にレコードを取得できる" do
        subject
        res = response.parsed_body
        expect(res["month"]).to eq 1
        expect(res["counts"]).to contain_exactly(
          { "genre" => "小説", "count" => 1 },
          { "genre" => "趣味", "count" => 1 },
          { "genre" => "未分類", "count" => 1 },
        )
        expect(response).to have_http_status(:ok)
      end
    end

    context "データが存在しないとき" do
      let(:params) { { year: 2025 } }

      it "空の配列が返る" do
        subject
        res = response.parsed_body
        expect(res["counts"]).to eq []
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
