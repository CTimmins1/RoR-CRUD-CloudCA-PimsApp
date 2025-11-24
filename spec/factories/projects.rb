# spec/factories/projects.rb
FactoryBot.define do
  factory :project do
    title { "Test Project #{SecureRandom.hex(4)}" }
    description { "A sample description for a new project." }
    status { :pending }
  end
end
