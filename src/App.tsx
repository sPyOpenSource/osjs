import { useEffect, useRef, useState } from "react";
import { Car, Track, UpgradeCategory } from "./types";
import { INITIAL_CARS, INITIAL_TRACKS, getUpgradedCar, UPGRADE_LATEST_COSTS } from "./data";
import RaceCanvas from "./components/RaceCanvas";
import Showroom3D from "./components/Showroom3D";
import { 
  Trophy, 
  Flame, 
  Coins, 
  Wrench, 
  ShieldAlert, 
  CheckCircle2, 
  MapPin, 
  Compass, 
  Gauge, 
  Activity, 
  ShoppingBag, 
  CornerDownRight, 
  Radio, 
  Play, 
  HelpCircle,
  Camera,
  Trash2,
  X,
  User
} from "lucide-react";

export default function App() {
  // Career Wallet & Career Stats
  const [credits, setCredits] = useState<number>(200000); // Starter credits Cr. 200,000
  const [ownedCarIds, setOwnedCarIds] = useState<string[]>(["porsche_911"]);
  const [bestLapTimes, setBestLapTimes] = useState<{ [trackId: string]: number }>({});
  const [carsList, setCarsList] = useState<Car[]>(INITIAL_CARS);
  const [streakCount, setStreakCount] = useState<number>(0);
  const [totalRacesRan, setTotalRacesRan] = useState<number>(0);
  const [allTimeTopSpeed, setAllTimeTopSpeed] = useState<number>(0);

  // Driver Profile metadata & Camera integration
  const [driverName, setDriverName] = useState<string>("APEX RACER");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Active Selections
  const [selectedCarId, setSelectedCarId] = useState<string>("porsche_911");
  const [selectedTrackId, setSelectedTrackId] = useState<string>("spa");
  const [currentMenuTab, setCurrentMenuTab] = useState<"showroom" | "garage" | "tracks" | "career">("showroom");
  const [difficulty, setDifficulty] = useState<"Rookie" | "Amateur" | "Pro" | "Legend">("Pro");

  // Active Race state machines
  const [activeScreen, setActiveScreen] = useState<"lobby" | "racing" | "post_race">("lobby");
  const [lastRaceOutcome, setLastRaceOutcome] = useState<{
    position: number;
    lapTimes: number[];
    prizeEarned: number;
    speedRecord: number;
  } | null>(null);

  // Load career data upon initialization from browser local storage
  useEffect(() => {
    const cachedCredits = localStorage.getItem("rr3_credits");
    const cachedOwnedCars = localStorage.getItem("rr3_owned_cars");
    const cachedUpgrades = localStorage.getItem("rr3_car_upgrades");
    const cachedLaps = localStorage.getItem("rr3_best_laps");
    const cachedStreak = localStorage.getItem("rr3_streak");
    const cachedTotalRaces = localStorage.getItem("rr3_total_races");
    const cachedTopSpeed = localStorage.getItem("rr3_top_speed");
    const cachedName = localStorage.getItem("rr3_driver_name");
    const cachedAvatar = localStorage.getItem("rr3_avatar_url");

    if (cachedCredits) setCredits(parseInt(cachedCredits));
    if (cachedOwnedCars) setOwnedCarIds(JSON.parse(cachedOwnedCars));
    if (cachedStreak) setStreakCount(parseInt(cachedStreak));
    if (cachedTotalRaces) setTotalRacesRan(parseInt(cachedTotalRaces));
    if (cachedTopSpeed) setAllTimeTopSpeed(parseInt(cachedTopSpeed));
    if (cachedLaps) setBestLapTimes(JSON.parse(cachedLaps));
    if (cachedName) setDriverName(cachedName);
    if (cachedAvatar) setAvatarUrl(cachedAvatar);

    if (cachedUpgrades) {
      const parsedUpgrades = JSON.parse(cachedUpgrades);
      setCarsList(prev => prev.map(c => {
        if (parsedUpgrades[c.id]) {
          const upgraded = { ...c, upgrades: parsedUpgrades[c.id] };
          return getUpgradedCar(upgraded);
        }
        return c;
      }));
    }
  }, []);

  // Camera capture lifecycle stream management
  useEffect(() => {
    if (isCameraActive) {
      setCameraError(null);
      navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 320, facingMode: "user" },
        audio: false
      })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => console.warn("Camera play start offset handled:", e));
        }
      })
      .catch((err) => {
        console.error("Camera capture initialization error: ", err);
        setCameraError("Camera access denied or device busy. Please ensure permission is granted.");
        setIsCameraActive(false);
      });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraActive]);

  // Auto-fullscreen state observer for optimal simulator immersion
  useEffect(() => {
    if (activeScreen === "racing") {
      const elem = document.documentElement;
      try {
        if (elem.requestFullscreen) {
          elem.requestFullscreen().catch((err) => {
            console.warn("Fullscreen request failed / blocked by iframe context:", err);
          });
        } else if ((elem as any).webkitRequestFullscreen) {
          (elem as any).webkitRequestFullscreen();
        } else if ((elem as any).msRequestFullscreen) {
          (elem as any).msRequestFullscreen();
        }
      } catch (err) {
        console.warn("Fullscreen activation exception:", err);
      }
    } else {
      try {
        const doc = document as any;
        const isFullscreen = !!(
          document.fullscreenElement ||
          doc.webkitFullscreenElement ||
          doc.msFullscreenElement
        );
        if (isFullscreen) {
          if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          } else if (doc.webkitExitFullscreen) {
            doc.webkitExitFullscreen();
          } else if (doc.msExitFullscreen) {
            doc.msExitFullscreen();
          }
        }
      } catch (err) {
        console.warn("Fullscreen deactivation exception:", err);
      }
    }
  }, [activeScreen]);

  // Sync game statistics to client browser persistence local storage
  const syncCareerData = (
    newCredits: number,
    newOwnedIds: string[],
    newCars: Car[],
    newLaps?: { [trackId: string]: number },
    newStreak?: number,
    newRaces?: number,
    newTopSpeed?: number
  ) => {
    localStorage.setItem("rr3_credits", newCredits.toString());
    localStorage.setItem("rr3_owned_cars", JSON.stringify(newOwnedIds));
    
    // Extract simply upgrades levels to minimize cache overhead
    const upgradeMap: { [key: string]: any } = {};
    newCars.forEach(c => {
      upgradeMap[c.id] = c.upgrades;
    });
    localStorage.setItem("rr3_car_upgrades", JSON.stringify(upgradeMap));

    if (newLaps) localStorage.setItem("rr3_best_laps", JSON.stringify(newLaps));
    if (newStreak !== undefined) localStorage.setItem("rr3_streak", newStreak.toString());
    if (newRaces !== undefined) localStorage.setItem("rr3_total_races", newRaces.toString());
    if (newTopSpeed !== undefined) localStorage.setItem("rr3_top_speed", newTopSpeed.toString());
  };

  // Helper retrieval references
  const activeCar = carsList.find(c => c.id === selectedCarId) || carsList[0];
  const activeTrack = INITIAL_TRACKS.find(t => t.id === selectedTrackId) || INITIAL_TRACKS[0];

  // Purchase Supercar Showroom handling
  const handlePurchaseCar = (car: Car) => {
    if (credits < car.price) return;
    
    const upgradedCredits = credits - car.price;
    const updatedOwnedIds = [...ownedCarIds, car.id];
    
    setCredits(upgradedCredits);
    setOwnedCarIds(updatedOwnedIds);
    
    // Unlock and state update
    const updatedCars = carsList.map(c => c.id === car.id ? { ...c, owned: true } : c);
    setCarsList(updatedCars);

    syncCareerData(upgradedCredits, updatedOwnedIds, updatedCars);
  };

  // Invest upgrades in dynamic car mechanics
  const handleUpgradeCategory = (category: UpgradeCategory) => {
    const currentLevel = activeCar.upgrades[category];
    if (currentLevel >= 4) return; // capped maximum

    const cost = UPGRADE_LATEST_COSTS[currentLevel];
    if (credits < cost) return;

    const upgradedCredits = credits - cost;
    const upgradedCarLevels = {
      ...activeCar.upgrades,
      [category]: currentLevel + 1
    };

    const updatedCars = carsList.map(c => {
      if (c.id === activeCar.id) {
        const withLevels = { ...c, upgrades: upgradedCarLevels };
        return getUpgradedCar(withLevels);
      }
      return c;
    });

    setCredits(upgradedCredits);
    setCarsList(updatedCars);
    syncCareerData(upgradedCredits, ownedCarIds, updatedCars);
  };

  // Capture user photo from the active media camera stream
  const handleCapture = () => {
    if (!videoRef.current) return;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Mirror the image horizontally for a natural reflection feel
        ctx.translate(300, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0, 300, 300);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setAvatarUrl(dataUrl);
        localStorage.setItem("rr3_avatar_url", dataUrl);
        
        // Disable the active camera stream gracefully
        setIsCameraActive(false);
      }
    } catch (err) {
      console.error("Camera photo snapping failed: ", err);
    }
  };

  // Erase the photo and clear client persistence storage
  const handleDeletePhoto = () => {
    setAvatarUrl(null);
    localStorage.removeItem("rr3_avatar_url");
  };

  // Handle callback upon race completion
  const handleRaceComplete = (data: { position: number; lapTimes: number[]; prizeEarned: number; speedRecord: number }) => {
    setLastRaceOutcome(data);
    
    // Updates career credits
    const finalCredits = credits + data.prizeEarned;
    setCredits(finalCredits);

    // Updates top speeds achieved
    let currentTopSpeed = allTimeTopSpeed;
    if (data.speedRecord > allTimeTopSpeed) {
      currentTopSpeed = data.speedRecord;
      setAllTimeTopSpeed(data.speedRecord);
    }

    // Update streaks and races ran counter
    const racesCount = totalRacesRan + 1;
    setTotalRacesRan(racesCount);

    let streakVal = streakCount;
    if (data.position <= 2) {
      streakVal += 1;
      setStreakCount(streakVal);
    } else {
      streakVal = 0; // split streak
      setStreakCount(0);
    }

    // Verify track record lap times
    const updatedBestLap = { ...bestLapTimes };
    const fastestLap = Math.min(...data.lapTimes);
    if (!bestLapTimes[selectedTrackId] || fastestLap < bestLapTimes[selectedTrackId]) {
      updatedBestLap[selectedTrackId] = fastestLap;
      setBestLapTimes(updatedBestLap);
    }

    syncCareerData(finalCredits, ownedCarIds, carsList, updatedBestLap, streakVal, racesCount, currentTopSpeed);
    setActiveScreen("post_race");
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white flex flex-col antialiased font-sans relative overflow-x-hidden">
      {/* BACKGROUND ACCENT (GRID) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none geometric-grid" style={{ zIndex: 0 }}></div>
      
      {/* 1. COMPREHENSIVE LOBBY SCREEN (DASHBOARD) */}
      {activeScreen === "lobby" && (
        <div className="flex-1 flex flex-col z-10">
          
          {/* Dashboard Header Profile Indicators */}
          <div className="border-b border-white/10 bg-gradient-to-r from-[#1a1a1c] to-[#0c0c0e]/95 sticky top-0 z-30 backdrop-blur-md px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-6">
              <div className="w-10 h-10 bg-yellow-500 flex items-center justify-center font-black text-black text-xl italic tracking-tighter select-none shadow-[0_0_15px_rgba(234,179,8,0.3)] shrink-0">
                RR
              </div>
              <div>
                <h1 className="text-xl font-black uppercase tracking-wider text-white italic">REAL RACING 3D</h1>
                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Licensed GT & Hypercar Motorsport</p>
              </div>
            </div>

            {/* Wallet Cash Balance and Driver Badge Streaks */}
            <div className="flex items-center gap-6 flex-wrap">
              {/* Driver Header Profile Info Link */}
              <div 
                onClick={() => setCurrentMenuTab("career")} 
                className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 px-3 py-1 border-l border-white/10 h-10 transition-all select-none"
                title="View Driver Profile"
              >
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt="Driver Avatar" 
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-none border border-yellow-500 object-cover shadow-[0_0_8px_rgba(234,179,8,0.25)]" 
                  />
                ) : (
                  <div className="w-8 h-8 rounded-none border border-white/20 bg-white/5 flex items-center justify-center font-bold text-[10px] text-gray-400 font-mono">
                    <User className="w-3.5 h-3.5 text-gray-450 group-hover:text-yellow-500 transition-colors" />
                  </div>
                )}
                <div className="text-left hidden sm:block">
                  <span className="block text-[8px] text-gray-400 font-bold uppercase tracking-wider leading-none">DRIVER</span>
                  <span className="block text-xs font-black uppercase text-yellow-500 tracking-tight leading-none mt-1 group-hover:text-white transition-all font-sans font-medium">
                    {driverName}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end border-l border-white/10 pl-6 h-10 justify-center">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">WALLET Balance</span>
                <span className="text-lg font-mono tracking-tight text-emerald-400 font-bold">Cr. {credits.toLocaleString()}</span>
              </div>

              <div className="flex flex-col items-end border-l border-white/10 pl-6 h-10 justify-center">
                <span className="text-[10px] text-yellow-500/85 font-bold uppercase tracking-wider">Victory Streak</span>
                <span className="text-lg font-mono tracking-tight text-yellow-500 font-bold italic">{streakCount} RACES</span>
              </div>

              <div className="flex flex-col items-end border-l border-white/10 pl-6 h-10 justify-center pr-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Events</span>
                <span className="text-lg font-mono tracking-tight text-white font-bold">{totalRacesRan} COMPLETED</span>
              </div>
            </div>
          </div>

          {/* Core Applet Workspace Navigation */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Nav menu rail */}
            <div className="lg:col-span-3 border-r border-white/10 bg-[#121215] p-6 flex flex-col gap-6 justify-between rounded-none">
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-black tracking-widest text-gray-450 uppercase px-3 font-mono">GARAGE COMMANDS</p>
                
                <button
                  onClick={() => setCurrentMenuTab("showroom")}
                  className={`w-full text-left px-5 py-3.5 rounded-none text-xs font-black tracking-wider uppercase transition-all flex items-center justify-between border italic ${
                    currentMenuTab === "showroom" 
                    ? "bg-white/5 border-l-4 border-l-yellow-500 border-t-white/10 border-r-white/10 border-b-white/10 text-yellow-450 shadow-[0_0_15px_rgba(234,179,8,0.08)]" 
                    : "text-gray-450 hover:text-white hover:bg-white/5 border-white/10"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <ShoppingBag className="w-4 h-4" /> SUPERCAR SHOWROOM
                  </span>
                  <span className="text-[10px] bg-black/40 text-gray-400 px-2.5 py-0.5 rounded-none border border-white/10">
                    {carsList.filter(c => c.owned).length}/{carsList.length}
                  </span>
                </button>

                <button
                  onClick={() => setCurrentMenuTab("garage")}
                  className={`w-full text-left px-5 py-3.5 rounded-none text-xs font-black tracking-wider uppercase transition-all flex items-center justify-between border italic ${
                    currentMenuTab === "garage" 
                    ? "bg-white/5 border-l-4 border-l-yellow-500 border-t-white/10 border-r-white/10 border-b-white/10 text-yellow-450 shadow-[0_0_15px_rgba(234,179,8,0.08)]" 
                    : "text-gray-450 hover:text-white hover:bg-white/5 border-white/10"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Wrench className="w-4 h-4" /> UPGRADE WORKSHOP
                  </span>
                  {activeCar.owned && (
                    <span className="text-[10px] text-yellow-500 font-mono font-bold">
                      LVL {(Object.values(activeCar.upgrades) as number[]).reduce((a, b) => a + b, 0)}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setCurrentMenuTab("tracks")}
                  className={`w-full text-left px-5 py-3.5 rounded-none text-xs font-black tracking-wider uppercase transition-all flex items-center justify-between border italic ${
                    currentMenuTab === "tracks" 
                    ? "bg-white/5 border-l-4 border-l-yellow-500 border-t-white/10 border-r-white/10 border-b-white/10 text-yellow-450 shadow-[0_0_15px_rgba(234,179,8,0.08)]" 
                    : "text-gray-450 hover:text-white hover:bg-white/5 border-white/10"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Compass className="w-4 h-4" /> WORLD CIRCUITS
                  </span>
                </button>

                <button
                  onClick={() => setCurrentMenuTab("career")}
                  className={`w-full text-left px-5 py-3.5 rounded-none text-xs font-black tracking-wider uppercase transition-all flex items-center justify-between border italic ${
                    currentMenuTab === "career" 
                    ? "bg-white/5 border-l-4 border-l-yellow-500 border-t-white/10 border-r-white/10 border-b-white/10 text-yellow-450 shadow-[0_0_15px_rgba(234,179,8,0.08)]" 
                    : "text-gray-450 hover:text-white hover:bg-white/5 border-white/10"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Activity className="w-4 h-4" /> CAREER STATISTICS
                  </span>
                </button>
              </div>

              {/* Launcher HUD segment */}
              <div className="p-5 rounded-none bg-[#16161a] border border-white/10 space-y-4 mt-8 lg:mt-0">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-ping shadow-[0_0_8px_rgba(234,179,8,1)]" />
                  <span className="text-[10px] font-mono tracking-widest text-yellow-500 font-black uppercase">READY TO LAUNCH</span>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">SELECTED TEAM PLATFORM:</h4>
                  <p className="text-sm text-white font-extrabold tracking-wide uppercase mt-1 italic">{activeCar.brand} {activeCar.name}</p>
                  <p className="text-[10px] font-mono text-gray-400 mt-1">at {activeTrack.name}</p>
                </div>
                
                <button
                  onClick={() => {
                    if (!activeCar.owned) {
                      setCurrentMenuTab("showroom");
                      return;
                    }
                    setActiveScreen("racing");
                  }}
                  className={`w-full py-4 rounded-none font-black uppercase tracking-wider text-xs italic transition-all flex items-center justify-center gap-3 cursor-pointer ${
                    activeCar.owned 
                    ? "bg-yellow-500 hover:bg-yellow-400 text-black shadow-[px_rgba(234,179,8,0.30)] shadow-[0_0_15px_rgba(234,179,8,0.25)] duration-150" 
                    : "bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> 
                  {activeCar.owned ? "ENTER CUP RACE" : "BUY VEHICLE TO ENROLL"}
                </button>
              </div>
            </div>

            {/* Right hand dynamic pane */}
            <div className="lg:col-span-9 p-8 bg-[#0c0c0e] overflow-y-auto max-h-[calc(100vh-130px)] z-10">
              
                {/* A. SUPERCAR SHOWROOM TAB */}
                {currentMenuTab === "showroom" && (
                  <div className="space-y-6 animate-view-fade">
                    <div>
                      <h2 className="text-2xl font-black uppercase text-white tracking-wide italic leading-none">SUPERCAR SHOWROOM</h2>
                      <p className="text-xs text-gray-400 mt-2 font-mono uppercase tracking-wider">Browse licensed championship GT platforms and select active weapon for the grid.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left: Car cards selector */}
                      <div className="space-y-4">
                        {carsList.map(car => (
                          <div
                            key={car.id}
                            onClick={() => setSelectedCarId(car.id)}
                            className={`p-5 rounded-none border transition-all cursor-pointer flex items-center justify-between ${
                              selectedCarId === car.id 
                              ? "bg-[#16161a] border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.1)]" 
                              : "bg-black/40 border-white/10 hover:bg-[#16161a]/60 hover:border-white/20"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              {/* Vector color accent profile circle */}
                              <div 
                                className="w-12 h-12 rounded-none flex items-center justify-center font-bold text-xl relative overflow-hidden border border-white/15"
                                style={{ backgroundColor: car.color }}
                              >
                                <span className="absolute bottom-1 right-1 text-xs drop-shadow-md">{car.emoji}</span>
                              </div>
                              <div className="text-left">
                                <span className="text-[9px] font-mono tracking-widest font-extrabold uppercase px-2 py-0.5 rounded-none bg-black/55 text-white border border-white/10">
                                  CLASS {car.class}
                                </span>
                                <h3 className="text-sm font-black text-white uppercase tracking-wider mt-1.5">{car.brand} {car.name}</h3>
                              </div>
                            </div>

                            <div className="text-right font-mono">
                              {car.owned ? (
                                <span className="text-[10px] text-yellow-500 font-black tracking-wider flex items-center gap-1.5 italic">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500" /> SELECTED
                                </span>
                              ) : (
                                <div>
                                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">PRICE TAG</p>
                                  <p className="text-sm font-black text-yellow-550 leading-none mt-1">Cr. {car.price.toLocaleString()}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Right: Technical specification sheets & active preview */}
                      <div className="p-6 rounded-none bg-[#121215] border border-white/10 flex flex-col justify-between">
                        <div className="space-y-5">
                          {/* Active showroom interactive 3D model */}
                          <div className="h-56 rounded-none bg-black/60 border border-white/10 relative flex flex-col items-center justify-center overflow-hidden">
                            <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse" />
                              <span className="text-[9px] font-mono tracking-widest text-[#eab308] font-black uppercase">Active Studio 3D Visualizer</span>
                            </div>
                            
                            <Showroom3D car={activeCar} />
                          </div>

                          <div className="space-y-1.5">
                            <h3 className="text-lg font-black text-white uppercase tracking-wider italic">{activeCar.brand} {activeCar.name}</h3>
                            <p className="text-xs text-gray-400 leading-relaxed font-sans">{activeCar.description}</p>
                          </div>

                          {/* Dynamic Specification bar metrics comparison */}
                          <div className="space-y-4 pt-4 border-t border-white/10">
                            
                            {/* Top Speed Spec */}
                            <div className="space-y-2 font-mono text-xs">
                              <div className="flex justify-between items-center text-gray-400">
                                <span className="text-[10px] uppercase font-bold tracking-wider">TOP SPEED</span>
                                <span className="text-white font-black">{activeCar.currentSpecs.topSpeed} KM/H</span>
                              </div>
                              <div className="h-1.5 bg-white/10 w-full flex gap-0.5">
                                <div 
                                  className="h-full bg-yellow-500" 
                                  style={{ width: `${(activeCar.currentSpecs.topSpeed / 550) * 100}%` }}
                                />
                                <div className="h-full bg-white/5 flex-1" />
                              </div>
                            </div>

                            {/* Acceleration */}
                            <div className="space-y-2 font-mono text-xs">
                              <div className="flex justify-between items-center text-gray-400">
                                <span className="text-[10px] uppercase font-bold tracking-wider">ACCELERATION (0-100 KM/H)</span>
                                <span className="text-white font-black">{activeCar.currentSpecs.acceleration} SEC</span>
                              </div>
                              <div className="h-1.5 bg-white/10 w-full flex gap-0.5">
                                {/* Acceleration maps value downwards (lower is better, e.g. 1.7 sec is closer to max) */}
                                <div 
                                  className="h-full bg-white" 
                                  style={{ width: `${(3.5 / activeCar.currentSpecs.acceleration) * 100}%` }}
                                />
                                <div className="h-full bg-white/5 flex-1" />
                              </div>
                            </div>

                            {/* Lateral Grip */}
                            <div className="space-y-2 font-mono text-xs">
                              <div className="flex justify-between items-center text-gray-400">
                                <span className="text-[10px] uppercase font-bold tracking-wider">LATERAL CORNERING GRIP</span>
                                <span className="text-white font-black">{activeCar.currentSpecs.grip.toFixed(2)} G</span>
                              </div>
                              <div className="h-1.5 bg-white/10 w-full flex gap-0.5">
                                <div 
                                  className="h-full bg-yellow-500" 
                                  style={{ width: `${(activeCar.activeGrip || activeCar.currentSpecs.grip / 3.29) * 100}%` }}
                                />
                                <div className="h-full bg-white/5 flex-1" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Interactive owned/unlocked button purchase option */}
                        <div className="pt-6 border-t border-white/10 mt-6 md:mt-2 bg-[#18181c] p-4.5 rounded-none border border-white/5 flex items-center justify-between">
                          {activeCar.owned ? (
                            <span className="w-full text-center text-[10px] font-mono font-black tracking-widest text-[#22c55e] flex items-center justify-center gap-1.5 bg-emerald-950/20 py-3 rounded-none border border-emerald-500/30 uppercase italic">
                              <CheckCircle2 className="w-4 h-4" /> COMPLETED OWNERSHIP
                            </span>
                          ) : (
                            <button
                              onClick={() => handlePurchaseCar(activeCar)}
                              disabled={credits < activeCar.price}
                              className={`w-full py-4.5 rounded-none font-black uppercase tracking-wider text-xs italic transition-all text-center cursor-pointer flex items-center justify-center gap-2 ${
                                credits >= activeCar.price 
                                ? "bg-yellow-500 hover:bg-yellow-400 text-black shadow-[0_0_15px_rgba(234,179,8,0.25)]" 
                                : "bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed"
                              }`}
                            >
                              <Coins className="w-4 h-4" /> PURCHASE PLATFORM (Cr. {activeCar.price.toLocaleString()})
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* B. UPGRADE GARAGE STATION TAB */}
                {currentMenuTab === "garage" && (
                  <div className="space-y-6 animate-view-fade">
                    <div>
                      <h2 className="text-2xl font-black uppercase text-white tracking-wide italic leading-none">UPGRADE WORKSHOP</h2>
                      <p className="text-xs text-gray-400 mt-2 font-mono uppercase tracking-wider">Install genuine factory engine packages, aero wings, and high-compound racing slicks.</p>
                    </div>

                    {!activeCar.owned ? (
                      <div className="p-8 rounded-none bg-black/40 border border-white/10 text-center flex flex-col items-center justify-center">
                        <ShieldAlert className="w-11 h-11 text-yellow-500 mb-3 animate-pulse" />
                        <h4 className="text-base font-black uppercase text-white tracking-wider italic">CHASSIS NOT OWNED</h4>
                        <p className="text-xs text-gray-400 max-w-sm mt-1 mb-5">You must first acquire ownership of the active scorecard {activeCar.brand} {activeCar.name} in the Showroom to calibrate custom parts.</p>
                        <button
                          onClick={() => setCurrentMenuTab("showroom")}
                          className="px-6 py-3.5 rounded-none bg-yellow-500 font-black uppercase text-xs tracking-widest text-black hover:bg-yellow-400 cursor-pointer italic shadow-[0_0_15px_rgba(234,179,8,0.2)] duration-150"
                        >
                          Go to Showroom
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Custom parts selection column */}
                        <div className="lg:col-span-2 space-y-4">
                          {[
                            { 
                              id: "engine" as UpgradeCategory, 
                              name: "STAGE II MOTOR REPROGRAM", 
                              detail: "Increases direct horsepower output and top speed cap parameters.", 
                              perf: "+ Top Speed, + Acceleration" 
                            },
                            { 
                              id: "drivetrain" as UpgradeCategory, 
                              name: "LIGHT GEAR TRANSMISSION", 
                              detail: "Shaves off milliseconds from dual-clutch transmission shifts.", 
                              perf: "++ Acceleration" 
                            },
                            { 
                              id: "aerodynamics" as UpgradeCategory, 
                              name: "DOWNDRAFT REAR WING", 
                              detail: "Utilizes active vector spoiler angles to maximize high-speed turn grip.", 
                              perf: "++ Lateral Grip, + Top Speed" 
                            },
                            { 
                              id: "tyres" as UpgradeCategory, 
                              name: "ZERO COMPROMISE RACING SLICKS", 
                              detail: "Ultra-sticky soft compound rubber compounds to lock braking marking zones.", 
                              perf: "++ Lateral Grip, - Braking Distance" 
                            }
                          ].map(part => {
                            const level = activeCar.upgrades[part.id];
                            const isCapped = level >= 4;
                            const cost = isCapped ? 0 : UPGRADE_LATEST_COSTS[level];

                            return (
                              <div
                                key={part.id}
                                className="bg-[#121215] border border-white/10 p-5 rounded-none flex items-center justify-between gap-4 select-none"
                              >
                                <div className="space-y-1.5 text-left">
                                  <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-mono font-black tracking-widest text-yellow-500 uppercase">
                                      {part.id} upgrade
                                    </span>
                                    <div className="flex gap-1.5">
                                      {Array.from({ length: 4 }).map((_, idx) => (
                                        <div
                                          key={idx}
                                          className={`w-4 h-1 border ${
                                            idx < level 
                                              ? "bg-yellow-500 border-yellow-400" 
                                              : "bg-black border-white/5"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <h4 className="text-sm font-black text-white tracking-wider uppercase leading-none">{part.name}</h4>
                                  <p className="text-[11px] text-gray-400 leading-normal max-w-md">{part.detail}</p>
                                  <span className="inline-block text-[9px] font-mono font-black tracking-wider text-[#10b981] bg-[#16161a] px-2.5 py-1 rounded-none border border-white/10 uppercase">
                                    {part.perf}
                                  </span>
                                </div>

                                <div className="text-right flex flex-col items-end gap-2 shrink-0">
                                  {isCapped ? (
                                    <span className="text-[10px] font-mono font-black tracking-widest text-[#eab308] flex items-center gap-1 bg-[#1a1815] px-3 py-2 rounded-none border border-yellow-500/20 italic">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-[#eab308]" /> MAXIMUM
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => handleUpgradeCategory(part.id)}
                                      disabled={credits < cost}
                                      className={`px-5 py-3 rounded-none font-black uppercase text-xs tracking-wider italic transition-all cursor-pointer ${
                                        credits >= cost 
                                          ? "bg-yellow-500 hover:bg-yellow-400 text-black shadow-[0_0_15px_rgba(234,179,8,0.2)]" 
                                          : "bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed"
                                      }`}
                                    >
                                      BUY (Cr. {cost.toLocaleString()})
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Visual Spec outcome comparison board */}
                        <div className="p-6 rounded-none bg-[#121215] border border-white/10 flex flex-col justify-between font-mono">
                          <div>
                            <h3 className="text-[9px] font-black tracking-widest text-gray-400 uppercase mb-4 flex items-center gap-1.5 leading-none">
                              📈 MECHANICAL OUTPUT SPECIFICATIONS
                            </h3>
                            
                            <div className="space-y-3">
                              <div className="p-3 bg-black/40 rounded-none border border-white/10 flex justify-between items-center text-xs">
                                <span className="text-gray-450 font-sans text-[11px] uppercase tracking-wider font-semibold">VELOCITY SPEC:</span>
                                <div className="text-right font-bold">
                                  <span className="text-gray-500 line-through mr-2">{activeCar.baseSpecs.topSpeed}</span>
                                  <span className="text-white">{activeCar.currentSpecs.topSpeed} km/h</span>
                                </div>
                              </div>

                              <div className="p-3 bg-black/40 rounded-none border border-white/10 flex justify-between items-center text-xs">
                                <span className="text-gray-450 font-sans text-[11px] uppercase tracking-wider font-semibold">LAUNCH TIME (0-100):</span>
                                <div className="text-right font-bold">
                                  <span className="text-gray-500 line-through mr-2">{activeCar.baseSpecs.acceleration}s</span>
                                  <span className="text-emerald-400">{activeCar.currentSpecs.acceleration}s</span>
                                </div>
                              </div>

                              <div className="p-3 bg-black/40 rounded-none border border-white/10 flex justify-between items-center text-xs">
                                <span className="text-gray-450 font-sans text-[11px] uppercase tracking-wider font-semibold">CORNER G-FORCE:</span>
                                <div className="text-right font-bold">
                                  <span className="text-gray-500 line-through mr-2">{activeCar.baseSpecs.grip}G</span>
                                  <span className="text-yellow-500">{activeCar.currentSpecs.grip.toFixed(2)}G</span>
                                </div>
                              </div>

                              <div className="p-3 bg-black/40 rounded-none border border-white/10 flex justify-between items-center text-xs">
                                <span className="text-gray-450 font-sans text-[11px] uppercase tracking-wider font-semibold">BRAKING DECELERATION:</span>
                                <div className="text-right font-bold">
                                  <span className="text-gray-500 line-through mr-2">{activeCar.baseSpecs.braking}m</span>
                                  <span className="text-amber-500">{activeCar.currentSpecs.braking}m</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 rounded-none bg-black/60 border border-white/5 text-[11px] text-left leading-relaxed text-gray-400 mt-6 lg:mt-2 font-sans flex items-start gap-2.5">
                            <Radio className="w-5 h-5 text-yellow-500 shrink-0" />
                            <p>
                              Track telemetry systems are simulated on real-world GT ratios. Increasing lateral G-force grip significantly helps maintain drift momentum on sweeping curves.
                            </p>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                )}

                {/* C. CIRCUITS TRACK LAB TAB */}
                {currentMenuTab === "tracks" && (
                  <div className="space-y-6 animate-view-fade">
                    <div>
                      <h2 className="text-2xl font-black uppercase text-white tracking-wide italic leading-none">LICENSED RACING TRACKS</h2>
                      <p className="text-xs text-gray-400 mt-2 font-mono uppercase tracking-wider">Select standard locations. Each circuit maintains independent track record times.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left: Circuit lists */}
                      <div className="space-y-4">
                        {INITIAL_TRACKS.map(track => {
                          const isBest = bestLapTimes[track.id];
                          return (
                            <div
                              key={track.id}
                              onClick={() => setSelectedTrackId(track.id)}
                              className={`p-4.5 rounded-none border transition-all cursor-pointer flex items-center justify-between ${
                                selectedTrackId === track.id 
                                ? "bg-yellow-500/10 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.1)]" 
                                : "bg-[#121215] border-white/10 hover:bg-[#16161a]"
                              }`}
                            >
                              <div className="flex items-center gap-4 text-left">
                                <div className="w-10 h-10 rounded-none bg-black border border-white/10 flex items-center justify-center font-mono font-black text-white uppercase text-xs shrink-0">
                                  {track.id.substring(0, 3)}
                                </div>
                                <div>
                                  <h3 className="text-sm font-black text-white uppercase tracking-wider leading-none">{track.name}</h3>
                                  <p className="text-[10px] font-mono text-yellow-500 mt-1 uppercase tracking-widest">{track.location}</p>
                                </div>
                              </div>

                              <div className="text-right font-mono text-xs shrink-0">
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">DISTANCE</p>
                                <p className="text-white font-bold mt-0.5 uppercase">{track.length}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Right: Track map metrics / lap records */}
                      <div className="p-6 rounded-none bg-[#121215] border border-white/10 flex flex-col justify-between">
                        <div className="space-y-5">
                          <div className="h-44 rounded-none bg-black/40 border border-white/10 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute top-3 left-3 flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-yellow-500" />
                              <span className="text-[9px] font-mono tracking-widest text-gray-400 font-bold uppercase">{activeTrack.location}</span>
                            </div>

                            {/* Canvas outline simulation of real world loop maps */}
                            <svg className="w-2/3 max-h-36 opacity-40 filter drop-shadow-[0_0_8px_rgba(234,179,8,0.2)]" viewBox="0 0 200 200">
                              <path 
                                d={
                                  activeTrack.id === "spa" 
                                    ? "M 40 40 C 80 40 100 80 120 40 C 140 20 180 50 160 120 L 140 160 L 60 150 L 20 100 Z" 
                                    : activeTrack.id === "monza" 
                                    ? "M 20 100 L 180 100 C 190 140 170 170 100 170 L 60 170 L 20 120 Z" 
                                    : activeTrack.id === "silverstone"
                                    ? "M 50 20 L 150 20 Q 180 60 160 110 L 120 160 Q 80 140 40 150 Z"
                                    : activeTrack.id === "bathurst"
                                    ? "M 20 120 L 120 120 L 180 100 C 160 50 80 40 40 80 Z"
                                    : "M 40 40 C 90 20 160 50 160 120 C 120 160 80 120 40 150 Z"
                                } 
                                fill="none" 
                                stroke="#eab308" 
                                strokeWidth="4" 
                                strokeLinecap="round"
                              />
                            </svg>

                            <p className="absolute bottom-3 text-[9px] font-mono text-gray-500 uppercase tracking-widest">GPS RADAR DIAGRAM</p>
                          </div>

                          <div className="space-y-1.5 text-left">
                            <h3 className="text-base font-black text-white uppercase tracking-widest">{activeTrack.name}</h3>
                            <p className="text-xs text-gray-400 leading-relaxed font-sans">{activeTrack.description}</p>
                          </div>

                          {/* Historical timings */}
                          <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-4 border-t border-white/10">
                            <div className="bg-black/50 p-3 rounded-none border border-white/5 text-left">
                              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none">LAP RECORD</p>
                              <p className="text-sm font-black text-yellow-500 mt-1">{activeTrack.lapRecord}</p>
                              <p className="text-[9px] text-gray-500 font-sans mt-0.5 uppercase tracking-wide">{activeTrack.recordHolder}</p>
                            </div>

                            <div className="bg-black/50 p-3 rounded-none border border-white/5 text-left">
                              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none">PERSONAL BEST</p>
                              <p className="text-sm font-black text-emerald-400 mt-1">
                                {bestLapTimes[activeTrack.id] 
                                  ? `${bestLapTimes[activeTrack.id].toFixed(3)}s` 
                                  : "NO TIME SET"}
                              </p>
                              <p className="text-[9px] text-gray-500 font-sans mt-0.5 uppercase tracking-wide">GT class target</p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-6 border-t border-white/10 mt-6 flex justify-between items-center bg-black/40 p-4 rounded-none">
                          <CheckCircle2 className="w-5 h-5 text-yellow-500" />
                          <span className="text-[10px] font-mono font-black text-gray-350 uppercase tracking-wider">
                            LOCATED AT: {activeTrack.location} • TARGETING LAP
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* D. CAREER COMPREHENSIVE TIMELINE TAB */}
                {currentMenuTab === "career" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-view-fade">
                    {/* Career Summary details lists */}
                    <div className="p-6 rounded-none bg-[#121215] border border-white/10 space-y-6 text-left">
                      <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <h2 className="text-2xl font-black uppercase text-white tracking-wide italic leading-none">DRIVER PROFILE</h2>
                        <span className="text-[9px] font-mono bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 uppercase tracking-widest font-bold">GT-LICENTIATED</span>
                      </div>

                      {/* HIGH-FIDELITY DRIVER IDENTITY LICENSE CARD */}
                      <div className="bg-black/50 border border-white/10 p-5 rounded-none relative overflow-hidden flex flex-col sm:flex-row gap-5 items-center">
                        {/* Golden Racing Grid Accent overlay */}
                        <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/5 rotate-45 transform translate-x-8 -translate-y-8 pointer-events-none"></div>

                        {/* Interactive Photo Box */}
                        <div className="relative group shrink-0">
                          <div className="w-24 h-24 bg-neutral-950 border-2 border-yellow-500/80 shadow-[0_0_15px_rgba(234,179,8,0.15)] flex flex-col items-center justify-center overflow-hidden relative">
                            {avatarUrl ? (
                              <>
                                <img 
                                  src={avatarUrl} 
                                  alt="Captured Driver" 
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                                {/* Quick deletion trigger */}
                                <button 
                                  type="button"
                                  onClick={handleDeletePhoto}
                                  className="absolute top-1 right-1 bg-red-650 hover:bg-red-600 text-white p-1 rounded-none shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Clear Image"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <div className="flex flex-col items-center justify-center p-2 text-center text-gray-500 select-none">
                                <User className="w-8 h-8 text-white/10 mb-1" />
                                <span className="text-[8px] font-mono tracking-wider font-bold">NO TELEMETRY</span>
                              </div>
                            )}

                            {/* Camera Active Preview Live Feed Overlay */}
                            {isCameraActive && (
                              <div className="absolute inset-0 bg-black z-10 flex items-center justify-center">
                                <video 
                                  ref={videoRef} 
                                  autoPlay 
                                  playsInline 
                                  muted
                                  className="w-full h-full object-cover scale-x-[-1]"
                                />
                                {/* Crosshair graphics */}
                                <div className="absolute inset-2 border border-dashed border-yellow-500/40 pointer-events-none"></div>
                              </div>
                            )}
                          </div>

                          {/* Quick camera triggers overlay/badge */}
                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-1 z-20">
                            {!isCameraActive ? (
                              <button
                                type="button"
                                onClick={() => setIsCameraActive(true)}
                                className="bg-yellow-500 hover:bg-yellow-400 text-black font-black font-mono text-[9px] px-2 py-1 flex items-center gap-1 tracking-wider uppercase transition-all shadow-md select-none whitespace-nowrap border-0 cursor-pointer"
                              >
                                <Camera className="w-3 h-3 text-black" /> CAMERA
                              </button>
                            ) : (
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={handleCapture}
                                  className="bg-emerald-500 hover:bg-emerald-400 text-white font-black font-mono text-[9px] px-2 py-1 flex items-center gap-1 tracking-wider uppercase transition-all shadow-md select-none border-0 cursor-pointer"
                                >
                                  SNAP
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setIsCameraActive(false)}
                                  className="bg-red-500 hover:bg-red-400 text-white font-black font-mono text-[9px] px-1.5 py-1 flex items-center transition-all shadow-md select-none border-0 cursor-pointer"
                                  title="Cancel"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Interactive metadata details */}
                        <div className="flex-1 w-full space-y-3.5 text-center sm:text-left">
                          <div>
                            <span className="block text-[8px] text-gray-500 font-mono font-black uppercase tracking-widest">DRIVING IDENTIFICATION CODE</span>
                            <div className="flex items-center gap-2 mt-1 justify-center sm:justify-start">
                              <input 
                                type="text"
                                value={driverName}
                                onChange={(e) => {
                                  const name = e.target.value.toUpperCase().slice(0, 18);
                                  setDriverName(name);
                                  localStorage.setItem("rr3_driver_name", name);
                                }}
                                className="bg-[#161619] border border-white/15 px-2.5 py-1 text-xs font-black text-white focus:outline-none focus:border-yellow-500/80 uppercase font-sans tracking-wide w-full max-w-[180px] italic placeholder-gray-600"
                                placeholder="DRIVER NAME"
                                maxLength={18}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] font-mono text-left bg-black/30 p-2.5 border border-white/5">
                            <div>
                              <span className="text-gray-500 font-bold block text-[8px]">PILOT CLASS:</span>
                              <span className="text-yellow-500 font-extrabold text-[10px]">A-LICENSE SPECIALIST</span>
                            </div>
                            <div>
                              <span className="text-gray-500 font-bold block text-[8px]">GT CATEGORY:</span>
                              <span className="text-white font-extrabold text-[10px]">HYPERCAR ELITE</span>
                            </div>
                            <div>
                              <span className="text-gray-500 font-bold block text-[8px]">REGISTRY ID:</span>
                              <span className="text-gray-300 text-[10px]">GTX-2026-APEX</span>
                            </div>
                            <div>
                              <span className="text-gray-500 font-bold block text-[8px]">STATUS:</span>
                              <span className="text-emerald-450 font-bold animate-pulse text-[10px]">● TELEMETRY ONLINE</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Display permission error if camera cannot load */}
                      {cameraError && (
                        <div className="bg-red-950/40 border border-red-500/20 p-3 text-[11px] text-red-300 font-mono text-left flex items-start gap-2.5 leading-relaxed">
                          <ShieldAlert className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                          <div>
                            <span className="font-extrabold text-red-200 block uppercase text-[9px] tracking-wider font-sans">CAMERA DRIVER NOT INITIALIZED</span>
                            <span>{cameraError}</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4 font-mono text-center">
                        <div className="bg-black/40 p-4 rounded-none border border-white/5">
                          <p className="text-[9px] font-bold text-gray-450 uppercase tracking-wider">CARS UNLOCKED</p>
                          <p className="text-xl font-black text-yellow-500 mt-1">
                            {ownedCarIds.length} / {carsList.length}
                          </p>
                        </div>

                        <div className="bg-black/40 p-4 rounded-none border border-white/5">
                          <p className="text-[9px] font-bold text-gray-450 uppercase tracking-wider">SPEED RECORD</p>
                          <p className="text-xl font-black text-yellow-500 mt-1">
                            {allTimeTopSpeed ? `${allTimeTopSpeed} km/h` : "---"}
                          </p>
                        </div>
                      </div>

                      {/* Progress checklist */}
                      <div className="space-y-3 font-sans text-xs">
                        <h4 className="text-[9px] font-mono tracking-widest text-gray-400 uppercase font-black">CAREER LANDMARKS</h4>
                        
                        <div className="flex items-center gap-3 p-3 bg-black/40 rounded-none border border-white/5">
                          <CheckCircle2 className="w-4 h-4 text-yellow-500 shrink-0" />
                          <p className="text-gray-300 leading-normal">Starter Licence: Complete Spa Qualifying Circuit parameters.</p>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-black/40 rounded-none border border-white/5">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 ${ownedCarIds.length >= 2 ? "text-yellow-500" : "text-white/15"}`} />
                          <p className="text-gray-300 leading-normal">Hypercar Collector: Acquire a second licensed vehicle from active Showroom.</p>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-black/40 rounded-none border border-white/5">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 ${allTimeTopSpeed >= 400 ? "text-yellow-500" : "text-white/15"}`} />
                          <p className="text-gray-300 leading-normal">Speedbreaker Elite: Cross 400 km/h hypercar speed threshold index.</p>
                        </div>
                      </div>
                    </div>

                    {/* Fun crew chief telemetry insight */}
                    <div className="p-6 rounded-none bg-[#121215] border border-white/10 flex flex-col justify-between text-left">
                      <div className="space-y-4">
                        <h3 className="text-[9px] font-black tracking-widest text-gray-400 uppercase flex items-center gap-1.5 font-mono">
                          <Radio className="w-4 h-4 text-emerald-400" /> TEAM CHIEF INTERCOM
                        </h3>
                        <div className="h-28 rounded-none bg-black/50 border border-white/5 p-4 flex items-start gap-3">
                          <Radio className="w-5 h-5 text-yellow-500 animate-pulse mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[10px] font-mono text-gray-400 uppercase leading-none font-bold">Radio Transceiver live</p>
                            <p className="text-xs font-mono text-gray-300 mt-2.5 italic leading-relaxed">
                              "Looking at telemetry, your tire compound kits are crucial to shave off tenths of a second on technical sectors. Check out the Upgrade station."
                            </p>
                          </div>
                        </div>

                        {/* Racing high records */}
                        <div className="space-y-2 text-xs font-mono text-left">
                          <h4 className="text-[9px] font-black tracking-widest text-gray-400 uppercase">TRACK RECORD TIMES ACHIEVED</h4>
                          {Object.keys(bestLapTimes).map(id => {
                            const track = INITIAL_TRACKS.find(t => t.id === id);
                            return (
                              <div key={id} className="flex justify-between p-2.5 rounded-none bg-black/40 border border-white/5">
                                <span className="uppercase font-bold text-gray-400 text-[11px]">{track?.name || id}</span>
                                <span className="text-yellow-500 font-bold">{bestLapTimes[id].toFixed(3)}s</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="text-[9px] font-mono text-gray-500 uppercase mt-4 tracking-wider">
                        UPDATED TELEMETRY UTC SYSTEM: 2026-06-12 12:26:05
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

      {/* 2. REAL RACING DUAL CORE SIMULATOR LAYER */}
      {activeScreen === "racing" && (
        <div className="flex-1 w-full h-full">
          <RaceCanvas
            currentCar={activeCar}
            currentTrack={activeTrack}
            difficulty={difficulty}
            onRaceFinished={handleRaceComplete}
            onExit={() => setActiveScreen("lobby")}
          />
        </div>
      )}

      {/* 3. POST-RACE HUD TELEMETRY REPORT SUMMARY */}
      {activeScreen === "post_race" && lastRaceOutcome && (
        <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center p-6 bg-[radial-gradient(#1a1a1e_1px,transparent_1px)] [background-size:16px_16px]">
          <div className="w-full max-w-2xl bg-[#0c0c0e] border border-white/10 rounded-none p-8 relative space-y-6 animate-view-fade">
            
            {/* Victory / Podium graphical crown representation */}
            <div className="text-center font-sans space-y-2">
              <div className="w-14 h-14 rounded-none bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 flex items-center justify-center text-2xl mx-auto">
                🏆
              </div>
              <h2 className="text-2xl font-black uppercase text-white tracking-widest mt-3 italic">RACE CLASSIFICATION</h2>
              <p className="text-[10px] font-mono text-yellow-500 mt-1 uppercase tracking-widest">Circuit Arena: {activeTrack.name}</p>
            </div>

            {/* Standing positioning */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2 border-b border-white/5">
              
              {/* Placement credentials */}
              <div className="p-4.5 bg-black/40 rounded-none border border-white/15 border-l-[3.5px] border-l-yellow-500 text-left">
                <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest leading-none">PLACEMENT RESULT</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-black font-mono text-yellow-500 tracking-wide">
                    P{lastRaceOutcome.position}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">OUT OF 6 RACERS</span>
                </div>
                <div className="mt-3 text-xs flex justify-between text-gray-300 font-mono">
                  <span>PAYOUT BALANCE:</span>
                  <span className="text-emerald-400 font-black">Cr. +{lastRaceOutcome.prizeEarned.toLocaleString()}</span>
                </div>
              </div>

              {/* Lap recording details */}
              <div className="p-4.5 bg-black/40 rounded-none border border-white/15 border-l-[3.5px] border-l-yellow-500 text-left font-mono">
                <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest leading-none">FASTEST LAP REPORT</p>
                <p className="text-2xl font-black text-white mt-2">
                  {Math.min(...lastRaceOutcome.lapTimes).toFixed(3)}s
                </p>
                <div className="mt-2 text-[11px] flex justify-between text-gray-450 uppercase">
                  <span>LAP 1 TIME:</span>
                  <span className="text-gray-300 font-semibold">{lastRaceOutcome.lapTimes[0]?.toFixed(3)}s</span>
                </div>
                <div className="text-[11px] flex justify-between text-gray-450 uppercase">
                  <span>LAP 2 TIME:</span>
                  <span className="text-gray-300 font-semibold">{lastRaceOutcome.lapTimes[1]?.toFixed(3)}s</span>
                </div>
              </div>

            </div>

            {/* AI Strategic Advice from Crew Chief */}
            <div className="p-4.5 bg-black/40 border border-white/10 rounded-none text-left flex items-start gap-3.5">
              <div className="p-2.5 rounded-none bg-yellow-500/10 text-yellow-500 border border-yellow-500/15 shrink-0">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-mono tracking-widest text-[#eab308] font-black uppercase leading-none">AI Race Engineer Telemetry Review</span>
                <p className="text-xs font-mono text-gray-300 italic leading-normal">
                  "Solid feedback out there on the curbs of {activeTrack.name}. Reached top velocity of {lastRaceOutcome.speedRecord} km/h in the {activeCar.name}. Check the upgrade bay to refine the suspension compound kits."
                </p>
              </div>
            </div>

            {/* Call to actions */}
            <div className="pt-2 flex justify-end gap-3 font-sans">
              <button
                onClick={() => {
                  setActiveScreen("racing");
                }}
                className="px-6 py-3.5 rounded-none bg-white/5 hover:bg-white/10 text-gray-250 font-black uppercase text-xs tracking-wider border border-white/10 cursor-pointer italic duration-150"
              >
                Re-Race Circuit
              </button>
              <button
                onClick={() => {
                  setActiveScreen("lobby");
                  setCurrentMenuTab("garage");
                }}
                className="px-6 py-3.5 rounded-none bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase text-xs tracking-widest cursor-pointer italic shadow-[0_0_15px_rgba(234,179,8,0.23)] duration-150"
              >
                Go to Workshop
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
