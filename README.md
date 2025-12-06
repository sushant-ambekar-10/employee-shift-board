# Employee Shift Board

> A full-stack application to manage employee shifts without the headache. Built with love (and lots of coffee).

**Assignment:** C - Employee Shift Board  
**Status:** Done!  
**Submitted:** 06 December 2025

---

## What is This?

Basically, it's an app where:
- **Admins** can create and manage employee shifts
- **Employees** can see their own shifts
- **The system** prevents chaos like overlapping shifts or people working less than 4 hours

Think of it as a digital shift scheduler that actually prevents your manager from accidentally scheduling someone for 2 overlapping shifts. You're welcome!

---

## What Actually Works?

### For Admins
- Login and access admin dashboard
- Create shifts for any employee (with validation)
- See all employees and their shifts
- Update shift status (scheduled → completed → cancelled)
- Delete shifts if they mess up

### For Regular Employees
- Login with their account
- See only their own shifts (can't see others)
- View shift timing clearly
- Logout when done

### Smart Validations
- Can't create shifts less than 4 hours (system blocks it)
- Can't overlap shifts on same day (system prevents it)
- Clear error messages so you know what went wrong

---

## What's Under the Hood?

**Backend:** Node.js + Express (basically JavaScript running on the server)  
**Database:** MongoDB Atlas (cloud-based, no local setup needed)  
**Frontend:** React (the thing you see and click on)  
**Authentication:** JWT tokens (like a digital ID card for each user)

---

## How to Run It (Super Easy)

### Before You Start
- Make sure you have Node.js v14+ installed
- Have MongoDB Atlas account ready (the connection string)

### Step 1: Backend Setup

cd backend
npm install

 

Create `.env` file with:
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/shift-board?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here
PORT=5000

 

Run it:
npm run dev

 

You should see:
 - DB Connected
 - Seed data created
 - Server running on http://localhost:5000

 

### Step 2: Frontend Setup

Open a **new terminal**:

cd frontend
npm install
npm start

 

Browser opens automatically at `http://localhost:3000`

---

## Test It Out

### Admin Account
Email: hire-me@anshumat.org
Password: HireMe@2025!

 

Click login → You see admin dashboard with create shift form

### Regular Employee
Email: user@test.com
Password: Test123!

 

Click login → You see only your shifts (no admin features)

---

## How the API Works

Don't need this for basic testing, but here it is:

### Login
POST /api/auth/login
Send: { email: "...", password: "..." }
Get back: { token: "...", user: {...} }

 

### Get All Employees
GET /api/employees
Header: Authorization: Bearer <token>

 

### Create a Shift (Admin only)
POST /api/shifts
Body: {
employeeId: "...",
date: "2025-12-15",
startTime: "09:00",
endTime: "17:00"
}

 

### Get Shifts
GET /api/shifts

Admins see: All shifts
Employees see: Only their shifts

 

### Update Shift Status
PUT /api/shifts/:id/status
Body: { status: "completed" }

 

### Delete Shift
DELETE /api/shifts/:id

 

---

## Testing (The Fun Part)

### Test 1: Create a Valid Shift
1. Login as admin
2. Pick an employee
3. Pick a date
4. Start: 09:00 → End: 17:00
5. Click Create
6. Boom! Shift appears in table

### Test 2: Try Breaking the 4-Hour Rule
1. Start: 09:00 → End: 11:00 (only 2 hours)
2. Click Create
3. Get error: "Shift must be at least 4 hours"

Good! The system knows what it's doing.

### Test 3: Try Overlapping Shifts
1. Create shift: 09:00 - 17:00
2. Try creating another: 14:00 - 18:00 (same day, same employee)
3. Get error: "Shift overlaps with existing shift"

Great! No double-booking here.

### Test 4: Switch to Employee Account
1. Logout
2. Login as employee
3. You only see your shifts
4. No "Create Shift" button (admins only)
5. Perfect separation of concerns

### Test 5: Update Shift Status
1. Click on any shift's status dropdown
2. Change to "Completed"
3. Status updates instantly

---

## How the Code is Organized

shift-board/
│
├── backend/
│ ├── models/ (Database schemas)
│ │ ├── User.js (Login info)
│ │ ├── Employee.js (Employee data)
│ │ └── Shift.js (Shift info)
│ │
│ ├── routes/ (API endpoints)
│ │ ├── auth.js (Login endpoint)
│ │ ├── employees.js (Get employees)
│ │ └── shifts.js (Shift CRUD)
│ │
│ ├── middleware.js (Auth checks)
│ ├── server.js (Main server file)
│ ├── .env (Config file)
│ └── package.json (Dependencies)
│
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ │ ├── Login.jsx (Login page)
│ │ │ └── Dashboard.jsx (Main page)
│ │ │
│ │ ├── components/
│ │ │ ├── ShiftForm.jsx (Create shift form)
│ │ │ └── ShiftTable.jsx (Shift list)
│ │ │
│ │ ├── utils/
│ │ │ └── api.js (API calls)
│ │ │
│ │ ├── App.jsx
│ │ ├── App.css
│ │ └── index.js
│ │
│ └── package.json
│
└── README.md (this file)

 

Simple, right? Each folder has a specific job.

---

## Security Stuff

**Passwords:** Hashed using bcryptjs (not stored as plain  )  
**Login:** JWT tokens (each user gets a unique token)  
**Protected Routes:** Can't access admin features without a valid token  
**Validation:** All inputs checked before saving to database

Basically, we're not doing anything stupid with your data.

---

## Database Structure

### Users Table
{
"email": "hire-me@anshumat.org",
"password": "hashed_password_here",
"role": "admin",
"createdAt": "2025-12-06"
}

 

### Employees Table
{
"name": "John Doe",
"employeeCode": "EMP001",
"department": "Engineering",
"userId": "673f8a2c...",
"createdAt": "2025-12-06"
}

 

### Shifts Table
{
"employeeId": "673f8a2c...",
"date": "2025-12-15",
"startTime": "09:00",
"endTime": "17:00",
"status": "scheduled",
"createdBy": "673f8a2c...",
"createdAt": "2025-12-06"
}

 

---

## How the Validation Actually Works

### The 4-Hour Rule
// Convert time to minutes, subtract, check if >= 240 mins (4 hours)
// If not, error out before saving to database
// Simple math, actually works!

 

### No Overlapping Rule
// Before creating new shift:
// 1. Check if employee has any shifts on that date
// 2. If yes, compare timing
// 3. If times overlap, error out
// 4. If all good, create shift
// Pretty straightforward!

 

### Role-Based Access
// When user logs in, we attach their role to request
// For admin endpoints, we check: "Is this person an admin?"
// If no, return 403 (nope, not allowed)
// If yes, proceed
// Works every time!

 

---

## What Could Go Wrong?

**MongoDB not connecting?**
- Check connection string in `.env`
- Check username/password are correct
- Check MongoDB Atlas cluster is active

**Can't login?**
- Make sure backend is running (npm run dev)
- Check you're using demo credentials
- Refresh the page

**Shift creation failing?**
- Make sure you're logged in as admin
- All fields must be filled
- End time must be at least 4 hours after start time

**Frontend won't load?**
- Make sure React is running (npm start)
- Check no other app is using port 3000
- Clear browser cache and refresh

---

## What I Learned Building This

- How to structure a full-stack app properly
- JWT authentication (actually useful!)
- MongoDB with Mongoose (easier than raw SQL)
- React for building UIs (component thinking)
- Validation and error handling (important!)
- How to separate admin/user concerns
- Git workflow (commit, push, etc.)

Honestly, it was fun!

---

## Optional: Deploy It Live

If you want others to actually use this:

**Backend on Render:**
1. Push to GitHub
2. Connect to Render.com
3. Set environment variables
4. Deploy (takes 5 mins)

**Frontend on Vercel:**
1. Push to GitHub
2. Connect to Vercel
3. Deploy (takes 3 mins)
4. Now it's live on the internet!

---

## The Assignment Requirements Checklist

-  - JWT authentication with two seeded users (admin + normal user)
-  - Login page with email and password
-  - Dashboard showing shifts
-  - Admin can create shifts
-  - Admin can delete shifts
-  - Shift assignment form (admin only)
-  - Validation: No overlapping shifts
-  - Validation: Min 4 hours
-  - Users see only their shifts
-  - Admins see all shifts
-  - Clean code with proper structure
-  - Error handling and messages
-  - Role-based access control
-  - Demo credentials work perfectly

Everything done!

---

## That's Pretty Much It

This app does what it's supposed to do without being overly complicated. No unnecessary features, no bloated code, just a working shift management system.

If you have questions while reviewing, the code is commented and straightforward. No magic tricks here!

---

## Questions?

If something doesn't work or you're confused about something:
- Check the error message (they're usually helpful)
- Verify backend is running on port 5000
- Verify frontend is running on port 3000
- Check .env file has correct MongoDB connection
- Restart both servers

That should fix 99% of issues.

---

**Built with:** Node.js, Express, React, MongoDB, and determination  
**Submitted:** 06 December 2025  
**Status:** Ready for review!

---

Good luck!
