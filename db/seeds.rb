puts "Seeding demo user..."

demo_email = "conor@example.com"
demo_password = "password123"

user = User.find_or_initialize_by(email: demo_email)

if user.new_record?
  user.password = demo_password
  user.password_confirmation = demo_password
  user.save!
  puts "Created demo user: #{demo_email}"
else
  puts "Demo user already exists: #{demo_email}"
end
