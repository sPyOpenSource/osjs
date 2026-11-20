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
var import_ws = require("ws");
var import_vite = require("vite");

// src/data.ts
var INITIAL_VIDEOS = [
  {
    id: "sintel",
    title: "Sintel - Epic Fantasy CGI Masterpiece (Official WebTorrent)",
    description: "Sintel is an independently produced short film, initiated by the Blender Foundation as a means to improve the open source 3D creation suite Blender. It is an epic fantasy story about a girl named Sintel who rescues and forms an unbreakable bond with a baby dragon she names Scales. When Scales is kidnapped, she embarks on a dangerous lifelong journey to find him.",
    magnetUrl: "magnet:?xt=urn:btih:08ada5a7a6183aae1e09d8311128d975522b1f87&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A6969&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com",
    category: "Animation",
    uploader: "Blender Foundation",
    uploaderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    views: 1482049,
    duration: "14:48",
    uploadedAt: "2 years ago",
    thumbnailUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
    comments: [
      {
        id: "c1",
        author: "P2P_Enthusiast_99",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
        content: "Still the best showcase of WebTorrent tech. It streamed instantly in under 3 seconds! 0 buffer, 100% peer sharing.",
        timestamp: "5 days ago",
        likes: 42
      },
      {
        id: "c2",
        author: "CGI_Artist_Sam",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        content: "Blender did an absolute stellar job on Sintel. The emotional ending hits hard every time. Outstanding textures and modeling.",
        timestamp: "1 week ago",
        likes: 19
      },
      {
        id: "c3",
        author: "CryptoSwarms",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80",
        content: "WebTorrent + WebRTC is literally the future of content distribution. This eliminates expensive central server hostings entirely.",
        timestamp: "3 weeks ago",
        likes: 12
      }
    ]
  },
  {
    id: "big-buck-bunny",
    title: "Big Buck Bunny - Animated Slapstick Comedy",
    description: "Big Buck Bunny tells the story of a giant, adorable forest rabbit whose quiet, harmonious day is rudely interrupted by three bullying woodland rodents. They mock him, throw fruit at him, and ruin his garden. Inspired to seek revenge, the gentle giant constructs a series of highly creative and comical forest traps to teach the bullies a lesson.",
    magnetUrl: "magnet:?xt=urn:btih:dd8255ecdc7ca33fb0bdf81323d84062ef7317d2&dn=Big+Buck+Bunny&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A6969&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com",
    category: "Comedy",
    uploader: "Peach Open Movie Project",
    uploaderAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    views: 924855,
    duration: "9:56",
    uploadedAt: "1 year ago",
    thumbnailUrl: "https://images.unsplash.com/photo-1590691566903-692bf52c283a?w=600&auto=format&fit=crop&q=80",
    comments: [
      {
        id: "cc1",
        author: "Nostalgic_Coder",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        content: "What a classic bunny! I remember downloading this as a raw AVI file 15 years ago. Running it over direct browser peers is insane.",
        timestamp: "2 months ago",
        likes: 31
      },
      {
        id: "cc2",
        author: "P2P_Speedster",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
        content: "Streaming speed is reaching 8.4 MB/s! WebRTC is cooking on this torrent right now.",
        timestamp: "3 weeks ago",
        likes: 8
      }
    ]
  },
  {
    id: "tears-of-steel",
    title: "Tears of Steel - Science Fiction VFX Showcase",
    description: "Tears of Steel was created in Amsterdam to explore open-source pipeline VFX tools within Blender. It presents an alternate science-fiction reality in a futuristic Amsterdam, where a team of brilliant scientists has set up a massive control station in the old Oude Kerk to stop a violent rebellion of giant mechanical robots.",
    magnetUrl: "magnet:?xt=urn:btih:20e24cc0438e5b2298aef3e1ef27a087e5b28d05&dn=Tears+of+Steel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A6969&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com",
    category: "Sci-Fi",
    uploader: "Mango Open Cinema Co.",
    uploaderAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80",
    views: 745100,
    duration: "12:14",
    uploadedAt: "8 months ago",
    thumbnailUrl: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=600&auto=format&fit=crop&q=80",
    comments: [
      {
        id: "cts1",
        author: "VFX_Gamer",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
        content: "The tracking and integration of active human actors into full digital 3D mech suits here is top tier, especially for 2012 open source!",
        timestamp: "3 days ago",
        likes: 14
      }
    ]
  },
  {
    id: "cosmos-laundromat",
    title: "Cosmos Laundromat - Surreal Avant-Garde Fantasy",
    description: "In Cosmos Laundromat, Franck, a depressed sheep on a deserted island, seeks an ends to his boredom and misery. He makes a sudden pact with Victor, a eccentric cosmic salesman who arrives with a special magical washing machine. Franck enters the device and is instantly transformed into a giant flying dragonfly, sparking a series of rapid-fire adventures in unknown dimensions.",
    magnetUrl: "magnet:?xt=urn:btih:c9e15763f7c34f4ae812839d1d1a29cc744a91a2&dn=Cosmos+Laundromat&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr%3A%2F%2Ftracker.empire-js.us%3A6969&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com",
    category: "Experimental",
    uploader: "Blender Institute",
    uploaderAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    views: 611293,
    duration: "10:10",
    uploadedAt: "6 months ago",
    thumbnailUrl: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80",
    comments: [
      {
        id: "cl1",
        author: "HypnoticDreams",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
        content: "The sheep transforms in Franck's physical forms. The hair simulation is incredibly complex. Truly mesmerizing visual narrative.",
        timestamp: "4 weeks ago",
        likes: 22
      }
    ]
  }
];

// server.ts
var serverVideos = JSON.parse(JSON.stringify(INITIAL_VIDEOS));
var activeConnections = /* @__PURE__ */ new Set();
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.get("/api/videos", (req, res) => {
    res.json(serverVideos);
  });
  app.post("/api/reset", (req, res) => {
    serverVideos = JSON.parse(JSON.stringify(INITIAL_VIDEOS));
    broadcastToAll({ type: "videos_reset", videos: serverVideos });
    res.json({ success: true, message: "Videos reset to default initial list." });
  });
  const server = import_http.default.createServer(app);
  const wss = new import_ws.WebSocketServer({ server });
  function broadcastToRoom(videoId, payload) {
    const messageStr = JSON.stringify(payload);
    for (const conn of activeConnections) {
      if (conn.videoId === videoId && conn.socket.readyState === import_ws.WebSocket.OPEN) {
        conn.socket.send(messageStr);
      }
    }
  }
  function broadcastToAll(payload) {
    const messageStr = JSON.stringify(payload);
    for (const conn of activeConnections) {
      if (conn.socket.readyState === import_ws.WebSocket.OPEN) {
        conn.socket.send(messageStr);
      }
    }
  }
  function broadcastSwarmStats(videoId) {
    const peersInRoom = Array.from(activeConnections).filter((c) => c.videoId === videoId);
    let totalDownloadSpeed = 0;
    let totalUploadSpeed = 0;
    let maxProgress = 0;
    const peerPipelines = peersInRoom.map((p) => {
      totalDownloadSpeed += p.stats.downloadSpeed;
      totalUploadSpeed += p.stats.uploadSpeed;
      if (p.stats.progress > maxProgress) {
        maxProgress = p.stats.progress;
      }
      return {
        id: p.peerId,
        peerName: p.peerName,
        downloaded: p.stats.downloaded,
        uploaded: p.stats.uploaded,
        progress: p.stats.progress,
        downloadSpeed: p.stats.downloadSpeed,
        uploadSpeed: p.stats.uploadSpeed
      };
    });
    broadcastToRoom(videoId, {
      type: "room_stats_broadcast",
      videoId,
      activePeersCount: peersInRoom.length,
      totalDownloadSpeed,
      totalUploadSpeed,
      maxProgress,
      peerPipelines
    });
  }
  wss.on("connection", (ws) => {
    const conn = {
      socket: ws,
      peerId: "peer_" + Math.random().toString(36).substring(2, 9),
      peerName: "Anonymous Peer",
      videoId: null,
      stats: {
        peerId: "",
        peerName: "Anonymous Peer",
        downloadSpeed: 0,
        uploadSpeed: 0,
        downloaded: 0,
        uploaded: 0,
        progress: 0
      }
    };
    activeConnections.add(conn);
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message);
        switch (data.type) {
          case "join_room": {
            const { videoId, peerName } = data;
            const previousRoom = conn.videoId;
            conn.videoId = videoId;
            conn.peerName = peerName || conn.peerName;
            conn.stats = {
              peerId: conn.peerId,
              peerName: conn.peerName,
              downloadSpeed: 0,
              uploadSpeed: 0,
              downloaded: 0,
              uploaded: 0,
              progress: 0
            };
            const targetVideo = serverVideos.find((v) => v.id === videoId);
            ws.send(JSON.stringify({
              type: "join_ack",
              peerId: conn.peerId,
              comments: targetVideo ? targetVideo.comments : [],
              likesCount: targetVideo ? targetVideo.views % 12 : 0
              // logical starting point or preserved likes counts
            }));
            broadcastToRoom(videoId, {
              type: "peer_joined",
              peerId: conn.peerId,
              peerName: conn.peerName,
              message: `${conn.peerName} connected to peer swap swarm.`
            });
            broadcastSwarmStats(videoId);
            if (previousRoom) {
              broadcastSwarmStats(previousRoom);
            }
            break;
          }
          case "leave_room": {
            const oldRoomId = conn.videoId;
            conn.videoId = null;
            if (oldRoomId) {
              broadcastToRoom(oldRoomId, {
                type: "peer_left",
                peerId: conn.peerId,
                peerName: conn.peerName,
                message: `${conn.peerName} disconnected from swarm.`
              });
              broadcastSwarmStats(oldRoomId);
            }
            break;
          }
          case "publish_video": {
            const { video } = data;
            if (video && video.title && (video.magnetUrl || video.isLive)) {
              const existsOffset = serverVideos.findIndex((v) => v.id === video.id || video.magnetUrl && v.magnetUrl === video.magnetUrl);
              const customVideo = {
                ...video,
                id: video.id || `video-${Date.now()}`,
                comments: video.comments || [],
                views: video.views || 1,
                broadcasterId: video.isLive ? conn.peerId : void 0
              };
              if (existsOffset !== -1) {
                customVideo.comments = [...serverVideos[existsOffset].comments];
                serverVideos[existsOffset] = customVideo;
              } else {
                serverVideos.unshift(customVideo);
              }
              broadcastToAll({
                type: "video_published",
                video: customVideo,
                videos: serverVideos
              });
            }
            break;
          }
          case "rtc_signal": {
            const { target, signal } = data;
            for (const other of activeConnections) {
              if (other.peerId === target && other.socket.readyState === import_ws.WebSocket.OPEN) {
                other.socket.send(JSON.stringify({
                  type: "rtc_signal_received",
                  sender: conn.peerId,
                  senderName: conn.peerName,
                  signal
                }));
                break;
              }
            }
            break;
          }
          case "add_comment": {
            const { videoId, comment } = data;
            const targetVideoIndex = serverVideos.findIndex((v) => v.id === videoId);
            if (targetVideoIndex !== -1) {
              const fullComment = {
                id: comment.id || `comment-${Date.now()}`,
                author: comment.author || conn.peerName,
                avatar: comment.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
                content: comment.content,
                timestamp: comment.timestamp || "Just now",
                likes: 0
              };
              const alreadyExists = serverVideos[targetVideoIndex].comments.some((c) => c.id === fullComment.id || c.content === fullComment.content && c.author === fullComment.author);
              if (!alreadyExists) {
                serverVideos[targetVideoIndex].comments.unshift(fullComment);
                broadcastToRoom(videoId, {
                  type: "comment_received",
                  videoId,
                  comment: fullComment,
                  allComments: serverVideos[targetVideoIndex].comments
                });
              }
            }
            break;
          }
          case "peer_stats_update": {
            const { videoId, stats } = data;
            if (conn.videoId === videoId) {
              conn.stats = {
                peerId: conn.peerId,
                peerName: conn.peerName,
                downloadSpeed: stats.downloadSpeed || 0,
                uploadSpeed: stats.uploadSpeed || 0,
                downloaded: stats.downloaded || 0,
                uploaded: stats.uploaded || 0,
                progress: stats.progress || 0
              };
              broadcastSwarmStats(videoId);
            }
            break;
          }
          case "ping": {
            ws.send(JSON.stringify({ type: "pong" }));
            break;
          }
        }
      } catch (err) {
        console.error("Payload parsing failure:", err);
      }
    });
    ws.on("close", () => {
      const oldRoomId = conn.videoId;
      activeConnections.delete(conn);
      const originalLen = serverVideos.length;
      serverVideos = serverVideos.filter((v) => !v.isLive || v.broadcasterId !== conn.peerId);
      if (serverVideos.length !== originalLen) {
        broadcastToAll({
          type: "videos_updated",
          videos: serverVideos
        });
      }
      if (oldRoomId) {
        broadcastToRoom(oldRoomId, {
          type: "peer_left",
          peerId: conn.peerId,
          peerName: conn.peerName,
          message: `${conn.peerName} pipeline connection closed.`
        });
        broadcastSwarmStats(oldRoomId);
      }
    });
    ws.on("error", () => {
      activeConnections.delete(conn);
    });
  });
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
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Swarm Server is online and listening on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
