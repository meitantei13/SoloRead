FactoryBot.define do
  factory :book do
    user
    title { Faker::Lorem.sentence }
    author { Faker::Name.name }
    content { Faker::Lorem.paragraph }
    read_date { Faker::Date.between(from: Date.today - 365, to: Date.today) }
    status { :published }
  end
end
