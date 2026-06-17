import React, { useState, useEffect, useRef } from 'react';
import { Faction, PlacedStructure, PlacedUnit, LogMessage } from './types';
import BattleGrid from './components/BattleGrid';
import BuildSidebar from './components/BuildSidebar';
import Soundboard from './components/Soundboard';
import MissionBriefing from './components/MissionBriefing';
import NostalgiaEncyclopedia from './components/NostalgiaEncyclopedia';
import { playSynthSound } from './utils/audioSynth';
import { ShieldCheck, Calendar, RefreshCcw, HelpCircle, Terminal } from 'lucide-react';

export default function App() {
  const [faction, setFaction] = useState<Faction>('ALLIES');
  const [credits, setCredits] = useState<number>(8500); // Decent starting funds
  const [structures, setStructures] = useState<PlacedStructure[]>([]);
  const [units, setUnits] = useState<PlacedUnit[]>([]);
  const [placementItem, setPlacementItem] = useState<any>(null);
  const [activePage, setActivePage] = useState<'WARZONE' | 'INTEL'>('WARZONE');
  
  // multiplayer socket states
  const [commanderId, setCommanderId] = useState<string>('');
  const [commanderName, setCommanderName] = useState<string>('COMMANDER');
  const [otherCommanders, setOtherCommanders] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  
  const wsRef = useRef<WebSocket | null>(null);

  // Tactical action logger
  const [logMessages, setLogMessages] = useState<LogMessage[]>([
    {
      id: 'init_1',
      text: '★ Red Alert 2 Command console authenticated. Grid standing by.',
      type: 'success',
      timestamp: new Date().toLocaleTimeString()
    },
    {
      id: 'init_2',
      text: 'Establishing battlefield control, stand by...',
      type: 'info',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  // Electrical dynamic power tracking (MW)
  const [powerStatus, setPowerStatus] = useState<{ prod: number; cons: number }>({
    prod: 150, // construction yard default baseline
    cons: 10
  });

  // Push new lines into combat feed
  const addLogMessage = (text: string, type: 'info' | 'warning' | 'danger' | 'success') => {
    const newMessage: LogMessage = {
      id: `log_${Date.now()}_${Math.random()}`,
      text,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setLogMessages(prev => [newMessage, ...prev].slice(0, 40)); // keep up to 40 logs
  };

  // Helper to send frame
  const webSocketSend = (type: string, payload: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, payload }));
    }
  };

  // Initialize and listen to WebSocket connection
  useEffect(() => {
    const isHttps = window.location.protocol === 'https:';
    const wsProtocol = isHttps ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}`;
    
    console.log(`[RTS COMMAND] Connecting to secure tactical comms: ${wsUrl}`);
    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;

    socket.onopen = () => {
      console.log("[RTS COMMAND] Comms established.");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case 'init': {
            const { commanderId: cid, commanderName: cname, structures: s, units: u, commanders } = data.payload;
            setCommanderId(cid);
            setCommanderName(cname);
            setOtherCommanders(commanders.filter((c: any) => c.id !== cid));
            if (s && s.length > 0) {
              setStructures(s);
            }
            if (u) {
              setUnits(u);
            }
            addLogMessage(`★ Authenticated as commander: ${cname}`, "success");
            break;
          }
          case 'commander_joined': {
            const { id, name, commanders } = data.payload;
            setOtherCommanders(commanders.filter((c: any) => c.id !== commanderId));
            addLogMessage(`📡 COMMAND LINK ESTABLISHED: ${name} synced to tactical network.`, "info");
            playSynthSound('construction_complete');
            break;
          }
          case 'commander_left': {
            const { name, commanders } = data.payload;
            if (wsRef.current) {
              // Recalculate other players list ignoring ourselves
              const currentId = commanderId || '';
              setOtherCommanders(commanders.filter((c: any) => c.id !== currentId));
            }
            addLogMessage(`🛰️ COMMAND LINK LOST: ${name} offline.`, "warning");
            break;
          }
          case 'commanders_list_update': {
            const commandersList = data.payload;
            const currentId = commanderId || '';
            setOtherCommanders(commandersList.filter((c: any) => c.id !== currentId));
            break;
          }
          case 'commander_cursor': {
            const { id, name, faction: f, x, y } = data.payload;
            setOtherCommanders(prev => prev.map(c => {
              if (c.id === id) {
                return { ...c, cursorX: x, cursorY: y, faction: f };
              }
              return c;
            }));
            break;
          }
          case 'place_structure': {
            const { struct, commanderName: senderName } = data.payload;
            setStructures(prev => {
              if (prev.some(s => s.id === struct.id)) return prev;
              return [...prev, struct];
            });
            addLogMessage(`[CO-OP] Commander ${senderName} deployed ${struct.type.replace('_', ' ').toUpperCase()}`, "success");
            playSynthSound('construction_complete');
            break;
          }
          case 'spawn_unit': {
            const { unit, commanderName: senderName } = data.payload;
            setUnits(prev => {
              if (prev.some(u => u.id === unit.id)) return prev;
              return [...prev, unit];
            });
            addLogMessage(`[CO-OP] Commander ${senderName} trained ${unit.type}!`, "success");
            playSynthSound('construction_complete');
            break;
          }
          case 'move_unit': {
            const { id, targetX, targetY } = data.payload;
            setUnits(prev => prev.map(u => {
              if (u.id === id) {
                return { ...u, targetX, targetY };
              }
              return u;
            }));
            break;
          }
          case 'chat_message': {
            const chatLog = data.payload;
            addLogMessage(`💬 [COM] ${chatLog.sender}: ${chatLog.text}`, chatLog.faction === 'SOVIETS' ? 'danger' : chatLog.faction === 'YURI' ? 'warning' : 'info');
            break;
          }
          case 'soundboard_trigger': {
            const { soundName, quote, sender } = data.payload;
            if (soundName === 'speech_custom') {
              const parts = quote.split(':');
              const act = parts[0] as 'EVA' | 'SOVIET' | 'YURI';
              const text = parts.slice(1).join(':');
              addLogMessage(`🔊 [COM] ${sender} broadcast: "${text}"`, "success");
              
              if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                if (act === 'SOVIET') { utterance.rate = 0.85; utterance.pitch = 0.75; }
                else if (act === 'YURI') { utterance.rate = 0.95; utterance.pitch = 0.6; }
                else { utterance.rate = 1.05; utterance.pitch = 1.1; }
                window.speechSynthesis.speak(utterance);
              }
            } else {
              addLogMessage(`🔊 [COM] ${sender} triggered SFX: "${quote}"`, "success");
              playSynthSound(soundName);
            }
            break;
          }
          case 'reset_battlefield': {
            const { structures: s, units: u, commanderName: senderName, faction: f } = data.payload;
            setStructures(s);
            setUnits(u);
            addLogMessage(`🚨 Tactical map reset by commander ${senderName}!`, "danger");
            playSynthSound('siren');
            break;
          }
        }
      } catch (err) {
        console.error("[RTS COMMAND] Failed to process incoming frame:", err);
      }
    };

    socket.onclose = () => {
      console.log("[RTS COMMAND] Comms disconnected.");
    };

    return () => {
      socket.close();
    };
  }, [commanderId]);

  // Synchronize faction and name profile changes to the WebSocket backend
  useEffect(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && commanderName) {
      wsRef.current.send(JSON.stringify({
        type: 'update_profile',
        payload: {
          name: commanderName,
          faction: faction
        }
      }));
    }
  }, [faction, commanderName]);

  const resetBattlefield = (chosenFaction: Faction, fromRemote = false) => {
    playSynthSound('construction_complete');
    
    // Clear out
    setUnits([]);
    setCredits(8500);
    setPlacementItem(null);

    // Default Construction Yard positioning on grid
    const cyId = chosenFaction === 'ALLIES' ? 'allied_const' : chosenFaction === 'SOVIETS' ? 'soviet_const' : 'yuri_const';
    const initStructures: PlacedStructure[] = [
      {
        id: `placed_conyard_${Date.now()}`,
        type: cyId,
        x: 13, // Bottom right section
        y: 13,
        hp: 1000,
        maxHp: 1000,
        active: true,
      }
    ];

    setStructures(initStructures);
    setPowerStatus({ prod: 150, cons: 10 });
    
    addLogMessage(`Factions switched! Enlisted as ${chosenFaction} commander. Base Construction Yard positioned.`, 'success');

    if (!fromRemote) {
      webSocketSend("reset_battlefield", { faction: chosenFaction });
    }
  };

  // Quick sound test
  const handleLogoClick = () => {
    playSynthSound('siren');
    addLogMessage('Nuclear Warning Alert triggered! Air attack countermeasures initialized.', 'danger');
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    webSocketSend("chat_message", { message: chatInput });
    setChatInput('');
  };

  return (
    <div id="full_app_container" className="min-h-screen bg-slate-950 text-neutral-100 flex flex-col font-sans select-none tracking-normal antialiased pb-8">
      {/* Absolute CRT Scanlines Grid */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_60%,rgba(0,0,0,0.5)_100%)] z-10 opacity-70"></div>

      {/* Retro Red Alert 2 Header Bar */}
      <header className="bg-gradient-to-r from-red-950 via-neutral-900 to-indigo-950 border-b border-neutral-800 py-3 px-6 shadow-md z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Logo & Sound alarm */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={handleLogoClick}>
            <div className="bg-red-700/90 border-2 border-red-500 rounded p-1.5 flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-xl leading-none">🎖️</span>
            </div>
            <div>
              <h1 className="text-sm font-black tracking-widest text-red-500 uppercase font-mono leading-none">
                COMMAND & CONQUER
              </h1>
              <p className="text-[10px] text-amber-400 font-mono tracking-widest select-none leading-none mt-1">
                RED ALERT 2: COMMAND DECK
              </p>
            </div>
          </div>

          {/* Commander Profile Settings */}
          <div className="flex items-center gap-2 bg-neutral-950 px-3 py-1.5 rounded border border-neutral-800">
            <span className="text-[9px] font-mono text-neutral-500 font-bold tracking-widest">CALLSIGN:</span>
            <input
              id="callsign_input"
              type="text"
              value={commanderName}
              onChange={(e) => setCommanderName(e.target.value.slice(0, 16))}
              className="bg-transparent text-amber-400 text-xs font-mono font-extrabold border-none outline-none focus:ring-0 w-24 placeholder-neutral-700"
              placeholder="CALLSIGN..."
            />
          </div>

          {/* Factions Multi-control */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest hidden md:inline">
              Select Faction:
            </span>
            <div className="flex bg-neutral-950 rounded p-1 border border-neutral-800 shadow-inner">
              {[
                { id: 'ALLIES', label: 'Allied Forces', icon: '🔵' },
                { id: 'SOVIETS', label: 'Soviet High', icon: '🔴' },
                { id: 'YURI', label: 'Yuri Elite', icon: '🔮' }
              ].map(fac => (
                <button
                  id={`faction_tab_${fac.id.toLowerCase()}`}
                  key={fac.id}
                  onClick={() => {
                    if (faction !== fac.id) {
                      setFaction(fac.id as Faction);
                    }
                  }}
                  className={`font-mono text-[10px] tracking-widest py-1.5 px-3 rounded text-center transition-all focus:outline-none flex items-center gap-1.5 ${faction === fac.id ? 'bg-amber-600/90 text-black font-extrabold shadow border border-amber-400' : 'hover:bg-neutral-900 text-neutral-400'}`}
                >
                  <span>{fac.icon}</span>
                  {fac.label}
                </button>
              ))}
            </div>

            {/* Quick reset button */}
            <button
              id="reset_game_btn"
              onClick={() => resetBattlefield(faction)}
              title="Reset Tactical Map"
              className="bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-amber-500 border border-neutral-800 p-2.5 rounded transition-all focus:outline-none cursor-pointer"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Tactical Console Page Tabs */}
      <div className="bg-neutral-900 border-b border-neutral-800/80 py-2 px-6 z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex gap-2.5 w-full sm:w-auto">
            {[
              { id: 'WARZONE', label: 'BATTLEFIELD WARZONE', icon: '📡' },
              { id: 'INTEL', label: 'TACTICAL BROADCAST & DATABASE', icon: '🧠' }
            ].map(page => (
              <button
                id={`page_tab_${page.id.toLowerCase()}`}
                key={page.id}
                onClick={() => {
                  playSynthSound('click');
                  setActivePage(page.id as 'WARZONE' | 'INTEL');
                }}
                className={`font-mono text-[11px] tracking-wider py-2 px-4 rounded border transition-all duration-200 flex-1 sm:flex-initial focus:outline-none flex items-center justify-center gap-2 cursor-pointer ${activePage === page.id ? 'bg-amber-600 font-extrabold text-black border-amber-400 shadow-md' : 'bg-neutral-950 border-neutral-800 hover:bg-neutral-800 text-neutral-400'}`}
              >
                <span>{page.icon}</span>
                {page.label}
              </button>
            ))}
          </div>
          
          {/* Real-time sync commanders list */}
          <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-400 bg-neutral-950 px-3 py-1 border border-neutral-800 rounded max-w-full overflow-x-auto">
            <span className="text-[9px] text-neutral-500 bg-neutral-900 border border-neutral-800 px-1 py-0.5 rounded shrink-0">
              ACTIVE LINKS: <span className="text-emerald-400 font-bold">{otherCommanders.length + 1}</span>
            </span>
            <span className="text-amber-500 font-extrabold shrink-0">★ {commanderName || 'ME'}</span>
            {otherCommanders.map(c => (
              <span key={c.id} className="text-neutral-400 flex items-center gap-1 border-l border-neutral-800 pl-2 shrink-0">
                <span className={`w-1.5 h-1.5 rounded-full ${c.faction === 'SOVIETS' ? 'bg-red-500' : c.faction === 'YURI' ? 'bg-purple-500' : 'bg-blue-500'}`}></span>
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {activePage === 'WARZONE' ? (
        /* Main Content Layout Grid */
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 pt-4 grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10">
          
          {/* Left Side Column: Battlefield Map Sim & Status briefing */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* Main Battle Map */}
            <BattleGrid
              faction={faction}
              credits={credits}
              setCredits={setCredits}
              structures={structures}
              setStructures={setStructures}
              units={units}
              setUnits={setUnits}
              placementItem={placementItem}
              setPlacementItem={setPlacementItem}
              onAddLogMessage={addLogMessage}
              powerStatus={powerStatus}
              webSocketSend={webSocketSend}
              otherCommanders={otherCommanders}
            />

            {/* Scenario objectives checklist */}
            <MissionBriefing
              faction={faction}
              credits={credits}
              waveCount={units.filter(u => u.owner === 'ENEMY').length === 0 ? 0 : 1} // simplified Wave indicators
              structuresPlaced={structures.map(s => ({ id: s.id, type: s.type }))}
              unitsCount={units.filter(u => u.owner === 'PLAYER').length}
              logMessages={logMessages}
              onAddLogMessage={addLogMessage}
            />
          </div>

          {/* Right Side Column: C&C build radar sidebar & Console Logs */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* Westwood Style Production lists */}
            <BuildSidebar
              faction={faction}
              credits={credits}
              setCredits={setCredits}
              setPlacementItem={setPlacementItem}
              onAddLogMessage={addLogMessage}
              powerStatus={powerStatus}
              setPowerStatus={setPowerStatus}
            />

            {/* Real-time tactical Battle log board */}
            <div className="bg-neutral-950 border border-neutral-800 rounded p-4 flex-1 flex flex-col shadow-2xl relative min-h-[300px]">
              <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-neutral-800">
                <Terminal className="w-4 h-4 text-amber-400" />
                <h2 className="text-xs font-mono tracking-widest text-amber-400 uppercase">
                  BATTLEFIELD COM NETWORK FEED
                </h2>
              </div>

              {/* Logs scrolling stack */}
              <div id="combat_logs_stack" className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[300px] custom-scrollbar text-[11px] font-mono">
                {logMessages.map(log => {
                  let colorClass = 'text-neutral-400';
                  if (log.type === 'success') colorClass = 'text-green-400 font-semibold';
                  if (log.type === 'danger') colorClass = 'text-red-500 font-black';
                  if (log.type === 'warning') colorClass = 'text-yellow-500';

                  return (
                    <div key={log.id} className="leading-tight py-1 border-b border-neutral-900/60 flex items-start gap-1 pb-1">
                      <span className="text-neutral-600 text-[9px] font-sans shrink-0">[{log.timestamp}]</span>
                      <span className={colorClass}>{log.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Interactive COMS chat input */}
              <div className="mt-3 pt-2 border-t border-neutral-800/85 flex gap-2">
                <input
                  id="chat_input_field"
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      sendChatMessage();
                    }
                  }}
                  placeholder="Broadcast message to tactical net..."
                  className="bg-neutral-900 text-[11px] font-mono text-neutral-200 placeholder-neutral-500 py-1.5 px-3 rounded border border-neutral-800 focus:outline-none focus:border-amber-500 flex-1 min-w-0"
                />
                <button
                  id="send_chat_btn"
                  onClick={sendChatMessage}
                  className="bg-amber-600 hover:bg-amber-500 text-black font-mono font-bold text-[10px] tracking-wider py-1.5 px-3 rounded transition-all focus:outline-none shrink-0 cursor-pointer"
                >
                  SEND
                </button>
              </div>
            </div>
          </div>

        </main>
      ) : (
        /* Secondary Companion Row - Voice Soundboard & Lore Encyclopedia */
        <section className="flex-1 max-w-7xl mx-auto w-full px-4 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          {/* Retro audio soundboard */}
          <Soundboard onAddLogMessage={addLogMessage} webSocketSend={webSocketSend} />

          {/* Tactical database compendium */}
          <NostalgiaEncyclopedia />
        </section>
      )}

      {/* Aesthetic Site Footer */}
      <footer className="mt-8 text-center text-[10px] font-mono text-neutral-600 border-t border-neutral-900/50 pt-4 max-w-7xl mx-auto w-full px-4">
        <p className="flex justify-center items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-700" />
          ESTABLISHING MAXIMUM SECURITY PROTOCOLS. IN ALLY WITH GLOBAL DEFENSE SECURITY NETWORK 2026.
        </p>
      </footer>
    </div>
  );
}
