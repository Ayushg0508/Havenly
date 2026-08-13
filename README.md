# 🏡 Havenly

**Havenly** is a full-stack accommodation and travel booking web application inspired by platforms like Airbnb. It allows users to explore available properties, view detailed property information, create listings, and manage their booking experience through a modern and responsive web interface.

The project was developed to gain hands-on experience with **full-stack web development, REST APIs, authentication, database management, and frontend-backend integration**.

## 🚀 Features

* 🔐 User registration and authentication
* 🏠 Browse and explore accommodation listings
* 🔎 Search and discover properties
* 📍 View property details and location information
* ➕ Create and manage property listings
* 📅 Booking functionality
* 👤 User profile management
* ⭐ Review and rating functionality
* 📱 Responsive user interface
* 🔄 REST API based frontend-backend communication
* 💾 Persistent data storage using MongoDB

## 🛠️ Tech Stack

### Frontend

* HTML
* CSS
* JavaScript
* React.js

### Backend

* Node.js
* Express.js
* REST APIs

### Database

* MongoDB

### Tools & Platforms

* Git
* GitHub
* VS Code

## 🏗️ Project Architecture

The application follows a full-stack architecture:

```text
User
  │
  ▼
React.js Frontend
  │
  │ HTTP Requests / REST APIs
  ▼
Node.js + Express.js Backend
  │
  ▼
MongoDB Database
```

## 📂 Project Structure

```text
Havenly/
│
├── client/                 # Frontend application
│   ├── src/
│   ├── public/
│   └── ...
│
├── server/                 # Backend application
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── ...
│
├── README.md
└── package.json
```

> The exact folder structure may vary depending on the current version of the project.

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Havenly
```

### 2. Install dependencies

Install the dependencies for the frontend and backend according to the project structure.

```bash
npm install
```

If frontend and backend are maintained separately:

```bash
cd client
npm install

cd ../server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the backend directory and add the required configuration.

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

Add any other environment variables required by the current implementation.

### 4. Start the application

```bash
npm start
```

For development:

```bash
npm run dev
```

## 🎯 My Role & Contributions

I worked on the project as a **Full-Stack Developer**, contributing to:

* Developing the frontend user interface
* Building backend APIs using Node.js and Express.js
* Designing and integrating MongoDB database models
* Implementing user authentication and application workflows
* Developing property listing and booking functionality
* Connecting frontend components with backend REST APIs
* Managing application data and database operations
* Testing and debugging different application features


## 🔮 Future Improvements

* Online payment gateway integration
* Advanced property filtering and sorting
* Real-time booking availability
* Improved recommendation system
* Host analytics dashboard
* Email notifications
* Enhanced security and authorization
* Cloud deployment and scalable infrastructure

## 📚 What I Learned

Through this project, I gained practical experience in:

* Full-stack web application development
* MERN stack development
* REST API design and integration
* MongoDB database management
* Authentication and authorization
* Frontend-backend communication
* Git and GitHub workflow
* Debugging and deployment-oriented development

## 👨‍💻 Author

**Ayush Gautam**

B.Tech Computer Science & Engineering
