# 🎬 Movie App

This project contains two parts:
1. **Backend** (Spring Boot) → inside `/backend`
2. **Frontend** (Angular) → inside `/movie-dashboard`

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/movie-app.git
cd movie-app
2️⃣ Run the Backend (Spring Boot)
Prerequisites:
JDK 17+

Maven

PostgreSQL (or your DB)

Steps:
bash
نسخ الكود
cd backend/movieapp
mvn clean install
mvn spring-boot:run
Backend will start on:
👉 http://localhost:8080

3️⃣ Run the Frontend (Angular)
Prerequisites:
Node.js (v18+ recommended)

Angular CLI installed globally

Steps:
bash
نسخ الكود
cd movie-dashboard
npm install
ng serve -o
Frontend will start on:
👉 http://localhost:4200

4️⃣ API Testing with Postman
You can find the Postman collection inside /postman/movie-app.postman_collection.json.

To import:

Open Postman

Click Import

Select the file movie-app.postman_collection.json

Test APIs directly

📂 Project Structure
bash
نسخ الكود
movie-app/
├── backend/           # Spring Boot backend
│   └── movieapp/
├── movie-dashboard/   # Angular frontend
└── postman/           # Postman collection
