# 🚗 Car Rental — Velocify

A full-stack **Car Rental Web Application** built with a **Spring Boot** backend and a **Vanilla HTML/CSS/JS** frontend. The system supports multiple roles — **Users**, **Car Owners**, and **Admins** — with Firebase Authentication and JWT-secured REST APIs.

---

## ✨ Features

- 🔐 **Authentication** — Firebase Auth (email/password) + JWT token validation on the backend
- 🚙 **Car Listings** — Browse, filter, and view detailed car information
- 📅 **Bookings** — Users can book cars and manage reservations
- 🧑‍💼 **Admin Dashboard** — Full control over users, car owners, cars, and bookings
- 👤 **User Profiles** — View and update profile details
- 📦 **Car Owner Panel** — Post and manage car listings
- 💳 **Payment Flow** — Dedicated payment page for booking completion
- 🔔 **Notification System** — Admin-controlled broadcast notifications to users

---

## 🛠️ Tech Stack

| Layer      | Technology                                              |
|------------|---------------------------------------------------------|
| Backend    | Java 17, Spring Boot 4.x, Spring Security, Spring Data JPA |
| Auth       | Firebase Authentication + JWT (JJWT 0.11.5)            |
| Database   | MySQL 8+ with Hibernate ORM                             |
| Mapping    | MapStruct 1.5.5                                         |
| Utilities  | Lombok                                                  |
| Frontend   | HTML5, CSS3, Vanilla JavaScript (ES Modules)            |
| Firebase   | Firebase Auth SDK v12                                   |

---

## 📁 Project Structure

```
demo (1)/
├── backend/                        # Spring Boot application
│   ├── src/
│   │   └── main/
│   │       ├── java/com/example/demo/
│   │       │   ├── controller/         # REST API Controllers
│   │       │   │   ├── AdminController.java
│   │       │   │   ├── AuthController.java
│   │       │   │   ├── BookingController.java
│   │       │   │   ├── CarController.java
│   │       │   │   ├── CarOwnerController.java
│   │       │   │   └── UserController.java
│   │       │   ├── dto/                # Data Transfer Objects (request/response)
│   │       │   ├── entity/             # JPA Entity classes
│   │       │   │   ├── Admin.java
│   │       │   │   ├── Booking.java
│   │       │   │   ├── Car.java
│   │       │   │   ├── CarOwner.java
│   │       │   │   └── User.java
│   │       │   ├── exception/          # Custom exception handling
│   │       │   ├── mapper/             # MapStruct mappers (entity ↔ DTO)
│   │       │   ├── pattern/            # Design patterns / utilities
│   │       │   ├── repository/         # Spring Data JPA repositories
│   │       │   ├── security/           # JWT & Spring Security config
│   │       │   │   ├── AuthEntryPointJwt.java
│   │       │   │   ├── AuthTokenFilter.java
│   │       │   │   ├── JwtUtils.java
│   │       │   │   ├── UserDetailsImpl.java
│   │       │   │   ├── UserDetailsServiceImpl.java
│   │       │   │   └── WebSecurityConfig.java
│   │       │   ├── service/            # Business logic layer
│   │       │   ├── specification/      # JPA Specifications (dynamic filtering)
│   │       │   └── DemoApplication.java
│   │       └── resources/
│   │           ├── application.yml     # App configuration (DB, JWT, Firebase)
│   │           └── db/                 # Flyway migration scripts (if enabled)
│   └── pom.xml                         # Maven dependencies
│
└── frontend/                       # Static HTML/JS frontend
    ├── home.html                   # Main car listing page
    ├── login&register.html         # Authentication page
    ├── carDetails.html             # Car detail view
    ├── carPosting.html             # Car owner — post a car
    ├── adminDashboard.html         # Admin control panel
    ├── profile.html                # User profile page
    ├── payment.html                # Payment / booking confirmation
    └── assets/
        └── js/
            ├── firebase.js         # Firebase app initialization
            ├── auth.js             # Register, login, logout logic
            ├── login&register.js   # Login/register page bindings
            ├── filters.js          # Car search & filter logic
            └── profile.js          # Profile page logic
```

---

## ⚙️ Prerequisites

Make sure you have the following installed before getting started:

| Tool        | Version   | Download Link                              |
|-------------|-----------|--------------------------------------------|
| Java JDK    | 17+       | https://adoptium.net/                      |
| Maven       | 3.8+      | https://maven.apache.org/download.cgi      |
| MySQL       | 8.0+      | https://dev.mysql.com/downloads/           |
| Git         | Any       | https://git-scm.com/                       |
| VS Code / IntelliJ IDEA | Any | *(optional, for development)*  |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd "demo (1)"
```

---

### 2. Set Up the Database

Open your MySQL client (MySQL Workbench, CLI, etc.) and create the database:

```sql
CREATE DATABASE car_rental;
```

> The app is configured with `createDatabaseIfNotExist=true`, so MySQL will auto-create it on first run.

---

### 3. Configure the Backend

Open the file:

```
backend/src/main/resources/application.yml
```

Update the database credentials to match your local MySQL setup:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/car_rental?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: root          # 👈 Change this to your MySQL username
    password: YourPassword  # 👈 Change this to your MySQL password
```

> **⚠️ Important:** Never commit real credentials to version control. Consider using environment variables in production.

---

### 4. Run the Backend

Navigate to the backend folder and start the Spring Boot server:

```bash
cd backend

# On Windows
mvnw.cmd spring-boot:run

# On Mac/Linux
./mvnw spring-boot:run
```

The API will be available at:

```
http://localhost:8080
```

You should see the Spring Boot startup logs in your terminal. The database schema will be auto-created by Hibernate on first run.

---

### 5. Run the Frontend

The frontend is made of plain HTML files — no build step needed!

**Option A — VS Code Live Server (Recommended)**

1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code
2. Open the `frontend/` folder in VS Code
3. Right-click `home.html` → **"Open with Live Server"**
4. The app opens automatically at `http://127.0.0.1:5500`

**Option B — Node.js Simple HTTP Server**

```bash
cd frontend
npm install
npm start
```

> The `package.json` in the frontend folder handles this for you.

---

## 🔑 User Roles

| Role       | Capabilities                                              |
|------------|-----------------------------------------------------------|
| **User**   | Browse cars, make bookings, manage profile                |
| **Car Owner** | Post and manage car listings                           |
| **Admin**  | Full dashboard — manage all users, cars, and bookings     |

---

## 🌐 API Endpoints Overview

| Resource      | Base Path           | Description                    |
|---------------|---------------------|--------------------------------|
| Auth          | `/api/auth`         | Login, register, token refresh |
| Users         | `/api/users`        | User management                |
| Cars          | `/api/cars`         | Car listings and filtering     |
| Car Owners    | `/api/car-owners`   | Car owner management           |
| Bookings      | `/api/bookings`     | Booking creation & management  |
| Admin         | `/api/admin`        | Admin-only operations          |

> All secured endpoints require a valid **JWT token** in the `Authorization: Bearer <token>` header.

---

## 🔒 Firebase Authentication Setup

This project uses **Firebase Authentication** for the frontend sign-in flow. The Firebase project is already configured in `frontend/assets/js/firebase.js`.

If you want to connect your own Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable **Email/Password** authentication
4. Copy your Firebase config and replace the values in `frontend/assets/js/firebase.js`:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

5. Also update the `issuer-uri` in `application.yml`:

```yaml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: https://securetoken.google.com/YOUR_PROJECT_ID
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| `Access denied` for MySQL | Check username/password in `application.yml` |
| Port 8080 already in use | Change `server.port` in `application.yml` or stop the process using the port |
| Firebase auth errors | Verify your Firebase project config in `firebase.js` |
| CORS errors in browser | Ensure backend CORS config allows your frontend origin |
| Frontend can't reach backend | Make sure backend is running on `http://localhost:8080` |

---

## 📝 License

This project is for educational and demonstration purposes.

---

> Made with ❤️ using Spring Boot & Firebase
