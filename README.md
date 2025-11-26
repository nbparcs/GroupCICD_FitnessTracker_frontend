# Fitness Tracker Application

A modern, responsive web application built with React for tracking fitness activities, workouts, and health metrics. This frontend application provides an intuitive interface for users to monitor their fitness journey.

## Features

- **Activity Tracking**: Log and monitor various fitness activities
- **Workout Management**: Create and track workout routines
- **Progress Visualization**: Interactive charts and graphs to visualize fitness progress
- **Responsive Design**: Works on desktop and mobile devices
- **User Authentication**: Secure login and user profile management

## Technologies Used

- **Frontend**: React.js
- **UI Components**: Custom components with modern design
- **Data Visualization**: Recharts
- **State Management**: React Context API
- **Styling**: CSS Modules

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher) or Yarn

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/dearn1/GroupCICD_FitnessTracker_frontend.git
   cd fitness-tracker-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with the following variables:
   ```
   REACT_APP_API_URL=your_api_url_here
   # Add other environment variables as needed
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App (use with caution)

## Project Structure

```
fitness-tracker-app/
├── public/           # Static files
├── src/              # Source files
│   ├── assets/       # Images, fonts, etc.
│   ├── components/   # Reusable UI components
│   ├── context/      # React context providers
│   ├── pages/        # Page components
│   ├── services/     # API services
│   ├── styles/       # Global styles
│   ├── utils/        # Utility functions
│   ├── App.js        # Main App component
│   └── index.js      # Application entry point
├── .env.local        # Environment variables
├── package.json      # Project dependencies
└── README.md         # This file
```
