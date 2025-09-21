# Overview

This is a NASA Mars Rover Gallery application that displays photos captured by Mars rovers (Curiosity, Opportunity, and Spirit). The application allows users to browse rover images by selecting different rovers, cameras, and Sol dates (Martian days). It features a modern, space-themed UI with photo galleries, detailed image modals, and statistics about rover missions.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system variables
- **Forms**: React Hook Form with Zod validation resolvers

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API with endpoints for rover photos, stats, and manifests
- **External API Integration**: NASA Mars Rover Photos API for fetching rover data
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Logging**: Custom request logging for API endpoints with response capture

## Data Storage
- **Database**: PostgreSQL configured with Drizzle ORM
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Neon Database serverless PostgreSQL
- **Storage Interface**: Abstracted storage layer with in-memory implementation for basic stats

## External Dependencies
- **NASA API**: Mars Rover Photos API for fetching rover images and manifests
- **Database**: Neon Database (PostgreSQL serverless)
- **UI Libraries**: Radix UI for accessible component primitives
- **Validation**: Zod for runtime type validation and schema definition
- **Date Handling**: date-fns for date manipulation and formatting
- **Development Tools**: Replit-specific Vite plugins for development environment

## Key Design Patterns
- **Shared Schema**: Common TypeScript types and Zod schemas in `/shared` directory
- **Component Composition**: Modular React components with clear separation of concerns
- **API Abstraction**: Centralized API client functions for consistent data fetching
- **Progressive Enhancement**: Mobile-responsive design with graceful fallbacks
- **Type Safety**: End-to-end TypeScript with strict type checking