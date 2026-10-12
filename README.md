# EduQR • QR Code-Based Student Information Management System

A digital solution for educational institutions. The system assigns a cryptographically unique QR code to each student, enabling instant verification of authorized student details (roll number, department, CGPA, attendance, emergency contacts) via webcam or mobile camera.

---

## 🚀 Tech Stack

- **Frontend**: React (Vite), Vanilla CSS Glassmorphism Design System, `lucide-react`, `html5-qrcode`, `canvas-confetti`
- **Backend**: Spring Boot 3.2.5 (Java 17 LTS), Spring Data JPA, Spring Security, JJWT 0.12.5, Google ZXing 3.5.3 (QR generation)
- **Database**: MySQL 8.x
- **Deployment**:
  - **Version Control**: GitHub
  - **Backend**: Render (via Dockerfile)
  - **Frontend**: Vercel (via `vercel.json`)
  - **Cloud Database**: Aiven / TiDB / Clever Cloud (Free MySQL)

---

## 🌟 Key Features

1. **Digital Student ID Badge with ZXing QR**:
   - Institutional printable badge with photo avatar, department, batch, blood group, emergency contact, and high-resolution QR code.
   - 1-click Download QR PNG and Print ID Badge.

2. **Multi-Mode QR Scanner**:
   - **Live Camera Scanner**: Instant camera scanning with laser overlay (laptop webcam or mobile back camera).
   - **Image Upload Scanner**: Drag-and-drop or select any photo/screenshot of a QR code.
   - **Direct Code / Roll No Lookup**: Fallback instant verification.

3. **Role-Based Access Control (RBAC)**:
   - **Admin (`ROLE_ADMIN`)**: Register/edit/delete students, regenerate QR codes, export CSV, view institution analytics.
   - **Faculty (`ROLE_FACULTY`)**: Scan QR passes, view student profiles, log campus/library/attendance scans.
   - **Public Verification**: Scan QR link to authenticate student enrollment without logging in.

4. **Analytics & Activity Log**:
   - Total students, active enrollment %, average CGPA, attendance rate.
   - Real-time scan activity feed recording who scanned each student, purpose, and timestamp.

---

## 🛠️ Local Development Setup

### 1. Database Setup (MySQL)
Make sure your local MySQL service is running on port `3306`:
```sql
CREATE DATABASE student_qr_db;
```
Configure your credentials in `backend/src/main/resources/application.properties` (defaults are `root` / `sunny`).

### 2. Run Spring Boot Backend
```bash
cd backend
mvn spring-boot:run
```
The API server will start on: **`http://localhost:8080`**  
*Pre-seeded demo accounts:*
- **Admin**: `admin` / `admin123`
- **Faculty**: `faculty` / `faculty123`

### 3. Run React Frontend
```bash
cd frontend
npm install
npm run dev
```
The client will start on: **`http://localhost:5173`**

---

## ☁️ Cloud Deployment Guide (GitHub + Render + Vercel)

### Step 1: Push Project to GitHub
1. Create a new repository on [GitHub](https://github.com/new) named `qr-student-system`.
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit: EduQR Student Management System"
git branch -M main
git remote add origin https://github.com/<your-username>/qr-student-system.git
git push -u origin main
```

---

### Step 2: Deploy Backend & MySQL on Render

#### Option A: Get a Free Cloud MySQL Database
Since Render's free tier provides PostgreSQL, you can use any free MySQL cloud provider:
1. **Aiven for MySQL** (Free tier at [aiven.io](https://aiven.io)) OR **TiDB Serverless** (Free at [pingcap.com](https://pingcap.com)).
2. Create a free MySQL database and copy your JDBC URL, username, and password.

#### Option B: Deploy Backend Web Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure settings:
   - **Root Directory**: `backend` (or leave blank if pointing to `./backend/Dockerfile`)
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `backend/Dockerfile`
   - **Docker Context**: `backend`
4. Under **Environment Variables**, set:
   - `PORT`: `8080`
   - `SPRING_DATASOURCE_URL`: `jdbc:mysql://<your-cloud-host>:<port>/<dbname>?useSSL=true&serverTimezone=UTC`
   - `SPRING_DATASOURCE_USERNAME`: `<your-db-username>`
   - `SPRING_DATASOURCE_PASSWORD`: `<your-db-password>`
   - `JWT_SECRET`: `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970`
   - `CORS_ALLOWED_ORIGINS`: `https://*.vercel.app,http://localhost:5173`
   - `FRONTEND_URL`: `https://<your-vercel-app>.vercel.app`
5. Click **Create Web Service**. Render will automatically build the multi-stage Docker image and launch the Spring Boot app. Note down the deployed URL (e.g. `https://student-qr-backend.onrender.com`).

---

### Step 3: Deploy Frontend on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/) and click **Add New...** -> **Project**.
2. Import your GitHub repository `qr-student-system`.
3. Configure the build settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
4. Add **Environment Variable**:
   - `VITE_API_BASE_URL`: `https://student-qr-backend.onrender.com` (your Render backend URL)
5. Click **Deploy**. Vercel will build and deploy your React app in ~30 seconds with global CDN and automatic SSL!

---

## 🔒 API Endpoints Overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Authenticate user & get JWT |
| POST | `/api/auth/register` | Public | Register faculty/staff account |
| GET | `/api/auth/me` | Authenticated | Retrieve current user profile |
| GET | `/api/students` | Authenticated | Search & paginate students |
| GET | `/api/students/{id}` | Authenticated | Get full student details |
| POST | `/api/students` | Admin | Register student & generate QR |
| PUT | `/api/students/{id}` | Admin | Update student profile |
| DELETE | `/api/students/{id}` | Admin | Remove student record |
| POST | `/api/students/{id}/regenerate-qr` | Admin | Regenerate QR code |
| GET | `/api/students/export/csv` | Authenticated | Download student data CSV |
| GET | `/api/qr/verify/{uuid}` | Public | Verify student identity & status |
| GET | `/api/qr/student/{id}/image` | Public | Stream QR code PNG image |
| POST | `/api/qr/log-scan` | Authenticated | Log scan activity (attendance/entry) |
| GET | `/api/analytics/dashboard` | Authenticated | Institution KPIs & charts |

---

## 📄 License
This project is open-source and available under the MIT License.
