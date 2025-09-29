# 🚀 QuickChat - Real-Time MERN Stack Chat Application

QuickChat is a modern, full-featured, and real-time chat application built with the **MERN stack (MongoDB, Express, React, Node.js)** and **Socket.IO**.  
It provides a seamless and interactive user experience for instant messaging, complete with user authentication, online presence indicators, and image sharing capabilities.

---

## ✨ Live Demo
👉 [https://quick-chat-an-chat-app.vercel.app/](#)  
*(Replace with your final deployed frontend URL)*

---

## 📸 Screenshots


## 📸 Screenshots

<table>
<tr>
<td align="center"><strong>Login Page</strong></td>
<td align="center"><strong>Sign Up Page</strong></td>
</tr>
<tr>
<td><img src="https://github.com/Tonmoy-nita/QuickChat-An_Chat_App/blob/main/doc/images/Login_Page.jpg" alt="Login Page Screenshot" width="400"/></td>
<td><img src="https://github.com/Tonmoy-nita/QuickChat-An_Chat_App/blob/main/doc/images/Sign_up_Page.jpg" alt="Sign Up Page Screenshot" width="400"/></td>
</tr>
</table>

<table>
<tr>
<td align="center"><strong>Main Chat Interface</strong></td>
</tr>
<tr>
<td><img src="https://github.com/Tonmoy-nita/QuickChat-An_Chat_App/blob/main/doc/images/User_Interface.jpg" alt="Chat Interface Screenshot" width="600"/></td>
</tr>
</table>


---

## 🚀 Features
- 🔐 **User Authentication** – Secure registration & login system using JWT  
- ⚡ **Real-Time Messaging** – Instant message delivery with Socket.IO  
- 🟢 **Online Presence** – See which users are currently online  
- 💬 **Text & Image Sharing** – Upload images (Cloudinary integration)  
- 👤 **User Profiles** – View & edit name, bio, and profile picture  
- 🔍 **User Search** – Quickly find users in the sidebar  
- 🔔 **Unread Message Indicators** – Track unread chats easily  
- 📱 **Responsive Design** – Works on desktop & mobile (Tailwind CSS)

---

## 🛠️ Tech Stack

| Category   | Technology |
|------------|-------------|
| **Frontend** | React.js, Vite, Tailwind CSS, Socket.IO Client, Axios, React Router |
| **Backend**  | Node.js, Express.js, Socket.IO, MongoDB, Mongoose, JWT, Bcryptjs, Cloudinary |
| **Deployment** | Vercel (Frontend), Render/Heroku (Backend) |

---

## ⚙️ Getting Started

Follow these simple steps to run the project locally:

### ✅ Prerequisites
- Node.js (v18 or higher recommended)  
- npm (or Yarn)  
- MongoDB Atlas account  
- Cloudinary account  

---

### Project Structure
The project is organized into two main directories: client for the frontend React application and server for the backend Node.js API.

quick-chat/
├── client/
│ ├── public/
│ ├── src/
│ │ ├── assets/ # Static assets like images and icons
│ │ ├── components/ # Reusable React components (Sidebar, ChatContainer, etc.)
│ │ ├── context/ # React Context for state management (AuthContext, ChatContext)
│ │ ├── lib/ # Utility functions (e.g., date formatting)
│ │ ├── pages/ # Page components (HomePage, LoginPage, ProfilePage)
│ │ ├── App.jsx # Main application component with routing
│ │ ├── index.css # Global styles
│ │ └── main.jsx # Application entry point
│ ├── .env # Frontend environment variables
│ └── package.json
│
└── server/
├── controllers/ # Logic for handling requests (userController, messageController)
├── lib/ # Library/helper files (db.js, cloudinary.js, utils.js)
├── middleware/ # Express middleware (e.g., protectRoute for auth)
├── models/ # Mongoose schemas (User.js, Message.js)
├── routes/ # API route definitions (userRoutes, messageRoutes)
├── .env # Backend environment variables
├── package.json
└── server.js # Main server entry point (Express and Socket.IO setup)

---

## 🔗 API Endpoints

The backend server exposes the following REST API endpoints under the `/api` prefix.

### Authentication (`/api/auth`)
- **POST /signup** → Register a new user  
- **POST /login** → Log in an existing user  
- **PUT /update-profile** → Update the logged-in user's profile (Protected)  
- **GET /check** → Verify the current user's token and return user data (Protected)  

### Messaging (`/api/messages`)
- **GET /users** → Get all users for the sidebar, excluding the current user (Protected)  
- **GET /:id** → Get all messages between the logged-in user and another user (Protected)  
- **POST /send/:id** → Send a message to another user (Protected)  
- **PUT /mark/:id** → Mark a specific message as seen (Protected)  

---

## 📦 Dependencies & Installation

To run the project, you first need to install the dependencies for both the client and the server.

### 🔧 Server-Side (`/server`) Dependencies
Run `npm install` in the `/server` directory to install:

| Package       | Description |
|---------------|-------------|
| express       | Web framework for Node.js |
| mongoose      | ODM library for MongoDB |
| socket.io     | Real-time, bidirectional communication |
| jsonwebtoken  | Generate and verify JWTs |
| bcryptjs      | Password hashing |
| cloudinary    | Upload & manage images in the cloud |
| cors          | Enable Cross-Origin Resource Sharing |
| dotenv        | Load environment variables |
| nodemon       | Auto-restart server in development |

---

### 🎨 Client-Side (`/client`) Dependencies
Run `npm install` in the `/client` directory to install:

| Package            | Description |
|--------------------|-------------|
| react              | UI library |
| react-dom          | DOM entry point for React |
| react-router-dom   | Client-side routing |
| socket.io-client   | Socket.IO client |
| axios              | HTTP requests to backend |
| react-hot-toast    | Notifications & alerts |
| tailwindcss        | Utility-first CSS framework |
| vite               | Fast frontend build tool |

---

## ⚙️ Getting Started

### ✅ Prerequisites
- Node.js (v18+)  
- npm (or Yarn)  
- MongoDB Atlas Account  
- Cloudinary Account  

---

### 🔧 Installation & Setup


```bash
1️⃣ **Clone the repository**
git clone https://github.com/Tonmoy-nita/QuickChat-An_Chat_App.git
cd quick-chat
2️⃣ Setup Backend (server)

bash
Copy code
cd server
npm install
Create a .env file in /server and add variables (see below).

Start backend:

bash
Copy code
npm run server
3️⃣ Setup Frontend (client)

bash
Copy code
cd ../client
npm install
Create a .env file in /client and add variables (see below).

Start frontend:

bash
Copy code
npm run dev
👉 App will run locally:

Frontend → http://localhost:5173

Backend → http://localhost:5000

🔑 Environment Variables
server/.env
env
Copy code
PORT=5000
MONGODB_URI="your_mongodb_connection_string"
JWT_SECRET="your_jwt_secret_key"
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
client/.env
env
Copy code
VITE_BACKEND_URL="http://localhost:5000"


📄 License

This project is licensed under the MIT License.
👤 Contact
```
### Tonmoy

GitHub: @Tonmoy-nita

LinkedIn: Tonmoy Bhowmick

Project Link: https://github.com/Tonmoy-nita/QuickChat-An_Chat_App
