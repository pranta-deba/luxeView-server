# luxeView Server

This repository contains the server-side code for the **luxeView** project. **luxeView** is a full-stack single-page application that offers advanced search filtering functionalities, including pagination, categorization, and sorting of products. The server is built using Node.js, Express.js, and MongoDB, and it handles the backend logic, API endpoints, and database interactions.

## 🚀 Live API

The live API is deployed on Vercel and can be accessed at: [luxeView Server](https://luxe-view-server.vercel.app/)

## 📂 Client-Side Repository

The client-side code can be found here: [luxeView Client](https://github.com/pranta-deba/luxeView-client)

## ✨ Features

- **RESTful API**: Provides endpoints for user management and product operations, including searching, filtering, pagination, and sorting.
- **CRUD Operations**: Supports Create, Read, Update, and Delete operations on product data.
- **Authentication**:
  - Google Authentication using Firebase.
  - Email and Password Authentication using Firebase.
- **Database**: MongoDB is used to store and manage product and user data.
- **Error Handling**: Robust error handling for API requests.

## 📦 Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (using Mongoose)
- **Authentication**: Firebase Authentication 
- **Deployment**: Vercel

## 📜 API Endpoints

Here is a list of the main API endpoints:

- `POST /register` - Register a new user.
- `POST /login` - Log in an existing user.
- `PATCH /update-user` - Update user information (name and image).
- `GET /latest` - Retrieve the latest products.
- `GET /products/:id` - Retrieve a single product by its ID.
- `GET /products` - Retrieve a list of products with search, filter, and pagination options.

## 🔧 Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/pranta-deba/luxeView-server.git
   
   cd luxeView-server
