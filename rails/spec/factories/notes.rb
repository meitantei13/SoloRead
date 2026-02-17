FactoryBot.define do
  factory :note do
    user
    book
    content { Faker::Lorem.paragraph }
  end
end
