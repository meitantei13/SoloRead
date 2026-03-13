RSpec.describe DeleteGuestUsersJob, type: :job do
  describe "#perform" do
    it "24時間以上経過したゲストアカウントを削除" do
      guest = create(:user, is_guest: true, created_at: 25.hours.ago)
      DeleteGuestUsersJob.perform_now
      expect(User.exists?(guest.id)).to be false
    end

    it "24時間未満のゲストユーザーは削除しない" do
      guest = create(:user, is_guest: true, created_at: 23.hours.ago)
      DeleteGuestUsersJob.perform_now
      expect(User.exists?(guest.id)).to be true
    end

    it "通常ユーザーは削除しない" do
      user = create(:user, is_guest: false, created_at: 25.hours.ago)
      DeleteGuestUsersJob.perform_now
      expect(User.exists?(user.id)).to be true
    end
  end
end
