# Main Branch – Project Overview

This repository uses a decoupled architecture.

- `pims-backend`: Rails API backend
- `pims-frontend`: React frontend

The main branch intentionally does not contain code.

## Demo Login 

Email: conor@example.com  
Password: password123

Steps to run (Locally):
1. cd pims-backend
2. bundle install
3. rails db:setup
4. rails s

In another terminal (Locally):
1. cd pims-frontend
2. npm install
3. npm run dev

Backend deployed on Render. 
Steps to run:
1. git clone -b pims-frontend https://github.com/CTimmins1/RoR-CRUD-CloudCA-PimsApp.git
2. npm install
3. npm run dev.
