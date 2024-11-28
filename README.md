This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### **README: User Data Fetch and Storage Application**

---

#### **Overview**
This application periodically fetches random user data from an external API and stores it in a PostgreSQL database. It uses a backend implemented with Next.js API routes and a cron job for scheduled data fetching.

---

### **Features**
1. **Periodic User Data Fetching**: Fetches user data every 5 minutes from the [Random User API](https://randomuser.me/).
2. **Data Storage**: Saves user details, including name, email, gender, and location, into a PostgreSQL database.
3. **Frontend Integration**: Displays the fetched and stored user data using a client-side React application.
4. **Error Handling**: Logs any errors during data fetching or database operations for debugging.

---

### **Code Structure**
- **Backend API (Next.js)**:
  - **API Route** (`/api/cron-fetch`):
    - Schedules a cron job using the `node-cron` library.
    - Fetches data from the Random User API.
    - Processes the response and inserts user and location data into the database.
- **Database Integration**:
  - Uses a PostgreSQL database with a connection pool (`pg` library).
  - Two tables:
    1. **`users`**: Stores user information.
    2. **`locations`**: Stores location details associated with users.

---

### **How the Code Works**

#### **Backend API**
- **Cron Job (`node-cron`)**:
  - Executes every 5 minutes using the cron schedule `*/5 * * * *`.
  - Fetches 5 random user records from the Random User API.
  - Inserts the following into the database:
    - User details (name, email, gender).
    - Associated location (city, country).

- **Error Handling**:
  - Logs errors during the cron job (e.g., API call failure or database insertion issues).
  - Provides meaningful error messages in the console for debugging.

#### **Frontend**
- Fetches data from the backend API using `axios`.
- Handles rendering and error display in case of data inconsistencies.

---

### **Key Libraries Used**
- **Backend**:
  - [`node-cron`](https://www.npmjs.com/package/node-cron): For scheduling periodic tasks.
  - [`axios`](https://www.npmjs.com/package/axios): For making HTTP requests.
  - [`pg`](https://www.npmjs.com/package/pg): PostgreSQL database integration.
- **Frontend**:
  - React with Next.js for SSR and frontend rendering.
  - `axios` for API calls.

---

### **Database Schema**

#### **Table: `users`**
| Column      | Type         | Description                  |
|-------------|--------------|------------------------------|
| `id`        | `SERIAL`     | Primary key.                 |
| `name`      | `VARCHAR`    | User's full name.            |
| `email`     | `VARCHAR`    | User's email address.        |
| `gender`    | `VARCHAR`    | User's gender.               |
| `createdAt` | `TIMESTAMP`  | Timestamp of record creation.|

#### **Table: `locations`**
| Column    | Type         | Description                  |
|-----------|--------------|------------------------------|
| `id`      | `SERIAL`     | Primary key.                 |
| `userId`  | `INTEGER`    | Foreign key from `users`.    |
| `city`    | `VARCHAR`    | User's city.                 |
| `country` | `VARCHAR`    | User's country.              |

---

### **How to Run the Project**

1. **Clone the Repository**:
   ```bash
   git clone <repository_url>
   cd <repository_directory>
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   DATABASE_URL=<your_postgres_connection_string>
   ```

4. **Run Database Migrations**:
   Ensure the database is set up and migrate the schema:
   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255),
     email VARCHAR(255),
     gender VARCHAR(50),
     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE locations (
     id SERIAL PRIMARY KEY,
     userId INTEGER REFERENCES users(id),
     city VARCHAR(255),
     country VARCHAR(255)
   );
   ```

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```

6. **View the Application**:
   - Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.
   - API route for cron job: `/api/cron-fetch`.

---

### **Troubleshooting**

#### **Common Errors**
- **Hydration Errors**:
  - Ensure no browser-specific code (e.g., `window`, `localStorage`) runs on the server during SSR.
- **Database Errors**:
  - Verify the database schema and ensure the `createdAt` column exists in the `users` table.
- **API Errors**:
  - Check the Random User API endpoint and network connectivity.

---

### **Future Improvements**
1. **Pagination**: Add pagination support for displaying users on the frontend.
2. **Authentication**: Secure API routes with authentication.
3. **Frontend Enhancements**: Add a more user-friendly UI for displaying and managing fetched data.

---

### **Contributors**
- **Your Name**: Owais

--- 

This documentation serves as a guide for understanding and running the project while highlighting key features and configurations.