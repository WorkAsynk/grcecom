# FILEPATH

"""
README

This project utilizes Firebase serverless functions. Follow the steps below to set it up on your local machine:

1. Install Firebase CLI:
    - Run the command `npm install -g firebase-tools` to install the Firebase CLI globally.

2. Set up Firebase project:
    - Create a new Firebase project on the Firebase console (https://console.firebase.google.com/).
    - Retrieve your Firebase project ID.

3. Configure Firebase project:
    - Run the command `firebase login` to authenticate with your Google account.
    - Run the command `firebase use --add` and select your Firebase project from the list.
    - Run the command `firebase functions:config:set project.id=<YOUR_PROJECT_ID>` to set your project ID.

4. Install project dependencies:
    - Run the command `npm install` to install the required dependencies.

5. Start the local development server:
    - Run the command `firebase emulators:start` to start the Firebase emulators for functions and Firestore.

6. Test the functions:
    - Use a tool like Postman or cURL to send requests to the local server (e.g., http://localhost:5001/<YOUR_PROJECT_ID>/<FUNCTION_NAME>).

Note: Make sure you have Node.js and npm installed on your machine before proceeding.

For more information, refer to the Firebase documentation: https://firebase.google.com/docs/functions

"""

