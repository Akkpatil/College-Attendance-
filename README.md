
```markdown
# Student Attendance Management System

A web-based application for managing student attendance, built with **Node.js**, **SQLite**, and **Bootstrap**. This system allows professors to register, log in, manage student attendance, and generate monthly attendance reports.

---

## Features

- **Professor Authentication**: Professors can register and log in securely.
- **Dashboard**: Overview of students and attendance management.
- **Student Management**: Add or remove students from divisions.
- **Attendance Marking**: Mark attendance for students in specific divisions.
- **Reports**: Generate and view monthly attendance reports.

---

## Technology Stack

### Backend
- **Node.js**: JavaScript runtime for server-side logic.
- **SQLite**: Lightweight relational database for data storage.

### Frontend
- **Bootstrap**: For responsive and user-friendly design.
- **EJS**: Templating engine for rendering dynamic HTML pages.

### Additional Packages
- **express**: Web framework for handling routes and middleware.
- **sqlite3**: Library for interacting with SQLite databases.
- **bcryptjs**: Secure password hashing.
- **body-parser**: Middleware for parsing HTTP request bodies.
- **express-session**: Session handling for user authentication.

---

## Folder Structure

```
student-attendance/
├── views/
│   ├── login.ejs         # Login page
│   ├── register.ejs      # Registration page
│   ├── dashboard.ejs     # Dashboard for attendance management
│   ├── attendance.ejs    # Attendance marking page
│   ├── report.ejs        # Attendance report page
├── app.js                # Main application logic
└── database/
    └── attendance.db     # SQLite database file
```

---

## Database Schema

### Professors Table
```sql
CREATE TABLE IF NOT EXISTS professors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);
```

### Students Table
```sql
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    division TEXT NOT NULL
);
```

### Attendance Table
```sql
CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY(student_id) REFERENCES students(id)
);
```

---

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/student-attendance.git
   ```
2. Navigate to the project directory:
   ```bash
   cd student-attendance
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the application:
   ```bash
   node app.js
   ```
5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## Usage

### Login/Registration
- Professors can register and log in to access the system.

### Dashboard
- View an overview of students and manage attendance.

### Student Management
- Add or remove students from Division A or B.

### Attendance
- Mark daily attendance for students.

### Reports
- Generate and view monthly attendance reports.

---


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Node.js for backend development.
- SQLite for a lightweight database solution.
- Bootstrap for frontend styling.
```
