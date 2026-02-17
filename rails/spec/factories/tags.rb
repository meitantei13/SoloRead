FactoryBot.define do
  factory :tag do
    user
    name { Faker::Lorem.word }
    is_default { false }

    trait :default do
      user { nil }
      is_default { true }
    end
  end
end
