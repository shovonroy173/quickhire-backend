# QuickHire Backend API

🚀 A robust RESTful API for the QuickHire Job Board Application built with Node.js, Express, TypeScript, and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Deployment](#deployment)

## ✨ Features

- ✅ **Job Management** - Create, read, update, and delete job listings
- ✅ **Application System** - Submit and manage job applications
- ✅ **Admin Authentication** - Secure JWT-based authentication
- ✅ **Advanced Filtering** - Search, filter, and paginate job listings
- ✅ **Input Validation** - Comprehensive request validation using Joi
- ✅ **Error Handling** - Centralized error handling with proper status codes
- ✅ **Rate Limiting** - Protect API from abuse
- ✅ **Security** - Helmet.js, CORS, and other security best practices
- ✅ **Logging** - Winston-based logging system
- ✅ **TypeScript** - Full type safety throughout the application
- ✅ **API Documentation** - Swagger/OpenAPI documentation

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting
- **Documentation**: Swagger UI

## 📁 Project Structure
```src/
├── config/
│   ├── env.ts                  
│   └── swagger.ts
├── common/
│   ├── utils/
│   │   ├── ApiResponse.ts
│   │   ├── ApiError.ts
│   │   └── catchAsync.ts   
├── middlewares/
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   └── validate.middleware.ts
├── modules/
│   ├── auth/
│   │   ├── controllers/auth.controller.ts
│   │   ├── services/auth.service.ts    
│   │   ├── validations/auth.validation.ts
│   │   └── routes/auth.route.ts
│   ├── job/
│   │   ├── controllers/job.controller.ts           
│   │   ├── services/job.service.ts
│   │   ├── validations/job.validation.ts
│   │   └── routes/job.route.ts
│   ├── application/        
│   │   ├── controllers/application.controller.ts
│   │   ├── services/application.service.ts     
│   │   ├── validations/application.validation.ts
│   │   └── routes/application.route.ts
│   └── user/       
│       └── model/user.model.ts
├── routes/
│   └── index.ts
├── server.ts
├── tsconfig.json       
├── package.json
├── .env.example
├── .gitignore
└── README.md
```     
## 🚀 Getting Started   
### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
### Installation
1. Clone the repository:
```bash     
git clone       
   git clone https://github.com/yourusername/quickhire-backend.git
   cd quickhire-backend
2. Install dependencies:
```bash
npm install     
3. Create a `.env` file based on `.env.example` and fill in the required environment variables.
4. Start the development server:
```bash     
npm run dev
The API will be running at `http://localhost:5000`. 
## 🌐 API Documentation 
Access the API documentation at `http://localhost:5000/docs` (available in development mode).
## 🗄️ Database Schema
- **User**: Represents admin users with fields for name, email, password, role, and last login.
- **Job**: Represents job listings with fields for title, description, company              
name, location, salary range, experience level, and application count.
- **Application**: Represents job applications with fields for applicant name, email, resume link,
cover note, portfolio, LinkedIn, experience, status, and references to the job and reviewer.
## 🧪 Testing   
Run tests using Jest:       
```bash
npm test        
## 🚀 Deployment
1. Build the application:
```bash
npm run build
2. Start the application in production mode:
```bash
npm start
3. Ensure environment variables are set in the production environment.  
## 📞 Contact
For any questions or support, please contact [your email] or open an issue on the GitHub repository.
