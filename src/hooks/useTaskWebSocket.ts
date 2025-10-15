import { useEffect, useRef } from "react";

type WSMessage = {
  type: "task-updated" | "new-comment" | "task-deleted";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
};

export function useTaskWebSocket(
  taskId: string,
  onMessage: (msg: WSMessage) => void
) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!taskId) return;

    const ws = new WebSocket(`ws://localhost:3001/?taskId=${taskId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Connected to project WebSocket:", taskId);
    };

    ws.onmessage = (event) => {
      try {
        const data: WSMessage = JSON.parse(event.data);
        onMessage(data);
      } catch (err) {
        console.error("Failed to parse WS message:", err);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, [taskId, onMessage]);

  return wsRef;
}
