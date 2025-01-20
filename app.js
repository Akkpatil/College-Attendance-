const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');

const app = express();
const db = new sqlite3.Database('./database/attendance.db');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(
  session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: false,
  })
);

// Routes
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Login
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM professors WHERE username = ?', [username], (err, professor) => {
    if (err) throw err;
    if (!professor || !bcrypt.compareSync(password, professor.password)) {
      return res.send('Invalid credentials!');
    }
    req.session.professor = professor;
    res.redirect('/dashboard');
  });
});


// Register
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  db.run('INSERT INTO professors (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
    if (err) {
      return res.send('Error registering user.');
    }
    res.redirect('/login');
  });
});

// Dashboard
app.get('/dashboard', (req, res) => {
  if (!req.session.professor) return res.redirect('/login');
  res.render('dashboard');
});

// View Students by Division
app.get('/attendance/:division', (req, res) => {
  const division = req.params.division;
  db.all('SELECT * FROM students WHERE division = ?', [division], (err, students) => {
    if (err) throw err;
    res.render('attendance', { students, division });
  });
});

// Add Student
app.post('/students/add', (req, res) => {
  const { name, division } = req.body;
  db.run('INSERT INTO students (name, division) VALUES (?, ?)', [name, division], (err) => {
    if (err) throw err;
    res.redirect(`/attendance/${division}`);
  });
});

// Remove Student
app.post('/students/remove', (req, res) => {
  const { id, division } = req.body;
  db.run('DELETE FROM students WHERE id = ?', [id], (err) => {
    if (err) throw err;
    res.redirect(`/attendance/${division}`);
  });
});

// Mark Attendance
app.post('/attendance/mark', (req, res) => {
  const { student_id, date, status, division } = req.body;
  db.run('INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)', [student_id, date, status], (err) => {
    if (err) throw err;
    res.redirect(`/attendance/${division}`);
  });
});

// Monthly Report
app.get('/report/:division', (req, res) => {
  const division = req.params.division;
  const reportQuery = `
    SELECT s.name, 
           SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS present_days,
           SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) AS absent_days
    FROM students s
    LEFT JOIN attendance a ON s.id = a.student_id
    WHERE s.division = ?
    GROUP BY s.id
  `;
  db.all(reportQuery, [division], (err, report) => {
    if (err) throw err;
    res.render('report', { report, division });
  });
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


app.get('/report', (req, res) => {
  const sql = `
      SELECT students.name, 
             strftime('%m', attendance.date) AS month,
             SUM(CASE WHEN attendance.status = 'present' THEN 1 ELSE 0 END) AS present,
             SUM(CASE WHEN attendance.status = 'absent' THEN 1 ELSE 0 END) AS absent
      FROM attendance
      INNER JOIN students ON attendance.student_id = students.id
      GROUP BY students.name, month
  `;

  db.all(sql, [], (err, rows) => {
      if (err) {
          console.error("Database error:", err.message);
          return res.status(500).send("Error generating report");
      }

      // Log the fetched rows to verify the data
      console.log("Report Data Fetched:", rows);

      // Pass rows as `reportData` to the EJS view
      res.render('report', { reportData: rows || [] });
  });
});


app.get('/report', (req, res) => {
  const dummyData = [
      { name: "John Doe", month: "01", present: 20, absent: 2 },
      { name: "Jane Smith", month: "02", present: 18, absent: 4 }
  ];
  res.render('report', { reportData: dummyData });
});

