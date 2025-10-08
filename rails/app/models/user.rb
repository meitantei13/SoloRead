# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable
  include DeviseTokenAuth::Concerns::User
  has_many :books, dependent: :destroy
end
