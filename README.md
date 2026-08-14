# 🎓 College Project Management System

<p align="center">
  <strong>A full-stack platform for managing final-year college projects from proposal to completion.</strong>
</p>

<p align="center">
  <a href="https://college-project-management-system.netlify.app/">🌐 Live Demo</a>
  •
  <a href="#-features">Features</a>
  •
  <a href="#-architecture">Architecture</a>
  •
  <a href="#-workflows">Workflows</a>
  •
  <a href="#-local-development">Run Locally</a>
</p>

------------------------------------------------------------------------

## 🌐 Live Project

### 👉 [Open College Project Management System](https://college-project-management-system.netlify.app/)

The frontend is deployed and available online.

> **Important:** The application is intentionally designed around a
> college-controlled user model. There is no unrestricted public
> Student/Teacher sign-up flow. The Admin creates and manages authorized
> accounts.

------------------------------------------------------------------------

## 📌 What Is This?

The **College Project Management System** is a full-stack web
application designed to replace scattered communication and manual
tracking of final-year projects with a centralized digital workflow.

It connects three roles:

``` text
                    ┌──────────────────┐
                    │      ADMIN       │
                    │  College Control │
                    └────────┬─────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
     ┌─────────────────┐          ┌─────────────────┐
     │     STUDENT     │          │     TEACHER     │
     │ Project Owner   │◄────────►│   Supervisor    │
     └─────────────────┘          └─────────────────┘
```

Complete lifecycle:

**Project Proposal → Admin Approval → Supervisor Assignment →
Development → File Submission → Feedback → Completion**

------------------------------------------------------------------------

# ✨ Features

- 🔐 JWT authentication with HTTP-only cookies
- 👥 Role-based access control
- 🧑‍💼 Admin-controlled account creation
- 🎓 Student project management
- 👨‍🏫 Supervisor assignment and requests
- 📁 Project file uploads
- 💬 Teacher feedback
- 🔔 In-app notifications
- 📧 Email notifications
- 🗄️ MongoDB data modeling
- ⚡ Redux Toolkit state management
- 🌐 REST API architecture
- 🛡️ Protected routes and middleware
- 📱 Responsive React UI

------------------------------------------------------------------------

# 👥 User Roles

## 🧑‍💼 Admin

The Admin acts as the college-level controller.

- Create student accounts
- Create teacher accounts
- Manage users
- Review project proposals
- Approve or reject projects
- Assign supervisors
- Manage deadlines
- Monitor project progress

## 🎓 Student

Students can:

- Login securely
- Submit project proposals
- Track project status
- Request supervisors
- Upload project files
- View supervisor feedback
- Receive notifications
- Track completion

## 👨‍🏫 Teacher / Supervisor

Teachers can:

- Review supervisor requests
- Accept or reject requests
- View assigned students
- View student projects
- Download project files
- Provide feedback
- Track progress
- Mark projects as completed

------------------------------------------------------------------------

# 🔄 Complete Project Lifecycle

``` text
Student submits proposal
        ↓
Project = Pending
        ↓
Admin reviews
        ↓
Approve / Reject
        ↓
Supervisor assignment
        ↓
Student works on project
        ↓
File submission
        ↓
Teacher reviews
        ↓
Feedback
        ↓
Teacher marks completed
        ↓
Student receives notification
```

------------------------------------------------------------------------

# 🏗️ Architecture

``` text
                    ┌─────────────────────┐
                    │     React + Vite    │
                    │     Frontend        │
                    └──────────┬──────────┘
                               │
                             Axios
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Express REST API   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Authentication /    │
                    │ Authorization       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Routes → Controllers│
                    │ → Services → Models │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      MongoDB        │
                    └─────────────────────┘
```

------------------------------------------------------------------------

# 🔐 Authentication & Authorization

Authentication uses:

- JWT
- HTTP-only cookies
- Protected API routes
- Role-based authorization

``` text
Request
  ↓
JWT Cookie
  ↓
Authentication Middleware
  ↓
User Identified
  ↓
Role Check
  ├── Admin   → Admin APIs
  ├── Student → Student APIs
  └── Teacher → Teacher APIs
```

Users cannot access functionality outside their assigned role.

------------------------------------------------------------------------

# 🔒 Why There Is No Public Sign-Up Button

This is an intentional architectural decision.

The current application is designed for a **specific college**, where
the Admin controls who belongs to the system.

If unrestricted registration were enabled:

``` text
Random Internet User
        ↓
Public Sign Up
        ↓
Creates Account
        ↓
Could enter the college system
```

Instead:

``` text
                COLLEGE ADMIN
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
     Create Student        Create Teacher
          │                     │
          └──────────┬──────────┘
                     ▼
              Authorized Users
```

Therefore, there is intentionally **no public Student/Teacher
registration button**.

This is an access-control and data-isolation decision, not a missing
feature.

------------------------------------------------------------------------

# 🌍 Live Demo & Access Model

### 🚀 Live Frontend

**[Launch the
Application](https://college-project-management-system.netlify.app/)**

The frontend is publicly accessible for demonstration.

The authenticated workflows require authorized accounts created by the
Admin.

### 🔐 Demo Credentials

Real administrator credentials are **not included in this public
README**.

If you are a recruiter, interviewer, evaluator, or reviewer and would
like to test the authenticated workflows, please contact me for
controlled demo credentials.

> Never publish a real administrator password in a public GitHub
> repository.

------------------------------------------------------------------------

# 🛠️ Technology Stack

| Layer            | Technologies            |
|------------------|-------------------------|
| Frontend         | React, Vite             |
| State Management | Redux Toolkit           |
| Routing          | React Router            |
| Styling          | Tailwind CSS            |
| HTTP Client      | Axios                   |
| Backend          | Node.js, Express.js     |
| Database         | MongoDB                 |
| ODM              | Mongoose                |
| Authentication   | JWT + HTTP-only Cookies |
| File Uploads     | Multer                  |
| Email            | Nodemailer              |
| Deployment       | Netlify                 |

------------------------------------------------------------------------

# 📁 Project Structure

``` text
College-Project-Management-System/
│
├── Client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── ...
│
├── Server/
│   ├── controllers/
│   ├── middlewares/
│   ├── Models/
│   ├── routes/
│   ├── services/
│   ├── app.js
│   ├── server.js
│   └── ...
│
└── README.md
```

------------------------------------------------------------------------

# 🔄 Core Workflows

## Student Project Submission

``` text
Student Login
     ↓
Title + Description
     ↓
Submit Proposal
     ↓
Project = Pending
     ↓
Admin Review
```

## Approval & Supervisor Assignment

``` text
Admin Reviews
     ↓
Approve
     ↓
Assign Teacher
     ↓
Update Student + Teacher + Project
     ↓
Notifications + Email
```

## Supervisor Request

``` text
Student selects Teacher
        ↓
Supervisor Request
        ↓
Teacher Reviews
        ↓
Accept / Reject
        ↓
Accepted → Student + Teacher + Project linked
```

## Files & Feedback

``` text
Student uploads file
        ↓
Multer processes upload
        ↓
File stored and referenced
        ↓
Teacher downloads
        ↓
Teacher provides feedback
        ↓
Student receives notification
```

## Completion

``` text
Teacher reviews project
        ↓
Marks project completed
        ↓
Project status = Completed
        ↓
Student notified
```

------------------------------------------------------------------------

# 📧 Notifications & Email

Important events can trigger notifications and emails:

- Project approval
- Project rejection
- Supervisor assignment
- Supervisor request
- Request acceptance
- Request rejection
- Teacher feedback
- Project completion

Email functionality is implemented using **Nodemailer**.

------------------------------------------------------------------------

# 🗄️ Database

MongoDB with Mongoose is used for core entities including:

- Users
- Projects
- Supervisor Requests
- Notifications
- Deadlines

The relationships between students, teachers, projects, and supervisor
requests are maintained through MongoDB references.

------------------------------------------------------------------------

# 💻 Local Development

## 1. Clone

``` bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd College-Project-Management-System
```

## 2. Backend

``` bash
cd Server
npm install
npm run dev
```

## 3. Frontend

Open another terminal:

``` bash
cd Client
npm install
npm run dev
```

The frontend normally runs at:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

# 🔑 Environment Variables

Create a backend `.env` file.

``` env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
```

Never commit real credentials, API keys, database passwords, email
passwords, or JWT secrets.

------------------------------------------------------------------------

# 🚀 Deployment

The frontend is deployed on Netlify:

**[🌐 Live
Application](https://college-project-management-system.netlify.app/)**

The current access model intentionally keeps account creation controlled
by the college administrator.

A future production architecture could include:

- Secure backend hosting
- HTTPS
- Cloud file storage
- Database security
- Secret management
- CI/CD
- Monitoring
- Rate limiting
- Audit logs
- Multi-college tenant isolation

------------------------------------------------------------------------

# 🧠 What This Project Demonstrates

This project demonstrates practical experience with:

- Full-stack web development
- React architecture
- Redux state management
- REST API design
- Express middleware
- JWT authentication
- HTTP-only cookies
- Role-based authorization
- MongoDB schema design
- Mongoose relationships
- File uploads
- Email automation
- Notification systems
- Protected routes
- Error handling
- Layered backend architecture
- Deployment and environment configuration

------------------------------------------------------------------------

# 🔮 Future Improvements

The next major architectural improvement would be converting the current
single-college system into a **multi-college / multi-tenant platform**.

``` text
                    Platform
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
     College A      College B      College C
        │              │              │
    Students       Students       Students
    Teachers       Teachers       Teachers
```

Potential improvements:

- Multi-college support
- College-specific administrators
- Cloud file storage
- Real-time notifications
- CI/CD
- Automated testing
- Analytics dashboards
- Audit logs
- Project progress tracking
- Production monitoring

------------------------------------------------------------------------

# 📊 Project Status

| Component                | Status                    |
|--------------------------|---------------------------|
| React Frontend           | ✅ Completed              |
| Vite                     | ✅ Completed              |
| Redux Toolkit            | ✅ Completed              |
| REST API                 | ✅ Completed              |
| MongoDB                  | ✅ Completed              |
| Authentication           | ✅ Completed              |
| JWT + HTTP-only Cookies  | ✅ Completed              |
| Role-Based Authorization | ✅ Completed              |
| Admin Workflow           | ✅ Completed              |
| Student Workflow         | ✅ Completed              |
| Teacher Workflow         | ✅ Completed              |
| Supervisor Requests      | ✅ Completed              |
| File Uploads             | ✅ Completed              |
| Feedback System          | ✅ Completed              |
| Notifications            | ✅ Completed              |
| Email Integration        | ✅ Completed              |
| Frontend Deployment      | ✅ Live                   |
| Public Sign-Up           | 🔒 Intentionally Disabled |
| Multi-College Support    | 🚧 Future Improvement     |

------------------------------------------------------------------------

# 🎯 Project Philosophy

> **Every role has a responsibility.  
> Every action has permission.  
> Every project has a traceable lifecycle.**

This project was built to solve a practical college workflow while
gaining hands-on experience with full-stack engineering, authentication,
authorization, database design, file management, notifications, email
communication, and deployment.

It is intentionally designed around **controlled college membership**,
which is why public registration is disabled in the current version.

------------------------------------------------------------------------

# ⭐ Explore the Project

### 🌐 Live Demo

**[🚀
college-project-management-system.netlify.app](https://college-project-management-system.netlify.app/)**

### 💻 Source Code

**GitHub:** `<ADD-YOUR-GITHUB-REPOSITORY-URL>`

### 👨‍💻 Developer

**Sanjaya Giri**

------------------------------------------------------------------------

<p align="center">
  <strong>Built with React • Node.js • Express • MongoDB • Redux Toolkit</strong>
</p>

<p align="center">
  🚀 From project proposal to project completion — everything in one place.
</p>
