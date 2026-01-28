# GetCyberRight - Cybersecurity Education Platform

## Overview

GetCyberRight is a cybersecurity education website designed to provide simple, practical security guidance for families, seniors, and organizations. The platform focuses on protecting users from modern cyber threats like phishing, romance scams, identity theft, and tech support scams through accessible educational content, security guides, and community resources.

The application is built as a full-stack TypeScript project with a React frontend and Express backend, featuring a landing page with multiple sections including hero, features, testimonials, contact forms, and newsletter signup.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query (React Query) for server state
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Animations**: Framer Motion for subtle page animations
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Framework**: Express 5 on Node.js
- **Language**: TypeScript with ES modules
- **API Design**: REST endpoints for contact form and newsletter subscriptions
- **Validation**: Zod schemas shared between frontend and backend
- **Session Storage**: Memory-based storage (MemStorage class) with interface for future database migration

### Data Layer
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema Location**: `shared/schema.ts` contains all database table definitions
- **Schema Generation**: drizzle-zod for automatic Zod schema generation from database tables
- **Current Tables**: users, contact_messages, newsletter_subscribers

### Project Structure
```
├── client/           # React frontend application
│   ├── src/
│   │   ├── components/   # UI and page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities and query client
│   │   └── pages/        # Route page components
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Data storage abstraction
│   └── vite.ts       # Vite dev server integration
├── shared/           # Shared code between frontend/backend
│   └── schema.ts     # Database schemas and types
└── migrations/       # Drizzle database migrations
```

### Build and Development
- **Development**: Vite dev server with Express middleware integration
- **Production Build**: esbuild for server bundling, Vite for client bundling
- **Output**: `dist/` directory with `index.cjs` (server) and `public/` (client assets)

## External Dependencies

### Database
- **PostgreSQL**: Primary database (configured via DATABASE_URL environment variable)
- **Drizzle Kit**: Database migration and schema push tool (`npm run db:push`)

### UI Framework
- **Radix UI**: Headless component primitives for accessibility
- **shadcn/ui**: Pre-built component implementations using Radix
- **Lucide React**: Icon library
- **react-icons**: Additional icon sets (social media icons)

### Form and Validation
- **Zod**: Schema validation for both frontend forms and API requests
- **React Hook Form**: Form state management and validation integration
- **@hookform/resolvers**: Zod resolver for React Hook Form

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **tailwind-merge**: Intelligent class merging

### Development Tools
- **Replit Plugins**: Runtime error overlay, cartographer, and dev banner for Replit environment
- **TypeScript**: Strict type checking across the entire codebase