import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { WebSocketServer, WebSocket } from "ws";

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required but missing. Please configure it in the AI Studio Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Collaborative Room registry
  interface ClientConnection {
    ws: WebSocket;
    username: string;
  }

  interface RoomState {
    roomId: string;
    clients: ClientConnection[];
    chatHistory: { username: string; text: string; time: string }[];
    armyState: {
      townHall: number;
      plannedTroops: { [troopId: string]: number };
      plannedSpells: { [spellId: string]: number };
      plannedHeroes: { [heroId: string]: boolean };
      selectedBaseStyle: string;
      customGoal: string;
      playbookResult: any | null;
    };
    whiteboard: {
      lines: any[];
      markers: any[];
    };
  }

  const rooms: { [roomId: string]: RoomState } = {};

  app.use(express.json());

  // API Endpoints
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  app.get("/api/rooms", (req, res) => {
    const list = Object.entries(rooms).map(([id, state]) => ({
      roomId: id,
      memberCount: state.clients.length,
      members: state.clients.map(c => c.username),
      townHall: state.armyState.townHall,
      selectedBaseStyle: state.armyState.selectedBaseStyle
    }));
    res.json(list);
  });

  // Clash AI Strategist Playbook Endpoint
  app.post("/api/clash/tactic-advisor", async (req: express.Request, res: express.Response) => {
    try {
      const { townHall, baseStyle, armyDetails, customGoal } = req.body;

      if (!townHall || !baseStyle) {
        res.status(400).json({ error: "Missing required parameters: townHall and baseStyle" });
        return;
      }

      const client = getAiClient();
      
      const prompt = `You are a legendary Clash of Clans esports pro player and war general. 
Produce an expert-level tactical attack playbook for a player confronting this setup:
- Player Town Hall Level: ${townHall} (TH${townHall})
- Target Base Layout Grid Style: ${baseStyle}
- Army Composition Details: ${JSON.stringify(armyDetails || "Default customized general army")}
- Player's Custom Focus/Goal: ${customGoal || "3-Star War Attack Plan"}

Provide a highly concrete, practical, and step-by-step master strategy.`;

      const systemInstruction = `You are "CoC Tactician AI", an elite war strategist specialized in Clash of Clans.
Analyze the target Town Hall size, the base layout shape (e.g. Ring, Compartments, Diamond), and the player's troops.
Output a highly structured tactical execution plan in JSON form that details:
1. General recommended strategy name (e.g., "QC LaLoon", "Yeti Smash", "DragBat")
2. Phase 1: Funneling & Pre-attack (how to set up the boundary blockages so troops don't wander)
3. Phase 2: Main Charge & Entry (exact placement, angle of entry, Siege Machine deployment)
4. Phase 3: Cleanup & Spell management (how to manage spells like Rage, Freeze, Poison, Wardens Tomes)
5. Core threats and warnings (Single Infernos, Eagle Artillery targets, Clan Castle luring)`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          strategyName: {
            type: Type.STRING,
            description: "An catchy and standard CoC strategy name suited for this attack.",
          },
          overview: {
            type: Type.STRING,
            description: "Short high-level tactical justification on why this strategy counters this type of base layout.",
          },
          phase1Funnel: {
            type: Type.OBJECT,
            properties: {
              objective: { type: Type.STRING },
              stepByStep: { type: Type.ARRAY, items: { type: Type.STRING } },
              troopAllocation: { type: Type.STRING, description: "Which specific units to use for funneling." }
            },
            required: ["objective", "stepByStep", "troopAllocation"]
          },
          phase2Entry: {
            type: Type.OBJECT,
            properties: {
              entryAngle: { type: Type.STRING, description: "Clock position entry (e.g., 6 o'clock, 12 o'clock, or face-on)." },
              siegeUsage: { type: Type.STRING, description: "How to use the siege machine (e.g., Log Launcher, Flame Flinger)." },
              stepByStep: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["entryAngle", "siegeUsage", "stepByStep"]
          },
          phase3SpellsHeroes: {
            type: Type.OBJECT,
            properties: {
              spellTiming: { type: Type.STRING, description: "When to use pivotal spells (e.g., Freeze on Town Hall, Invisibility on Blimp)." },
              heroAbilities: { type: Type.STRING, description: "Crucial warden tome or royal champion ability triggers." },
              cleanupAction: { type: Type.STRING, description: "Instructions on deployment of cleanup troops." }
            },
            required: ["spellTiming", "heroAbilities", "cleanupAction"]
          },
          threatsAndCounters: {
            type: Type.OBJECT,
            properties: {
              clanCastle: { type: Type.STRING, description: "How to deal with defensive CC troops." },
              highThreatBuildings: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Top 2-3 target buildings that could ruin the attack." },
              backupPlan: { type: Type.STRING, description: "What to do if the main funnel fails or key hero dies early." }
            },
            required: ["clanCastle", "highThreatBuildings", "backupPlan"]
          }
        },
        required: [
          "strategyName",
          "overview",
          "phase1Funnel",
          "phase2Entry",
          "phase3SpellsHeroes",
          "threatsAndCounters"
        ]
      };

      const result = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema,
          temperature: 0.15,
        }
      });

      const responseText = result.text || "{}";
      const parsedData = JSON.parse(responseText.trim());
      res.json(parsedData);
    } catch (error: any) {
      console.error("Error in Clash Tactic Advisor API:", error);
      res.status(500).json({
        error: "Failed to compile the tactical playbook.",
        details: error.message || error
      });
    }
  });

  // Vite Integration for Assets & Routing
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Clash of Clans Tactics Server running at http://0.0.0.0:${PORT}`);
  });

  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws: WebSocket) => {
    let currentRoomId: string | null = null;
    let username = "Chief " + Math.floor(100 + Math.random() * 900);

    ws.on("message", (messageStr: string) => {
      try {
        const message = JSON.parse(messageStr);
        const { type } = message;

        if (type === "join") {
          const { roomId, requestedUsername } = message;
          if (!roomId) return;
          currentRoomId = roomId;
          if (requestedUsername) username = requestedUsername.trim();

          // Initialize room if it doesn't exist yet
          if (!rooms[roomId]) {
            rooms[roomId] = {
              roomId,
              clients: [],
              chatHistory: [
                { username: "System", text: `Welcome to Room "${roomId}". Connect with other clanmates to plan your battle tactics.`, time: new Date().toLocaleTimeString() }
              ],
              armyState: {
                townHall: 11,
                plannedTroops: {},
                plannedSpells: {},
                plannedHeroes: { barbarian_king: true, archer_queen: true, grand_warden: true, royal_champion: false },
                selectedBaseStyle: "compartment",
                customGoal: "Aim for standard 3-star CWL base attack.",
                playbookResult: null
              },
              whiteboard: {
                lines: [],
                markers: []
              }
            };
          }

          const room = rooms[roomId];
          
          // Check if already in room
          const exists = room.clients.some(c => c.ws === ws);
          if (!exists) {
            room.clients.push({ ws, username });
          }

          // Broadcast Join event to others in the same room
          const joinAnnouncement = {
            username: "System",
            text: `⚔️ ${username} joined the War Plan Room.`,
            time: new Date().toLocaleTimeString()
          };
          room.chatHistory.push(joinAnnouncement);

          // Return full initial room sync state to the new client
          ws.send(JSON.stringify({
            type: "init",
            state: {
              chatHistory: room.chatHistory,
              armyState: room.armyState,
              whiteboard: room.whiteboard,
              members: room.clients.map(c => c.username)
            }
          }));

          // Notify others
          room.clients.forEach(c => {
            if (c.ws !== ws && c.ws.readyState === WebSocket.OPEN) {
              c.ws.send(JSON.stringify({
                type: "memberJoined",
                username,
                chatHistory: room.chatHistory,
                members: room.clients.map(cl => cl.username)
              }));
            }
          });
        }

        else if (type === "chat") {
          if (!currentRoomId || !rooms[currentRoomId]) return;
          const room = rooms[currentRoomId];
          const chatMsg = {
            username,
            text: message.text,
            time: new Date().toLocaleTimeString()
          };
          room.chatHistory.push(chatMsg);
          if (room.chatHistory.length > 50) room.chatHistory.shift();

          // Broadcast to everyone in room
          const broadcastMsg = JSON.stringify({ type: "chat", message: chatMsg });
          room.clients.forEach(c => {
            if (c.ws.readyState === WebSocket.OPEN) {
              c.ws.send(broadcastMsg);
            }
          });
        }

        else if (type === "draw") {
          if (!currentRoomId || !rooms[currentRoomId]) return;
          const room = rooms[currentRoomId];
          const { drawingState } = message; // contains lines and markers
          if (drawingState) {
            room.whiteboard = drawingState;
            // Broadcast update to other clients in room
            const broadcastMsg = JSON.stringify({ type: "draw", drawingState });
            room.clients.forEach(c => {
              if (c.ws !== ws && c.ws.readyState === WebSocket.OPEN) {
                c.ws.send(broadcastMsg);
              }
            });
          }
        }

        else if (type === "updateArmy") {
          if (!currentRoomId || !rooms[currentRoomId]) return;
          const room = rooms[currentRoomId];
          const { armyState } = message;
          if (armyState) {
            room.armyState = { ...room.armyState, ...armyState };
            
            // Broadcast update to other clients
            const broadcastMsg = JSON.stringify({ type: "updateArmy", armyState: room.armyState });
            room.clients.forEach(c => {
              if (c.ws !== ws && c.ws.readyState === WebSocket.OPEN) {
                c.ws.send(broadcastMsg);
              }
            });
          }
        }

        else if (type === "clearWhiteboard") {
          if (!currentRoomId || !rooms[currentRoomId]) return;
          const room = rooms[currentRoomId];
          room.whiteboard = { lines: [], markers: [] };
          
          const broadcastMsg = JSON.stringify({ type: "clearWhiteboard" });
          room.clients.forEach(c => {
            if (c.ws.readyState === WebSocket.OPEN) {
              c.ws.send(broadcastMsg);
            }
          });
        }

      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    });

    ws.on("close", () => {
      if (currentRoomId && rooms[currentRoomId]) {
        const room = rooms[currentRoomId];
        room.clients = room.clients.filter(c => c.ws !== ws);
        
        // Broadcast leave log
        const leaveAnnouncement = {
          username: "System",
          text: `🛡️ ${username} departed the War Plan Room.`,
          time: new Date().toLocaleTimeString()
        };
        room.chatHistory.push(leaveAnnouncement);

        room.clients.forEach(c => {
          if (c.ws.readyState === WebSocket.OPEN) {
            c.ws.send(JSON.stringify({
              type: "memberLeft",
              username,
              chatHistory: room.chatHistory,
              members: room.clients.map(cl => cl.username)
            }));
          }
        });

        // Clean room if wholly vacant
        if (room.clients.length === 0) {
          delete rooms[currentRoomId];
        }
      }
    });
  });
}

startServer();
