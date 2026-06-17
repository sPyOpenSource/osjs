import express from "express";
import path from "path";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

// Standard Types matching src/types.ts
interface PlacedStructure {
  id: string;
  type: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  active: boolean;
  angle?: number;
  lastFired?: number;
}

interface PlacedUnit {
  id: string;
  type: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  owner: 'PLAYER' | 'ENEMY';
  hp: number;
  maxHp: number;
  angle: number;
  lastFired: number;
  speed: number;
  damage: number;
  range: number;
  synthType: 'bullet' | 'laser' | 'tesla' | 'flame' | 'psychic';
  color: string;
  isKirov?: boolean;
}

interface Commander {
  id: string;
  name: string;
  faction: 'ALLIES' | 'SOVIETS' | 'YURI';
  cursorX: number;
  cursorY: number;
  connectedAt: string;
}

// Global server-authoritative state
let globalStructures: PlacedStructure[] = [
  {
    id: `placed_conyard_init_allies`,
    type: "allied_const",
    x: 13,
    y: 13,
    hp: 1000,
    maxHp: 1000,
    active: true,
  }
];

let globalUnits: PlacedUnit[] = [];

// Track active socket connections mapped to their Commander profiles
const socketCommanders = new Map<WebSocket, Commander>();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. HTTP Server setup
  const server = createServer(app);

  // 2. WebSocket Server setup
  const wss = new WebSocketServer({ noServer: true });

  // Handle upgrade manually to hook into same HTTP port 3000
  server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  });

  // Helper: Broadcast a message to all connected clients except (optionally) the sender
  const broadcast = (data: any, excludeSocket?: WebSocket) => {
    const rawPayload = JSON.stringify(data);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client !== excludeSocket) {
        client.send(rawPayload);
      }
    });
  };

  // WebSocket connection handler
  wss.on("connection", (ws: WebSocket) => {
    // Generate an initial random ID and profile for this joined Commander
    const clientId = `COM_${Math.floor(1000 + Math.random() * 9000)}`;
    const newCommander: Commander = {
      id: clientId,
      name: `Commander #${clientId.split('_')[1]}`,
      faction: 'ALLIES',
      cursorX: -1,
      cursorY: -1,
      connectedAt: new Date().toLocaleTimeString()
    };

    socketCommanders.set(ws, newCommander);

    // Send initial configuration payload to the new client
    ws.send(JSON.stringify({
      type: "init",
      payload: {
        commanderId: clientId,
        commanderName: newCommander.name,
        faction: newCommander.faction,
        structures: globalStructures,
        units: globalUnits,
        commanders: Array.from(socketCommanders.values())
      }
    }));

    // Broadcast that a new commander has synchronized
    broadcast({
      type: "commander_joined",
      payload: {
        id: clientId,
        name: newCommander.name,
        faction: newCommander.faction,
        commanders: Array.from(socketCommanders.values())
      }
    }, ws);

    // Recurrent keep-alive ping intervals are handled by ws library,
    // we also listen for specific message frames from client.
    ws.on("message", (messageStr: string) => {
      try {
        const data = JSON.parse(messageStr);
        const commander = socketCommanders.get(ws);
        if (!commander) return;

        switch (data.type) {
          case "update_profile": {
            const { name, faction } = data.payload;
            if (name) commander.name = name;
            if (faction) commander.faction = faction;
            // Broadcast the revised user list to all
            broadcast({
              type: "commanders_list_update",
              payload: Array.from(socketCommanders.values())
            });
            break;
          }

          case "cursor_move": {
            const { x, y } = data.payload;
            commander.cursorX = x;
            commander.cursorY = y;
            // Broadcast cursor positions to other client commanders
            broadcast({
              type: "commander_cursor",
              payload: {
                id: commander.id,
                name: commander.name,
                faction: commander.faction,
                x,
                y
              }
            }, ws);
            break;
          }

          case "place_structure": {
            const struct: PlacedStructure = data.payload;
            // Prevent duplicates using unique ID check
            if (!globalStructures.some(s => s.id === struct.id)) {
              globalStructures.push(struct);
            }
            broadcast({
              type: "place_structure",
              payload: { struct, commanderId: commander.id, commanderName: commander.name }
            }, ws);
            break;
          }

          case "sell_structure": {
            const { id } = data.payload;
            globalStructures = globalStructures.filter(s => s.id !== id);
            broadcast({
              type: "sell_structure",
              payload: { id, commanderId: commander.id, commanderName: commander.name }
            }, ws);
            break;
          }

          case "spawn_unit": {
            const unit: PlacedUnit = data.payload;
            if (!globalUnits.some(u => u.id === unit.id)) {
              globalUnits.push(unit);
            }
            broadcast({
              type: "spawn_unit",
              payload: { unit, commanderId: commander.id, commanderName: commander.name }
            }, ws);
            break;
          }

          case "move_unit": {
            const { id, targetX, targetY } = data.payload;
            // Update local memory representing moving state
            const unit = globalUnits.find(u => u.id === id);
            if (unit) {
              unit.targetX = targetX;
              unit.targetY = targetY;
            }
            broadcast({
              type: "move_unit",
              payload: { id, targetX, targetY }
            }, ws);
            break;
          }

          case "combat_event": {
            // Forward shooting lasers, bullet effects, tesla lightning to replicate actions across clients
            const { effect } = data.payload;
            broadcast({
              type: "combat_event",
              payload: { effect }
            }, ws);
            break;
          }

          case "unit_health_sync": {
            // Keep HP synchronized when combat fires
            const { updatedUnits, updatedStructures } = data.payload;
            if (updatedUnits) {
              // Merge survival/hp changes
              globalUnits = globalUnits.map(gu => {
                const match = updatedUnits.find((u: any) => u.id === gu.id);
                return match ? { ...gu, hp: match.hp } : gu;
              }).filter(gu => gu.hp > 0);
            }
            if (updatedStructures) {
              globalStructures = globalStructures.map(gs => {
                const match = updatedStructures.find((s: any) => s.id === gs.id);
                return match ? { ...gs, hp: match.hp } : gs;
              }).filter(gs => gs.hp > 0);
            }
            broadcast({
              type: "unit_health_sync",
              payload: { updatedUnits, updatedStructures }
            }, ws);
            break;
          }

          case "reset_battlefield": {
            const { faction: resetFaction } = data.payload;
            const cyId = resetFaction === 'ALLIES' ? 'allied_const' : resetFaction === 'SOVIETS' ? 'soviet_const' : 'yuri_const';
            globalUnits = [];
            globalStructures = [
              {
                id: `placed_conyard_${Date.now()}`,
                type: cyId,
                x: 13,
                y: 13,
                hp: 1000,
                maxHp: 1000,
                active: true,
              }
            ];
            broadcast({
              type: "reset_battlefield",
              payload: {
                structures: globalStructures,
                units: globalUnits,
                commanderName: commander.name,
                faction: resetFaction
              }
            }, ws);
            break;
          }

          case "chat_message": {
            const { message } = data.payload;
            broadcast({
              type: "chat_message",
              payload: {
                id: `chat_${Date.now()}`,
                sender: commander.name,
                faction: commander.faction,
                text: message,
                timestamp: new Date().toLocaleTimeString()
              }
            });
            break;
          }

          case "soundboard_trigger": {
            const { soundName, quote } = data.payload;
            broadcast({
              type: "soundboard_trigger",
              payload: {
                soundName,
                quote,
                sender: commander.name
              }
            }, ws);
            break;
          }
        }
      } catch (err) {
        console.error("Failed to parse websocket payload:", err);
      }
    });

    ws.on("close", () => {
      const commander = socketCommanders.get(ws);
      if (commander) {
        socketCommanders.delete(ws);
        broadcast({
          type: "commander_left",
          payload: {
            id: commander.id,
            name: commander.name,
            commanders: Array.from(socketCommanders.values())
          }
        });
      }
    });
  });

  // 3. Mount Vite Dev Server in development or serve static assets in production
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 4. Bind server to Port 3000
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`[RTS BACKEND SERVER] Running successfully on http://0.0.0.0:${PORT}`);
  });
}

startServer();
