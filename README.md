# 💬 Convo-ChatWebsite

A modern **real-time one-to-one chat web application** built using the
**MERN stack** and **Socket.IO**,\
featuring instant messaging, user authentication, profile management,
and online status tracking.

------------------------------------------------------------------------

## 🚀 Features

### 🔐 Authentication & Security

-   User Signup & Login
-   JWT-based authentication (stored in HTTP-only cookies)
-   Protected routes

### 💬 Real-Time Chat

-   One-to-One private messaging
-   Instant message delivery using **Socket.IO**
-   No page refresh required
-   Message persistence with MongoDB

### 🟢 Online Status

-   Real-time online/offline users
-   Multiple device/tab support per user

### 👤 User Profile

-   Edit profile details (name, username, email, gender)
-   Update profile picture with live preview
-   Secure profile update

### 🎨 UI/UX

-   Modern responsive UI (Tailwind CSS)
-   Auto-scroll on new messages
-   Message timestamps
-   Sound notification for new messages

------------------------------------------------------------------------

## 🛠️ Tech Stack

### Frontend

-   React.js
-   Zustand (State Management)
-   Axios
-   Socket.IO Client
-   Tailwind CSS

### Backend

-   Node.js
-   Express.js
-   MongoDB + Mongoose
-   Socket.IO
-   JWT Authentication
-   Multer (Image Upload)

------------------------------------------------------------------------

## 📂 Project Structure

    chat-app/
    │
    ├── client/                 # React frontend
    │   ├── src/
    │   │   ├── components/
    │   │   ├── context/
    │   │   ├── zustand/
    │   │   ├── pages/
    │   │   └── assets/
    │
    ├── server/                 # Node.js backend
    │   ├── Controllers/
    │   ├── Routes/
    │   ├── Module/
    │   ├── Soket/
    │   └── Db/
    │
    └── README.md

------------------------------------------------------------------------

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

``` bash
git clone https://github.com/HarshitKumar609/Convo-ChatWebsite
cd chat-app
```

### 2️⃣ Backend Setup

``` bash
cd server
npm install
```

Create a `.env` file:

``` env
MONGODB_URI= ""
DB_NAME=""
JWT_SCREATS=""
PORT=3000
JWT_SECRET=
NODE_ENV=

CLOUD_NAME = 
CLOUD_API_KEY = 
CLOUD_API_SECRET = 

```

Run backend:

``` bash
npm start
```

------------------------------------------------------------------------

### 3️⃣ Frontend Setup

``` bash
cd client
npm install
npm run dev
```

------------------------------------------------------------------------

## 🔌 Socket.IO Flow (1-1 Chat)

-   Each user connects with their `userId`
-   Backend maps `userId → socketId(s)`
-   Messages are emitted **only to the receiver**
-   Frontend filters messages based on active chat

✔️ No chat rooms\
✔️ Pure 1-1 messaging

------------------------------------------------------------------------

## 🧪 Testing Real-Time Chat

1.  Open the app in **two browsers**
2.  Login with **two different users**
3.  Send messages
4.  Messages appear instantly without refresh

------------------------------------------------------------------------

## 🔮 Future Enhancements

-   Typing indicator
-   Message seen / delivered status
-   Unread message count
-   Group chat support
-   Media & file sharing
-   Push notifications

------------------------------------------------------------------------

## 🤝 Contributing

Contributions are welcome!\
Feel free to fork the repository and submit a pull request.

------------------------------------------------------------------------

## 🙌 Acknowledgements

-   Socket.IO
-   MongoDB
-   React
-   Tailwind CSS

------------------------------------------------------------------------

⭐ If you like this project, give it a star!
