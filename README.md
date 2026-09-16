# 🏃 Fitness Tracker App

A responsive web-based **Fitness Tracker Application** that allows users to record their daily fitness activities, monitor their progress, and manage their personal fitness information.

The application uses **Firebase Authentication** for secure user login and registration and **Cloud Firestore** for storing fitness activity data.

## 🌐 Live Demo

👉 https://kushalagouda.github.io/fitness-tracker-app/

## 📂 GitHub Repository

👉 https://github.com/KushalaGouda/fitness-tracker-app

---

## 📌 Project Overview

The Fitness Tracker App is designed to help users keep track of their daily physical activities in a simple and user-friendly way.

Users can create an account, log in securely, record their fitness activities, view their activity history, monitor their progress, and manage their profile.

The application provides a dashboard that gives users a quick overview of their fitness information and progress.

---

## 🎯 Objectives

The main objectives of this project are:

- To provide a simple platform for tracking daily fitness activities.
- To allow users to securely create and manage their accounts.
- To store fitness activity information permanently using Firebase Firestore.
- To allow users to add, edit, view, and delete activities.
- To provide progress tracking through charts and statistics.
- To keep each user's fitness data separate and secure.
- To provide a responsive interface that works on desktop and mobile devices.

---

## ✨ Features

### 🔐 User Authentication

- User registration
- User login
- Firebase Authentication
- Logout functionality
- Forgot Password functionality
- Password reset email support
- Authentication-based access to user data

### 📊 Dashboard

The dashboard provides an overview of the user's fitness activities and progress.

Users can view their fitness information in one place after logging in.

### ➕ Add Activity

Users can manually enter their fitness activities.

Activity information can include:

- Date
- Exercise type
- Workout duration
- Calories burned
- Steps
- Other activity-related information

### 📋 Activity History

Users can view their previously recorded fitness activities.

The history section allows users to:

- View activities
- Edit activities
- Delete activities
- Review their recorded fitness information

### ✏️ Edit Activity

Users can modify previously entered activity information whenever required.

### 🗑️ Delete Activity

Users can remove activities that they no longer want to keep.

### 📈 Progress Tracking

The application provides progress information using:

- Statistics
- Progress information
- Weekly activity data
- Charts

This helps users understand their activity patterns over time.

### 👤 User Profile

Users can manage their personal profile information.

Profile information is stored in Firebase Firestore and is associated with the authenticated user's Firebase UID.

### 🔒 Data Security

Each user's activity data is associated with their Firebase Authentication UID.

Firestore security rules ensure that authenticated users can access only their own profile and activity data.

### 📱 Responsive Design

The application is designed to work across different screen sizes, including:

- Desktop computers
- Laptops
- Tablets
- Android/mobile devices

---

## 🛠️ Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend / Database

- Firebase Authentication
- Firebase Cloud Firestore

### Hosting & Version Control

- GitHub
- GitHub Pages

---

## 🏗️ Project Structure

```text
fitness-tracker-app/
│
├── index.html
├── login.html
├── add-activity.html
├── history.html
├── progress.html
├── profile.html
│
├── css/
│   └── style.css
│
└── js/
    ├── activity.js
    ├── dashboard.js
    ├── firebase.js
    ├── history.js
    ├── login.js
    ├── profile.js
    └── progress.js
