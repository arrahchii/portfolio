# replit.md

## Overview

This is an AI-powered portfolio website for Lance Cabanit featuring an interactive digital twin chatbot. The application combines a modern React frontend with an Express.js backend to create an engaging, conversational portfolio experience. Users can interact with an AI assistant that represents Lance's professional persona, answering questions about skills, projects, experience, and availability. The design emphasizes clean aesthetics with interactive elements and smooth user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, accessible UI components
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and API interaction
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript for the REST API server
- **AI Integration**: OpenAI API for conversational AI capabilities through a digital twin service
- **Session Management**: In-memory storage with session-based chat history tracking
- **API Design**: RESTful endpoints with structured error handling and request validation using Zod schemas

### Data Storage Solutions
- **Database**: PostgreSQL configured via Drizzle ORM with planned schema for users and chat messages
- **Current Implementation**: In-memory storage (MemStorage) for development with database migration path ready
- **Schema**: Defined tables for users, chat messages with support for conversation sessions and metadata

### Authentication and Authorization
- **Current State**: Basic user schema defined but authentication not yet implemented
- **Planned**: Session-based authentication with user management capabilities

### External Dependencies
- **OpenAI API**: Powers the conversational AI features through the digital twin service
- **Neon Database**: PostgreSQL hosting service for production data persistence
- **Radix UI**: Provides accessible, unstyled components as foundation for the design system
- **Development Tools**: ESBuild for server bundling, PostCSS for CSS processing, and TypeScript for type checking

### Key Design Patterns
- **Component Composition**: Modular React components with clear separation of concerns
- **Custom Hooks**: Abstracted logic for chat functionality and API interactions
- **Service Layer**: Dedicated AI service for handling OpenAI integration and response generation
- **Storage Abstraction**: Interface-based storage layer allowing easy swapping between in-memory and database implementations
- **Error Boundaries**: Comprehensive error handling with user-friendly feedback mechanisms

The architecture supports both development and production environments with hot reloading, optimized builds, and scalable deployment patterns. The chat interface includes features like quick questions, typing indicators, and conversation history for enhanced user experience.