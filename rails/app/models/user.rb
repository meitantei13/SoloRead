# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable
  include DeviseTokenAuth::Concerns::User

  has_many :books, dependent: :destroy
  has_many :genres, dependent: :destroy
  has_many :notes, dependent: :destroy
  has_many :tags, dependent: :destroy

  # １以上の整数のみ許可。未入力はnil
  validates :yearly_reading_goal, numericality: { only_integer: true, greater_than: 0 }, allow_nil: true
end
