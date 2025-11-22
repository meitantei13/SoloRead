require "rails_helper"

RSpec.describe User, type: :model do
  context "factoryのデフォルト設定に従った場合" do
    let(:user) { create(:user) }

    it "承認済みの user レコードを正常に新規作成できる" do
      expect(user).to be_valid
      expect(user).to be_confirmed
    end
  end

  describe "cleanup_guest_users" do
    it "1日以上経過したゲストアカウントを自動削除" do
      old_guest = User.create!(name: "ゲストユーザー", email: "guest_1@example.com", password: "password", created_at: 2.days.ago)

      new_guest = User.create!(name: "ゲストユーザー", email: "guest_2@example.com", password: "password", created_at: Time.current)

      expect { User.cleanup_guest_users }.to change { User.count }.by(-1)
      expect(User).not_to exist(old_guest.id)
      expect(User).to exist(new_guest.id)
    end
  end
end
