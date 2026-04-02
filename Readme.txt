SPOTIFY LIBRARY MANAGER - README

Welcome to the Spotify Library Manager application! This is a full-stack web application built with Node.js, Express, EJS, and MongoDB. It allows users to browse a music library, manage categories, create personalized playlists, and leave ratings/reviews for their favorite tracks.

--------------------------------------------------
PREREQUISITES

Before setting up the application, please ensure you have the following installed on your computer:
- Node.js (v14 or higher)
- MongoDB (Running locally, or a MongoDB Atlas cluster)

--------------------------------------------------
a. SETUP INSTRUCTIONS

Step 1: Extract the project files
Extract the submitted project folder and open your Terminal (Mac/Linux) or Command Prompt/PowerShell (Windows) inside the root directory of the project.

Step 2: Install Dependencies
Run the following command to download and install all required Node.js packages (like Express, Mongoose, EJS, etc.):

npm install

Step 3: Database Configuration
Ensure your the  info in the config.env file is as follow
DB=mongodb+srv://DBFirstAdmin:Pa$$word@wad1mongodb.xcwngxx.mongodb.net/WADProject?retryWrites=true&w=majority
SECRET=e6giefHBZg9Q1onf

--------------------------------------------------
b. HOW TO RUN THE APPLICATION

Step 1: Start the Server
In your terminal, while inside the project root directory, run the following command to start the backend server:

nodemon server.js


Step 2: Access the Web App
Once the terminal displays a message confirming the server is running (e.g., "Server running on port 3000"), open your web browser and navigate to:

http://localhost:8000

--------------------------------------------------
c. TEST CREDENTIALS

To test the role-based functionality of the application (such as the "+ Add New Song" button which is restricted to admins), please use the following seeded accounts:

Admin Account (Has full permissions to add/edit/delete songs, categories and reviews):
Username: admin1
Password: 123

Standard User Account (Can browse, leave reviews, and create playlists):
Username: testUser
Password: 123

(Note: You can also register a brand new user account directly through the application's Sign Up page.)

--------------------------------------------------
d. AI and LLM
The css code are meanly created by AI/LLM, we only did very little change to the naming for the class.