Weekly Report Generator & Team Dashboard

Full-stack app: Spring Boot + React + PostgreSQL, with JWT auth and an optional AI chat assistant (Google Gemini).

Prerequisites
  -Java 17+
  -Maven
  -Node.js 18+
  -PostgreSQL (installed locally, e.g. via pgAdmin)

===================================================================

1. Database

Using pgAdmin (or psql), create a new database:

sql
CREATE DATABASE weekly_reports;

Tables are created automatically on first backend startup (Hibernate ddl-auto: update) — no need to create tables manually.

===================================================================

2. Backend
   
bash
cd backend

Add the following to src/main/resources/application.properties:

properties
spring.datasource.url=jdbc:postgresql://localhost:5432/weekly_reports
spring.datasource.username=postgres
spring.datasource.password=your_postgres_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

server.port=8080

jwt.secret=${JWT_SECRET}
jwt.expiration-ms=86400000

gemini.api-key=${GEMINI_API_KEY}
gemini.model=gemini-2.5-flash
gemini.api-url=https://generativelanguage.googleapis.com/v1beta/models

===================================================================
Update spring.datasource.username / password to match your local PostgreSQL credentials.

Note: the JWT keys must be exactly jwt.secret and jwt.expiration-ms — no spring. prefix.

Set environment variables and run:

bash
export JWT_SECRET=$(openssl rand -base64 32)
export GEMINI_API_KEY=your-gemini-key-here   # optional — only needed for the AI chat assistant

mvn clean install
mvn spring-boot:run

Backend runs on http://localhost:8080.

===================================================================

3. Frontend
bash
cd frontend
npm install

Create .env:

VITE_API_BASE_URL=http://localhost:8080/api

Run:

bash
npm run dev

Frontend runs on http://localhost:5173.

===================================================================

4. Login

Seeded accounts (password for all: password123):

Role	Email
Manager	manager@company.com
Admin	admin@company.com
Team Member	alice@company.com
Team Member	bob@company.com
Team Member	carol@company.com
Team Member	dave@company.com
