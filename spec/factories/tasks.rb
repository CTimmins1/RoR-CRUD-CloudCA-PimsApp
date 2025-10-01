# spec/factories/tasks.rb
FactoryBot.define do
  factory :task do
    # Use Faker for more realistic data if needed, or simple strings
    title { "Complete feature X" }
    due_date { 1.week.from_now }
    priority { 1 } # medium
    # Association: automatically creates a Project when a Task is built
    association :project
  end
end
