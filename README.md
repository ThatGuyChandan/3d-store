# Quleep - 3D Product Viewer

Quleep is a full-stack web application that allows users to view and interact with 3D models of products in a dynamic, web-based environment. It provides a seamless experience for users to register, log in, and browse a gallery of products, each with its own interactive 3D viewer.

## Features

- **User Authentication:** Secure user registration and login system using JWT for session management.
- **Product Gallery:** A gallery of all available products, fetched from the backend.
- **Interactive 3D Viewer:** A dedicated page for each product with an interactive 3D model viewer built with React Three Fiber.
- **Model Controls:** Users can rotate, zoom, and pan the 3D models.
- **Dynamic Backgrounds:** Ability to change the background of the 3D viewer to see the product in different environments.
- **Custom Model Upload:** Users can upload their own `.glb` or `.gltf` models to view them in the viewer.
- **Responsive Design:** The application is designed to work on both desktop and mobile devices.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) database

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    cd Quleep
    ```

2.  **Setup the Backend:**
    - Navigate to the backend directory:
      ```sh
      cd backend
      ```
    - Install the dependencies:
      ```sh
      npm install
      ```
    - Create a `.env` file in the `backend` directory and add the following environment variables, replacing the values with your own:
      ```env
      DB_USER=your_db_user
      DB_PASSWORD=your_db_password
      DB_HOST=localhost
      DB_PORT=5432
      DB_NAME=your_db_name
      JWT_SECRET=your_jwt_secret
      ```
    - Create the database in PostgreSQL with the name you specified in `DB_NAME`.
    - Run the database seed to populate it with initial data:
      ```sh
      npm run seed
      ```

3.  **Setup the Frontend:**
    - Navigate to the frontend directory from the root folder:
      ```sh
      cd frontend
      ```
    - Install the dependencies:
      ```sh
      npm install
      ```
    - Create a `.env` file in the `frontend` directory and add the following environment variable:
      ```env
      REACT_APP_API_URL=http://localhost:5000/api
      ```

### Running the Application

1.  **Start the Backend Server:**
    - In the `backend` directory, run:
      ```sh
      npm start
      ```
    - The server will start on `http://localhost:5000`.

2.  **Start the Frontend Application:**
    - In the `frontend` directory, run:
      ```sh
      npm start
      ```
    - The application will open in your browser at `http://localhost:3000`.
