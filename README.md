# Novastra: Skill Gap Analyzer

**Bridge the gap between your current skills and your dream career with AI.**

Novastra is an intelligent career acceleration platform that analyzes your resume, identifies missing skills based on real-world job requirements, and generates a personalized learning path to help you level up.

## Overview

Landing a dream job isn't just about having a resume; it's about having the *right* skills that the market demands. Novastra takes the guesswork out of career growth by using advanced AI and OCR to dissect your professional profile and compare it against industry standards.

## Key Features

- **Smart Resume Parsing**: Upload your resume in PDF or image format. Our neural network-based OCR extracts your experience and skills with high precision.
- **AI Skill Gap Analysis**: Automatically identifies which skills you have and which ones you're missing for your target role.
- **Dynamic Learning Paths**: Generates a step-by-step roadmap with curated resources to help you bridge the identified gaps.
- **Career Comparison**: See how you stack up against different roles (e.g., Software Engineer vs. Data Scientist) to find your best fit.
- **Growth Tracking**: Track your progress as you learn and update your profile to see your "Readiness Velocity" increase.
- **AI Career Assistant**: A built-in chat interface to help you with career advice, interview prep, or learning path adjustments.

## Tech Stack

### Frontend
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Content Rendering**: React Markdown

### Backend
- **Runtime**: Node.js / Express
- **Database**: MongoDB (Mongoose)
- **AI Integration**: OpenAI API & Google Gemini (Generative AI)
- **File Handling**: Multer & PDF-Parse
- **OCR**: Tesseract.js

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Running locally or MongoDB Atlas)
- API Keys for OpenAI or Google Gemini

### 1. Clone the repository
```bash
git clone https://github.com/bhavana679/Novastra-Skill_Gap_Analyzer.git
cd Novastra-Skill_Gap_Analyzer
```

### 2. Setup Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
```
Start the backend:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
```
Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
Start the frontend:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```bash
├── backend/            # Express server & AI integration
│   ├── src/
│   │   ├── services/   # AI logic, ATS parsing, skill extraction
│   │   ├── routes/     # API endpoints
│   │   └── models/     # Database schemas
├── frontend/           # Next.js application
│   ├── src/
│   │   ├── app/        # Dashboard, Login, Role Selection pages
│   │   └── components/ # UI components & charts
└── README.md
```

## Contributing

We welcome contributions! If you have ideas for features or find bugs, feel free to open an issue or submit a pull request.

---

Built by the Novastra Team.
