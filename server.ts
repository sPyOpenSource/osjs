import express, { Request, Response } from 'express';
import path from 'path';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from "@google/genai";
import { FAMOUS_OFFICERS, FAMOUS_RELATIONSHIPS } from './src/data';
import { Officer, RelationshipRelation } from './src/types';

const app = express();
app.use(express.json());

const PORT = 3000;

// Shared server-side state for collaborative real-time sync
let serverOfficers: Officer[] = [...FAMOUS_OFFICERS];
let serverRelationships: RelationshipRelation[] = [...FAMOUS_RELATIONSHIPS];

// Lazy initialization of Gemini
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing. Configure it in the Secrets panel in AI Studio.');
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// REST fallback APIs
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    time: new Date().toISOString(),
    websocketUrl: `wss://${req.headers.host}`
  });
});

// Create HTTP server
const server = http.createServer(app);

// Build WebSocket server
const wss = new WebSocketServer({ server });

// Clean connection pool and broadcasting
function broadcast(message: any, excludeConnection?: WebSocket) {
  const payload = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client !== excludeConnection) {
      client.send(payload);
    }
  });
}

wss.on('connection', (ws: WebSocket) => {
  console.log('[WS] Client connected successfully.');

  // Immediately send initial state to the newly connected user (idempotence setup)
  ws.send(JSON.stringify({
    type: 'init',
    data: {
      officers: serverOfficers,
      relationships: serverRelationships
    }
  }));

  ws.on('message', async (data: string) => {
    try {
      const msg = JSON.parse(data);
      console.log(`[WS] Received message type: ${msg.type}`);

      switch (msg.type) {
        case 'add_officer': {
          const newOfficer: Officer = msg.data;
          const idx = serverOfficers.findIndex(o => o.id === newOfficer.id);
          if (idx !== -1) {
            serverOfficers[idx] = newOfficer;
          } else {
            serverOfficers.unshift(newOfficer);
          }
          // Broadcast update to all clients
          broadcast({
            type: 'officer_added',
            data: newOfficer
          });
          break;
        }

        case 'delete_officer': {
          const officerId = msg.data;
          serverOfficers = serverOfficers.filter(o => o.id !== officerId);
          serverRelationships = serverRelationships.filter(r => r.fromOfficerId !== officerId && r.toOfficerId !== officerId);
          
          broadcast({
            type: 'officer_deleted',
            data: {
              officerId,
              relationships: serverRelationships
            }
          });
          break;
        }

        case 'add_relationship': {
          const relation: RelationshipRelation = msg.data;
          const exists = serverRelationships.some(r => 
            (r.fromOfficerId === relation.fromOfficerId && r.toOfficerId === relation.toOfficerId) ||
            (r.fromOfficerId === relation.toOfficerId && r.toOfficerId === relation.fromOfficerId)
          );
          if (!exists) {
            serverRelationships.push(relation);
            broadcast({
              type: 'relationship_added',
              data: relation
            });
          }
          break;
        }

        case 'delete_relationship': {
          const { fromOfficerId, toOfficerId } = msg.data;
          serverRelationships = serverRelationships.filter(r => 
            !(r.fromOfficerId === fromOfficerId && r.toOfficerId === toOfficerId) &&
            !(r.fromOfficerId === toOfficerId && r.toOfficerId === fromOfficerId)
          );
          broadcast({
            type: 'relationship_deleted',
            data: { fromOfficerId, toOfficerId }
          });
          break;
        }

        case 'generate_bio': {
          const { name, styleName, gender, factionName, stats, traits, skills, requestId } = msg.data;
          try {
            const ai = getGeminiClient();
            const prompt = `你是一位精通《三国志》与三国历史的传奇传记撰写官。
请为武将撰写一段生动、宏大、符合历史或传奇色彩的武将列传（个人传记），篇幅为3-4句话。
请使用极高水准、典雅古风的中文进行书写，风格应与光荣特库摩的《三国志8》武将列传完美契合。

武将信息细节：
- 姓名：${name} ${styleName ? `（字：${styleName}）` : ""}
- 性别：${gender === 'Male' ? '男' : '女'}
- 所属势力 / 阵营：${factionName}
- 五维属性 (0-100)：统帅 ${stats?.leadership}、武力 ${stats?.force}、智力 ${stats?.intelligence}、政治 ${stats?.politics}、魅力 ${stats?.charisma}
- 特色人格特质：${traits?.join(", ") || "无"}
- 战术战法技能：${skills?.join(", ") || "无"}

请直接输出传记正文，严禁包含任何JSON包裹、无用的“列传：”前缀标签或版权署名说明。用充满英雄气概的古风书写！`;

            const response = await ai.models.generateContent({
              model: "gemini-3.5-flash",
              contents: prompt,
              config: {
                systemInstruction: "你是一位专门为光荣特库摩《三国志8》设计武将列传的历史叙事专家与游戏策划。",
                temperature: 0.85,
              }
            });

            ws.send(JSON.stringify({
              type: 'bio_generated',
              data: {
                requestId,
                biography: response.text || "其生平淹没于滚滚历史洪流之中，其名未得彰显。"
              }
            }));
          } catch (err: any) {
            ws.send(JSON.stringify({
              type: 'error',
              data: {
                requestId,
                message: err.message || '通过 WebSocket 生成武将列传失败。'
              }
            }));
          }
          break;
        }

        case 'evaluate_strategy': {
          const { officer, scenario, requestId } = msg.data;
          try {
            const ai = getGeminiClient();
            const prompt = `为武将 ${officer.name} 在《三国志8》特定的战役剧本背景下，提供一份宏大的军事军师方针与议会谏言。

武将基本细节：
- 姓名：${officer.name} (${officer.styleName || "无字"})
- 五维属性：统帅 (LDR) ${officer.stats?.leadership}、武力 (FOR) ${officer.stats?.force}、智力 (INT) ${officer.stats?.intelligence}、政治 (POL) ${officer.stats?.politics}、魅力 (CHR) ${officer.stats?.charisma}
- 特质：${officer.traits?.join(", ")}
- 战术战法技能：${officer.skills?.join(", ")}
- 所属势力ID：${officer.factionId}

剧本背景：${scenario.title} (公元 ${scenario.year} 年)
- 剧本描述：${scenario.description}
- 获胜判定标准：${scenario.victoryCondition}

提供一份格式化为易读 Markdown 的谏书方案。严格输出以下三个部分，并使用富有个性、令人振奋、符合《三国志8》特色系统的军师口吻书写：
1. **天下局势分析**：简明扼要用两句话分析我们在开局城市和周围相邻敌对势力的地缘态势。
2. **战场指挥战术指南**：具体讲解如何结合此武将的五维属性（统帅/武力/智力）与他拥有的战法特殊技（如 ${officer.skills?.join(", ")}）克敌制胜。
3. **连携与社交关系网建议**：推荐 2 位适合与此武将义结金兰（结拜）、结婚或强力登用、笼络的武将对象，以便完美推进天下统一霸业。

请确保回复内容非常考究，使用典雅的三国军事古风中文，不要掺杂英文游戏名词！`;

            const response = await ai.models.generateContent({
              model: "gemini-3.5-flash",
              contents: prompt,
              config: {
                systemInstruction: "你是三国乱世军师帐中的大军师元帅。请交付最专业、最具三国沉浸感、排版完美的 Markdown 战术评测与天下大势分析论述。",
                temperature: 0.75,
              }
            });

            ws.send(JSON.stringify({
              type: 'strategy_evaluated',
              data: {
                requestId,
                advice: response.text || "军帅殿上无策，未能卜知天意。"
              }
            }));
          } catch (err: any) {
            ws.send(JSON.stringify({
              type: 'error',
              data: {
                requestId,
                message: err.message || '军师府商议决策失败。'
              }
            }));
          }
          break;
        }

        case 'run_duel': {
          const { off1, off2 } = msg.data;
          const force1 = off1.stats.force + Math.floor(Math.random() * 15);
          const force2 = off2.stats.force + Math.floor(Math.random() * 15);
          
          let winner = force1 > force2 ? off1 : off2;
          let loser = force1 > force2 ? off2 : off1;
          const winnerForce = force1 > force2 ? force1 : force2;
          const loserForce = force1 > force2 ? force2 : force1;

          const dialogueList = [
            `“${winner.name}” 振臂咆哮，长枪急转格开重击，反手一记千钧横扫！“${loser.name}” 登时战马失前蹄，轰然坠于尘埃，举手认负！`,
            `战场上火星狂飙，兵刃相接！“${winner.name}” 运出排山倒海般的蛮力，一刀将 “${loser.name}” 的武器震飞数丈，震悚全场！`,
            `数十回合电光石火的激突！“${winner.name}” 越战越勇，将 “${loser.name}” 逼退得毫无还手余地。一记精妙绝伦的长戟背击锁定胜局！恭喜 “${winner.name}” 赢得天下无双的单挑胜利！`
          ];
          const chosenDialogue = dialogueList[Math.floor(Math.random() * dialogueList.length)];

          const duelResult = {
            winnerName: winner.name,
            winnerForce,
            loserName: loser.name,
            loserForce,
            dialogue: chosenDialogue,
            time: new Date().toLocaleTimeString()
          };

          // Broadcast combat outcome to ALL connected clients so it shows on everyone's dashboard
          broadcast({
            type: 'duel_notification',
            data: duelResult
          });
          break;
        }

        default:
          console.warn(`[WS] Unknown message type: ${msg.type}`);
      }
    } catch (err) {
      console.error('[WS] Error processing message:', err);
    }
  });

  ws.on('close', () => {
    console.log('[WS] Client disconnected.');
  });
});

// Vite Middleware integration for Full-Stack Development Mode
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static folder from /dist
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`[ROTK 8 Server] Server listening on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Error booting service:", err);
});
