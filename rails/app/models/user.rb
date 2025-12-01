# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable
  include DeviseTokenAuth::Concerns::User
  has_many :books, dependent: :destroy

  scope :expired_guests, -> {
    where(is_guest: true).
      where("created_at <= ?", 1.day.ago)
  }

  def self.cleanup_guest_users
    expired_guests.destroy_all
  end
end
