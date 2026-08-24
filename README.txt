ONLINE LIBRARY MANAGEMENT SYSTEM - HTML EDITION
================================================

HOW TO OPEN
1. Extract the ZIP file.
2. Open the OLMS-HTML folder.
3. Double-click index.html.
4. The project will open in Google Chrome, Microsoft Edge, or another browser.

No PHP, MySQL, XAMPP, Apache, or internet connection is required.

DEMO LOGIN DETAILS
Admin:
  Username: admin
  Password: admin123

Student:
  Student ID: ST100
  Password: 1234

Other demo student IDs: ST101, ST102, ST103, ST104
Their default password is: 1234

FEATURES
- Admin and student login
- Admin dashboard and profile
- Add, search, and delete books
- Issue and return books
- Student and member records
- Fine payment demonstration
- Reports with Print / Save as PDF
- Student profile and password editing
- Password-reset and support requests
- Responsive mobile and desktop design

HOW DATA IS SAVED
The project uses browser localStorage instead of a database. Changes are saved
in the browser on the same device. Use the "Reset demo data" button on the home
page to restore the original sample records.

IMPORTANT
This is a front-end college demonstration. HTML/JavaScript login cannot provide
real production security because credentials and data stay in the browser.

CONVERSION NOTES
The original PHP helper files (login-check, add-book-save, delete-book,
return-book, logout, database connection, and sidebar include) are not separate
pages in this edition. Their functions are handled safely inside assets/app.js.
The database sample data has also been converted into JavaScript demo data.
