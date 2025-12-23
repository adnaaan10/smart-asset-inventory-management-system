# 🚀 **Smart Asset & Inventory Management System**

A full-stack web application that helps organizations efficiently manage company assets, inventory, assignments, and repair tickets with role-based access control.
Built using Django REST Framework, React, and Docker, following real-world development practices.

## 📌 **Project Overview**

- The Smart Asset & Inventory Management System allows companies to:

- Track office assets (laptops, monitors, devices, etc.)

-  Manage consumable inventory with low-stock alerts

- Assign assets to employees

- Raise and resolve repair tickets

- Provide separate dashboards for Admin, Employee, and Technician

- This project was developed module-wise, tested using Postman, and containerized with Docker, making it production-ready.

## 🧑‍💼 **User Roles & Responsibilities**

### 🔑 **Admin**

- Manage assets and inventory

- Assign assets to employees

- Assign repair tickets to technicians

- View organization-level analytics and dashboards

- Manage users

### 👨‍💻 **Employee**

- View assigned assets

- Report issues / raise repair tickets

- Track ticket status

- View personal dashboard activity

### 🛠️ **Technician**

- View assigned repair tickets

- Update ticket status (In Progress / Resolved)

- Track recent activity

## ✨ **Key Features**

### ✅ **Core Features**

- JWT-based authentication (login & refresh tokens)

- Role-based access control (RBAC)

- CRUD operations for assets, inventory, assignments, and tickets

- Secure REST APIs with permission handling

- Dashboard analytics for all roles

## 📊 **Dashboards**

### **Admin Dashboard**

- Asset status overview (Available, Assigned, Under Repair, Retired)

- Ticket statistics

- Inventory alerts

### **Employee Dashboard**

- Assigned assets

- Active & resolved tickets

- Recent activity

### **Technician Dashboard**

- Assigned tickets

- Ticket status tracking

- Recent activity timeline


## 🛠️ **Tech Stack**

### **Backend**

- Python

- Django

- Django REST Framework

- JWT Authentication (SimpleJWT)

- PostgreSQL / SQLite

- Gunicorn

### **Frontend**

- React.js

- Material UI (MUI)

- Axios

- Role-based protected routes

### **DevOps & Tools**

- Docker & Docker Compose

- Nginx (for frontend)

- Postman (API testing)

- Git & GitHub