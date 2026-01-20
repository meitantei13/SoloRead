FactoryBot.define do
  factory :genre do
    name { Faker::Book.genre }
    is_default { false }
    user { nil }

    trait :default do
      is_default { true }
      user { nil }
    end

    trait :custom do
      is_default { false }
      user
    end
  end
end
