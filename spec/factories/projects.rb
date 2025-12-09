FactoryBot.define do
  factory :project do
    association :user          # <- this will create a user via the user factory
    title       { "Test Project" }
    description { "A sample project" }
    status      { :pending }   
  end
end
