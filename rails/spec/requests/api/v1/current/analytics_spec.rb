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
end
