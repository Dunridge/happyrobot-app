
# HappyRobot test app 

A real-time collaborative task management system that allows users to create and manage multiple projects, add tasks with dependencies, and comment on tasks with instant updates across all clients. The frontend and backend are built with Next.js (App Router) using TypeScript and Tailwind CSS, providing a fast, type-safe, and responsive user experience. PostgreSQL serves as the database, storing projects, tasks, and comments efficiently, including flexible JSON fields for metadata and configuration. Real-time collaboration is enabled through WebSockets, allowing updates to tasks, status changes, and comments to be broadcast instantly to all connected clients. The system is designed to handle large datasets efficiently, supports optimistic UI updates, and can scale over time with minimal latency while maintaining data consistency.

Stack: 
1. Frontend – Next.js (App Router)
2. Backend – Next.js API routes
3. Database – PostgreSQL
4. Real-time updates – WebSockets


# Collaborative Task Management System - Project Brief

## Objectives
- Users can create multiple projects
- Users can add, update, and delete tasks within projects
- Support for task dependencies and status transitions
- Comment threads on tasks with real-time updates
- Changes made by one client should be visible to all other clients in near real-time
- Your app should maintain consistency across clients
- No usage of Firebase, Supabase, or other managed real-time DBs

## Constraints
- Assume Project payloads will eventually be large (2MB+)
- You must be efficient in how updates are transmitted (avoid resending entire projects)
- You are free to use tools like WebSockets, server-sent events, polling, etc.
- You may use any frontend/backend framework or language, but your reasoning should be clear

### Preferred Stack
- **Frontend:** Next.js (App Router preferred) OR vanilla React with Go backend
- **Backend:** Next.js API routes OR Go services

## Bonus Points (Optional)
- Undo/Redo functionality
- Operational Transform or CRDT-inspired approach
- Event-based backend (e.g., append-only event log or message queue)
- Clear domain model
- Type-safe API contract between frontend/backend
- Optimistic UI updates with rollback on failure
- Database transactions for complex operations
- Caching strategy (Redis, in-memory, etc.)
- Rate limiting and backpressure handling

## Extended Challenges (Choose One or More)

### Option 1: Performance & Scale
- Virtual scrolling for 10,000+ tasks
- Lazy loading with pagination/cursor
- Database indexing strategy
- Load testing results (include scripts)

### Option 2: Advanced Collaboration
- User presence indicators (who's viewing what)
- Live cursors/selection sharing
- Collaborative text editing in descriptions
- Activity feed with real-time notifications
- @mentions with notifications

### Option 3: Developer Experience
- Comprehensive test suite (unit, integration, e2e)
- CI/CD pipeline configuration
- API documentation (Swagger/OpenAPI)
- Database migrations and seeding

### Option 4: Open-Ended Extension
- Build something innovative with this system. Examples:
  - AI-powered task suggestions or auto-categorization
  - Kanban/Gantt view with drag-and-drop
  - Time tracking and analytics dashboard
  - Integration with external services (GitHub, Slack, etc.)
  - Mobile-responsive PWA with offline support
  - Your own creative feature that showcases your strengths

## Deliverables

1. **GitHub Repository**
   - Private repo with your solution
   - Invite `carlos-happyrobot`, `joaquinllopez00` to the repo
   - Working frontend and backend
   - Setup instructions (ideally Dockerized or minimal install)
   - Short README covering:
     - Architecture decisions
     - How you handle sync
     - How you'd scale the system over time
     - Any tradeoffs you made
     - Technology choices and justifications
     - Data flow and synchronization strategy

2. **Demo Video (~5 minutes)**
   - Explain what you've built and walk through your code
   - Live demo of features
   - Architecture walkthrough
   - Code highlights
   - Challenges faced and solutions
