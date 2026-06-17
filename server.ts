import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer, WebSocket } from "ws";

const app = express();
const server = http.createServer(app);
const PORT = 3000;

// Derive paths for ES modules support
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory server-authoritative state
interface RemotePlayer {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  dirX: number;
  dirY: number;
  angle: number;
  health: number;
  score: number;
  kills: number;
  currentWeaponIndex: number;
  isFiring: boolean;
  levelId: string;
  lastSeen: number;
}

const activePlayers = new Map<string, RemotePlayer>();
const socketRooms = new Map<WebSocket, string>(); // Keep track of each socket's assigned playerId

// Health-check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", activePlayers: activePlayers.size });
});

// Configure WebSocket Server
const wss = new WebSocketServer({ noServer: true });

// Attach WS upgrade to Express HTTP Server
server.on("upgrade", (request, socket, head) => {
  const pathname = new URL(request.url || "", `http://${request.headers.host}`).pathname;
  if (pathname === "/ws") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

// Broadcast helper
function broadcastToRoom(senderId: string, levelId: string, message: any) {
  const payload = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      const pId = socketRooms.get(client);
      if (pId && pId !== senderId) {
        const player = activePlayers.get(pId);
        if (player && player.levelId === levelId) {
          client.send(payload);
        }
      }
    }
  });
}

// Global broadcast
function broadcastAll(message: any) {
  const payload = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

wss.on("connection", (ws: WebSocket) => {
  let boundPlayerId: string | null = null;

  ws.on("message", (rawMessage: string) => {
    try {
      const data = JSON.parse(rawMessage);
      const { type, payload } = data;

      switch (type) {
        case "join": {
          const { id, name, color, x, y, dirX, dirY, angle, health, score, kills, currentWeaponIndex, levelId } = payload;
          boundPlayerId = id;
          socketRooms.set(ws, id);

          const newPlayer: RemotePlayer = {
            id,
            name: name || `Cybermarine-${Math.floor(Math.random() * 900 + 100)}`,
            color: color || "#22d3ee",
            x: x || 2.0,
            y: y || 2.0,
            dirX: dirX || 1.0,
            dirY: dirY || 0.0,
            angle: angle || 0.0,
            health: health ?? 100,
            score: score ?? 0,
            kills: kills ?? 0,
            currentWeaponIndex: currentWeaponIndex ?? 0,
            isFiring: false,
            levelId: levelId || "facility",
            lastSeen: Date.now(),
          };

          activePlayers.set(id, newPlayer);

          // 1. Tell the player they joined successfully and give them list of current players in their lobby
          const roomPlayers = Array.from(activePlayers.values()).filter(p => p.levelId === newPlayer.levelId);
          ws.send(JSON.stringify({
            type: "welcome",
            payload: {
              assignedId: id,
              players: roomPlayers,
            }
          }));

          // 2. Broadcast join event to everyone else in the same room
          broadcastToRoom(id, newPlayer.levelId, {
            type: "player:joined",
            payload: newPlayer
          });

          // 3. System chat notification
          broadcastToRoom(id, newPlayer.levelId, {
            type: "chat:message",
            payload: {
              sender: "SYSTEM",
              message: `${newPlayer.name} HAS INFILTRATED THE AREA`,
              color: "#38bdf8",
              isSystem: true,
            }
          });
          break;
        }

        case "update": {
          if (!boundPlayerId) return;
          const player = activePlayers.get(boundPlayerId);
          if (player) {
            // Update mutable fields safely
            const { x, y, dirX, dirY, angle, health, score, kills, currentWeaponIndex, isFiring } = payload;
            
            player.x = x ?? player.x;
            player.y = y ?? player.y;
            player.dirX = dirX ?? player.dirX;
            player.dirY = dirY ?? player.dirY;
            player.angle = angle ?? player.angle;
            player.health = health ?? player.health;
            player.score = score ?? player.score;
            player.kills = kills ?? player.kills;
            player.currentWeaponIndex = currentWeaponIndex ?? player.currentWeaponIndex;
            player.isFiring = isFiring ?? player.isFiring;
            player.lastSeen = Date.now();

            // Broadcast state update to everyone else in this client's level/room
            broadcastToRoom(boundPlayerId, player.levelId, {
              type: "player:updated",
              payload: player
            });
          }
          break;
        }

        case "room:change": {
          if (!boundPlayerId) return;
          const player = activePlayers.get(boundPlayerId);
          if (player) {
            const oldLevelId = player.levelId;
            const newLevelId = payload.levelId;
            
            if (oldLevelId !== newLevelId) {
              // Notify old room the player has departed
              broadcastToRoom(boundPlayerId, oldLevelId, {
                type: "player:left",
                payload: { id: boundPlayerId }
              });

              // Apply update
              player.levelId = newLevelId;
              player.x = payload.x ?? player.x;
              player.y = payload.y ?? player.y;
              player.angle = payload.angle ?? player.angle;

              // Force absolute sync with all active players in the new level room
              const roomPlayers = Array.from(activePlayers.values()).filter(p => p.levelId === newLevelId);
              ws.send(JSON.stringify({
                type: "welcome",
                payload: {
                  assignedId: boundPlayerId,
                  players: roomPlayers,
                }
              }));

              // Notify new room players of join
              broadcastToRoom(boundPlayerId, newLevelId, {
                type: "player:joined",
                payload: player
              });
            }
          }
          break;
        }

        case "fire": {
          if (!boundPlayerId) return;
          const player = activePlayers.get(boundPlayerId);
          if (player) {
            // Broadcast fire vector details for rendering weapon visual traces on other clients
            broadcastToRoom(boundPlayerId, player.levelId, {
              type: "player:fired",
              payload: {
                id: boundPlayerId,
                weaponId: payload.weaponId,
                originX: player.x,
                originY: player.y,
                angle: player.angle,
              }
            });
          }
          break;
        }

        case "chat:message": {
          if (!boundPlayerId) return;
          const player = activePlayers.get(boundPlayerId);
          if (player) {
            broadcastToRoom(boundPlayerId, player.levelId, {
              type: "chat:message",
              payload: {
                id: Math.random().toString(),
                sender: player.name,
                message: payload.message,
                color: player.color,
                isSystem: false,
              }
            });
            // Eco back to sender as confirmation
            ws.send(JSON.stringify({
              type: "chat:message",
              payload: {
                id: Math.random().toString(),
                sender: player.name,
                message: payload.message,
                color: player.color,
                isSystem: false,
              }
            }));
          }
          break;
        }

        case "pickup": {
          if (!boundPlayerId) return;
          const player = activePlayers.get(boundPlayerId);
          if (player) {
            // Synchronize pickup consumption across all co-op players
            broadcastToRoom(boundPlayerId, player.levelId, {
              type: "pickup:consumed",
              payload: {
                pickupId: payload.pickupId,
                collectedBy: player.name,
              }
            });
          }
          break;
        }
      }
    } catch (e) {
      console.error("WS Message Error:", e);
    }
  });

  ws.on("close", () => {
    if (boundPlayerId) {
      const player = activePlayers.get(boundPlayerId);
      if (player) {
        const levelId = player.levelId;
        const name = player.name;

        // Clean out memory
        activePlayers.delete(boundPlayerId);
        socketRooms.delete(ws);

        // Notify client peers
        broadcastToRoom(boundPlayerId, levelId, {
          type: "player:left",
          payload: { id: boundPlayerId }
        });

        broadcastToRoom(boundPlayerId, levelId, {
          type: "chat:message",
          payload: {
            sender: "SYSTEM",
            message: `${name} HAS OFFLINED`,
            color: "#ef4444",
            isSystem: true,
          }
        });
      }
    }
  });
});

// Setup Express dev middleware if not in production
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static files hosting
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`[Cyber Arena Engine] running co-op server on http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Critical server bootstrap error:", err);
});
