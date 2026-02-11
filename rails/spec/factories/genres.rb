FactoryBot.define do
  factory :genre do
    user
    name { Faker::Book.genre }
    is_default { false }

    trait :default do
      user { nil }
      is_default { true }
    end
  end
end
