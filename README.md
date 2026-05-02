# Campus Notifications Portal

This repository contains a full-stack implementation of a Campus Notifications Microservice, developed as part of a technical evaluation.

## Project Structure

- `logging_middleware/`: A reusable TypeScript package for centralized logging across backend and frontend stacks.
- `notification_app_be/`: Backend implementation containing the Priority Inbox logic (Stage 1).
- `notification_app_fe/`: A responsive Next.js application built with Material UI (Stage 2).
- `Notification_System_Design.md`: Detailed design documentation for the Priority Inbox algorithm and scalability strategies.

## Setup and Installation

### 1. Prerequisites
- Node.js (Latest LTS)
- npm

### 2. Logging Middleware
The middleware must be built first as it is a dependency for other modules:
```bash
cd logging_middleware
npm install
npm run build
```

### 3. Backend (Stage 1)
To run the Priority Inbox sorting logic:
```bash
cd notification_app_be
npm install
node stage1.js
```

### 4. Frontend (Stage 2)
To run the web application on `http://localhost:3000`:
```bash
cd notification_app_fe
npm install
npm run dev
```

## Features
- **Priority Inbox**: Automated sorting based on notification type weights (Placement > Result > Event) and recency.
- **Responsive UI**: Fully optimized for both Desktop and Mobile views.
- **Centralized Logging**: Every significant event and API call is logged through the custom middleware.
- **Read/Unread Tracking**: Persistent state management for notification viewing history.
