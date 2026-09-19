# Employee Management System

A full-stack **Employee Management System** built with **Java, Spring Boot, Spring Data JPA, MySQL, HTML, CSS, and JavaScript**.

The application provides a modern HR dashboard for managing employee records, departments, salaries, employee growth, and other HR-related information.

---

## 🚀 Features

- 📊 Modern HR Dashboard
- 👥 View all employees
- ➕ Add new employees
- ✏️ Update employee details
- 🗑️ Delete employees
- 🔍 Search employees by name
- 🏢 Filter employees by department
- 💰 Salary overview
- 📈 Employee growth analytics
- 📊 Department distribution
- 🕒 Recent employee activity
- 📱 Responsive user interface
- 🔗 RESTful APIs
- 🗄️ MySQL database integration
- 🔄 Automatic database table creation using Hibernate

---

## 🛠️ Technologies Used

### Backend
- Java 17
- Spring Boot 3.5.5
- Spring Web
- Spring Data JPA
- Hibernate
- Maven

### Frontend
- HTML5
- CSS3
- JavaScript
- Chart.js

### Database
- MySQL

### Tools
- VS Code
- MySQL Workbench
- Git
- GitHub

---

## 📁 Project Structure

```text
EmployeeManagementSystem/
│
├── .gitignore
├── pom.xml
├── README.md
│
└── src/
    └── main/
        ├── java/
        │   └── com/example/employee/
        │       │
        │       ├── EmployeeManagementApplication.java
        │       │
        │       ├── controller/
        │       │   └── EmployeeController.java
        │       │
        │       ├── entity/
        │       │   └── Employee.java
        │       │
        │       ├── repository/
        │       │   └── EmployeeRepository.java
        │       │
        │       └── service/
        │           └── EmployeeService.java
        │
        └── resources/
            │
            ├── application.properties
            │
            └── static/
                ├── index.html
                ├── style.css
                └── script.js
```

---

# ⚙️ How to Run the Project

## 1. Prerequisites

Before running the project, install:

- Java 17 or later
- Maven
- MySQL Server
- MySQL Workbench
- Git
- VS Code (recommended)

Verify Java:

```bash
java -version
```

Verify Maven:

```bash
mvn -version
```

---

## 2. Clone the Repository

Clone the project from GitHub:

```bash
git clone https://github.com/YOUR_USERNAME/Employee-Management-System.git
```

Move into the project directory:

```bash
cd Employee-Management-System
```

---

## 3. Create the MySQL Database

Open **MySQL Workbench** and execute:

```sql
CREATE DATABASE employee_db;
```

Then select the database:

```sql
USE employee_db;
```

You do not need to manually create the `employees` table.

Hibernate will create/update the table automatically when the application starts.

---

## 4. Configure MySQL Connection

Open:

```text
src/main/resources/application.properties
```

The configuration should look like:

```properties
spring.application.name=employee-management-system

spring.datasource.url=jdbc:mysql://localhost:3306/employee_db
spring.datasource.username=root
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

server.port=8080
```

### 🔐 Database Password

The project uses an environment variable for the MySQL password.

This prevents the actual database password from being stored in GitHub.

### Windows PowerShell

Before starting the application, run:

```powershell
$env:DB_PASSWORD="YOUR_MYSQL_PASSWORD"
```

Replace:

```text
YOUR_MYSQL_PASSWORD
```

with your local MySQL password.

> Never upload your actual MySQL password, API keys, or other credentials to GitHub.

---

## 5. Run the Application

From the project root directory, run:

```bash
mvn spring-boot:run
```

If the application starts successfully, you should see messages similar to:

```text
Tomcat started on port 8080
Started EmployeeManagementApplication
```

---

## 6. Open the Application

Open your browser and visit:

```text
http://localhost:8080
```

The Employee Management System dashboard will be displayed.

---

# 🔗 REST API Endpoints

The backend provides the following REST APIs:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/{id}` | Get employee by ID |
| POST | `/api/employees` | Add a new employee |
| PUT | `/api/employees/{id}` | Update employee |
| DELETE | `/api/employees/{id}` | Delete employee |
| GET | `/api/employees/department/{department}` | Find employees by department |
| GET | `/api/employees/search/{name}` | Search employees by name |

---

# 👤 Employee Information

Each employee record contains:

- Employee ID
- Name
- Email
- Phone
- Department
- Designation
- Salary
- Joining Date

---

# 🗄️ Database

The application uses **MySQL** as its relational database.

Database:

```text
employee_db
```

Main table:

```text
employees
```

Hibernate automatically manages the database table using:

```properties
spring.jpa.hibernate.ddl-auto=update
```

---

# 🔄 Application Architecture

The project follows a layered architecture:

```text
                    User
                     │
                     ▼
              Frontend UI
          HTML / CSS / JavaScript
                     │
                     ▼
                REST API
                     │
                     ▼
             Controller Layer
                     │
                     ▼
               Service Layer
                     │
                     ▼
             Repository Layer
                     │
                     ▼
           Spring Data JPA
                     │
                     ▼
               Hibernate
                     │
                     ▼
              MySQL Database
```

---

# 📊 Dashboard

The dashboard provides:

- Total number of employees
- Number of departments
- Average salary
- System status
- Employee distribution chart
- Salary overview chart
- Employee growth chart
- Recent employee activity
- Employee management table

---

# 🔍 Employee Management

Users can manage employee records directly from the dashboard.

### Add Employee

Users can enter:

```text
Name
Email
Phone
Department
Designation
Salary
Joining Date
```

### Edit Employee

Existing employee information can be modified.

### Delete Employee

Employees can be removed from the database.

### Search

Employees can be searched by name.

### Department Filter

Employees can be filtered based on department.

---

# 🧪 Testing the Application

After starting the application, you can test the APIs using:

- Browser
- Postman
- Frontend dashboard

For example, to retrieve all employees:

```text
GET http://localhost:8080/api/employees
```

---

# 📝 Example Employee JSON

Example request for adding an employee:

```json
{
  "name": "Rahul Kumar",
  "email": "rahul@example.com",
  "phone": "9876543210",
  "department": "Engineering",
  "designation": "Software Engineer",
  "salary": 75000,
  "joiningDate": "2026-09-18"
}
```

---

# 🛡️ Security

Sensitive information should never be committed to GitHub.

The project uses:

```properties
spring.datasource.password=${DB_PASSWORD}
```

instead of storing the database password directly.

The `.gitignore` file excludes environment files and other unnecessary files.

Do not upload:

```text
.env
Passwords
API Keys
Access Tokens
Personal Credentials
```

---

# 📌 Common Commands

### Compile the project

```bash
mvn clean compile
```

### Run the application

```bash
mvn spring-boot:run
```

### Package the application

```bash
mvn clean package
```

### Check Git status

```bash
git status
```

---

# 🐛 Troubleshooting

## MySQL Connection Error

Make sure:

1. MySQL Server is running.
2. MySQL is using port `3306`.
3. Database `employee_db` exists.
4. The `DB_PASSWORD` environment variable is set correctly.

Check the database:

```sql
SHOW DATABASES;
```

---

## Java Not Found

Run:

```bash
java -version
```

If Java is not recognized, install Java 17 and configure the Java environment variables.

---

## Maven Not Found

Run:

```bash
mvn -version
```

If Maven is not recognized, install Maven and add its `bin` directory to the system PATH.

---

## Port 8080 Already in Use

If port `8080` is already being used, change:

```properties
server.port=8080
```

to another port, for example:

```properties
server.port=8081
```

Then open:

```text
http://localhost:8081
```

---

# 💡 Future Improvements

Possible future enhancements include:

- User authentication and authorization
- Admin and HR roles
- Employee profile pictures
- Pagination
- Advanced employee filtering
- Export employees to Excel/PDF
- Email notifications
- Attendance management
- Leave management
- Payroll management
- Deployment using Docker
- Cloud database integration

---

# 👨‍💻 Author

**Eklavya Sahani**

B.Tech – Computer Science (Artificial Intelligence)

---

## ⭐ Project Highlights

This project demonstrates practical experience with:

- Java
- Spring Boot
- REST APIs
- Spring Data JPA
- Hibernate
- MySQL
- CRUD Operations
- MVC / Layered Architecture
- HTML
- CSS
- JavaScript
- Git & GitHub
- Database Integration

---

## 📄 License

This project is created for educational and portfolio purposes.
