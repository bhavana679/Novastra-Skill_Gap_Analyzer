# Novastra Backend

The core engine of **Novastra**, responsible for AI-driven skill Extraction, resume parsing, and career roadmap generation.

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   Create a `.env` file from the `.env.example`:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_key
   OPENAI_API_KEY=your_openai_key
   ```

3. **Run the server**:
   ```bash
   # Development mode with watch
   npm run dev

   # Production mode
   npm start
   ```

## Core Services

- **ATS Service**: Handles resume parsing and text extraction from PDFs/Images.
- **AI Learning Path**: Generates personalized roadmaps using LLMs (Gemini/OpenAI).
- **Skill Extractor**: Identifies and classifies professional skills from raw text.
- **Skill Gap Service**: Compares extracted skills against target role benchmarks.

## API Architecture

- `src/routes/`: Express routers for auth, resume, career, and AI features.
- `src/services/`: Modular business logic for AI processing and data handling.
- `src/models/`: Mongoose schemas for persistence.
- `src/middleware/`: Authentication checks, error handling, and logging.

---
*For the full project overview and frontend setup, visit the [Root README](../README.md).*
