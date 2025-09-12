# Product Requirements Document (PRD)  
## Doctor/Patient Management Dashboard  

---

## Project Overview  
A simple, intuitive dashboard to help doctors efficiently manage patients, appointments, consultations, and daily tasks with minimum learning curve. The tool supports secure login, doctor management, and provides analytics dashboards to aid decision making.

**Technology Stack**:  
- Frontend Framework: Next.js 15  
- CSS Framework: Tailwind CSS version 4  

---

## Objectives  
- Streamline patient appointment scheduling and registration  
- Simplify consultation note-taking and prescription management  
- Provide easy patient search and filtering  
- Manage daily doctor tasks effectively  
- Enable role-based doctor management and secure logins  
- Present key analytics on patients and revenue  

---

## Success Metrics  
- Reduced time to schedule and manage appointments  
- Increased accuracy and completeness of patient records  
- Improved doctor task tracking and completion rates  
- User adoption with minimal training required  
- Secure access and user management without breaches  

---

## Features & Workflows

### 1. Appointment Scheduling  
- Easy calendar interface for booking, rescheduling, and cancelling appointments  
- Reminder notifications via SMS/email to patients  
- Input: Patient name, date/time, reason  
- Output: Updated calendar view, alerts

### 2. Patient Registration & Basic Profiles  
- Add Patient workflow:  
  - Text input for patient name triggers duplicate search  
  - If existing matches found, list them for quick selection  
  - If no match or new patient needed, form to capture:  
    - Name, Phone, Gender, DOB, Preferred Language, City, Address, Pin code  
- Redirect to Patient Overview on successful addition  
- Patient Overview allows adding visits and appointments

### 3. Consultation Notes  
- Simple form during appointment creation for symptoms and patient description  
- Prescription entry as chips with autocomplete from medicine database  
- Save consultation notes linked to appointment

### 4. Patient Search & Filter  
- Page 1: Patient list with filters for name, date, gender, age  
- Search bar for quick lookup by name or ID  
- Selecting patient opens Patient Overview page showing visit history with symptoms and prescriptions visible

### 5. Task List  
- Daily to-do list for doctors to add tasks like lab follow-ups, calls  
- View tasks by date range  
- Mark tasks as complete or delete

### 6. Doctor Management  
- List all doctors with roles visible  
- Role with admin privileges can add/delete doctors  
- Form to add doctors with name, contact, role input

### 7. Secure Login  
- Login page for doctor access  
- Admin role generates doctor IDs and passwords  
- Support for password reset and basic security best practices

### 8. Dashboard Analytics  
- Visual charts for:  
  - Patient count over date ranges  
  - Revenue metrics with filtering by dates  
  - Appointment trends and patient visit stats  
- Key performance indicators related to patient management and revenue  

---

## User Roles & Permissions  
- Admin Doctor: Full access including doctor management and ID generation  
- Regular Doctor: Access to patient and appointment management, tasks, analytics as allowed  
- Role-based interface controls to minimize clutter and enhance usability  

---

## Security & Compliance  
- User authentication with password protection  
- Secure data storage for patient information  
- Role-based access control  
- Data privacy compliance as per regulatory standards  

---

## Data Storage  
- For now, use **local storage** on the client side to store all patient, appointment, consultation, task, and doctor data as no backend server is set up yet.  
- Data persistence and retrieval are handled through browser local storage APIs to enable offline use and quick access.  
- Plan for future migration to server/database storage when backend infrastructure is available.  

---

## Timeline & Milestones  
- Phase 1: Core Appointment & Patient Registration (2 weeks)  
- Phase 2: Consultation Notes & Patient Search (2 weeks)  
- Phase 3: Task List & Doctor Management (1 week)  
- Phase 4: Secure Login & Analytics Dashboard (1 week)  

---

## Additional Notes  
- Focus on minimal clicks and clean UI  
- Responsive design for desktop/tablet  
- Keep workflows linear to reduce errors  

---

## Open Issues  
- Finalize medicine database integration for autocomplete  
- Define notification frequency and method preferences  

---

## Glossary  
- Patient Overview: Page summarizing patient info and visit history  
- Chips Input: Tag-style input for quick selection or addition items  
- KPI: Key Performance Indicator  

---
