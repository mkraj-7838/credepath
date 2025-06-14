# JobSearch Application

## Overview
JobSearch is a web-based job search platform that allows users to browse, filter, and view job listings. The application features a responsive user interface built with HTML, Tailwind CSS, and JavaScript, and a backend powered by Node.js, Express, and MongoDB. Users can search for jobs by title, location, salary, experience, function, industry, and job type, and view detailed job descriptions.

## Features
- **Responsive Design**: Adapts to various screen sizes for a seamless experience on desktop and mobile devices.
- **Job Filtering**: Filter jobs by location, experience, salary, function, industry, and job type.
- **Pagination**: Navigate through job listings with paginated results.
- **Dynamic Job Details**: View detailed information about selected jobs, including company details, responsibilities, qualifications, and benefits.
- **Interactive UI**: Includes hover effects, animations, and action buttons for applying, saving, or copying job links.
- **Backend API**: Provides endpoints for fetching, creating, updating, and deleting job listings.
- **MongoDB Integration**: Stores job data in a MongoDB database with a well-defined schema.

## Live Demo
Check out the live version of the app [here](https://credepath-mk.netlify.app/).

![Credepath](./image.jpg)

## Technologies Used
- **Frontend**:
  - HTML5
  - Tailwind CSS (via CDN)
  - JavaScript (Vanilla)
  - Google Fonts (Inter)
- **Backend**:
  - Node.js
  - Express.js
  - MongoDB (via Mongoose)
- **External Services**:
  - Dicebear API for generating company logo placeholders
  - MongoDB Atlas or local MongoDB instance for database hosting
- **Dependencies**:
  - `express`
  - `mongoose`
  - `dotenv`

## Prerequisites
Before running the application, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **MongoDB** (local instance or MongoDB Atlas account)
- **Git** (optional, for cloning the repository)


## Installation

### Step 1: Clone or Download the Repository
If using Git, clone the repository:
```bash
git clone <repository-url>
cd jobsearch
```
Alternatively, download the project files as a ZIP and extract them to a folder named `jobsearch`.

### Step 2: Set Up the Backend
1. **Navigate to the Backend Directory**:
   If the backend files (`server.js`, `models/Job.js`, etc.) are in a separate folder (e.g., `backend`), navigate to it:
   ```bash
   cd backend
   ```
   If all files are in the root directory, skip this step.

2. **Install Backend Dependencies**:
   Run the following command to install required Node.js packages:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the backend directory (or root if no separate backend folder) with the following content:
   ```env
   PORT=5000
   MONGO_URI=<your-mongodb-connection-string>
   ```
   - Replace `<your-mongodb-connection-string>` with your MongoDB Atlas URI or local MongoDB connection string (e.g., `mongodb://localhost:27017/jobsearch`).
   - Ensure MongoDB is running if using a local instance.

4. **Start the Backend Server**:
   Run the following command to start the Express server:
   ```bash
   npx nodemon server.js
   ```
   The server should start on `http://localhost:5000` (or the port specified in `.env`). You should see:
   ```
   Server running on port 5000
   MongoDB connected successfully
   ```

### Step 3: Set Up the Frontend
1. **Organize Frontend Files**:
   Ensure the following files are in the project root or a `frontend` folder:
   - `index.html`
   - `script.js`
   - `styles.css`
   - An `images` folder containing:
     - `Logo.png`
     - `profile.svg`
     - `bag.svg`
     - `location.svg`
     - `money.svg`
     - `save.svg`
     - `not-interested.svg`
     - `link.svg`
     - `verified.svg`
     - `placeholder.png`

   If these image files are missing, create placeholder images or update the paths in `index.html` and `script.js` to use alternative URLs or the Dicebear API.

2. **Serve the Frontend**:
   The frontend requires a web server to handle requests properly. You can use a simple HTTP server like `live-server` or `http-server`.

   **Option 1: Using `live-server`**:
   - Install `live-server` globally:
     ```bash
     npm install -g live-server
     ```
   - Navigate to the directory containing `index.html` (e.g., project root or `frontend` folder):
     ```bash
     cd frontend
     ```
   - Start the server:
     ```bash
     live-server
     ```
     This will open the application in your default browser at `http://localhost:8080`.

   **Option 2: Using `http-server`**:
   - Install `http-server` globally:
     ```bash
     npm install -g http-server
     ```
   - Navigate to the directory containing `index.html`:
     ```bash
     cd frontend
     ```
   - Start the server:
     ```bash
     http-server
     ```
     Access the application at `http://localhost:8080`.

   **Option 3: Using a Local Development Server**:
   - If you have a local development environment like VS Code with the Live Server extension, right-click `index.html` and select "Open with Live Server".

### Step 4: Configure the API URL
- If running the backend locally, update this line in `script.js` to:
  ```javascript
  const API_BASE_URL = "http://localhost:5000/api";
  ```
- Save the file and refresh the browser to ensure the frontend communicates with your local backend.

### Step 5: Populate the Database (Optional)
To test the application with sample data:
1. Use a tool like Postman or cURL to send a `POST` request to `http://localhost:5000/api/jobs` with a JSON body like:
   ```json
   {
     "companyName": "Tech Corp",
     "jobTitle": "Software Engineer",
     "experience": "2-4 yrs",
     "location": "Bangalore",
     "salary": "10-20 LPA",
     "postedDaysAgo": 3,
     "applicantsCount": 25,
     "isCredepathVerifiedCompany": true,
     "isCredepathVerifiedJob": true,
     "skillsRequired": ["JavaScript", "React", "Node.js"],
     "jobDescription": {
       "keyResponsibilities": ["Develop web applications", "Collaborate with teams"],
       "requiredQualifications": ["Bachelor's in CS", "2+ years experience"],
       "preferredSkills": ["TypeScript", "AWS"]
     },
     "benefits": ["Health insurance", "Flexible hours"],
     "aboutCompany": "Tech Corp is a leading tech company.",
     "jobType": "Full-time",
     "industry": "Tech",
     "function": "Engineering"
   }
   ```
2. Repeat to add more job listings.

Alternatively, use a MongoDB client (e.g., MongoDB Compass) to insert documents directly into the `jobs` collection.

### Step 6: Preview the Application
1. Open your browser and navigate to `http://localhost:8080` (or the port provided by your web server).
2. The application should load with:
   - A header containing a logo, navigation, search inputs, and filters.
   - A job listings panel on the left (or top on mobile).
   - A job details panel on the right (or bottom on mobile).
   - Pagination controls at the bottom.
   - A footer with links and copyright information.
3. Use the search inputs and filters to query jobs, click on a job listing to view details, and interact with action buttons (Apply, Save, etc.).

## Project Structure
```
credepath/
├── images/                  # Image assets (logos, icons)
│   ├── Logo.png
│   ├── profile.svg
│   ├── bag.svg
│   ├── location.svg
│   ├── money.svg
│   ├── save.svg
│   ├── not-interested.svg
│   ├── link.svg
│   ├── verified.svg
│   ├── placeholder.png
├──Server/
|   ├── models/                  # Mongoose schema
│       ├── Job.js
|   ├── server.js                # Backend Express server
|   ├── package.json             # Node.js dependencies
|   ├── .env                    # Environment variables
├── index.html               # Main HTML file
├── script.js                # Frontend JavaScript
├── styles.css               # Custom CSS
└── README.md               # This file
```

## API Endpoints
- **GET /api/jobs**: Fetch paginated job listings with optional filters (e.g., `?location=Delhi&experience=2-4 yrs&page=1`).
- **GET /api/jobs/:id**: Fetch details of a specific job by ID.
- **POST /api/jobs**: Create a new job listing.
- **PUT /api/jobs/:id**: Update an existing job listing.
- **DELETE /api/jobs/:id**: Delete a job listing.
- **GET /**: Health check endpoint returning server status.

## Notes
- **Image Assets**: Ensure all referenced images exist in the `images` folder. If unavailable, replace with placeholder URLs or update paths in the code.
- **Backend Hosting**: The provided `API_BASE_URL` points to a deployed backend (`https://credepath-job.onrender.com/api`). For local development, switch to `http://localhost:5000/api`.
- **MongoDB Setup**: If using MongoDB Atlas, ensure your IP is allowlisted in the Atlas network settings.
- **Error Handling**: The frontend handles API errors by displaying user-friendly messages in the UI.

## Troubleshooting
- **Backend Not Connecting to MongoDB**:
  - Verify `MONGO_URI` in `.env` is correct.
  - Ensure MongoDB is running (local) or your IP is allowlisted (Atlas).
- **Frontend Not Loading Jobs**:
  - Check the `API_BASE_URL` in `script.js`.
  - Ensure the backend server is running and accessible.
  - Open the browser's developer console (F12) to check for network errors.
- **Images Not Loading**:
  - Verify the `images` folder exists and contains all required files.
  - Update image paths in `index.html` and `script.js` if necessary.
- **Pagination Issues**:
  - Ensure the backend returns `totalPages` and `currentPage` in the `/api/jobs` response.

## Future Improvements
- Add user authentication for job applications and saved jobs.
- Implement advanced search with keyword highlighting.
- Add sorting options for job listings (e.g., by date, salary).
- Enhance accessibility (ARIA labels, keyboard navigation).
- Deploy the frontend to a static hosting service (e.g., Vercel, Netlify).

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For issues or suggestions, please open an issue on the repository or contact the maintainer at [mohit.work.mail9@gmail.com].
