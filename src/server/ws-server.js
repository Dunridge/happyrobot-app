import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import url from "url";

const app = express();
app.use(express.json());

const taskConnections = new Map();

const wss = new WebSocketServer({ noServer: true });

function getTaskIdFromRequest(req) {
  if (!req.url) return null;
  const parsed = url.parse(req.url, true);
  return parsed.query.taskId || null;
}

wss.on("connection", (ws, req) => {
  const taskId = getTaskIdFromRequest(req);
  if (!taskId) {
    ws.close(1008, "Missing taskId");
    return;
  }

  if (!taskConnections.has(taskId)) taskConnections.set(taskId, new Set());
  taskConnections.get(taskId).add(ws);

  console.log(
    `WS connected: ${taskId}, total: ${taskConnections.get(taskId).size}`
  );

  ws.on("close", () => {
    taskConnections.get(taskId).delete(ws);
    console.log(
      `WS disconnected: ${taskId}, remaining: ${
        taskConnections.get(taskId).size
      }`
    );
  });
});

app.post("/broadcast", (req, res) => {
  const { taskId, data } = req.body;
  const conns = taskConnections.get(taskId);
  if (!conns || conns.size === 0) {
    return res.status(404).send("No active connections for this task");
  }

  const msg = JSON.stringify(data);
  conns.forEach((ws) => ws.send(msg));
  res.send("Broadcast sent");
});

const server = createServer(app);

server.on("upgrade", (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});

server.listen(3001, () => {
  console.log("✅ WS + broadcast server running on port 3001");
});

const broadcastToTask = (taskId, data) => {
  const conns = taskConnections.get(taskId);
  if (!conns) return;
  const msg = JSON.stringify(data);
  conns.forEach((ws) => ws.send(msg));
};

export { broadcastToTask };
export default wss;
