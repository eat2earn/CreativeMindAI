# AI-Powered Image and Chat Application

A full-stack application that provides AI-powered image processing, chatbot functionality, and text-to-speech capabilities with a modern React frontend and Node.js backend.

## Project Overview

This project consists of two main parts:
- **Frontend**: A React application built with Vite
- **Backend**: A Node.js server with Express

### Key Features
- User Authentication & Management
- AI-Powered Chatbot
- Image Processing (including background removal)
- Text-to-Speech Conversion
- Payment Integration (Razorpay)
- Credit System for Premium Features

## Project Structure

```
project/
├── Frontend/                    # React Frontend Application
│   ├── src/
│   │   ├── assets/             # Static assets (images, fonts)
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── context/           # React context providers
│   │   ├── animation/         # Animation related files
│   │   ├── lib/               # Utility functions
│   │   ├── test/              # Test files
│   │   ├── App.jsx            # Main App component
│   │   ├── main.jsx           # Application entry point
│   │   └── index.css          # Global styles
│   │
│   ├── public/                # Static public assets
│   ├── index.html             # Main HTML file
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   └── postcss.config.cjs     # PostCSS configuration
│
└── Backend/                    # Node.js Backend Server
    ├── routes/                # API Routes
    │   ├── textToSpeechRoutes.js
    │   ├── chatbotRoutes.js
    │   ├── imageRoutes.js
    │   └── userRoutes.js
    │
    ├── controllers/           # Business Logic
    │   ├── textToSpeechController.js
    │   ├── chatbotController.js
    │   ├── removeBgController.js
    │   ├── imageController.js
    │   └── userController.js
    │
    ├── models/               # Database Models
    │   ├── chatModel.js
    │   ├── transactionModel.js
    │   └── userModel.js
    │
    ├── middlewares/         # Custom middleware functions
    ├── config/             # Configuration files
    ├── uploads/            # File upload directory
    ├── Server.js           # Main server file
    └── package.json        # Backend dependencies

```

## Setup Instructions

### Backend Setup
1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with required environment variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

4. Start the server:
```bash
npm start
```

### Frontend Setup
1. Navigate to the Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with required variables:
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

4. Start the development server:
```bash
npm run dev
```

## Available Scripts

### Backend
- `npm start`: Start the server
- `npm run dev`: Start server in development mode with nodemon

### Frontend
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## Dependencies

### Frontend
- React
- Vite
- Axios
- React Router
- Framer Motion
- React Toastify
- TailwindCSS

### Backend
- Express.js
- MongoDB
- Mongoose
- JWT
- Razorpay
- Multer
- Other AI/ML libraries

## Features in Detail

### 1. User Management
- User registration and authentication
- Profile management
- Credit system for premium features

### 2. AI Chatbot
- Real-time chat interface
- AI-powered responses
- Chat history management

### 3. Image Processing
- Background removal
- Image upload and processing
- Secure file storage

### 4. Text-to-Speech
- Text conversion to speech
- Multiple voice options
- Audio file generation

### 5. Payment Integration
- Razorpay integration
- Secure payment processing
- Credit purchase system

## Security Features
- JWT authentication
- Secure file uploads
- Environment variable protection
- API rate limiting
- Input validation

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License.