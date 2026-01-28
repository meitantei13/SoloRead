require "rails_helper"

RSpec.describe UserMailer, type: :mailer do
  describe "#email_change_confirmation" do
    let(:user) do
      create(
        :user,
        email: "old@example.com",
        unconfirmed_email: "new@example.com",
      )
    end
    let(:token) { "test-token" }

    let(:mail) do
      UserMailer.email_change_confirmation(user, token)
    end

    it "宛先が新しいメールアドレスになっている" do
      expect(mail.to).to eq ["new@example.com"]
    end

    it "件名が正しい" do
      expect(mail.subject).to eq "【Solo Read】メールアドレス変更の確認"
    end

    it "本文にトークンが含まれる" do
      expect(mail.body.encoded).to include token
    end
  end
end
