# Employee Shift Board

> A full-stack application to manage employee shifts without the headache. Built with love (and lots of coffee ☕).

**Assignment:** C - Employee Shift Board  
**Status:**  Done!  
**Submitted:** 06 December 2025

---

## What is This?

Basically, it's an app where:
- **Admins** can create and manage employee shifts
- **Employees** can see their own shifts
- **The system** prevents chaos like overlapping shifts or people working less than 4 hours

Think of it as a digital shift scheduler that actually prevents your manager from accidentally scheduling someone for 2 overlapping shifts 😅

---

##  What Actually Works?

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

##  What's Under the Hood?

**Backend:** Node.js + Express (basically JavaScript running on the server)  
**Database:** MongoDB Atlas (cloud-based, no local setup needed)  
**Frontend:** React (the thing you see and click on)  
**Authentication:** JWT tokens (like a digital ID card for each user)

---

##  How to Run It (Super Easy)

### Before You Start
- Make sure you have Node.js v14+ installed
- Have MongoDB Atlas account ready (the connection string)

### Step 1: Backend Setup

