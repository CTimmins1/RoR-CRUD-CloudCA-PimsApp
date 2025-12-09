FactoryBot.define do
  factory :task do
    association :project       # will also create a user through project

    title    { "My Task" }
    priority { :medium }       
    status   { :pending }
  end
end
