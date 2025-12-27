# 🎓 University Management System – Microservices Architecture

## 📌 Overview

This project is a **University Management System** developed using a **microservices architecture**.  
It focuses on managing **universities and their courses** through independent backend services, coordinated via a **Service Registry** and an **API Gateway**, with a **React frontend** as the user interface.

The goal of this project is to demonstrate modern **enterprise-grade system design**, including service discovery, API gateway routing, database-per-service, and full-stack integration.

---

## 🏗️ Architecture

The system is composed of the following components:

- **React Frontend** – User interface
- **API Gateway** – Single entry point for all requests
- **Service Registry (Eureka)** – Service discovery
- **University Management Service** – Manages universities
- **Course Management Service** – Manages courses
- **MySQL Databases** – One database per service

---

## 🔧 Backend Services

### Service Registry (Eureka Server)
- Handles service discovery
- Allows services to register and locate each other dynamically
- **Port:** 8761

---

### 🏫 University Management Service
- Manages university-related data
- **Port:** 8081
- **Database:** `dbUniversity`
- Provides REST APIs for CRUD operations

---

### 📚 Course Management Service
- Manages course-related data
- **Port:** 8082
- **Database:** `dbCourses`
- Provides REST APIs for CRUD operations

---

## API Gateway

The API Gateway acts as the **single access point** for the frontend.

### Responsibilities:
- Routing requests to the appropriate microservice
- Load balancing using Eureka
- Centralized CORS handling
- Decoupling frontend from backend service locations

- **Port:** 9999  
- **Technology:** Spring Cloud Gateway (Reactive)



