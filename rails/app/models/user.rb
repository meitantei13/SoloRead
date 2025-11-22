# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable
  include DeviseTokenAuth::Concerns::User
  has_many :books, dependent: :destroy

  def self.cleanup_guest_users
    where("created_at <= ?", 1.day.ago).
      where(name: "ゲストユーザー").
      destroy_all
  end
end
