var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_http = __toESM(require("http"), 1);
var import_ws = require("ws");
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var aiClient = null;
function getAIClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY process variable is not set. Please configure it in your Secrets / Settings.");
    }
    aiClient = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
app.post("/api/gemini/command", async (req, res) => {
  const { prompt, currentSceneDescription } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "No prompt provided" });
  }
  try {
    const ai = getAIClient();
    const systemInstruction = `You are a 3D modeling and three.js scripting expert integrated into "Blender Web", a fully featured 3D web modeler.
Your job is to translate human language requests (e.g. "Create a planetary solar system", "Scatter 5 trees", "Add a red torus on top of a yellow cylinder") into a clear sequence of JSON commands that build, edit, or adjust 3D geometry and lights in our editor.

Current state of the 3D grid and scene contains: ${currentSceneDescription || "Only defaults (Camera, Grid, Ambient Light)"}

You MUST follow these rules:
1. Always respond in valid JSON format matching the schema requested below.
2. Coordinate space is standard ThreeJS/OpenGL:
   - Ground is at Y = 0 (an infinite horizontal grid).
   - X is left/right positive-right, Y is up/down positive-up, Z is front/back positive-back.
   - The interactive viewport typically has a 20x20 grid helper. Try to place objects within standard boundaries (e.g. -10 <= X, Z <= 10; 0 <= Y <= 8).
3. The available object types are:
   - "cube": rectangular prism (default size 1x1x1)
   - "sphere": round sphere (default radius 0.5)
   - "cylinder": cylinder oriented vertically (default radius 0.5, height 1)
   - "cone": cone pointed upwards (default radius 0.5, height 1)
   - "torus": donut shape (default radius 0.4, tube radius 0.15)
   - "plane": standard horizontal or vertical quad (default scale 1x1)
   - "pointlight": omnidirectional light source (default intensity 1, color white)
   - "directionallight": directional light casting orthographic rays down
4. Transform values:
   - "position": [X, Y, Z] as numbers. If placing on the grid, make Y = scaleY / 2 so it stands exactly on the ground, not sinking.
   - "rotation": [degX, degY, degZ] angle in DEGREES (e.g. [0, 45, 90]). We convert them to radians on the client.
   - "scale": [scaleX, scaleY, scaleZ] as numbers. Defaults are [1, 1, 1].
5. Materials:
   - "color": hex color code e.g. "#12f456"
   - "roughness": number between 0.0 (mirror-like shiny) and 1.0 (dead matte)
   - "metalness": number between 0.0 (non-metallic plastic) and 1.0 (metallic gold/steel)
   - "intensity": number (only used for light objects, representing strength)`;
    const schema = {
      type: import_genai.Type.OBJECT,
      properties: {
        explanation: {
          type: import_genai.Type.STRING,
          description: "Friendly high-level explanation of what the AI assistant is adding/changing."
        },
        commands: {
          type: import_genai.Type.ARRAY,
          description: "Array of modeling commands to execute on the viewport.",
          items: {
            type: import_genai.Type.OBJECT,
            properties: {
              action: {
                type: import_genai.Type.STRING,
                description: "The action to execute: 'add' (create a new mesh/light), 'update' (modify existing items by name) or 'delete' (remove items by name)."
              },
              type: {
                type: import_genai.Type.STRING,
                description: "Unique item type. Must be 'cube', 'sphere', 'cylinder', 'cone', 'torus', 'plane', 'pointlight', or 'directionallight'."
              },
              name: {
                type: import_genai.Type.STRING,
                description: "Unique identifier for this item (e.g. 'Sun Light', 'Tree TreeTrunk 1', 'Main Ground'). Used for selection and animation hierarchy."
              },
              position: {
                type: import_genai.Type.ARRAY,
                items: { type: import_genai.Type.NUMBER },
                description: "Array of [X, Y, Z] relative coordinates."
              },
              rotation: {
                type: import_genai.Type.ARRAY,
                items: { type: import_genai.Type.NUMBER },
                description: "Array of X, Y, Z rotational degrees [0-360]."
              },
              scale: {
                type: import_genai.Type.ARRAY,
                items: { type: import_genai.Type.NUMBER },
                description: "Array of [X, Y, Z] scale multipliers, default [1, 1, 1]."
              },
              color: {
                type: import_genai.Type.STRING,
                description: "Color hexadecimal string e.g. '#25b4fa' or '#eaeaea'. Default is white."
              },
              roughness: {
                type: import_genai.Type.NUMBER,
                description: "Material metal roughness preset [0.0 to 1.0]."
              },
              metalness: {
                type: import_genai.Type.NUMBER,
                description: "Material metallic finish [0.0 to 1.0]."
              },
              intensity: {
                type: import_genai.Type.NUMBER,
                description: "Lighting strength factor (only for lights, default is 1.0)."
              }
            },
            required: ["action", "type", "name", "position"]
          }
        }
      },
      required: ["explanation", "commands"]
    };
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate 3D commands for this prompt: "${prompt}". Ensure they complement or extend: "${currentSceneDescription || "Empty Canvas"}".`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    const bodyText = response.text || "{}";
    res.json(JSON.parse(bodyText.trim()));
  } catch (err) {
    console.error("Gemini model execution failed:", err);
    res.status(500).json({ error: err.message || "Internal server generative parsing error." });
  }
});
app.post("/api/gemini/material", async (req, res) => {
  const { materialPrompt, currentObjectName } = req.body;
  if (!materialPrompt) {
    return res.status(400).json({ error: "No shader style specified." });
  }
  try {
    const ai = getAIClient();
    const systemInstruction = `You are a material rendering expert for ThreeJS / Blender shaders.
Your task is to translate a description of a surface look or physical material (e.g. "Shiny Gold", "Aged rusted cooper", "Cyberpunk neon glow", "Mirror glass", "Charcoal rock") into clean physical parameters.

Return a JSON object conforming exactly to this structure:
{
  "color": "Hex string representing diffuse/albedo color e.g. '#ffcc00'",
  "roughness": number between 0.00 and 1.00 (rough vs smooth specular),
  "metalness": number between 0.00 and 1.00 (metal vs dielectric insulation),
  "emissive": "Hex string for glowing emission, e.g. '#000000' if no glow, or match glow color",
  "wireframe": boolean (true if outline wireframe wire view is described),
  "explanation": "One line explanation of how this material representation aligns to standard PBR shader properties."
}`;
    const schema = {
      type: import_genai.Type.OBJECT,
      properties: {
        color: { type: import_genai.Type.STRING, description: "Diffuse hex color e.g. '#c5a059' or '#0d0d0d'" },
        roughness: { type: import_genai.Type.NUMBER, description: "Surface roughness [0-1]" },
        metalness: { type: import_genai.Type.NUMBER, description: "Surface reflectivity metalness [0-1]" },
        emissive: { type: import_genai.Type.STRING, description: "Surface self-illumination glow color or '#000000'" },
        wireframe: { type: import_genai.Type.BOOLEAN, description: "Is wire mesh render mode requested" },
        explanation: { type: import_genai.Type.STRING, description: "High-level summary of the PBR parameters applied." }
      },
      required: ["color", "roughness", "metalness", "emissive", "wireframe", "explanation"]
    };
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Design 3D Material parameters for object "${currentObjectName || "Selected"}" to look like: "${materialPrompt}".`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    const bodyText = response.text || "{}";
    res.json(JSON.parse(bodyText.trim()));
  } catch (err) {
    console.error("Gemini material generation failed:", err);
    res.status(500).json({ error: err.message || "Material shader generation failed." });
  }
});
var sceneObjectsState = [
  {
    id: "sky-directional-light",
    name: "Sun Light",
    type: "directionallight",
    position: { x: 5, y: 8, z: 5 },
    rotation: { x: -45, y: 45, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    color: "#ffffff",
    roughness: 1,
    metalness: 0,
    emissive: "#000000",
    wireframe: false,
    intensity: 1.2,
    visible: true,
    locked: false
  },
  {
    id: "point-glow-light",
    name: "Point Light",
    type: "pointlight",
    position: { x: -2, y: 3, z: 2 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    color: "#ffe0b2",
    roughness: 1,
    metalness: 0,
    emissive: "#000000",
    wireframe: false,
    intensity: 1,
    visible: true,
    locked: false
  },
  {
    id: "default-cube-id",
    name: "Cube",
    type: "cube",
    position: { x: 0, y: 0.5, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    color: "#9ca3af",
    roughness: 0.5,
    metalness: 0.1,
    emissive: "#000000",
    wireframe: false,
    intensity: 1,
    visible: true,
    locked: false
  }
];
var keyframesState = [];
var connectedUsers = /* @__PURE__ */ new Map();
var DESIGNER_NAMES = [
  "Sculptor Neo",
  "Vertices Pro",
  "Render Guru",
  "Vector Chef",
  "Polygon Ace",
  "Shading Master",
  "Keyframe Sage",
  "Grid Carver"
];
var DESIGNER_COLORS = [
  "#f97316",
  // Orange
  "#3b82f6",
  // Blue
  "#10b981",
  // Green
  "#a855f7",
  // Purple
  "#ec4899",
  // Pink
  "#eab308",
  // Yellow
  "#06b6d4"
  // Cyan
];
function broadcastPresence() {
  const usersList = Array.from(connectedUsers.values()).map((u) => ({
    id: u.id,
    name: u.name,
    color: u.color,
    selectedObjectId: u.selectedObjectId
  }));
  const payload = JSON.stringify({
    type: "presence:sync",
    users: usersList
  });
  for (const user of connectedUsers.values()) {
    if (user.ws.readyState === import_ws.WebSocket.OPEN) {
      user.ws.send(payload);
    }
  }
}
function broadcastToOthers(senderId, payloadStr) {
  for (const [id, user] of connectedUsers.entries()) {
    if (id !== senderId && user.ws.readyState === import_ws.WebSocket.OPEN) {
      user.ws.send(payloadStr);
    }
  }
}
function broadcastToAll(payloadStr) {
  for (const user of connectedUsers.values()) {
    if (user.ws.readyState === import_ws.WebSocket.OPEN) {
      user.ws.send(payloadStr);
    }
  }
}
app.get("/api/scene", (req, res) => {
  res.json({ sceneObjects: sceneObjectsState, keyframes: keyframesState });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  const server = import_http.default.createServer(app);
  const wss = new import_ws.WebSocketServer({ server });
  wss.on("connection", (ws) => {
    const userId = "user_" + Math.random().toString(36).substring(2, 9);
    const chosenName = DESIGNER_NAMES[Math.floor(Math.random() * DESIGNER_NAMES.length)] + " #" + Math.floor(Math.random() * 100);
    const chosenColor = DESIGNER_COLORS[Math.floor(Math.random() * DESIGNER_COLORS.length)];
    const newUser = {
      id: userId,
      name: chosenName,
      color: chosenColor,
      selectedObjectId: null,
      ws
    };
    connectedUsers.set(userId, newUser);
    console.log(`[WS Connection] Joined ${chosenName} (ID: ${userId})`);
    ws.send(JSON.stringify({
      type: "welcome",
      profile: {
        id: userId,
        name: chosenName,
        color: chosenColor
      }
    }));
    ws.send(JSON.stringify({
      type: "init",
      sceneObjects: sceneObjectsState,
      keyframes: keyframesState
    }));
    broadcastToOthers(userId, JSON.stringify({
      type: "chat:message",
      id: "joined_" + userId,
      sender: "system",
      text: `${chosenName} joined the collaborative workspace.`,
      timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }));
    broadcastPresence();
    ws.on("message", (rawMessage) => {
      try {
        const message = JSON.parse(rawMessage);
        switch (message.type) {
          case "scene:update": {
            if (Array.isArray(message.sceneObjects)) {
              sceneObjectsState = message.sceneObjects;
            }
            if (Array.isArray(message.keyframes)) {
              keyframesState = message.keyframes;
            }
            broadcastToOthers(userId, JSON.stringify({
              type: "scene:sync",
              sceneObjects: sceneObjectsState,
              keyframes: keyframesState,
              senderId: userId
            }));
            break;
          }
          case "presence:update": {
            if (newUser) {
              newUser.selectedObjectId = message.selectedObjectId ?? null;
              broadcastPresence();
            }
            break;
          }
          case "chat:sendMessage": {
            if (message.text) {
              const chatMsg = JSON.stringify({
                type: "chat:message",
                id: Math.random().toString(36).substring(2, 9),
                sender: "user",
                senderName: chosenName,
                senderColor: chosenColor,
                text: message.text,
                timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              });
              broadcastToAll(chatMsg);
            }
            break;
          }
          default:
            break;
        }
      } catch (err) {
        console.error("Error parsing WebSocket packet:", err);
      }
    });
    ws.on("close", () => {
      connectedUsers.delete(userId);
      console.log(`[WS Connection] Left ${chosenName} (ID: ${userId})`);
      broadcastToOthers(userId, JSON.stringify({
        type: "chat:message",
        id: "left_" + userId,
        sender: "system",
        text: `${chosenName} left the workspace.`,
        timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }));
      broadcastPresence();
    });
  });
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Blender Web server active at http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
