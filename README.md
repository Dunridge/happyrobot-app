
# HappyRobot test app 

A real-time collaborative task management system that allows users to create and manage multiple projects, add tasks with dependencies, and comment on tasks with instant updates across all clients. The frontend and backend are built with Next.js (App Router) using TypeScript and Tailwind CSS, providing a fast, type-safe, and responsive user experience. PostgreSQL serves as the database, storing projects, tasks, and comments efficiently, including flexible JSON fields for metadata and configuration. Real-time collaboration is enabled through WebSockets, allowing updates to tasks, status changes, and comments to be broadcast instantly to all connected clients. The system is designed to handle large datasets efficiently, supports optimistic UI updates, and can scale over time with minimal latency while maintaining data consistency.

Stack: 
1. Frontend – Next.js (App Router)
2. Backend – Next.js API routes
3. Database – PostgreSQL
4. Real-time updates – WebSockets