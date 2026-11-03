**AI Job Hunter**

An AI-powered job search application developed using **Java, Spring Boot, and PostgreSQL** to simplify the job discovery process and help candidates find relevant career opportunities.

**Project Overview**

AI Job Hunter is a backend-focused application that aims to make job searching more efficient through backend technologies and AI integration.

The application is designed to manage job-related information, process job data, and support intelligent job-search functionality.

**Tech Stack**

| Category | Technologies |
| Programming Language | Java |
| Backend Framework | Spring Boot |
| Database | PostgreSQL |
| ORM | Spring Data JPA / Hibernate |
| API Development | REST APIs |
| Build Tool | Maven |
| AI Integration |
| Version Control | Git, GitHub |

** Key Features**

AI-Powered Job Search: Helps candidates discover relevant job opportunities.

Intelligent Skill Matching: Analyze candidate skills against job requirements.

Job Match Percentage: Calculates and displays a match percentage based on the alignment between candidate skills and job description requirements.

Job Description Analysis: Analyzes job descriptions to identify required skills and qualifications.

REST API Development: Implements RESTful APIs using Java and Spring Boot.

Database Integration: Uses PostgreSQL, Spring Data JPA and Hibernate for data persistence.

Backend Development: Implements application logic using a structured Spring Boot architecture.

**Backend Architecture**

The application follows a layered backend architecture:

AI-Job-Hunter
│
├── src/main/java
│   └── com.example.jobhunter
│       ├── controller
│       ├── service
│       ├── repository
│       ├── entity
│       ├── dto
│       ├── config
│       └── exception
│
├── src/main/resources
│   └── application.properties
│
├── pom.xml
└── README.md
```
Technologies & Concepts Used

- Object-Oriented Programming (OOP)
- Java Collections and Exception Handling
- Spring Boot and Dependency Injection
- Spring Data JPA and Hibernate
- RESTful Web Services
- PostgreSQL Database Operations
- AI API Integration
- Maven Dependency Management

Prerequisites

- Java 17 or later
- Maven
- PostgreSQL
- IDE (IntelliJ IDEA recommended)

1. Clone the Repository


2. Navigate to the Project

cd AI-Job-Hunter
3. Configure PostgreSQL

Create a PostgreSQL database and configure your database credentials in `application.properties`.

Example:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/job_hunter
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Configure your AI API credentials securely using environment variables if your application requires them.

### 4. Build the Application
mvn clean install

### 5. Run the Application
mvn spring-boot:run

The application will start on:

http://localhost:8080
 Testing

Run the test cases using:
mvn test

Future Enhancements

- Improve AI-based job recommendations.
- Enhance job matching based on candidate skills.
- Add application tracking functionality.
- Improve authentication and security.
- Add automated testing and deployment.
