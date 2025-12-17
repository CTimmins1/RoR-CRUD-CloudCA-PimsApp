# PIMS App — Project & Task Management System

A full-stack Ruby on Rails CRUD application for managing projects and their associated tasks.  
Built with Bootstrap for styling, Chartkick for data visualization, and GitHub Actions CI/CD for continuous integration.

---

## Features

### Project Management
- Create, view, edit, and delete projects.  
- Each project includes a title, description, and status.  
- Project-level dashboards for reporting and visual insights.

### Task Management
- Nested tasks under each project.  
- Each task includes a title, priority, due date, and status.  
- Status options: To Do, In Progress, Restarted, Completed.  
- Default values and validation ensure data integrity.

### Data Visualization
- Interactive charts powered by Chartkick and Google Charts.  
- Task breakdown by status per project.  
- Optional global task chart across all projects.

### Design
- Responsive Bootstrap 5 interface.  
- Color-coded badges for task priorities and statuses.  
- Card-based layout with intuitive navigation.

### Technical Stack
- Backend: Ruby on Rails 7 / 8  
- Frontend: ERB, Bootstrap 5, Chartkick  
- Database: PostgreSQL (production)  
- Testing: RSpec  
- CI/CD: GitHub Actions  
- Deployment: Render

---

## Setup Instructions

### 1. Clone the repository
```bash
https://github.com/CTimmins1/RoR-CRUD-CloudCA-PimsApp/tree/pims-backend
cd pims-backend

2. Install dependencies
bash
bundle install

3. Setup the database
bash
bin/rails db:create db:migrate db:seed

4. Start the server
bash
bin/dev

Or:

rails server
Then visit: http://localhost:3000

Running Tests
To run automated tests and linting locally:

bundle exec rspec
bundle exec rubocop
bundle exec brakeman

CI/CD Pipeline
This project uses GitHub Actions for continuous integration.

Runs RuboCop for linting.

Runs RSpec for automated testing.

Runs Brakeman for web vulnerabilities.

Optionally deploys to Render after successful tests.

Learning Outcomes
This project demonstrates:

-MVC architecture and RESTful design.

-Integration of data visualization using Chartkick.

-Responsive front-end development with Bootstrap.

-CI/CD pipeline setup using GitHub Actions.

-Deployment to a cloud hosting service.

-Application of software engineering principles such as TDD and version control.

Author: Conor 
GitHub: https://github.com/CTimmins1

