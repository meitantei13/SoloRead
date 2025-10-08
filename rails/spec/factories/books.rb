FactoryBot.define do
  factory :book do
    user
    title { Faker::Lorem.sentence }
    author { Faker::Name.name }
    content { Faker::Lorem.paragraph }
    read_date { Faker::Date.between(from: Time.zone.today - 365, to: Time.zone.today) }
    status { :published }
  end
end
