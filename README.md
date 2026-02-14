🚀 HireTrack: Job Application Command Center
HireTrack is a premium, full-stack MERN application designed for job seekers to track, analyze, and manage their career opportunities in one high-end, glassmorphism-inspired interface. Built with a focus on clean UI/UX and real-time data management.

✨ Key Features
📈 Success Analytics: Real-time calculation of interview conversion rates and total applications.

💰 Pipeline Value Tracker: Monitors the total potential salary across all active applications.

🕒 Smart Relative Timeline: Shows exactly when you applied (e.g., "2 hours ago", "yesterday") using custom date logic.

🔴 Urgency Intelligence: Categorizes applications as "Recent," "Follow Up," or "Stale" based on the age of the application.

🔍 Global Search & Filter: Instantly find applications by company or role and filter by status.

🎨 Premium Glassmorphism UI: A modern, soft-aesthetic interface featuring backdrop blurs, organic border radii, and a high-end emerald/slate color palette.

📝 Contextual Notes: Expandable sections for recruiter contacts and interview links.

🛠️ Tech Stack
Frontend: React.js, Tailwind CSS, Lucide React, Axios.

Backend: Node.js, Express.js, MongoDB, Mongoose.

🚀 Getting Started
1. Prerequisites
Node.js installed

MongoDB Compass or a local MongoDB service running

2. Installation
Clone the repository:
git clone https://www.google.com/search?q=https://github.com/prajwalghotekar/hiretrack.git

cd hiretrack

3. Setup Backend
cd server

npm install

node server.js

(Server runs on http://localhost:5000)

4. Setup Frontend
cd client

npm install

npm run dev

(App runs on http://localhost:5173)

📁 Project Structure
hiretrack/

├── client/ (React frontend)

│   ├── src/components/ (StatCard, UrgencyBadge)

│   └── src/pages/ (Dashboard logic)

└── server/ (Node/Express backend)

🧠 Development Challenges
During development, a significant challenge was handling Windows file system permissions (EPERM) while managing node modules. This was resolved by shifting the development environment to a root-level directory to bypass deep-path permission restrictions.

Developed by: Prajwal Ghotekar
