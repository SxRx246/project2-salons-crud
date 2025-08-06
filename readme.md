![SalonEase - Book Your Appointment with Ease](https://ibb.co/wh0yLNm0)

# SalonEase

## Description

SalonEase is a full-stack web application that facilitates appointment booking for salons. It features two types of users: normal users who can book appointments and admin users who can manage salons. Both user types have full CRUD (Create, Read, Update, Delete) capabilities, enabling them to manage appointments and salon details effectively.


## Getting started

+ Link to [Live Demo](https://salonswebsite.onrender.com)
+ Link to [GitHub Repository](https://github.com/SxRx246/project2-salons-crud)


## Attributions

#### Design

+ UI Template: [HairSalon - ThemeWagon](https://themewagon.com/themes/free-bootstrap-4-html5-hair-salon-website-template-hairsal/)


+ Icons: [CSS Icons Reference](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css)



## Technologies Used

**Node.js & Express.js** Handle server-side logic, routes, and API endpoints.

**MongoDB & Mongoose** Manage application data and define schemas for Users, Salons, Services, Staff, and Appointments.

**JavaScript** Adds interactivity to forms and routes.

**CSS & Bootstrap** Style the frontend and layout.

**bcrypt & express-session** Used for password hashing and session-based login system.


## Next steps

### Access Control
- Only salon creators can edit/delete their salons.
- Users can only view/edit/delete their own appointments.
- Improve role-based permissions for admin vs regular users.

### Appointment Enhancements
- Prevent booking appointments in the past.
- Add appointment statuses (pending, confirmed, canceled).

### Media & Content
- Allow image uploads for salons, services, and staff.

### Analytics
- Show salon owners metrics: bookings, top services/staff, etc.

### Location Features
- Display salons on Google Maps.
- Filter/search salons by location or service type.



## Project Structure (Summary)

- **Models:** `User`, `Salon`, `Service`, `Staff`, `Appointment`
- **Routes:** Auth, Salons, Appointments
- **Views:** Built with EJS and Bootstrap components
- **Middleware:** Role-based session handling and form validation
