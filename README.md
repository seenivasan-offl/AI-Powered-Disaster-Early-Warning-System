# AI-Powered Disaster Early Warning System

This project is a full-stack AI-powered platform for disaster monitoring, incident reporting, and early warning. It integrates user reporting, real-time alerts, AI-based predictions, and multi-channel notifications to help communities and authorities respond effectively to natural disasters.

---

## Table of Contents

- [Project Overview](#project-overview)  
- [Backend (Spring Boot)](#backend-spring-boot)  
- [Frontend (React)](#frontend-react)  
- [AI Service (Python)](#ai-service-python)  
- [Setup & Running](#setup--running)  
- [Features](#features)  
- [Security](#security)  
- [Contributing](#contributing)  
- [License](#license)

---

## Project Overview

- Users can **sign up/login**, view disaster dashboards, and report incidents with precise geolocation.  
- Administrators review and approve incidents, manage alerts, and monitor system health.  
- AI microservices analyze sensor, weather, and social data for disaster prediction and risk scoring.  
- Notifications are sent via SMS, email, and WhatsApp to keep users informed in real time.

---

## Backend (Spring Boot)

- REST APIs secured with JWT authentication (roles: USER, ADMIN).  
- Incident reporting, alert management, and user management.  
- Integration with AI prediction microservices and weather data.  
- Uses PostgreSQL (or compatible RDBMS) with JPA for persistence.  
- Supports real-time WebSocket updates and asynchronous notifications.

---

## Frontend (React)

- Responsive React UI with routing and protected routes.  
- Incident reporting forms with interactive map location picker (React Leaflet).  
- Real-time alerts dashboard with map visualization and color-coded severity.  
- Admin panel for managing pending incidents and alerts.  
- Weather search and AI demo pages.

---

## AI Service (Python)

- Flask-based REST API for AI-powered disaster prediction models.  
- Processes sensor time series data, satellite images, and social media text.  
- Includes scripts for preprocessing data and training models (e.g., LSTM).  
- Modular design allowing integration of multiple AI models.

---

## Setup & Running

### Backend

1. Install Java 17+ and Maven.  
2. Configure `application.properties` with database and secret keys (use environment variables for sensitive info).  
3. Run:
mvn clean package
mvn spring-boot:run

text

## Managing Sensitive Configuration

> **Important:** The Twilio credentials (`twilio.sid` and `twilio.token`) have been removed from the `application.properties` file for security reasons. 

### How to provide credentials now

Set these as environment variables on your system before running the application:

- **For Windows (PowerShell):**


### Frontend

1. Install Node.js (16+).  
2. Navigate to frontend folder.  
3. Install dependencies:
npm install

text
4. Run development server:
npm start

text

### AI Service

1. Create and activate Python virtual environment:
python -m venv venv
source venv/bin/activate # or venv\Scripts\activate on Windows

text
2. Install dependencies:
pip install -r requirements.txt

text
3. Train models (optional):
python train_lstm.py

text
4. Run API server:
python app.py

text

---

## Features

- User authentication and authorization with JWT.  
- Interactive maps for incident and alert location selection.  
- Real-time alert notifications with Twilio, email, and WhatsApp integration.  
- AI-driven disaster prediction with extensible models.  
- Historical disaster data visualization and analysis.  
- Admin reviews and bulk processing of incidents.  
- Weather data integration for enhanced situational awareness.

---

## Security

- Never commit secrets or API keys; use environment variables.  
- JWT tokens secure API endpoints with role-based access control.  
- GitHub push protection enabled to prevent accidental secret exposure.

---

## Contributing

Contributions are welcome! Please open issues or pull requests for bugs, features, or improvements.

---

## License

This project is licensed under the MIT License.

---

*For detailed documentation, deployment guides, or API references, please contact
