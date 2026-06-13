import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

type Msg = { type: string; id?: string; payload?: unknown };

const MAX_MESSAGE_BYTES = 8_192;
const messageSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("ping"), id: z.string().uuid().optional() }).strict(),
  z.object({ type: z.literal("time"), id: z.string().uuid().optional() }).strict(),
  z.object({ type: z.literal("system"), id: z.string().uuid().optional() }).strict(),
  z.object({
    type: z.literal("echo"),
    id: z.string().uuid().optional(),
    payload: z.string().max(2_000),
  }).strict(),
]);

function handle(msg: Msg): Msg {
  switch (msg.type) {
    case "ping":
      return { type: "pong", id: msg.id, payload: { t: Date.now() } };
    case "time":
      return { type: "time", id: msg.id, payload: { iso: new Date().toISOString() } };
    case "echo":
      return { type: "echo", id: msg.id, payload: msg.payload };
    case "system":
      return {
        type: "system",
        id: msg.id,
        payload: {
          ua: "webOS Worker",
          status: "available",
        },
      };
    default:
      return { type: "error", id: msg.id, payload: { message: `unknown type: ${msg.type}` } };
  }
}

export const Route = createFileRoute("/api/ws")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (request.headers.get("Upgrade") !== "websocket") {
          return new Response("Expected WebSocket upgrade", { status: 426 });
        }

        const origin = request.headers.get("Origin");
        const requestUrl = new URL(request.url);
        if (!origin || new URL(origin).host !== requestUrl.host) {
          return new Response("Forbidden", { status: 403 });
        }

        // Cloudflare Workers WebSocketPair (available in workerd runtime).
        const WSPair = (globalThis as unknown as { WebSocketPair?: new () => Record<string, WebSocket> }).WebSocketPair;
        if (!WSPair) {
          return new Response("WebSockets not supported in this runtime", { status: 500 });
        }
        const pair = new WSPair();
        const client = pair[0];
        const server = pair[1] as WebSocket & { accept: () => void };

        server.accept();

        server.addEventListener("message", (event: MessageEvent) => {
          if (typeof event.data !== "string" || event.data.length > MAX_MESSAGE_BYTES) {
            server.send(JSON.stringify({ type: "error", payload: { message: "invalid message" } }));
            return;
          }

          try {
            const result = messageSchema.safeParse(JSON.parse(event.data));
            if (!result.success) {
              server.send(JSON.stringify({ type: "error", payload: { message: "invalid message" } }));
              return;
            }
            server.send(JSON.stringify(handle(result.data)));
          } catch {
            server.send(JSON.stringify({ type: "error", payload: { message: "invalid JSON" } }));
          }
        });

        server.send(
          JSON.stringify({ type: "welcome", payload: { message: "Connected to webOS backend" } }),
        );

        // Heartbeat
        const interval = setInterval(() => {
          try {
            server.send(JSON.stringify({ type: "tick", payload: { t: Date.now() } }));
          } catch {
            clearInterval(interval);
          }
        }, 5000);

        server.addEventListener("close", () => clearInterval(interval));

        return new Response(null, { status: 101, webSocket: client } as ResponseInit & { webSocket: WebSocket });
      },
    },
  },
});
