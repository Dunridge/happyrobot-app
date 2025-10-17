
# How to start 
1. `pnpm run build` -> `pnpm run dev` (runs on http://localhost:3000)
2. `node src/server/ws-server.js` (runs on http://localhost:3001)

# How to test 
1. Added a test endpoint to populate the database and test the population with 10k+ tasks: /api/projects/${projectId}/populate -> see the Populate button on the project page 

# Architecture Decisions

The system is designed with a modular separation between the frontend and backend. The frontend uses Next.js App Router with React for state management, while the backend is implemented via Next.js API routes. Real-time updates are handled through WebSockets, enabling low-latency communication and consistent state across all clients. The architecture is event-driven, ensuring scalability and maintainability as the system grows.

# Synchronization Strategy

Updates are transmitted as fine-grained events rather than full project payloads to minimize network overhead. The frontend applies optimistic UI updates, providing immediate feedback while the backend validates changes. In case of conflicts, a last-write-wins approach is used, with potential for CRDT-inspired strategies for collaborative editing scenarios. This ensures consistency while supporting real-time collaboration.

# Scaling Strategy

To efficiently handle large datasets, task lists are virtualized, allowing smooth rendering of 10,000+ tasks. Additional scaling measures include lazy loading, database indexing, and optional caching layers (e.g., Redis) for frequently accessed data. The system is designed to handle large project payloads without impacting client performance.

# Trade-offs

WebSockets vs SSE: WebSockets were chosen for lower latency, but they require more complex connection management.

Optimistic UI: Improves user experience but introduces additional logic for rollback in case of server-side validation failure.

Conflict resolution: Using last-write-wins simplifies implementation but may not handle complex collaborative edits perfectly.

# Technology Choices

Frontend: Next.js (App Router) with React for server-side rendering and state management.

Backend: Next.js API routes for handling project and task operations.

Database: PostgreSQL for structured storage of projects, tasks, and comments.

Real-time: WebSockets for low-latency updates and broadcast of fine-grained changes.

# Data Flow and Synchronization

Clients send small update payloads via WebSockets.

The backend validates and persists the updates in the database.

The server broadcasts the changes to all connected clients subscribed to the same project.

Clients update their local state optimistically and reconcile with server confirmation, ensuring consistency across all sessions.