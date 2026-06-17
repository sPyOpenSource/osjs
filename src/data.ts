import { Car, Track } from "./types";

export const INITIAL_TRACKS: Track[] = [
  {
    id: "spa",
    name: "Circuit de Spa-Francorchamps",
    location: "Stavelot, Belgium",
    length: "7.004 km",
    corners: 20,
    difficulty: "Legend",
    lapRecord: "1:41.252",
    recordHolder: "Lewis Hamilton",
    bgGradStart: "#0a1910", // Dark green forest vibe
    bgGradEnd: "#020804",
    segmentCount: 4500, // Long track
    turnComplexity: 1.5,
    curbColorPrimary: "#ef4444",
    curbColorSecondary: "#ffffff",
    description: "Nestled in the Ardennes forest, legendary for steep elevation changes, high physical turn forces, and the fearsome Eau Rouge/Raidillon hill crest."
  },
  {
    id: "monza",
    name: "Autodromo Nazionale Monza",
    location: "Monza, Italy",
    length: "5.793 km",
    corners: 11,
    difficulty: "Amateur",
    lapRecord: "1:18.887",
    recordHolder: "Lewis Hamilton",
    bgGradStart: "#1a0f0a", // Italian terracotta sunset
    bgGradEnd: "#080402",
    segmentCount: 3000, // Short fast track
    turnComplexity: 0.6, // Mostly straights
    curbColorPrimary: "#10b981", // Green & White & Red curbs
    curbColorSecondary: "#ffffff",
    description: "The 'Temple of Speed'. Monza features massive high-speed straights coupled with severe braking zones and chicanes, terminating at the sweeping Curva Parabolica."
  },
  {
    id: "silverstone",
    name: "Silverstone Circuit",
    location: "Silverstone, UK",
    length: "5.891 km",
    corners: 18,
    difficulty: "Pro",
    lapRecord: "1:27.097",
    recordHolder: "Max Verstappen",
    bgGradStart: "#0f172a", // Slate British skies grey-blue
    bgGradEnd: "#020617",
    segmentCount: 3800,
    turnComplexity: 1.2,
    curbColorPrimary: "#ef4444",
    curbColorSecondary: "#ffffff",
    description: "The home of British motorsport. Extremely fast and wind-swept, Silverstone demands high aero-grip through the Maggots, Becketts, and Chapel complex."
  },
  {
    id: "bathurst",
    name: "Mount Panorama Circuit",
    location: "Bathurst, Australia",
    length: "6.213 km",
    corners: 23,
    difficulty: "Legend",
    lapRecord: "2:01.567",
    recordHolder: "Shane van Gisbergen",
    bgGradStart: "#291505", // Orange Australian dusty mountain vibe
    bgGradEnd: "#0a0501",
    segmentCount: 4000,
    turnComplexity: 1.8, // Crucially tight mountain turns
    curbColorPrimary: "#eab308", // Yellow and blue Australian track curbs
    curbColorSecondary: "#1e3a8a",
    description: "A mountain pass race track with incredible vertical elevation, narrow concrete barriers, and a blind, high-speed descent through the mountain face directly to Conrod Straight."
  },
  {
    id: "suzuka",
    name: "Suzuka International Circuit",
    location: "Suzuka, Japan",
    length: "5.807 km",
    corners: 18,
    difficulty: "Pro",
    lapRecord: "1:30.983",
    recordHolder: "Lewis Hamilton",
    bgGradStart: "#180f2d", // Tech purple neon dusk vibe
    bgGradEnd: "#07040d",
    segmentCount: 3900,
    turnComplexity: 1.4,
    curbColorPrimary: "#ef4444",
    curbColorSecondary: "#ffffff",
    description: "A masterpiece figure-eight layout. Suzuka is globally revered by drivers for its sweeping S-Curves, the Degner complex, and the ultra-fast 130R sweeping left-hander."
  }
];

export const INITIAL_CARS: Car[] = [
  {
    id: "porsche_911",
    name: "911 GT3 RS",
    brand: "Porsche",
    class: "GT",
    price: 150000,
    unlockedAtStreak: 0,
    baseSpecs: {
      topSpeed: 296,
      acceleration: 3.2,
      braking: 30.5,
      grip: 1.55 // lateral Gs
    },
    currentSpecs: {
      topSpeed: 296,
      acceleration: 3.2,
      braking: 30.5,
      grip: 1.55
    },
    maxSpecs: {
      topSpeed: 320,
      acceleration: 2.6,
      braking: 25.0,
      grip: 2.10
    },
    upgrades: {
      engine: 0,
      drivetrain: 0,
      aerodynamics: 0,
      tyres: 0
    },
    owned: true, // Starter car
    color: "#e2e8f0", // Racing silver-white
    shadowColor: "#94a3b8",
    emoji: "🏁",
    accentColor: "#ef4444",
    description: "The ultimate track weapon precision-engineered in Stuttgart. Exceptional mechanical grip, razor-sharp steering steering, and a high-revving flat-six powerplant."
  },
  {
    id: "ferrari_laferrari",
    name: "LaFerrari Aperta",
    brand: "Ferrari",
    class: "S",
    price: 850000,
    unlockedAtStreak: 1,
    baseSpecs: {
      topSpeed: 350,
      acceleration: 2.8,
      braking: 31.0,
      grip: 1.82
    },
    currentSpecs: {
      topSpeed: 350,
      acceleration: 2.8,
      braking: 31.0,
      grip: 1.82
    },
    maxSpecs: {
      topSpeed: 385,
      acceleration: 2.1,
      braking: 24.5,
      grip: 2.45
    },
    upgrades: {
      engine: 0,
      drivetrain: 0,
      aerodynamics: 0,
      tyres: 0
    },
    owned: false,
    color: "#dc2626", // Rosso corsa Ferrari Red
    shadowColor: "#991b1b",
    emoji: "🐎",
    accentColor: "#facc15",
    description: "Maranello's hybrid hypercar. A screaming 950-horsepower naturally aspirated V12 engine connected to an F1-derived electric recovery KERS booster system."
  },
  {
    id: "mclaren_p1",
    name: "McLaren P1 GTR",
    brand: "McLaren",
    class: "S",
    price: 920000,
    unlockedAtStreak: 2,
    baseSpecs: {
      topSpeed: 347,
      acceleration: 2.7,
      braking: 29.8,
      grip: 1.90
    },
    currentSpecs: {
      topSpeed: 347,
      acceleration: 2.7,
      braking: 29.8,
      grip: 1.90
    },
    maxSpecs: {
      topSpeed: 390,
      acceleration: 2.0,
      braking: 23.0,
      grip: 2.60
    },
    upgrades: {
      engine: 0,
      drivetrain: 0,
      aerodynamics: 0,
      tyres: 0
    },
    owned: false,
    color: "#f97316", // Papaya orange McLaren
    shadowColor: "#c2410c",
    emoji: "⚡",
    accentColor: "#1e293b",
    description: "A track-only extreme hypercar prototype. Incredible downforce, active aerodynamics wing, DRS system, and hybrid instant torquefill execution."
  },
  {
    id: "aston_valkyrie",
    name: "Valkyrie AMR Pro",
    brand: "Aston Martin",
    class: "R",
    price: 1800000,
    unlockedAtStreak: 4,
    baseSpecs: {
      topSpeed: 402,
      acceleration: 2.3,
      braking: 26.5,
      grip: 2.30
    },
    currentSpecs: {
      topSpeed: 402,
      acceleration: 2.3,
      braking: 26.5,
      grip: 2.30
    },
    maxSpecs: {
      topSpeed: 440,
      acceleration: 1.7,
      braking: 19.5,
      grip: 3.10
    },
    upgrades: {
      engine: 0,
      drivetrain: 0,
      aerodynamics: 0,
      tyres: 0
    },
    owned: false,
    color: "#065f46", // British Racing Green (dark emerald)
    shadowColor: "#022c22",
    emoji: "🦅",
    accentColor: "#ccfbf1",
    description: "Designed in collaboration with Adrian Newey. Features a full Venturi tunnel underbody aerodynamics floor producing F1-level lateral cornering forces without a speed penalty."
  },
  {
    id: "koenigsegg_jesko",
    name: "Jesko Absolut",
    brand: "Koenigsegg",
    class: "R",
    price: 2400000,
    unlockedAtStreak: 5,
    baseSpecs: {
      topSpeed: 480,
      acceleration: 2.5,
      braking: 28.0,
      grip: 2.15
    },
    currentSpecs: {
      topSpeed: 480,
      acceleration: 2.5,
      braking: 28.0,
      grip: 2.15
    },
    maxSpecs: {
      topSpeed: 531,
      acceleration: 1.8,
      braking: 21.0,
      grip: 2.95
    },
    upgrades: {
      engine: 0,
      drivetrain: 0,
      aerodynamics: 0,
      tyres: 0
    },
    owned: false,
    color: "#1e293b", // Stealth dark carbon / gold trim
    shadowColor: "#0f172a",
    emoji: "👑",
    accentColor: "#fbbf24",
    description: "The absolute speed king representing Koenigsegg's peak engineering. A 1600 HP light speed transmission designed specifically to shatter the 500 km/h barrier."
  }
];

export const UPGRADE_LATEST_COSTS = [45000, 75000, 120000, 200000]; // levels 1, 2, 3, 4 cost

/**
 * Calculates a car's upgraded telemetry specification figures based on installed parts.
 */
export function getUpgradedCar(car: Car): Car {
  const { engine, drivetrain, aerodynamics, tyres } = car.upgrades;

  // Let's increment based on progress to maxSpecs
  const calcSpec = (base: number, max: number, level: number): number => {
    const fraction = level / 4;
    return base + (max - base) * fraction;
  };

  // Top speed upgraded primarily by Engine (70%) and Aero (30% reduction in drag)
  const topSpeed = Math.round(
    calcSpec(car.baseSpecs.topSpeed, car.maxSpecs.topSpeed, (engine * 2 + aerodynamics) / 3)
  );

  // Acceleration upgraded by Engine (30%) and Drivetrain (50%) and Tyres (20% launch traction)
  // Acceleration is positive if lower (0-100 time in seconds), so we interpolate DOWN to max value
  const acceleration = parseFloat(
    calcSpec(car.baseSpecs.acceleration, car.maxSpecs.acceleration, (engine + drivetrain * 2 + tyres) / 4).toFixed(2)
  );

  // Braking is standard stopping distance - upgraded primarily by Tyres (60%) and Aerodynamics (40%)
  const braking = parseFloat(
    calcSpec(car.baseSpecs.braking, car.maxSpecs.braking, (tyres * 2.5 + aerodynamics * 1.5) / 4).toFixed(1)
  );

  // Lateral grip is lateral force upgraded by Aerodynamics (55%) and Tyres (45%)
  const grip = parseFloat(
    calcSpec(car.baseSpecs.grip, car.maxSpecs.grip, (aerodynamics * 2.2 + tyres * 1.8) / 4).toFixed(2)
  );

  return {
    ...car,
    currentSpecs: {
      topSpeed,
      acceleration,
      braking,
      grip
    }
  };
}
