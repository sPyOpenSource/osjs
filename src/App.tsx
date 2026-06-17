import React, { useState, useRef, useEffect } from "react";
import { 
  Sword, Shield, Plus, Minus, Trash2, Sparkles, RotateCcw, PenTool, Flame, 
  Info, Award, Clock, FileText, ChevronRight, Map, Heart, AlertTriangle, HelpCircle
} from "lucide-react";
import { TROOPS_DATA, SPELLS_DATA, HEROES_DATA, ARMY_PRESETS, TOWN_HALL_LIMITS, BASE_STYLES } from "./data";
import { Troop, Spell, Hero, ArmyPreset, PlaybookResponse } from "./types";

// Canvas Drawing & Stamping configuration types
interface Marker {
  id: string;
  x: number;
  y: number;
  label: string;
  color: string;
  type: "troop" | "spell" | "hero";
}

interface PathLine {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  width: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<"planner" | "calculator" | "playbook">("planner");
  // Town Hall State (Starts at 11 by default, which is the baseline modern strategy standard)
  const [townHall, setTownHall] = useState<number>(11);
  const [activePreset, setActivePreset] = useState<string>("Queen Charge Hybrid");

  // Selection state for planning
  const [plannedTroops, setPlannedTroops] = useState<{ [troopId: string]: number }>(
    ARMY_PRESETS[0].troops
  );
  const [plannedSpells, setPlannedSpells] = useState<{ [spellId: string]: number }>(
    ARMY_PRESETS[0].spells
  );
  const [plannedHeroes, setPlannedHeroes] = useState<{ [heroId: string]: boolean }>({
    barbarian_king: true,
    archer_queen: true,
    grand_warden: true,
    royal_champion: false, // Royal Champion unlocks at TH13
  });

  // Base layout details & custom tactical notes
  const [selectedBaseStyle, setSelectedBaseStyle] = useState<string>("compartment");
  const [customGoal, setCustomGoal] = useState<string>("Aim for standard 3-star CWL base attack.");

  // Playbook & Loading state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [playbookResult, setPlaybookResult] = useState<PlaybookResponse | null>({
    strategyName: "Queen Charge Hybrid Smash",
    overview: "Hybrid (Miner + Hog) works phenomenally on compartment bases. A heavy Queen Charge from the 6 o'clock cell clears the Archer Queen and Clan Castle, allowing the fast-paced Hybrid split-army to sweep adjacent rooms easily under the Grand Warden's Eternal Tome.",
    phase1Funnel: {
      objective: "Establish secure margins on the perimeter so the dynamic hybrid troops keep moving straight into core corridors.",
      stepByStep: [
        "Drop a Baby Dragon at 4 o'clock to trim down trash collector buildings.",
        "Deploy the Barbarian King + Siege Barracks at 7 o'clock to complete the opposite side funnel.",
        "Ensure the path to the central grid is clear of distracting external buildings before primary hybrid release."
      ],
      troopAllocation: "1x Baby Dragon, 1x Barbarian King, and small cleanup auxiliary Archers."
    },
    phase2Entry: {
      entryAngle: "6 o'clock (South-Southeastern Entry Face)",
      siegeUsage: "Siege Barracks or Log Launcher to break through initial key compartment partition wall.",
      stepByStep: [
        "Initiate Queen Charge with 5 Healers at 6 o'clock to punch a corridor straight into the enemy eagle artillery segment.",
        "Perform a strategic wall break using Wall Breakers or Super Wall Breakers precisely when defenses lock onto the Queen.",
        "Unleash the full wave of Miners, closely followed by Hog Riders and the Grand Warden, diagonally into the main core."
      ]
    },
    phase3SpellsHeroes: {
      spellTiming: "Deploy core Heal Spells in centers of massive splash damage (such as Bomb Towers and Giant Bomb spots). Let Rage keep Queen healthy.",
      heroAbilities: "Pop Warden's Eternal Tome Ability immediately when Town Hall Weapon explodes with Giga Inferno or when double Giant Bomb triggers.",
      cleanupAction: "Scatter side-wing Wizards and spare Archers behind the hybrid to swiftly clean up resource storages."
    },
    threatsAndCounters: {
      clanCastle: "Drop Poison Spell on top of defensive CC (such as Electro Dragon or Super Minions) and rage the Charged Queen.",
      highThreatBuildings: ["Eagle Artillery", "Town Hall Giga Inferno Chamber", "Bomb Towers"],
      backupPlan: "If the Queen dies too early, shift the Warden's deployment priority to protect the main core Hog/Miner pack. Use standard freezes defensively."
    }
  });

  // Strategy Canvas (Sketchpad Map) state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasTool, setCanvasTool] = useState<"draw" | "marker" | "erase">("draw");
  const [drawColor, setDrawColor] = useState<string>("#ef4444"); // default red funnel arrow
  const [selectedMarkerId, setSelectedMarkerId] = useState<string>("pekka");
  const [markerCategory, setMarkerCategory] = useState<"ground" | "air" | "spell" | "hero">("ground");
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [lines, setLines] = useState<PathLine[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentLinePoints, setCurrentLinePoints] = useState<{ x: number; y: number }[]>([]);

  // Automatically align whiteboard marker stamp tab category when selected marker changes
  useEffect(() => {
    const isGround = TROOPS_DATA.some(t => t.id === selectedMarkerId && t.category === "ground");
    const isAir = TROOPS_DATA.some(t => t.id === selectedMarkerId && t.category === "air");
    const isSpell = SPELLS_DATA.some(s => s.id === selectedMarkerId);
    const isHero = HEROES_DATA.some(h => h.id === selectedMarkerId);

    if (isGround) setMarkerCategory("ground");
    else if (isAir) setMarkerCategory("air");
    else if (isSpell) setMarkerCategory("spell");
    else if (isHero) setMarkerCategory("hero");
  }, [selectedMarkerId]);

  const [apiError, setApiError] = useState<string | null>(null);

  // --- Multiplayer Collaborative Room States ---
  const [targetRoomId, setTargetRoomId] = useState<string>("war-room-1");
  const [userName, setUserName] = useState<string>(
    "Chief_" + Math.floor(100 + Math.random() * 900)
  );
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [roomMembers, setRoomMembers] = useState<string[]>([]);
  const [chatHistory, setChatHistory] = useState<{ username: string; text: string; time: string }[]>([]);
  const [chatInput, setChatInput] = useState<string>("");
  const socketRef = useRef<WebSocket | null>(null);
  const isIncomingSyncRef = useRef<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const [availableRooms, setAvailableRooms] = useState<{
    roomId: string;
    memberCount: number;
    members: string[];
    townHall?: number;
    selectedBaseStyle?: string;
  }[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState<boolean>(false);

  // Retrieve active rooms list from the server
  const fetchAvailableRooms = async () => {
    setIsLoadingRooms(true);
    try {
      const resp = await fetch("/api/rooms");
      if (resp.ok) {
        const data = await resp.json();
        setAvailableRooms(data);
      }
    } catch (err) {
      console.error("Failed to fetch available rooms:", err);
    } finally {
      setIsLoadingRooms(false);
    }
  };

  // Poll available rooms on mount and every 10 seconds
  useEffect(() => {
    fetchAvailableRooms();
    const interval = setInterval(fetchAvailableRooms, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- Strategist Action Sync Socket Handlers ---
  const connectToRoom = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}`;
    
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      setIsConnected(true);
      // Initiate join sequence on the server room
      socket.send(JSON.stringify({
        type: "join",
        roomId: targetRoomId.trim() || "lobby",
        requestedUsername: userName.trim()
      }));
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const { type } = message;

        if (type === "init") {
          const { chatHistory: chat, armyState: army, whiteboard, members } = message.state;
          
          isIncomingSyncRef.current = true;
          setChatHistory(chat);
          setRoomMembers(members);
          
          if (army) {
            if (army.townHall !== undefined) setTownHall(army.townHall);
            if (army.plannedTroops) setPlannedTroops(army.plannedTroops);
            if (army.plannedSpells) setPlannedSpells(army.plannedSpells);
            if (army.plannedHeroes) setPlannedHeroes(army.plannedHeroes);
            if (army.selectedBaseStyle) setSelectedBaseStyle(army.selectedBaseStyle);
            if (army.customGoal) setCustomGoal(army.customGoal);
            if (army.playbookResult !== undefined) setPlaybookResult(army.playbookResult);
          }
          
          if (whiteboard) {
            if (whiteboard.lines) setLines(whiteboard.lines);
            if (whiteboard.markers) setMarkers(whiteboard.markers);
          }
          
          setTimeout(() => {
            isIncomingSyncRef.current = false;
          }, 80);
        }

        else if (type === "memberJoined" || type === "memberLeft") {
          setRoomMembers(message.members);
          setChatHistory(message.chatHistory);
        }

        else if (type === "chat") {
          setChatHistory(prev => [...prev, message.message]);
        }

        else if (type === "draw") {
          const { lines: dl, markers: dm } = message.drawingState;
          isIncomingSyncRef.current = true;
          if (dl) setLines(dl);
          if (dm) setMarkers(dm);
          setTimeout(() => {
            isIncomingSyncRef.current = false;
          }, 80);
        }

        else if (type === "updateArmy") {
          const army = message.armyState;
          if (army) {
            isIncomingSyncRef.current = true;
            if (army.townHall !== undefined) setTownHall(army.townHall);
            if (army.plannedTroops) setPlannedTroops(army.plannedTroops);
            if (army.plannedSpells) setPlannedSpells(army.plannedSpells);
            if (army.plannedHeroes) setPlannedHeroes(army.plannedHeroes);
            if (army.selectedBaseStyle) setSelectedBaseStyle(army.selectedBaseStyle);
            if (army.customGoal) setCustomGoal(army.customGoal);
            if (army.playbookResult !== undefined) setPlaybookResult(army.playbookResult);
            setTimeout(() => {
              isIncomingSyncRef.current = false;
            }, 80);
          }
        }

        else if (type === "clearWhiteboard") {
          isIncomingSyncRef.current = true;
          setLines([]);
          setMarkers([]);
          setTimeout(() => {
            isIncomingSyncRef.current = false;
          }, 80);
        }

      } catch (err) {
        console.error("Error parsing operational client socket packet:", err);
      }
    };

    socket.onclose = () => {
      setIsConnected(false);
      setRoomMembers([]);
    };

    socket.onerror = (err) => {
      console.error("Operational connection error:", err);
    };
  };

  const disconnectFromRoom = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setIsConnected(false);
    setRoomMembers([]);
  };

  const sendChatMessage = () => {
    if (!chatInput.trim() || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;
    socketRef.current.send(JSON.stringify({
      type: "chat",
      text: chatInput.trim()
    }));
    setChatInput("");
  };

  // Auto-scroll chat board
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Sync Army configurations to connected room socket
  useEffect(() => {
    if (isIncomingSyncRef.current || !isConnected) return;
    
    const syncTimeout = setTimeout(() => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          type: "updateArmy",
          armyState: {
            townHall,
            plannedTroops,
            plannedSpells,
            plannedHeroes,
            selectedBaseStyle,
            customGoal,
            playbookResult
          }
        }));
      }
    }, 200);

    return () => clearTimeout(syncTimeout);
  }, [townHall, plannedTroops, plannedSpells, plannedHeroes, selectedBaseStyle, customGoal, playbookResult, isConnected]);

  // Sync sketchpad shapes to connected room socket
  useEffect(() => {
    if (isIncomingSyncRef.current || !isConnected) return;

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: "draw",
        drawingState: {
          lines,
          markers
        }
      }));
    }
  }, [lines, markers, isConnected]);

  // Calculate current limits
  const limits = TOWN_HALL_LIMITS[townHall] || { maxTroopsSpace: 200, maxSpellsSpace: 6 };

  // Calculate stats
  const totalTroopsSpace = Object.entries(plannedTroops).reduce((sum: number, [id, count]) => {
    const troop = TROOPS_DATA.find(t => t.id === id);
    return sum + (troop ? troop.housingSpace * (count as number) : 0);
  }, 0);

  const totalSpellsSpace = Object.entries(plannedSpells).reduce((sum: number, [id, count]) => {
    const spell = SPELLS_DATA.find(s => s.id === id);
    return sum + (spell ? spell.housingSpace * (count as number) : 0);
  }, 0);

  const totalTrainingTime = Object.entries(plannedTroops).reduce((sum: number, [id, count]) => {
    const troop = TROOPS_DATA.find(t => t.id === id);
    return sum + (troop ? troop.trainingTime * (count as number) : 0);
  }, 0) + Object.entries(plannedSpells).reduce((sum: number, [id, count]) => {
    const spell = SPELLS_DATA.find(s => s.id === id);
    return sum + (spell ? spell.trainingTime * (count as number) : 0);
  }, 0);

  const elixirCost = Object.entries(plannedTroops).reduce((sum: number, [id, count]) => {
    const troop = TROOPS_DATA.find(t => t.id === id);
    return sum + (troop && troop.type === "elixir" ? troop.cost * (count as number) : 0);
  }, 0) + Object.entries(plannedSpells).reduce((sum: number, [id, count]) => {
    const spell = SPELLS_DATA.find(s => s.id === id);
    return sum + (spell && spell.type === "elixir" ? spell.cost * (count as number) : 0);
  }, 0);

  const darkElixirCost = Object.entries(plannedTroops).reduce((sum: number, [id, count]) => {
    const troop = TROOPS_DATA.find(t => t.id === id);
    return sum + (troop && troop.type === "dark_elixir" ? troop.cost * (count as number) : 0);
  }, 0) + Object.entries(plannedSpells).reduce((sum: number, [id, count]) => {
    const spell = SPELLS_DATA.find(s => s.id === id);
    return sum + (spell && spell.type === "dark_elixir" ? spell.cost * (count as number) : 0);
  }, 0);

  // Update hero status on town hall level change
  useEffect(() => {
    const updatedHeroes = { ...plannedHeroes };
    HEROES_DATA.forEach(hero => {
      if (townHall < hero.unlockedAtTh) {
        updatedHeroes[hero.id] = false;
      }
    });
    setPlannedHeroes(updatedHeroes);
  }, [townHall]);

  // Load Preset
  const handleLoadPreset = (preset: ArmyPreset) => {
    setActivePreset(preset.name);
    
    // Safety check matching limits with TownHall
    const draftTroops: { [troopId: string]: number } = {};
    const draftSpells: { [spellId: string]: number } = {};
    const draftHeroes: { [heroId: string]: boolean } = {};

    TROOPS_DATA.forEach(t => {
      draftTroops[t.id] = preset.troops[t.id] || 0;
    });
    SPELLS_DATA.forEach(s => {
      draftSpells[s.id] = preset.spells[s.id] || 0;
    });
    HEROES_DATA.forEach(h => {
      draftHeroes[h.id] = townHall >= h.unlockedAtTh ? (preset.heroes[h.id] || false) : false;
    });

    setPlannedTroops(draftTroops);
    setPlannedSpells(draftSpells);
    setPlannedHeroes(draftHeroes);
  };

  // Adjust troop/spell count
  const adjustTroopCount = (id: string, amount: number) => {
    const current = plannedTroops[id] || 0;
    const next = Math.max(0, current + amount);
    
    // Check space limit
    const troop = TROOPS_DATA.find(t => t.id === id);
    if (troop && amount > 0) {
      if (totalTroopsSpace + troop.housingSpace > limits.maxTroopsSpace) {
        // Space saturated
        return;
      }
    }
    
    setPlannedTroops({
      ...plannedTroops,
      [id]: next
    });
    setActivePreset("Custom Composition");
  };

  const adjustSpellCount = (id: string, amount: number) => {
    const current = plannedSpells[id] || 0;
    const next = Math.max(0, current + amount);

    // Check space limit
    const spell = SPELLS_DATA.find(s => s.id === id);
    if (spell && amount > 0) {
      if (totalSpellsSpace + spell.housingSpace > limits.maxSpellsSpace) {
        return;
      }
    }

    setPlannedSpells({
      ...plannedSpells,
      [id]: next
    });
    setActivePreset("Custom Composition");
  };

  const toggleHero = (heroId: string, minTh: number) => {
    if (townHall < minTh) return;
    setPlannedHeroes({
      ...plannedHeroes,
      [heroId]: !plannedHeroes[heroId]
    });
    setActivePreset("Custom Composition");
  };

  const resetComposition = () => {
    const emptyTroops: { [key: string]: number } = {};
    const emptySpells: { [key: string]: number } = {};
    TROOPS_DATA.forEach(t => emptyTroops[t.id] = 0);
    SPELLS_DATA.forEach(s => emptySpells[s.id] = 0);
    setPlannedTroops(emptyTroops);
    setPlannedSpells(emptySpells);
    setActivePreset("Custom Composition");
    setLines([]);
    setMarkers([]);
  };

  // Helper formatting for training duration
  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "Instant";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    const parts = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0 || h > 0) parts.push(`${m}m`);
    if (s > 0 || parts.length === 0) parts.push(`${s}s`);
    return parts.join(" ");
  };

  // Call the server.ts back-end tactical intelligence endpoint
  const generateAiPlaybook = async () => {
    setIsGenerating(true);
    setApiError(null);

    // Format troop and spell configuration to send to AI
    const compactTroops = Object.entries(plannedTroops)
      .filter(([_, count]) => (count as number) > 0)
      .map(([id, count]) => {
        const found = TROOPS_DATA.find(t => t.id === id);
        return `${count}x ${found ? found.name : id}`;
      });

    const compactSpells = Object.entries(plannedSpells)
      .filter(([_, count]) => (count as number) > 0)
      .map(([id, count]) => {
        const found = SPELLS_DATA.find(s => s.id === id);
        return `${count}x ${found ? found.name : id}`;
      });

    const selectedHeroesList = Object.entries(plannedHeroes)
      .filter(([_, active]) => active)
      .map(([id]) => HEROES_DATA.find(h => h.id === id)?.name || id);

    const baseStyleName = BASE_STYLES.find(b => b.id === selectedBaseStyle)?.name || selectedBaseStyle;

    try {
      const response = await fetch("/api/clash/tactic-advisor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          townHall,
          baseStyle: baseStyleName,
          customGoal,
          armyDetails: {
            troops: compactTroops,
            spells: compactSpells,
            heroes: selectedHeroesList,
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || errData.details || "API server issues. Please check if your GEMINI_API_KEY is configured.");
      }

      const parsed: PlaybookResponse = await response.json();
      setPlaybookResult(parsed);
      setActiveTab("playbook");
      
      // Auto-draw a simplified strategy representation on whiteboard when AI loads
      seedVisualTactics();
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Something went wrong creating the strategy playbook.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Whiteboard drawing engine (animates markers dynamically)
  useEffect(() => {
    let animationId: number;
    const tick = () => {
      drawWhiteboard();
      animationId = requestAnimationFrame(tick);
    };
    
    // Only request updates when the canvas tab is active
    if (activeTab === "planner") {
      animationId = requestAnimationFrame(tick);
    } else {
      drawWhiteboard();
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [lines, markers, selectedBaseStyle, townHall, activeTab]);

  const drawWhiteboard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Transform 2D coordinates (u, v) on virtual grid to isometric screen space
    const toIso = (u: number, v: number) => {
      return {
        x: centerX + (u - v) * 1.0,
        y: centerY + (u + v) * 0.5
      };
    };

    // Helper to draw a beautiful 3D isometric building block
    const drawIsoBlock = (
      u: number,
      v: number,
      sizeU: number,
      sizeV: number,
      height: number,
      colorTop: string,
      colorLeft: string,
      colorRight: string,
      label?: string
    ) => {
      const pBaseBack = toIso(u - sizeU/2, v - sizeV/2);
      const pBaseRight = toIso(u + sizeU/2, v - sizeV/2);
      const pBaseFront = toIso(u + sizeU/2, v + sizeV/2);
      const pBaseLeft = toIso(u - sizeU/2, v + sizeV/2);

      const pTopBack = { x: pBaseBack.x, y: pBaseBack.y - height };
      const pTopRight = { x: pBaseRight.x, y: pBaseRight.y - height };
      const pTopFront = { x: pBaseFront.x, y: pBaseFront.y - height };
      const pTopLeft = { x: pBaseLeft.x, y: pBaseLeft.y - height };

      // Left face
      ctx.fillStyle = colorLeft;
      ctx.beginPath();
      ctx.moveTo(pBaseLeft.x, pBaseLeft.y);
      ctx.lineTo(pBaseFront.x, pBaseFront.y);
      ctx.lineTo(pTopFront.x, pTopFront.y);
      ctx.lineTo(pTopLeft.x, pTopLeft.y);
      ctx.closePath();
      ctx.fill();

      // Right face
      ctx.fillStyle = colorRight;
      ctx.beginPath();
      ctx.moveTo(pBaseFront.x, pBaseFront.y);
      ctx.lineTo(pBaseRight.x, pBaseRight.y);
      ctx.lineTo(pTopRight.x, pTopRight.y);
      ctx.lineTo(pTopFront.x, pTopFront.y);
      ctx.closePath();
      ctx.fill();

      // Top face
      ctx.fillStyle = colorTop;
      ctx.beginPath();
      ctx.moveTo(pTopBack.x, pTopBack.y);
      ctx.lineTo(pTopRight.x, pTopRight.y);
      ctx.lineTo(pTopFront.x, pTopFront.y);
      ctx.lineTo(pTopLeft.x, pTopLeft.y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.stroke();

      if (label) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.font = "bold 8.5px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, pTopFront.x, pTopFront.y - height/2 + 5);
      }
    };

    // Helper to draw isometric rectangular walls of a compartment
    const drawIsoWallRect = (minU: number, minV: number, maxU: number, maxV: number, dashed: boolean = false) => {
      ctx.strokeStyle = "rgba(224, 242, 254, 0.35)"; // level 12 blue/white wall theme
      ctx.lineWidth = 3;
      if (dashed) {
        ctx.setLineDash([4, 4]);
      } else {
        ctx.setLineDash([]);
      }
      
      const pA = toIso(minU, minV);
      const pB = toIso(maxU, minV);
      const pC = toIso(maxU, maxV);
      const pD = toIso(minU, maxV);

      ctx.beginPath();
      ctx.moveTo(pA.x, pA.y);
      ctx.lineTo(pB.x, pB.y);
      ctx.lineTo(pC.x, pC.y);
      ctx.lineTo(pD.x, pD.y);
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]); // clear dash
    };

    const drawTowersForBase = () => {
      if (selectedBaseStyle === "ring") {
        const spots = [
          { u: -45, v: -45, label: "🏹 AT" },
          { u: 45, v: -45, label: "🏹 AT" },
          { u: 45, v: 45, label: "🏹 AT" },
          { u: -45, v: 45, label: "🏹 AT" }
        ];
        spots.forEach(s => {
          drawIsoBlock(s.u, s.v, 16, 16, 15, "#1e3a8a", "#172554", "#0f172a", s.label);
        });
      } else if (selectedBaseStyle === "compartment") {
        const spots = [
          { u: -60, v: -60, label: "💣 Mortar" },
          { u: 60, v: -60, label: "💣 Mortar" },
          { u: 60, v: 60, label: "🦅 Eagle" },
          { u: -60, v: 60, label: "🧪 CC" }
        ];
        spots.forEach(s => {
          drawIsoBlock(s.u, s.v, 18, 18, 14, "#475569", "#334155", "#1e293b", s.label);
        });
      } else if (selectedBaseStyle === "diamond") {
        const spots = [
          { u: 0, v: -55, label: "🔥 Inferno" },
          { u: 55, v: 0, label: "🏹 AT" },
          { u: 0, v: 55, label: "🔥 Inferno" },
          { u: -55, v: 0, label: "🏰 CC" }
        ];
        spots.forEach(s => {
          drawIsoBlock(s.u, s.v, 16, 16, 16, "#7f1d1d", "#991b1b", "#450a0a", s.label);
        });
      } else if (selectedBaseStyle === "box") {
        const spots = [
          { u: -70, v: -45, label: "📦 XB" },
          { u: 70, v: -45, label: "📦 XB" },
          { u: 70, v: 45, label: "🏹 AT" },
          { u: -70, v: 45, label: "🏹 AT" }
        ];
        spots.forEach(s => {
          drawIsoBlock(s.u, s.v, 16, 16, 12, "#3f6212", "#365314", "#1a2e05", s.label);
        });
      } else {
        const spots = [
          { u: -40, v: -40, label: "⚡ Tesla" },
          { u: 40, v: -40, label: "⚡ Tesla" },
          { u: 40, v: 40, label: "🏰 CC" },
          { u: -40, v: 40, label: "💪 AirD" }
        ];
        spots.forEach(s => {
          drawIsoBlock(s.u, s.v, 16, 16, 14, "#115e59", "#134e4a", "#042f2e", s.label);
        });
      }
    };

    // Clear background with rich Dark Slate/Green base color
    ctx.fillStyle = "#0c151d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw active emerald grass isometric field
    const borderMax = 185;
    const pTopLeft = toIso(-borderMax, -borderMax);
    const pTopRight = toIso(borderMax, -borderMax);
    const pBottomRight = toIso(borderMax, borderMax);
    const pBottomLeft = toIso(-borderMax, borderMax);

    // Fill green grass field
    ctx.fillStyle = "#0f2c1b"; // Deep green field
    ctx.beginPath();
    ctx.moveTo(pTopLeft.x, pTopLeft.y);
    ctx.lineTo(pTopRight.x, pTopRight.y);
    ctx.lineTo(pBottomRight.x, pBottomRight.y);
    ctx.lineTo(pBottomLeft.x, pBottomLeft.y);
    ctx.closePath();
    ctx.fill();

    // Field highlight border
    ctx.strokeStyle = "rgba(16, 185, 129, 0.25)";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Draw Isometric board grid tiles
    ctx.save();
    ctx.strokeStyle = "rgba(16, 185, 129, 0.08)";
    ctx.lineWidth = 1;
    const isoGridSize = 25;

    // Grid lines of constant u
    for (let u = -borderMax; u <= borderMax; u += isoGridSize) {
      const start = toIso(u, -borderMax);
      const end = toIso(u, borderMax);
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }

    // Grid lines of constant v
    for (let v = -borderMax; v <= borderMax; v += isoGridSize) {
      const start = toIso(-borderMax, v);
      const end = toIso(borderMax, v);
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
    ctx.restore();

    // Render base blueprint isometrically
    if (selectedBaseStyle === "ring") {
      // Cylindrical Ring boundaries translated into flat horizontal isometric ellipses
      ctx.save();
      ctx.strokeStyle = "rgba(224, 242, 254, 0.25)";
      ctx.lineWidth = 3;
      
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 130, 65, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(30, 41, 59, 0.25)";
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 65, 32.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(15, 23, 42, 0.55)";
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    } else if (selectedBaseStyle === "compartment") {
      // Compartments of custom walls
      drawIsoWallRect(-100, -100, 100, 100);
      drawIsoWallRect(-35, -35, 35, 35);

      // cross walls dividers inside
      ctx.strokeStyle = "rgba(224, 242, 254, 0.25)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const pLeftStart = toIso(-100, 0);
      const pLeftEnd = toIso(100, 0);
      ctx.moveTo(pLeftStart.x, pLeftStart.y);
      ctx.lineTo(pLeftEnd.x, pLeftEnd.y);

      const pTopStart = toIso(0, -100);
      const pTopEnd = toIso(0, 100);
      ctx.moveTo(pTopStart.x, pTopStart.y);
      ctx.lineTo(pTopEnd.x, pTopEnd.y);
      ctx.stroke();
    } else if (selectedBaseStyle === "diamond") {
      // Double diamond walls structures
      ctx.save();
      ctx.strokeStyle = "rgba(224, 242, 254, 0.35)";
      ctx.lineWidth = 3;
      
      const pTopD = toIso(0, -110);
      const pRightD = toIso(110, 0);
      const pBottomD = toIso(0, 110);
      const pLeftD = toIso(-110, 0);

      ctx.beginPath();
      ctx.moveTo(pTopD.x, pTopD.y);
      ctx.lineTo(pRightD.x, pRightD.y);
      ctx.lineTo(pBottomD.x, pBottomD.y);
      ctx.lineTo(pLeftD.x, pLeftD.y);
      ctx.closePath();
      ctx.fillStyle = "rgba(30, 41, 59, 0.25)";
      ctx.fill();
      ctx.stroke();

      const pTopDInner = toIso(0, -55);
      const pRightDInner = toIso(55, 0);
      const pBottomDInner = toIso(0, 55);
      const pLeftDInner = toIso(-55, 0);

      ctx.beginPath();
      ctx.moveTo(pTopDInner.x, pTopDInner.y);
      ctx.lineTo(pRightDInner.x, pRightDInner.y);
      ctx.lineTo(pBottomDInner.x, pBottomDInner.y);
      ctx.lineTo(pLeftDInner.x, pLeftDInner.y);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    } else if (selectedBaseStyle === "box") {
      drawIsoWallRect(-120, -75, 120, 75);
      drawIsoWallRect(-75, -45, 75, 45);
    } else {
      // Symmetric standard Anti-2 Star layout
      drawIsoWallRect(-95, -95, 95, 95);
      drawIsoWallRect(-45, -45, 45, 45);
    }

    // Draw defense towers
    drawTowersForBase();

    // Draw active Town Hall at center
    drawIsoBlock(
      0,
      0,
      32,
      32,
      20,
      "#d97706", // amber roof
      "#b45309", // dark gold left
      "#78350f", // dark gold right
      `TH ${townHall}`
    );

    // Outer perimeter direction labels positioned nicely at the diamond tips
    ctx.save();
    ctx.fillStyle = "rgba(148, 163, 184, 0.45)";
    ctx.font = "bold 9px 'JetBrains Mono', monospace";
    
    const p12 = toIso(0, -borderMax - 12);
    const p6 = toIso(0, borderMax + 15);
    const p9 = toIso(-borderMax - 12, 0);
    const p3 = toIso(borderMax + 15, 0);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    //ctx.fillText("12 o'clock", p12.x, p12.y);
    //ctx.fillText("6 o'clock", p6.x, p6.y);
    //ctx.fillText("9 o'clock", p9.x, p9.y);
    //ctx.fillText("3 o'clock", p3.x, p3.y);
    ctx.restore();

    // Draw user painted custom action curves
    lines.forEach(line => {
      if (line.points.length < 2) return;
      ctx.save();
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      ctx.moveTo(line.points[0].x, line.points[0].y);
      for (let i = 1; i < line.points.length; i++) {
        ctx.lineTo(line.points[i].x, line.points[i].y);
      }
      ctx.stroke();

      // If drawing tactical arrows, add arrow head on the final point vector
      if (line.points.length >= 3) {
        const last = line.points[line.points.length - 1];
        const prev = line.points[line.points.length - 3];
        const dx = last.x - prev.x;
        const dy = last.y - prev.y;
        const angle = Math.atan2(dy, dx);
        
        ctx.fillStyle = line.color;
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(
          last.x - 12 * Math.cos(angle - Math.PI / 6),
          last.y - 12 * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          last.x - 12 * Math.cos(angle + Math.PI / 6),
          last.y - 12 * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    });

    // Gather target structures for dynamic troop target guidance
    const targetPoints: { x: number; y: number; label: string }[] = [];
    
    // Core Town Hall at center
    targetPoints.push({ x: centerX, y: centerY, label: `TH ${townHall}` });

    // Defense towers depending on current base blueprint style
    if (selectedBaseStyle === "ring") {
      const spots = [
        { u: -45, v: -45, label: "AT" },
        { u: 45, v: -45, label: "AT" },
        { u: 45, v: 45, label: "AT" },
        { u: -45, v: 45, label: "AT" }
      ];
      spots.forEach(s => {
        const p = toIso(s.u, s.v);
        targetPoints.push({ x: p.x, y: p.y, label: s.label });
      });
    } else if (selectedBaseStyle === "compartment") {
      const spots = [
        { u: -60, v: -60, label: "Mortar" },
        { u: 60, v: -60, label: "Mortar" },
        { u: 60, v: 60, label: "Eagle" },
        { u: -60, v: 60, label: "CC" }
      ];
      spots.forEach(s => {
        const p = toIso(s.u, s.v);
        targetPoints.push({ x: p.x, y: p.y, label: s.label });
      });
    } else if (selectedBaseStyle === "diamond") {
      const spots = [
        { u: 0, v: -55, label: "Inferno" },
        { u: 55, v: 0, label: "AT" },
        { u: 0, v: 55, label: "Inferno" },
        { u: -55, v: 0, label: "CC" }
      ];
      spots.forEach(s => {
        const p = toIso(s.u, s.v);
        targetPoints.push({ x: p.x, y: p.y, label: s.label });
      });
    } else if (selectedBaseStyle === "box") {
      const spots = [
        { u: -70, v: -45, label: "XB" },
        { u: 70, v: -45, label: "XB" },
        { u: 70, v: 45, label: "AT" },
        { u: -70, v: 45, label: "AT" }
      ];
      spots.forEach(s => {
        const p = toIso(s.u, s.v);
        targetPoints.push({ x: p.x, y: p.y, label: s.label });
      });
    } else {
      const spots = [
        { u: -40, v: -40, label: "Tesla" },
        { u: 40, v: -40, label: "Tesla" },
        { u: 40, v: 40, label: "CC" },
        { u: -40, v: 40, label: "AirD" }
      ];
      spots.forEach(s => {
        const p = toIso(s.u, s.v);
        targetPoints.push({ x: p.x, y: p.y, label: s.label });
      });
    }

    // Draw Stamps/Placed Markers
    markers.forEach((mark, index) => {
      ctx.save();

      const elapsed = Date.now();
      // Defer Phase offset so each placed stamp has a slightly staggered float animation
      const hoverY = Math.sin((elapsed / 220) + (index * 1.5)) * 3;
      
      // 1. Radar Pulse Ring fading out
      const rippleCycle = ((elapsed + index * 300) / 1200) % 1; // 1.2 second loops staggered
      ctx.beginPath();
      ctx.arc(mark.x, mark.y + hoverY, 17 + rippleCycle * 15, 0, Math.PI * 2);
      ctx.strokeStyle = mark.color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 1 - rippleCycle;
      ctx.stroke();
      
      // Restore outer global alpha
      ctx.globalAlpha = 1.0;

      // 2. Backdrop circle glow (radius breathes gently)
      const glowRadius = 17.5 + Math.sin((elapsed / 140) + index) * 1.5;
      ctx.beginPath();
      ctx.arc(mark.x, mark.y + hoverY, glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = mark.color + "4D"; // ~30% transparency
      ctx.fill();
      ctx.strokeStyle = mark.color;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // 3. Spaced Stamp active inner pulse indicator dot
      ctx.beginPath();
      ctx.arc(mark.x + 10, mark.y + hoverY - 10, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#34d399"; // bright mint active indicator
      ctx.fill();

      // 4. Icon text floating centered
      ctx.font = "15px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(mark.label, mark.x, mark.y + hoverY);

      ctx.restore();

      // 5. Deployed Troop Movement / Active Playbook Pathing Guidance logic
      if (mark.type !== "spell") {
        // Find closest target structure on the virtual coordinate base
        let closestTarget = targetPoints[0];
        let minDist = Infinity;
        targetPoints.forEach(pt => {
          const d = Math.hypot(pt.x - mark.x, pt.y - mark.y);
          if (d < minDist) {
            minDist = d;
            closestTarget = pt;
          }
        });

        if (minDist > 15) {
          // Draw subtle directional dashed trace lines towards the closest building anchor
          ctx.save();
          ctx.strokeStyle = mark.color;
          ctx.lineWidth = 1.3;
          ctx.globalAlpha = 0.4;
          const lineOffset = -((elapsed / 45) % 24);
          ctx.setLineDash([6, 5]);
          ctx.lineDashOffset = lineOffset;
          ctx.beginPath();
          ctx.moveTo(mark.x, mark.y);
          ctx.lineTo(closestTarget.x, closestTarget.y);
          ctx.stroke();
          ctx.restore();

          // Compute moving marching mini-avatar progress (looping from 0 to 1)
          const marchPeriod = 4200; // 4.2 seconds travel time loop
          const marchShift = (index * 980) % marchPeriod;
          const progress = ((elapsed + marchShift) % marchPeriod) / marchPeriod;

          const marchX = mark.x + (closestTarget.x - mark.x) * progress;
          const marchY = mark.y + (closestTarget.y - mark.y) * progress;

          // Cute waddling effect to simulate actual troop foot movement
          const walkSwingX = Math.sin(progress * Math.PI * 16) * 2.5;
          const walkSwingY = Math.cos(progress * Math.PI * 16) * 1.8;

          ctx.save();
          // Miniature avatar badge
          ctx.beginPath();
          ctx.arc(marchX + walkSwingX, marchY + walkSwingY, 11, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(11, 15, 26, 0.88)";
          ctx.fill();
          ctx.strokeStyle = mark.color;
          ctx.lineWidth = 1.25;
          ctx.stroke();

          // Playbook target pointer micro-arrowheads at the badge bounds
          const bearing = Math.atan2(closestTarget.y - mark.y, closestTarget.x - mark.x);
          ctx.fillStyle = mark.color;
          ctx.beginPath();
          ctx.moveTo(
            marchX + walkSwingX + Math.cos(bearing) * 14,
            marchY + walkSwingY + Math.sin(bearing) * 14
          );
          ctx.lineTo(
            marchX + walkSwingX + Math.cos(bearing - 0.45) * 8,
            marchY + walkSwingY + Math.sin(bearing - 0.45) * 8
          );
          ctx.lineTo(
            marchX + walkSwingX + Math.cos(bearing + 0.45) * 8,
            marchY + walkSwingY + Math.sin(bearing + 0.45) * 8
          );
          ctx.closePath();
          ctx.fill();

          // Small text symbol/emoji
          ctx.font = "10.5px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(mark.label, marchX + walkSwingX, marchY + walkSwingY);
          ctx.restore();

          // Exploding shockwave impact rings when they strike defenses at progress > 0.94
          if (progress > 0.94) {
            const crashFactor = (progress - 0.94) / 0.06;
            ctx.save();
            ctx.beginPath();
            ctx.arc(closestTarget.x, closestTarget.y, 6 + crashFactor * 16, 0, Math.PI * 2);
            ctx.strokeStyle = mark.color;
            ctx.lineWidth = 1.8 * (1 - crashFactor);
            ctx.globalAlpha = 1 - crashFactor;
            ctx.stroke();

            // Flying sparks
            for (let i = 0; i < 4; i++) {
              const rad = (i * Math.PI / 2) + (crashFactor * Math.PI / 3);
              const radiusLength = 8 + crashFactor * 12;
              ctx.beginPath();
              ctx.arc(
                closestTarget.x + Math.cos(rad) * radiusLength,
                closestTarget.y + Math.sin(rad) * radiusLength,
                1.5,
                0,
                Math.PI * 2
              );
              ctx.fillStyle = mark.color;
              ctx.fill();
            }
            ctx.restore();
          }
        }
      } else {
        // Spell markers display a gorgeous circular rotating aura indicating Area of Effect
        ctx.save();
        ctx.strokeStyle = mark.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.25;
        ctx.setLineDash([5, 5]);

        ctx.beginPath();
        ctx.arc(mark.x, mark.y, 42, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(mark.x, mark.y, 42 + Math.sin(elapsed / 160) * 3, 0, Math.PI * 2);
        ctx.fillStyle = mark.color + "12"; // very subtle coverage filling
        ctx.fill();
        ctx.restore();
      }
    });
  };

  // Pre-seed mock tactical markers to demonstrate functionality when app mounts / playbook loads
  const seedVisualTactics = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;

    // Draw basic entering routes
    const mockLines: PathLine[] = [
      {
        id: "funnel-1",
        color: "#fb923c", // Amber funnel
        width: 3,
        points: [
          { x: w * 0.25, y: h * 0.8 },
          { x: w * 0.28, y: h * 0.65 },
          { x: w * 0.35, y: h * 0.6 }
        ]
      },
      {
        id: "main-charge",
        color: "#3b82f6", // Blue direct
        width: 4,
        points: [
          { x: w * 0.48, y: h * 0.9 },
          { x: w * 0.48, y: h * 0.75 },
          { x: w * 0.48, y: h * 0.62 }
        ]
      }
    ];

    const mockMarkers: Marker[] = [
      { id: "m1", x: w * 0.2, y: h * 0.8, label: "🐉", color: "#fb923c", type: "troop" }, // BbDragon funnel
      { id: "m2", x: w * 0.48, y: h * 0.9, label: "👼", color: "#10b981", type: "troop" }, // Healers
      { id: "m3", x: w * 0.48, y: h * 0.82, label: "🏹", color: "#3b82f6", type: "troop" }, // Queen
      { id: "m4", x: w * 0.5, y: h * 0.4, label: "⚡", color: "#a855f7", type: "spell" } // Spell
    ];

    setLines(mockLines);
    setMarkers(mockMarkers);
  };

  useEffect(() => {
    seedVisualTactics();
  }, [selectedBaseStyle]);

  // Canvas Mouse interaction handlers
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (canvasTool === "marker") {
      // Find the emoji symbol and type of placing unit
      const foundTroop = TROOPS_DATA.find(t => t.id === selectedMarkerId);
      const foundSpell = SPELLS_DATA.find(s => s.id === selectedMarkerId);
      const foundHero = HEROES_DATA.find(h => h.id === selectedMarkerId);

      const SPELL_EMOJIS: { [key: string]: string } = {
        lightning: "⚡",
        healing: "💚",
        rage: "🔥",
        jump: "🦘",
        freeze: "❄️",
        clone: "👥",
        invisibility: "👻",
        poison: "🤢",
        earthquake: "📳",
        haste: "🏃",
        bat: "🦇"
      };

      const HERO_EMOJIS: { [key: string]: string } = {
        barbarian_king: "👑",
        archer_queen: "👸",
        grand_warden: "👴",
        royal_champion: "🦸‍♀️"
      };

      let label = "⚔️";
      let color = "#ef4444";
      let origin: "troop" | "spell" | "hero" = "troop";

      if (foundHero) {
        label = HERO_EMOJIS[foundHero.id] || "👑";
        color = "#eab308";
        origin = "hero";
      } else if (foundSpell) {
        label = SPELL_EMOJIS[foundSpell.id] || "🧪";
        color = foundSpell.type === "dark_elixir" ? "#a855f7" : "#06b6d4";
        origin = "spell";
      } else if (foundTroop) {
        label = foundTroop.imageUrl;
        color = foundTroop.type === "dark_elixir" ? "#a855f7" : "#3b82f6";
        origin = "troop";
      }

      const newMark: Marker = {
        id: "marker_" + Date.now(),
        x,
        y,
        label,
        color,
        type: origin
      };

      setMarkers([...markers, newMark]);
    } else if (canvasTool === "draw") {
      setIsDrawing(true);
      setCurrentLinePoints([{ x, y }]);
    } else if (canvasTool === "erase") {
      // Erase closest markers/lines
      const remainingMarkers = markers.filter(m => {
        const dist = Math.hypot(m.x - x, m.y - y);
        return dist > 20;
      });
      setMarkers(remainingMarkers);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || canvasTool !== "draw") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Throttle stream slightly
    const lastPoint = currentLinePoints[currentLinePoints.length - 1];
    if (lastPoint && Math.hypot(lastPoint.x - x, lastPoint.y - y) > 4) {
      setCurrentLinePoints([...currentLinePoints, { x, y }]);
    }
  };

  const handleCanvasMouseUp = () => {
    if (isDrawing && currentLinePoints.length >= 2) {
      const newLine: PathLine = {
        id: "line_" + Date.now(),
        points: currentLinePoints,
        color: drawColor,
        width: 3.5
      };
      setLines([...lines, newLine]);
    }
    setIsDrawing(false);
    setCurrentLinePoints([]);
  };

  const clearCanvas = () => {
    setLines([]);
    setMarkers([]);
    
    if (isConnected && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: "clearWhiteboard"
      }));
    }
  };

  // Fast trigger helper when clicking troops in calculator to make them stampable
  const setMarkerFromList = (troopId: string) => {
    setSelectedMarkerId(troopId);
    setCanvasTool("marker");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col selection:bg-amber-500 selection:text-slate-900" id="main-coc-tactician">
      
      {/* Immersive Header Design */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-4 py-3 sm:px-6 shadow-lg shadow-slate-950/20" id="app-header">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-400 p-0.5 shadow-md flex items-center justify-center text-xl shrink-0">
              <span className="font-display font-bold text-slate-900">CoC</span>
            </div>
            <div>
              <h1 className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-2">
                Clash of Clans
              </h1>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Shield className="w-3 h-3 text-amber-500" /> Professional-tier attack calculations & AI Tactical advice
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Elegant Town Hall selector with level controls */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 flex items-center gap-2 text-sm">
              <span className="text-xs text-slate-400 uppercase font-mono px-2">Town Hall</span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setTownHall(prev => Math.max(7, prev - 1))}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 transition rounded text-xs font-bold font-mono"
                  title="Decrease Town Hall"
                >
                  -
                </button>
                <div className="bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded text-amber-500 font-sans font-extrabold flex items-center gap-1 shadow-inner">
                  🏰 TH{townHall}
                </div>
                <button 
                  onClick={() => setTownHall(prev => Math.min(16, prev + 1))}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 transition rounded text-xs font-bold font-mono"
                  title="Increase Town Hall"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={resetComposition}
              className="px-3 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          </div>
        </div>
      </header>

      {/* Dynamic Segmented Board Pages/Tabs */}
      <div className="bg-slate-900 border-b border-slate-800" id="tactical-board-navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-start gap-2 py-2.5 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab("planner")}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider font-mono rounded-lg transition-all shrink-0 ${
              activeTab === "planner"
                ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Map className="w-3.5 h-3.5" /> 🗺️ Tactical Board Plan
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab("calculator")}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider font-mono rounded-lg transition-all shrink-0 ${
              activeTab === "calculator"
                ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Sword className="w-3.5 h-3.5" /> 🧪 Army Calculator
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("playbook")}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider font-mono rounded-lg transition-all shrink-0 relative ${
              activeTab === "playbook"
                ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> 📜 AI Advisory Playbook
            {playbookResult && (
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content Workspace Layout */}
      <main className={`flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 ${
        activeTab === "planner" ? "lg:grid-cols-12" : "lg:grid-cols-1"
      } gap-6`} id="dashboard-layout">
        
        {/* LEFT COMPACT PORTFOLIO: Selection lists & limits */}
        <section className={`flex flex-col gap-6 order-last lg:order-last ${
          activeTab === "planner" 
            ? "lg:col-span-4 block" 
            : activeTab === "calculator"
              ? "lg:col-span-12 block"
              : "hidden"
        }`} id="calc-presets-section">
          
          {/* Multiplayer war-room coordination hub */}
          <div className={`rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-md flex ${
            activeTab === "planner" ? "flex-col gap-3" : "hidden"
          }`} id="coop-war-room">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-slate-600"}`} />
                <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  🛡️ Multiplayer War Room
                </h2>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-950 rounded border border-slate-850 text-slate-400">
                {isConnected ? "COLABORATIVE" : "OFFLINE"}
              </span>
            </div>

            {!isConnected ? (
              <div className="flex flex-col gap-2.5 text-xs">
                <p className="text-slate-400 leading-relaxed text-[11.5px]">
                  Coordinate troop lineups, base strategies, and whiteboard arrows live with your clanmates in real-time.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">War Room ID</label>
                    <input
                      type="text"
                      value={targetRoomId}
                      onChange={(e) => setTargetRoomId(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                      placeholder="Enter room ID..."
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-xs text-amber-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Your Alias</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Chief Name"
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={connectToRoom}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded transition flex items-center justify-center gap-1.5 font-mono uppercase"
                >
                  ⚔️ Create & Join War Room
                </button>

                {/* Available Active Rooms section */}
                <div className="border-t border-slate-800 pt-3 mt-1.5 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1">
                      🏰 Active Rooms List ({availableRooms.length})
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fetchAvailableRooms();
                      }}
                      disabled={isLoadingRooms}
                      className="text-[11px] text-amber-500 hover:text-amber-400 font-mono transition flex items-center gap-1 cursor-pointer bg-transparent border-none p-0 focus:outline-none"
                    >
                      {isLoadingRooms ? "⏳" : "🔄 Refresh"}
                    </button>
                  </div>

                  {availableRooms.length === 0 ? (
                    <div className="bg-slate-950 p-2 text-center rounded border border-slate-850">
                      <p className="text-slate-500 text-[10px] leading-relaxed">No active war planning rooms found.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setTargetRoomId("war-room-" + Math.floor(1 + Math.random() * 9));
                        }}
                        className="mt-1 text-[9.5px] text-amber-500/80 hover:text-amber-400 underline font-mono cursor-pointer"
                      >
                        🎲 Suggest Random Room ID
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-1.5 max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 pr-1">
                      {availableRooms.map((r) => (
                        <button
                          key={r.roomId}
                          type="button"
                          onClick={() => {
                            setTargetRoomId(r.roomId);
                          }}
                          className={`w-full text-left p-2 rounded border transition text-[11px] font-mono flex items-center justify-between cursor-pointer ${
                            targetRoomId === r.roomId
                              ? "bg-amber-950/20 border-amber-500/40 text-amber-300"
                              : "bg-slate-950/80 border-slate-850 hover:bg-slate-900/90 text-slate-300"
                          }`}
                        >
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="font-bold truncate text-[11px]">
                              🏰 {r.roomId}
                            </span>
                            <span className="text-[9px] text-slate-500 truncate">
                              {r.townHall ? `TH${r.townHall}` : ""} • {r.selectedBaseStyle || "tactical layout"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0 ml-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9.5px] font-bold text-slate-400">
                              {r.memberCount} {r.memberCount === 1 ? "chief" : "chiefs"}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 text-xs">
                {/* Active Members badge cluster */}
                <div className="bg-slate-950/80 p-2 rounded border border-slate-850 flex flex-col gap-1.5">
                  <span className="text-[10px] text-slate-400 font-mono uppercase flex items-center gap-1">
                    🟢 Connected Clansmiths ({roomMembers.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {roomMembers.map((m, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-0.5 rounded text-[10.5px] font-mono border ${
                          m === userName
                            ? "bg-amber-950/35 border-amber-500/40 text-amber-300 font-bold"
                            : "bg-slate-900 border-slate-800 text-slate-300"
                        }`}
                      >
                        🛡️ {m} {m === userName ? "(You)" : ""}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tactician Live Communication Feed */}
                <div className="bg-slate-950 rounded border border-slate-850 p-2.5">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block mb-1.5 border-b border-slate-900 pb-1">
                    📡 Tactical War Feed
                  </span>
                  <div className="h-[140px] overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                    {chatHistory.map((chat, idx) => {
                      const isSystem = chat.username === "System";
                      return (
                        <div key={idx} className="text-[11px] leading-relaxed">
                          {isSystem ? (
                            <div className="text-slate-500 italic flex items-start gap-1">
                              <span className="text-[10px] text-slate-600 font-mono shrink-0">[{chat.time}]</span>
                              <span>{chat.text}</span>
                            </div>
                          ) : (
                            <div className="flex flex-col bg-slate-900/40 px-2 py-1 rounded border border-slate-900">
                              <div className="flex items-center justify-between gap-1.5 mb-0.5">
                                <span className={`font-mono font-bold ${chat.username === userName ? "text-amber-400" : "text-sky-300"}`}>
                                  {chat.username}
                                </span>
                                <span className="text-[9px] text-slate-600 font-mono shrink-0">{chat.time}</span>
                              </div>
                              <p className="text-slate-300 font-sans break-all">{chat.text}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Message write context */}
                  <div className="flex items-center gap-1 mt-2 pt-2 border-t border-slate-900">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                      placeholder="Message connected clanmates..."
                      className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-sans"
                    />
                    <button
                      type="button"
                      onClick={sendChatMessage}
                      className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded transition text-xs font-mono uppercase shrink-0"
                    >
                      Send
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                        socketRef.current.send(JSON.stringify({
                          type: "updateArmy",
                          armyState: {
                            townHall,
                            plannedTroops,
                            plannedSpells,
                            plannedHeroes,
                            selectedBaseStyle,
                            customGoal,
                            playbookResult
                          }
                        }));
                        socketRef.current.send(JSON.stringify({
                          type: "chat",
                          text: `📢 Synced current base blueprint and army parameters to all strategists.`
                        }));
                      }
                    }}
                    className="p-1 px-2.5 bg-slate-950 hover:bg-slate-850 text-[10.5px] border border-slate-800 font-mono text-slate-300 rounded transition shrink-0"
                    title="Force sync current configuration parameters over to other clanmates"
                  >
                    🔄 Broadcast Setup
                  </button>
                  <button
                    type="button"
                    onClick={disconnectFromRoom}
                    className="p-1 px-3 bg-red-950/40 hover:bg-red-950 text-[10.5px] text-red-400 border border-red-900/30 rounded transition font-mono shrink-0"
                  >
                    🚪 Leave Room
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Target Base Style & Goal configuration selection panel */}
          <div className={`rounded-xl border border-slate-855 bg-slate-900 p-4 shadow-md ${
            activeTab === "planner" ? "block" : "hidden"
          }`} id="base-planner">
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider font-mono mb-3.5 flex items-center gap-1.5 border-b border-slate-800 pb-2.5">
              <Map className="w-4 h-4 text-amber-500" /> Target Layout & Objectives
            </h2>
            
            <div className="flex flex-col gap-3.5">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1.5 font-mono uppercase tracking-wide">Select Enemy Layout Target</label>
                <select
                  value={selectedBaseStyle}
                  onChange={(e) => setSelectedBaseStyle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-semibold text-amber-500 focus:outline-none focus:border-amber-500"
                >
                  {BASE_STYLES.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
                <p className="text-[10.5px] text-slate-550 mt-1.5 italic leading-relaxed">
                  {BASE_STYLES.find(b => b.id === selectedBaseStyle)?.description}
                </p>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1.5 font-mono uppercase tracking-wide">Custom Notes / War Priority</label>
                <textarea
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  placeholder="e.g. Poison CC immediately, or enter from eagle artillery angle..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-sans text-slate-300 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Section: Standard Esports Preset Templates */}
          <div className={`rounded-xl border border-slate-850 bg-slate-900 p-4 shadow-sm ${
            activeTab === "calculator" ? "block" : "hidden"
          }`} id="preset-library">
            <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2 uppercase tracking-wider font-mono">
              <Award className="w-4 h-4 text-amber-500" /> Esports Blueprint Presets
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Select an esports tactic template matching your playstyle. It auto-fills your army and spells below.
            </p>
            <div className="grid grid-cols-1 gap-2">
              {ARMY_PRESETS.map((p) => {
                // Check if any troop requires TH higher than selected townHall
                const isUsableAtTh = true; // all presets adapted down
                return (
                  <button
                    key={p.name}
                    onClick={() => handleLoadPreset(p)}
                    className={`w-full text-left p-3 rounded-lg border transition text-xs flex flex-col gap-1 ${
                      activePreset === p.name
                        ? "bg-amber-950/20 border-amber-500 text-amber-200"
                        : "bg-slate-950/60 border-slate-800 hover:bg-slate-850 hover:border-slate-750 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full font-bold">
                      <span className="font-display text-xs tracking-wide">{p.name}</span>
                      {activePreset === p.name && (
                        <span className="bg-amber-500 text-slate-950 font-extrabold text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded">
                          Selected
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-sans leading-relaxed">
                      {p.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Army Calculator Interface Card */}
          <div className={`rounded-xl border border-slate-850 bg-slate-900 p-4 shadow-sm ${
            activeTab === "calculator" ? "block" : "hidden"
          }`} id="army-calculator">
            
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Sword className="w-4 h-4 text-orange-500" /> Troop & Spell Calculator
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Custom layout troop space capacity breakdown</p>
              </div>
              <div className="text-right">
                <span className={`text-xs font-bold font-mono px-2 py-1 rounded ${
                  totalTroopsSpace > limits.maxTroopsSpace ? 'bg-red-950 text-red-400' : 'bg-slate-950 text-slate-300'
                }`}>
                  🚀 {totalTroopsSpace} / {limits.maxTroopsSpace} Space
                </span>
              </div>
            </div>

            {/* Live Visual Indicators Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1 font-mono uppercase">
                  <Clock className="w-3 h-3 text-cyan-400" /> Training
                </div>
                <div className="text-xs font-bold text-slate-200 mt-1 font-mono">{formatTime(totalTrainingTime)}</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1 font-mono uppercase">
                  💧 Elixir Cost
                </div>
                <div className="text-xs font-bold text-sky-400 mt-1 font-mono">{elixirCost.toLocaleString()}</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1 font-mono uppercase">
                  ⚛️ Dark Elixir
                </div>
                <div className="text-xs font-bold text-indigo-400 mt-1 font-mono">{darkElixirCost}</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1 font-mono uppercase font-sans">
                  🧪 Spells Cap
                </div>
                <div className="text-xs font-bold text-purple-400 mt-1 font-mono">
                  {totalSpellsSpace} / {limits.maxSpellsSpace}
                </div>
              </div>
            </div>

            {/* Scrollable Troops Selection Grid */}
            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
              
              {/* Ground Troops Column Group */}
              <div>
                <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5 border-b border-slate-800 pb-1">
                  <span>✊ Ground Attackers</span>
                </h3>
                <div className="grid grid-cols-1 gap-1.5">
                  {TROOPS_DATA.filter(t => t.category === "ground").map(t => {
                    const currentCount = plannedTroops[t.id] || 0;
                    return (
                      <div 
                        key={t.id} 
                        className={`flex items-center justify-between p-2 rounded-lg bg-slate-950/60 transition ${
                          currentCount > 0 ? "border border-amber-500/30 bg-slate-950" : "border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span 
                            onClick={() => setMarkerFromList(t.id)}
                            className="text-lg cursor-pointer hover:scale-125 transition" 
                            title="Click to select as map marker stamp"
                          >
                            {t.imageUrl}
                          </span>
                          <div>
                            <span 
                              onClick={() => setMarkerFromList(t.id)}
                              className="text-xs font-semibold text-slate-100 cursor-pointer hover:underline"
                            >
                              {t.name}
                            </span>
                            <div className="text-[10px] text-slate-400">
                              Space: {t.housingSpace} | {t.type === "elixir" ? "💧" : "⚛️"} {t.cost}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => adjustTroopCount(t.id, -1)}
                            className="h-6 w-6 rounded bg-slate-800 hover:bg-slate-700 active:bg-slate-650 flex items-center justify-center text-xs transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold font-mono">
                            {currentCount}
                          </span>
                          <button
                            onClick={() => adjustTroopCount(t.id, 1)}
                            className="h-6 w-6 rounded bg-slate-800 hover:bg-slate-700 active:bg-slate-650 flex items-center justify-center text-xs transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Air Troops Column Group */}
              <div>
                <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5 border-b border-slate-800 pb-1">
                  <span>🎈 Air Attackers</span>
                </h3>
                <div className="grid grid-cols-1 gap-1.5">
                  {TROOPS_DATA.filter(t => t.category === "air").map(t => {
                    const currentCount = plannedTroops[t.id] || 0;
                    return (
                      <div 
                        key={t.id} 
                        className={`flex items-center justify-between p-2 rounded-lg bg-slate-950/60 transition ${
                          currentCount > 0 ? "border border-sky-550/30 bg-slate-950" : "border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span 
                            onClick={() => setMarkerFromList(t.id)}
                            className="text-lg cursor-pointer hover:scale-125 transition"
                            title="Click to select as map marker stamp"
                          >
                            {t.imageUrl}
                          </span>
                          <div>
                            <span 
                              onClick={() => setMarkerFromList(t.id)}
                              className="text-xs font-semibold text-slate-100 cursor-pointer hover:underline"
                            >
                              {t.name}
                            </span>
                            <div className="text-[10px] text-slate-400">
                              Space: {t.housingSpace} | {t.type === "elixir" ? "💧" : "⚛️"} {t.cost}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => adjustTroopCount(t.id, -1)}
                            className="h-6 w-6 rounded bg-slate-800 hover:bg-slate-700 active:bg-slate-650 flex items-center justify-center text-xs transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold font-mono">
                            {currentCount}
                          </span>
                          <button
                            onClick={() => adjustTroopCount(t.id, 1)}
                            className="h-6 w-6 rounded bg-slate-800 hover:bg-slate-700 active:bg-slate-650 flex items-center justify-center text-xs transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Heroes Column Group */}
              <div>
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5 border-b border-slate-800 pb-1">
                  <span>👑 Battle Heroes</span>
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {HEROES_DATA.map(h => {
                    const unlocked = townHall >= h.unlockedAtTh;
                    const active = plannedHeroes[h.id] || false;
                    return (
                      <button
                        key={h.id}
                        onClick={() => toggleHero(h.id, h.unlockedAtTh)}
                        disabled={!unlocked}
                        className={`p-2 rounded-lg border text-left transition flex flex-col gap-0.5 relative overflow-hidden ${
                          !unlocked 
                            ? "bg-slate-950/20 border-slate-900 opacity-40 cursor-not-allowed"
                            : active 
                              ? "bg-emerald-950/20 border-emerald-500 text-emerald-200"
                              : "bg-slate-950/80 border-slate-800 text-slate-400 hover:bg-slate-850"
                        }`}
                      >
                        <span className="text-xs font-bold font-display tracking-tight flex items-center gap-1">
                          {h.name === "Barbarian King" ? "👑" : "👸"} {h.name}
                        </span>
                        <span className="text-[9px] text-slate-500">
                          {unlocked ? "Ready" : `Unlocks at TH ${h.unlockedAtTh}`}
                        </span>
                        {unlocked && active && (
                          <div className="absolute right-1 bottom-1 h-2 w-2 rounded-full bg-emerald-400 shadow shadow-emerald-400 animate-pulse" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Spells Selection Column Group */}
              <div>
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5 border-b border-slate-800 pb-1">
                  <span>🧪 Battle Spells</span>
                </h3>
                <div className="grid grid-cols-1 gap-1.5">
                  {SPELLS_DATA.map(s => {
                    const currentCount = plannedSpells[s.id] || 0;
                    return (
                      <div 
                        key={s.id} 
                        className={`flex items-center justify-between p-2 rounded-lg bg-slate-950/60 transition ${
                          currentCount > 0 ? "border border-cyan-550/30 bg-slate-950" : "border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span 
                            onClick={() => setMarkerFromList(s.id)}
                            className="bg-slate-900 h-7 w-7 rounded-md flex items-center justify-center text-xs border border-slate-800 cursor-pointer hover:bg-slate-800"
                            title="Place Spell marker on layout"
                          >
                            🧪
                          </span>
                          <div>
                            <span 
                              onClick={() => setMarkerFromList(s.id)}
                              className="text-xs font-semibold text-slate-100 cursor-pointer hover:underline"
                            >
                              {s.name}
                            </span>
                            <div className="text-[10px] text-slate-400">
                              Space: {s.housingSpace} | {s.type === "elixir" ? "💧" : "⚛️"}{s.cost}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => adjustSpellCount(s.id, -1)}
                            className="h-6 w-6 rounded bg-slate-800 hover:bg-slate-700 active:bg-slate-650 flex items-center justify-center text-xs transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold font-mono text-cyan-400">
                            {currentCount}
                          </span>
                          <button
                            onClick={() => adjustSpellCount(s.id, 1)}
                            className="h-6 w-6 rounded bg-slate-800 hover:bg-slate-700 active:bg-slate-650 flex items-center justify-center text-xs transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* RIGHT COMPLEX WORKSPACE PORTFOLIO: Interactive Whiteboard & AI Outputs */}
        <section className={`flex flex-col gap-6 order-first lg:order-first ${
          activeTab === "planner"
            ? "lg:col-span-8 block"
            : activeTab === "playbook"
              ? "lg:col-span-12 block"
              : "hidden"
        }`} id="tactical-board-section">
          
          {/* Interactive Tactical Sketchpad Canvas Widget */}
          <div className={`rounded-xl border border-slate-850 bg-slate-900 p-4 shadow-sm flex flex-col ${
            activeTab === "planner" ? "block font-sans" : "hidden"
          }`} id="tactical-whiteboard">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-200 font-display flex items-center gap-1.5">
                  <span className="inline-block p-1 bg-red-500/15 text-red-400 rounded-md">⚔️</span> Interactive Battle Strategy Map
                </h3>
                <p className="text-xs text-slate-400">Design funnel guides, path arrows, and deploy troop indicators</p>
              </div>

              {/* Sketchpad Control Bar */}
              <div className="flex border border-slate-800 rounded-lg p-0.5 bg-slate-950 w-fit shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => setCanvasTool("draw")}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded flex items-center gap-1 transition ${
                    canvasTool === "draw" ? "bg-red-500/25 border border-red-500/45 text-red-200" : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="Draw funneling or attack direction paths"
                >
                  <PenTool className="w-3 h-3" /> Paths
                </button>
                <button
                  type="button"
                  onClick={() => setCanvasTool("marker")}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded flex items-center gap-1 transition ${
                    canvasTool === "marker" ? "bg-blue-500/25 border border-blue-500/45 text-blue-200" : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="Place troops, spell, or hero stamps onto base grid"
                >
                  📍 Stamps
                </button>
                <button
                  type="button"
                  onClick={() => setCanvasTool("erase")}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded flex items-center gap-1 transition ${
                    canvasTool === "erase" ? "bg-amber-500/25 border border-amber-500/45 text-amber-200" : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="Wipe markers"
                >
                  🧹 Clear Area
                </button>
              </div>
            </div>

            {/* Quick selectors for Markers and Colors depending on Tool Selection */}
            {canvasTool === "draw" && (
              <div className="flex flex-wrap items-center gap-3 mb-2 px-1 py-0.5 bg-slate-950/60 rounded-md text-xs">
                <span className="text-slate-400 font-mono">Arrow Type:</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setDrawColor("#ef4444")} 
                    className={`h-4 w-4 rounded-full bg-red-500 border-2 transition ${drawColor === "#ef4444" ? "border-slate-100 scale-110" : "border-slate-800"}`} 
                    title="Funnel / Perimeter"
                  />
                  <button 
                    onClick={() => setDrawColor("#3b82f6")} 
                    className={`h-4 w-4 rounded-full bg-blue-500 border-2 transition ${drawColor === "#3b82f6" ? "border-slate-100 scale-110" : "border-slate-800"}`} 
                    title="Main Army Charge Entry"
                  />
                  <button 
                    onClick={() => setDrawColor("#eab308")} 
                    className={`h-4 w-4 rounded-full bg-yellow-500 border-2 transition ${drawColor === "#eab308" ? "border-slate-100 scale-110" : "border-slate-800"}`} 
                    title="Heroes & King/Queen Line"
                  />
                  <button 
                    onClick={() => setDrawColor("#a855f7")} 
                    className={`h-4 w-4 rounded-full bg-purple-500 border-2 transition ${drawColor === "#a855f7" ? "border-slate-100 scale-110" : "border-slate-800"}`} 
                    title="Spells drops"
                  />
                </div>
                <span className="text-slate-500 italic text-[10px]">Drag on map below to draw tactical arrows</span>
              </div>
            )}

            {canvasTool === "marker" && (
              <div className="mb-4 bg-slate-950/40 p-3 rounded-lg border border-slate-800/80 flex flex-col gap-3">
                {/* Barracks-themed Category Tabs Selector */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800/50">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">Select Unit Card:</span>
                    <span className="text-[10px] text-slate-500 hidden sm:inline">(select card below to stamp on map)</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-850">
                    <button
                      type="button"
                      onClick={() => setMarkerCategory("ground")}
                      className={`px-2.5 py-1 text-[10px] sm:text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                        markerCategory === "ground"
                          ? "bg-amber-500 text-slate-950 shadow"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      ✊ Ground
                    </button>
                    <button
                      type="button"
                      onClick={() => setMarkerCategory("air")}
                      className={`px-2.5 py-1 text-[10px] sm:text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                        markerCategory === "air"
                          ? "bg-amber-500 text-slate-950 shadow"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      🎈 Air
                    </button>
                    <button
                      type="button"
                      onClick={() => setMarkerCategory("spell")}
                      className={`px-2.5 py-1 text-[10px] sm:text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                        markerCategory === "spell"
                          ? "bg-amber-500 text-slate-950 shadow"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      🧪 Spells
                    </button>
                    <button
                      type="button"
                      onClick={() => setMarkerCategory("hero")}
                      className={`px-2.5 py-1 text-[10px] sm:text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                        markerCategory === "hero"
                          ? "bg-amber-500 text-slate-950 shadow"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      👑 Heroes
                    </button>
                  </div>
                </div>

                {/* Available Unit Cards Grid Container */}
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-[160px] overflow-y-auto pr-1">
                  {/* Ground category troops rendering */}
                  {markerCategory === "ground" &&
                    TROOPS_DATA.filter(t => t.category === "ground").map(t => {
                      const isSelected = selectedMarkerId === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSelectedMarkerId(t.id)}
                          className={`group relative flex flex-col items-center justify-between p-2 rounded-lg border text-center transition-all cursor-pointer ${
                            isSelected
                              ? "bg-amber-500/10 border-amber-500 shadow-sm shadow-amber-500/10"
                              : "bg-slate-900/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700 text-slate-300"
                          }`}
                        >
                          <div className={`w-9 h-9 flex items-center justify-center text-lg rounded-md transition-colors ${
                            isSelected ? "bg-amber-500/10" : "bg-slate-950"
                          }`}>
                            {t.imageUrl}
                          </div>
                          <span className={`text-[10px] font-bold mt-1.5 truncate max-w-full ${isSelected ? "text-amber-400" : "text-slate-200"}`}>
                            {t.name}
                          </span>
                          <span className="text-[8px] text-slate-500 font-mono mt-0.5 whitespace-nowrap">
                            {t.type === "elixir" ? "💧" : "⚛️"} Space: {t.housingSpace}
                          </span>
                          {isSelected && (
                            <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                          )}
                        </button>
                      );
                    })}

                  {/* Air category troops rendering */}
                  {markerCategory === "air" &&
                    TROOPS_DATA.filter(t => t.category === "air").map(t => {
                      const isSelected = selectedMarkerId === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSelectedMarkerId(t.id)}
                          className={`group relative flex flex-col items-center justify-between p-2 rounded-lg border text-center transition-all cursor-pointer ${
                            isSelected
                              ? "bg-amber-500/10 border-amber-500 shadow-sm shadow-amber-500/10"
                              : "bg-slate-900/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700 text-slate-300"
                          }`}
                        >
                          <div className={`w-9 h-9 flex items-center justify-center text-lg rounded-md transition-colors ${
                            isSelected ? "bg-amber-500/15" : "bg-slate-950"
                          }`}>
                            {t.imageUrl}
                          </div>
                          <span className={`text-[10px] font-bold mt-1.5 truncate max-w-full ${isSelected ? "text-amber-400" : "text-slate-200"}`}>
                            {t.name}
                          </span>
                          <span className="text-[8px] text-slate-500 font-mono mt-0.5 whitespace-nowrap">
                            {t.type === "elixir" ? "💧" : "⚛️"} Space: {t.housingSpace}
                          </span>
                          {isSelected && (
                            <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                          )}
                        </button>
                      );
                    })}

                  {/* Spells category rendering */}
                  {markerCategory === "spell" &&
                    SPELLS_DATA.map(s => {
                      const isSelected = selectedMarkerId === s.id;
                      const spellEmojis: { [key: string]: string } = {
                        lightning: "⚡",
                        healing: "💚",
                        rage: "🔥",
                        jump: "🦘",
                        freeze: "❄️",
                        clone: "👥",
                        invisibility: "👻",
                        poison: "🤢",
                        earthquake: "📳",
                        haste: "🏃",
                        bat: "🦇"
                      };
                      const emoji = spellEmojis[s.id] || "🧪";
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSelectedMarkerId(s.id)}
                          className={`group relative flex flex-col items-center justify-between p-2 rounded-lg border text-center transition-all cursor-pointer ${
                            isSelected
                              ? "bg-amber-500/10 border-amber-500 shadow-sm shadow-amber-500/10"
                              : "bg-slate-900/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700 text-slate-300"
                          }`}
                        >
                          <div className={`w-9 h-9 flex items-center justify-center text-lg rounded-md transition-colors ${
                            isSelected ? "bg-amber-500/15" : "bg-slate-950"
                          }`}>
                            {emoji}
                          </div>
                          <span className={`text-[10px] font-bold mt-1.5 truncate max-w-full ${isSelected ? "text-amber-400" : "text-slate-200"}`}>
                            {s.name.replace(" Spell", "")}
                          </span>
                          <span className="text-[8px] text-slate-500 font-mono mt-0.5 whitespace-nowrap">
                            {s.type === "elixir" ? "💧" : "⚛️"} Space: {s.housingSpace}
                          </span>
                          {isSelected && (
                            <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                          )}
                        </button>
                      );
                    })}

                  {/* Heroes category rendering */}
                  {markerCategory === "hero" &&
                    HEROES_DATA.map(h => {
                      const isSelected = selectedMarkerId === h.id;
                      const heroEmojis: { [key: string]: string } = {
                        barbarian_king: "👑",
                        archer_queen: "👸",
                        grand_warden: "👴",
                        royal_champion: "🦸‍♀️"
                      };
                      const emoji = heroEmojis[h.id] || "👑";
                      return (
                        <button
                          key={h.id}
                          type="button"
                          onClick={() => setSelectedMarkerId(h.id)}
                          className={`group relative flex flex-col items-center justify-between p-2 rounded-lg border text-center transition-all cursor-pointer ${
                            isSelected
                              ? "bg-amber-500/10 border-amber-500 shadow-sm shadow-amber-500/10"
                              : "bg-slate-900/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700 text-slate-300"
                          }`}
                        >
                          <div className={`w-9 h-9 flex items-center justify-center text-lg rounded-md transition-colors ${
                            isSelected ? "bg-amber-500/15" : "bg-slate-950"
                          }`}>
                            {emoji}
                          </div>
                          <span className={`text-[10px] font-bold mt-1.5 truncate max-w-full ${isSelected ? "text-amber-400" : "text-slate-200"}`}>
                            {h.name}
                          </span>
                          <span className="text-[8px] text-slate-500 font-mono mt-0.5 whitespace-nowrap">
                            TH Unlock: {h.unlockedAtTh}
                          </span>
                          {isSelected && (
                            <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                          )}
                        </button>
                      );
                    })}
                </div>
                
                <div className="flex items-center justify-end text-[10px] text-slate-500 gap-1 mt-0.5">
                  <span>🎯 Click anywhere on the tactical map grid to deploy the selected stamp</span>
                </div>
              </div>
            )}

            {/* Drawing Canvas Box with Base Blueprint Graphic Layer */}
            <div className="relative border border-slate-800 rounded-lg overflow-hidden bg-slate-950 aspect-[4/3] w-full" id="whiteboard-canvas-box">
              <canvas
                ref={canvasRef}
                width={520}
                height={390}
                className="w-full h-full block cursor-crosshair relative z-10"
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
              />
              <div className="absolute right-3 bottom-3 z-20 flex gap-1">
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="p-1 px-2.5 bg-slate-900/90 hover:bg-slate-800 text-[10px] text-slate-400 hover:text-white rounded border border-slate-755 transition flex items-center gap-1 font-mono"
                >
                  <RotateCcw className="w-3 h-3" /> Clear Map Sketches
                </button>
              </div>
            </div>

            {/* AI Advisor playbook generation button trigger */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="text-xs text-slate-400">
                  Plans are customized to your actual allocated army roster space limits. Verify TH limits before applying in war!
                </span>
              </div>
              <button
                onClick={generateAiPlaybook}
                disabled={isGenerating}
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/5 cursor-pointer uppercase tracking-wider"
              >
                {isGenerating ? (
                  <>
                    <div className="h-3 w-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Roster...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-slate-950" />
                    <span>Build AI Tactical Playbook</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Attack Playbook Advisories output block */}
          {apiError && (
            <div className="rounded-xl border border-red-900/40 bg-red-950/20 p-4 text-xs text-red-400 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
              <div>
                <span className="font-bold block">Command Room Error</span>
                <span>{apiError}</span>
              </div>
            </div>
          )}

          {activeTab === "playbook" && playbookResult && (
            <div className="rounded-xl border border-amber-950/35 bg-slate-900 shadow-xl overflow-hidden" id="playbook-report">
              
              {/* Header section card */}
              <div className="bg-gradient-to-r from-slate-900 via-amber-950/15 to-slate-900 border-b border-slate-800 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] text-amber-500 uppercase tracking-widest font-mono font-bold">
                    🛡️ AI Tactical Attack Intel
                  </div>
                  <h3 className="text-lg font-bold font-display tracking-wide text-white mt-0.5">
                    {playbookResult.strategyName}
                  </h3>
                </div>
                <div className="bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider px-2 py-1 rounded max-w-fit shadow">
                  PRO ADVISORY PLAYBOOK
                </div>
              </div>

              {/* Body strategic divisions */}
              <div className="p-5 space-y-5 text-xs">
                
                {/* Tactical Overview Info block */}
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
                  <span className="font-bold text-slate-300 font-mono text-[10.5px] uppercase block mb-1">
                    🎯 Tactical Counter Justification
                  </span>
                  <p className="text-slate-400 leading-relaxed font-sans">
                    {playbookResult.overview}
                  </p>
                </div>

                {/* Phase 1 steps */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 border-t border-slate-800 pt-4">
                  <div className="md:col-span-4">
                    <span className="font-extrabold text-amber-500 font-mono text-[10px] uppercase block mb-1">
                      PHASE 1: THE FUNNEL
                    </span>
                    <span className="text-slate-300 font-bold block">Perimeter Blockade</span>
                    <span className="text-[10px] text-slate-450 italic mt-1.5 block">
                      Required units: {playbookResult.phase1Funnel.troopAllocation}
                    </span>
                  </div>
                  <div className="md:col-span-8 space-y-2">
                    <span className="text-slate-400 font-bold italic block">
                      Objective: {playbookResult.phase1Funnel.objective}
                    </span>
                    <ul className="space-y-1.5">
                      {playbookResult.phase1Funnel.stepByStep.map((step, idx) => (
                        <li key={idx} className="flex gap-2 items-start text-slate-300 leading-relaxed">
                          <span className="h-4 w-4 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-[9px] font-mono text-amber-500 mt-0.5 shrink-0">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Phase 2 steps */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 border-t border-slate-800 pt-4">
                  <div className="md:col-span-4">
                    <span className="font-extrabold text-sky-400 font-mono text-[10px] uppercase block mb-1">
                      PHASE 2: COMPARTMENT ENTRY
                    </span>
                    <span className="text-slate-300 font-bold block">Sector Insertion</span>
                    <div className="mt-2 space-y-1 text-[10.5px]">
                      <div className="text-slate-450"><span className="text-slate-400 font-mono font-bold">Angle:</span> {playbookResult.phase2Entry.entryAngle}</div>
                      <div className="text-slate-450"><span className="text-slate-400 font-mono font-bold">Siege:</span> {playbookResult.phase2Entry.siegeUsage}</div>
                    </div>
                  </div>
                  <div className="md:col-span-8">
                    <ul className="space-y-1.5">
                      {playbookResult.phase2Entry.stepByStep.map((step, idx) => (
                        <li key={idx} className="flex gap-2 items-start text-slate-300 leading-relaxed">
                          <span className="h-4 w-4 rounded-full bg-sky-500/10 border border-sky-500/25 flex items-center justify-center text-[9px] font-mono text-sky-450 mt-0.5 shrink-0">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Phase 3 spells & cleaning */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 border-t border-slate-800 pt-4">
                  <div className="md:col-span-4">
                    <span className="font-extrabold text-purple-400 font-mono text-[10px] uppercase block mb-1">
                      PHASE 3: SPELLS & CLEANUP
                    </span>
                    <span className="text-slate-300 font-bold block">Rage & Spell Spikes</span>
                  </div>
                  <div className="md:col-span-8 space-y-3">
                    <div>
                      <span className="font-semibold text-purple-300 block mb-0.5">Spell Management Advice</span>
                      <p className="text-slate-400 leading-relaxed">{playbookResult.phase3SpellsHeroes.spellTiming}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-emerald-300 block mb-0.5">Hero Capability Triggers</span>
                      <p className="text-slate-400 leading-relaxed">{playbookResult.phase3SpellsHeroes.heroAbilities}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-teal-300 block mb-0.5">Cleanup Protocol</span>
                      <p className="text-slate-400 leading-relaxed">{playbookResult.phase3SpellsHeroes.cleanupAction}</p>
                    </div>
                  </div>
                </div>

                {/* High Threats, Luring & Backups */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 border-t border-slate-800 pt-4 bg-slate-950/20 p-2.5 rounded-lg border border-slate-850/60">
                  <div className="md:col-span-4">
                    <span className="font-extrabold text-red-400 font-mono text-[10px] uppercase block mb-1">
                      RISK ASSESSMENT
                    </span>
                    <span className="text-red-300 font-bold block">Enemy Countermeasures</span>
                  </div>
                  <div className="md:col-span-8 space-y-3 text-[11px]">
                    <div>
                      <span className="font-semibold text-red-300 block">Defense CC Neutralization (Clan Castle)</span>
                      <p className="text-slate-400 mt-0.5 leading-relaxed">{playbookResult.threatsAndCounters.clanCastle}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-350 block">Target Priorities to Snipe</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {playbookResult.threatsAndCounters.highThreatBuildings.map((building, i) => (
                          <span key={i} className="px-2 py-0.5 bg-red-950/40 text-red-350 rounded border border-red-900/40 font-mono text-[10px]">
                            ⚠️ {building}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold text-amber-300 block">Emergency Backup Redirection Plan</span>
                      <p className="text-slate-400 mt-0.5 leading-relaxed">{playbookResult.threatsAndCounters.backupPlan}</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeTab === "playbook" && !playbookResult && (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 shadow-md text-center flex flex-col items-center justify-center gap-4 max-w-2xl mx-auto my-6" id="playbook-empty-state">
              <div className="p-3.5 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20 mb-1">
                <Sparkles className="w-8 h-8 fill-amber-500/10 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-white uppercase font-mono tracking-wider">AI Advisories Locked</h3>
              <p className="text-slate-400 text-xs max-w-md leading-relaxed">
                The offensive blueprint playbook acts on your training queue configuration. Configure your roster on the <button type="button" onClick={() => setActiveTab("calculator")} className="text-amber-500 hover:text-amber-400 font-semibold focus:outline-none transition cursor-pointer">🧪 Army Calculator</button> page, set base style context, then trigger the generator to draft professional attack pipelines!
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm mt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("planner")}
                  className="w-full px-4 py-2.5 bg-slate-950 hover:bg-slate-850 text-slate-300 font-bold border border-slate-800 text-xs rounded transition uppercase tracking-wider font-mono flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Map className="w-3.5 h-3.5" /> Back to Whiteboard
                </button>
                <button
                  type="button"
                  onClick={generateAiPlaybook}
                  disabled={isGenerating}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-950 font-bold text-xs rounded transition uppercase tracking-wider font-mono flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isGenerating ? "Analyzing..." : "Draft Playbook"}
                </button>
              </div>
            </div>
          )}

        </section>

      </main>

      {/* Decorative footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500" id="app-footer">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>This Clash planner operates state checks on housing constraints. Customize compositions for perfect attacks.</p>
          <p className="font-mono text-[10px] text-slate-600">PRO COMMAND STATION v1.4.1</p>
        </div>
      </footer>
    </div>
  );
}
