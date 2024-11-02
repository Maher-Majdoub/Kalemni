# Kalemi

Welcome to Kalemni! This application allows users to send messages, images, audio, voices, and videos, as well as engage in live audio and video calling.

[![Live Version](https://img.shields.io/badge/Live%20Version-Visit%20Website-blue.svg)](https://kalemni.vercel.app/)

## Features

- **User Authentication**: Secure user registration and login using JWT (JSON Web Tokens) and Google OAuth.
- **Messaging**: Real-time text messaging between users, including one-on-one and group conversations.
- **Media Sharing**: Send and receive images and videos.
- **Live Calling**: Engage in multi-user audio and video calls using WebRTC.
- **Responsive Design**: Works seamlessly across devices.

### Note on Live Version

The live version of the application is hosted on a free service, which may delay some requests. Please be aware of this when using the app.

## Technologies Used

- **MongoDB**: NoSQL database to store user data and messages.
- **Express.js**: Web framework for building RESTful APIs.
- **React.js**: Frontend library for building user interfaces.
- **Node.js**: JavaScript runtime for the backend.
- **Socket.io**: Real-time communication for messaging and calling.
- **Multer**: Middleware for handling multipart/form-data (file uploads).
- **WebRTC**: For peer-to-peer audio and video calling.
- **Google OAuth**: For easy user authentication using Google accounts.
- **Supabase**: Used exclusively for uploading files.
- **TypeScript**: For type-safe development throughout the stack.

## Prerequisites

- Node.js (v20 or later)
- MongoDB (local or hosted)
- npm (Node package manager)

## Installation

- 1. Clone the repository:
     ```bash
     git clone git@github.com:Maher-Majdoub/Kalemni.git
     ```
- 2. Navigate to the server directory:
     ```bash
     cd Kalemni/server
     ```
- 3. Install dependencies:
     ```bash
     npm install
     ```
- 4. Create a .env file in the server directory and add your environment variables:
     ```bash
     SUPABASE_URL=your_supabase_url
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     ```
- 5. Start the server
     ```bash
     npm run dev
     ```
- 6. Navigate to the client directory:
     ```bash
     cd Kalemni/client
     ```
- 7. Install dependencies:
     ```bash
     npm install
     ```
- 8. Create a .env file in the client directory and add your environment variables:
     ```bash
     VITE_GOOGLE_CLIENT_ID=your_google_client_id
     VITE_SERVER_URL=http://localhost:3000
     ```
- 9. Start the client
     ```bash
     npm run dev
     ```
     
## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you would like to contribute to this project.

## License

This project is licensed under the [MIT](https://opensource.org/licenses/MIT) License. 
