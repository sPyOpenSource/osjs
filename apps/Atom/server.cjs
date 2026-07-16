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
var import_http = __toESM(require("http"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_ws = require("ws");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var apiKey = process.env.GEMINI_API_KEY;
var aiClient = null;
function getGeminiClient() {
  if (!aiClient) {
    if (!apiKey) {
      console.warn("Warning: GEMINI_API_KEY is null or undefined. AI features will respond with simulated guidance.");
    }
    aiClient = new import_genai.GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
app.post("/api/copilot/chat", async (req, res) => {
  const { messages, currentFile, codeSelection } = req.body;
  try {
    if (!apiKey) {
      const lastMsg = messages[messages.length - 1]?.content || "";
      let responseText = '### \u269B\uFE0F Atom Assistant (Offline Mode)\n\nTo enable real Gemini powered responses, please click **Settings -> Secrets** to configure your `GEMINI_API_KEY` environment variable.\n\nHere is a mock analysis of your request: *"' + lastMsg.substring(0, 100) + "\"*\n\n```javascript\n// Under active offline mode, you can read and write files\nconsole.log('Atom Core Online!');\n```";
      return res.json({ text: responseText });
    }
    const ai = getGeminiClient();
    const systemInstruction = "You are the built-in AI Copilot backend for the Atom IDE clone. Help the user edit, write, optimize, or review their code in a constructive, professional programmer style. Keep responses crisp and return formatted Markdown with proper code block language syntaxes (like javascript, html, typescript, etc.). Always take into account the current file name: " + (currentFile?.name || "none") + (currentFile ? " and its contents:\n```\n" + currentFile.content + "\n```\n" : "") + (codeSelection ? " The user has highlighted this specific code block or selection:\n```\n" + codeSelection + "\n```" : "");
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });
    res.json({ text: response.text });
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: err.message || "Internal assistant error" });
  }
});
app.post("/api/copilot/autofix", async (req, res) => {
  const { fileName, fileContent, errorDetails } = req.body;
  try {
    if (!apiKey) {
      return res.json({
        fixedCode: fileContent,
        explanation: "In offline mode, please configure `GEMINI_API_KEY` in the secrets panel to run automated hotfixes with Gemini."
      });
    }
    const ai = getGeminiClient();
    const prompt = `Fix the errors/issues described here: "${errorDetails}". 
    Below are the contents of the file named "${fileName}":
    \`\`\`
    ${fileContent}
    \`\`\`
    Analyze and output a JSON response containing the properties 'fixedCode' and 'explanation'. Do not wrap the JSON output in markdown blocks, just return pure JSON.`;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            fixedCode: { type: "STRING", description: "The updated, bug-free entire code of the file." },
            explanation: { type: "STRING", description: "A summary explaining what changes were made and why." }
          },
          required: ["fixedCode", "explanation"]
        }
      }
    });
    try {
      const resultObj = JSON.parse(response.text || "{}");
      res.json(resultObj);
    } catch (parseErr) {
      res.json({ fixedCode: fileContent, explanation: "Failed to parse API output, but contents were: " + response.text });
    }
  } catch (err) {
    console.error("Autofix Error:", err);
    res.status(500).json({ error: err.message || "An error occurred during auto-fixing." });
  }
});
function getGitHubHeaders(token) {
  return {
    "Authorization": `Bearer ${token}`,
    "User-Agent": "Atom-IDE-Clone",
    "Accept": "application/vnd.github.v3+json",
    "Content-Type": "application/json"
  };
}
app.get("/api/auth/github/url", (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const isConfigured = !!clientId && !!process.env.GITHUB_CLIENT_SECRET;
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers.host || "localhost:3000";
  const defaultAppUrl = `${protocol}://${host}`;
  const appUrl = (process.env.APP_URL || defaultAppUrl).replace(/\/$/, "");
  const redirectUri = `${appUrl}/auth/github/callback`;
  if (!isConfigured) {
    return res.json({
      configured: false,
      url: `/auth/github/callback?code=demo_auth_code_98765`,
      redirectUri
    });
  }
  const state = Math.random().toString(36).substring(2, 15);
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "repo,gist,read:user",
    state
  });
  res.json({
    configured: true,
    url: `https://github.com/login/oauth/authorize?${params.toString()}`,
    redirectUri
  });
});
app.get(["/auth/github/callback", "/auth/github/callback/"], async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send("No Auth Code received");
  }
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const isConfigured = !!clientId && !!clientSecret;
  let accessToken = "";
  let errorMsg = "";
  if (!isConfigured || code === "demo_auth_code_98765") {
    accessToken = "demo_mode_github_token_atom_999";
  } else {
    try {
      const response = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code
        })
      });
      if (!response.ok) {
        throw new Error(`GitHub token exchange status code: ${response.status}`);
      }
      const body = await response.json();
      if (body.error) {
        throw new Error(`GitHub OAuth error response: ${body.error_description || body.error}`);
      }
      accessToken = body.access_token;
    } catch (err) {
      console.error("Error exchanging GitHub auth code:", err);
      errorMsg = err.message || "OAuth exchange failed";
    }
  }
  if (errorMsg) {
    return res.send(`
      <html>
        <body style="font-family: system-ui, sans-serif; background: #1a1e24; color: #f43f5e; padding: 40px; text-align: center;">
          <div style="max-width: 480px; margin: 0 auto; background: #22272e; padding: 30px; border-radius: 8px; border: 1px solid #ff7b72; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
            <h2 style="margin-top:0;">\u26A0\uFE0F GitHub Connection Error</h2>
            <p style="color: #adbac7; line-height: 1.5; font-size: 14px;">${errorMsg}</p>
            <p style="color: #768390; font-size: 11px;">Make sure your Client ID and Client Secret match your GitHub Developer App configuration.</p>
            <button onclick="window.close()" style="background: #ff7b72; color: #1a1e24; border: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; cursor: pointer; margin-top: 15px;">
              Close Window
            </button>
          </div>
        </body>
      </html>
    `);
  }
  res.send(`
    <html>
      <body style="font-family: system-ui, sans-serif; background: #1a1e24; color: #57ab5a; padding: 40px; text-align: center;">
        <div style="max-width: 480px; margin: 0 auto; background: #22272e; padding: 30px; border-radius: 8px; border: 1px solid #347d39; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
          <div style="font-size: 40px; margin-bottom: 10px;">\u{1F419}</div>
          <h2 style="margin-top:0; color: #57ab5a;">\u269B\uFE0F GitHub Profile Connected</h2>
          <p style="color: #adbac7; line-height: 1.5; font-size: 14px;">Atom IDE clone successfully synchronized. Preparing your workspace views...</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({ 
                type: 'OAUTH_AUTH_SUCCESS', 
                token: '${accessToken}',
                isDemo: ${accessToken.startsWith("demo_mode_")}
              }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p style="color: #768390; font-size: 11px; margin-top: 20px;">You can safely close this window if it does not close automatically.</p>
        </div>
      </body>
    </html>
  `);
});
app.get("/api/github/user", async (req, res) => {
  const token = req.headers["x-github-token"] || "";
  if (!token) {
    return res.status(401).json({ error: "Missing GitHub access token" });
  }
  if (token.startsWith("demo_mode_")) {
    return res.json({
      login: "OctocatHacker",
      id: 583234,
      avatar_url: "https://github.githubassets.com/images/modules/logos_page/Octocat.png",
      html_url: "https://github.com/github/octocat",
      name: "Atom Sandbox User",
      company: "Atom Project",
      location: "San Francisco, CA",
      bio: "Crafting beautiful source editors for the web.",
      public_repos: 18,
      followers: 4122
    });
  }
  try {
    const response = await fetch("https://api.github.com/user", {
      headers: getGitHubHeaders(token)
    });
    if (!response.ok) {
      return res.status(response.status).json({ error: `GitHub API error: ${response.statusText}` });
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("User proxy error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch user profile" });
  }
});
app.get("/api/github/repos", async (req, res) => {
  const token = req.headers["x-github-token"] || "";
  if (!token) {
    return res.status(401).json({ error: "Missing GitHub access token" });
  }
  if (token.startsWith("demo_mode_")) {
    return res.json([
      { id: 101, name: "quantum-gravity-synthesizer", full_name: "OctocatHacker/quantum-gravity-synthesizer", description: "The central flux gravity vector module in classic ES6.", html_url: "https://github.com", updated_at: (/* @__PURE__ */ new Date()).toISOString() },
      { id: 102, name: "atom-ide-clones", full_name: "OctocatHacker/atom-ide-clones", description: "Breathtaking source codes mirroring beautiful traditional desktop editors.", html_url: "https://github.com", updated_at: (/* @__PURE__ */ new Date()).toISOString() },
      { id: 103, name: "react-sandbox-engine", full_name: "OctocatHacker/react-sandbox-engine", description: "Fast node development proxy running on sandboxed Cloud Run containers.", html_url: "https://github.com", updated_at: (/* @__PURE__ */ new Date()).toISOString() }
    ]);
  }
  try {
    const response = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated", {
      headers: getGitHubHeaders(token)
    });
    if (!response.ok) {
      return res.status(response.status).json({ error: `GitHub API error: ${response.statusText}` });
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Repos proxy error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch repositories" });
  }
});
app.post("/api/github/gists", async (req, res) => {
  const token = req.headers["x-github-token"] || "";
  if (!token) {
    return res.status(401).json({ error: "Missing GitHub access token" });
  }
  const { description, files, isPublic } = req.body;
  if (token.startsWith("demo_mode_")) {
    const fileNames = Object.keys(files || {});
    return res.json({
      html_url: "https://gist.github.com/mock-gist-url-sandbox",
      id: "mock-gist-id-xyz",
      description: description || "Gist published from Atom IDE",
      public: isPublic !== false,
      files: Object.fromEntries(fileNames.map((name) => [name, { filename: name, raw_url: "https://gist.githubusercontent.com/mock" }])),
      demo: true
    });
  }
  try {
    const response = await fetch("https://api.github.com/gists", {
      method: "POST",
      headers: getGitHubHeaders(token),
      body: JSON.stringify({
        description: description || "Gist published from Atom IDE Clone",
        public: isPublic !== false,
        files
      })
    });
    if (!response.ok) {
      const errMsg = await response.text();
      return res.status(response.status).json({ error: `GitHub API error: ${errMsg || response.statusText}` });
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Gist proxy error:", err);
    res.status(500).json({ error: err.message || "Failed to publish gist" });
  }
});
app.post("/api/github/push", async (req, res) => {
  const token = req.headers["x-github-token"] || "";
  if (!token) {
    return res.status(401).json({ error: "Missing GitHub access token" });
  }
  const { repo, path: path2, content, message, branch } = req.body;
  if (!repo || !path2 || content === void 0) {
    return res.status(400).json({ error: "Missing required push parameters (repo, path, content)" });
  }
  if (token.startsWith("demo_mode_")) {
    return res.json({
      success: true,
      commit: {
        sha: "cf83bc91a472b5368a15a81ca030d95681ca030d",
        html_url: `https://github.com/${repo}/commit/mock-commit-sha`,
        message: message || "Atom Web IDE push"
      },
      content: {
        name: path2.split("/").pop(),
        path: path2,
        html_url: `https://github.com/${repo}/blob/${branch || "main"}/${path2}`
      },
      demo: true
    });
  }
  try {
    const [owner, name] = repo.split("/");
    const headers = getGitHubHeaders(token);
    const cleanPath = path2.replace(/^\//, "");
    const checkUrl = `https://api.github.com/repos/${owner}/${name}/contents/${cleanPath}?ref=${branch || "main"}`;
    let sha;
    try {
      const checkRes = await fetch(checkUrl, { headers });
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (checkData && checkData.sha) {
          sha = checkData.sha;
        }
      }
    } catch (_) {
    }
    const base64Content = Buffer.from(content).toString("base64");
    const requestBody = {
      message: message || `Updated ${cleanPath} via Atom Web IDE`,
      content: base64Content,
      branch: branch || "main"
    };
    if (sha) {
      requestBody.sha = sha;
    }
    const putUrl = `https://api.github.com/repos/${owner}/${name}/contents/${cleanPath}`;
    const putRes = await fetch(putUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify(requestBody)
    });
    if (!putRes.ok) {
      const errorText = await putRes.text();
      return res.status(putRes.status).json({ error: `GitHub API error during push: ${errorText || putRes.statusText}` });
    }
    const data = await putRes.json();
    res.json({
      success: true,
      commit: data.commit,
      content: data.content
    });
  } catch (err) {
    console.error("Push proxy error:", err);
    res.status(500).json({ error: err.message || "Failed to commit and push file to GitHub" });
  }
});
var server = import_http.default.createServer(app);
var clientConnections = /* @__PURE__ */ new Map();
var wss = new import_ws.WebSocketServer({ noServer: true });
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
function broadcast(msg, excludeWs) {
  const json = JSON.stringify(msg);
  for (const client of clientConnections.keys()) {
    if (client !== excludeWs && client.readyState === import_ws.WebSocket.OPEN) {
      client.send(json);
    }
  }
}
wss.on("connection", (ws) => {
  const clientId = Math.random().toString(36).substring(2, 9);
  const pseudonyms = [
    "AdaLovelace",
    "GraceHopper",
    "LinusTorvalds",
    "TimBernersLee",
    "AlanTuring",
    "MargaretHamilton",
    "GuidoVanRossum",
    "SatoshiNakamoto",
    "DennisRitchie",
    "BjarneStroustrup",
    "KatherineJohnson",
    "JohnVonNeumann"
  ];
  const chosenName = pseudonyms[Math.floor(Math.random() * pseudonyms.length)] + `_${clientId}`;
  const niceColors = [
    "#ff5f56",
    "#ffbd2e",
    "#27c93f",
    "#61afef",
    "#c678dd",
    "#e5c07b",
    "#e06c75",
    "#56b6c2",
    "#98c379",
    "#f9826c"
  ];
  const chosenColor = niceColors[Math.floor(Math.random() * niceColors.length)];
  const clientState = {
    id: clientId,
    name: chosenName,
    color: chosenColor,
    filePath: null,
    cursor: null
  };
  clientConnections.set(ws, clientState);
  ws.send(JSON.stringify({
    type: "init",
    payload: {
      userId: clientId,
      users: Array.from(clientConnections.values())
    }
  }));
  broadcast({
    type: "user:join",
    payload: clientState
  }, ws);
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());
      switch (data.type) {
        case "user:update": {
          const state = clientConnections.get(ws);
          if (state) {
            Object.assign(state, data.payload);
            broadcast({
              type: "user:update",
              payload: state
            });
          }
          break;
        }
        case "file:change": {
          broadcast({
            type: "file:change",
            payload: {
              filePath: data.payload.filePath,
              content: data.payload.content,
              senderId: clientId
            }
          }, ws);
          break;
        }
        case "chat:message": {
          broadcast({
            type: "chat:message",
            payload: {
              sender: clientState.name,
              color: clientState.color,
              text: data.payload.text,
              timestamp: (/* @__PURE__ */ new Date()).toISOString()
            }
          });
          break;
        }
      }
    } catch (err) {
      console.error("Failed to parse incoming websocket action:", err);
    }
  });
  ws.on("close", () => {
    clientConnections.delete(ws);
    broadcast({
      type: "user:leave",
      payload: { id: clientId }
    });
  });
});
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("Vite dev middleware mounted.");
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
    console.log("Serving production build from dist.");
  }
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Atom Server listening at http://0.0.0.0:${PORT}`);
  });
}
start();
//# sourceMappingURL=server.cjs.map
