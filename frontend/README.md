# Novastra Frontend

This is the client-side application for **Novastra**, built with Next.js. It provides a sleek, interactive dashboard for career analysis and learning path management.

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## Key Packages

- **Next.js**: Core framework for routing and SSR.
- **Tailwind CSS**: Modern UI styling with custom design tokens.
- **Recharts**: Interactive charts for skill gap visualization.
- **Lucide React**: Clean and consistent iconography.
- **React Markdown**: Used for rendering AI-generated insights and learning paths.

## Architecture

- `src/app/`: Contains the main page layouts and routes.
  - `dashboard/`: The core user interface with sub-pages for chat, progress, and resources.
  - `upload/`: Resume upload and processing interface.
  - `select-role/`: Role selection for targeted gap analysis.
- `src/components/`: Reusable UI components like charts, sidebars, and custom markdown renderers.

## Design System

The project uses a custom design system defined in `globals.css` and `tailwind.config.mjs`, featuring:
- High-contrast typography for readability.
- Subtle glassmorphism effects for a modern feel.
- Dynamic hover states and transitions for better user engagement.

---
*For full project documentation, including the backend setup, please refer to the [Root README](../README.md).*

