import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Gemini Race Engineer (with telemetry critique)
  app.post("/api/race-engineer", async (req, res) => {
    const { trackName = "track", carName = "car", speed = 0, sector = 1, lap = 1, trackPosition = 1, eventType = "telemetry", lapTimes = [], upgrades = {} } = req.body || {};
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Fallback response with trackside immersion if API Key is missing.
        let defaultFeedback = `Trackside Crew: "Copy that, watch the rumble strips on the exit."`;
        let defaultAdvice = "Stay focused on conserving cornering speed.";

        if (eventType === "crashed") {
          defaultFeedback = `Trackside Crew: "Tough impact! Let's check the suspension damage. Get back on track when clear."`;
        } else if (eventType === "won race") {
          defaultFeedback = `Trackside Crew: "P1! What a drive! You absolutely dominated the circuit."`;
        } else if (eventType === "perfect apex cornering") {
          defaultFeedback = `Trackside Crew: "Exquisite apex, sector times look green. Keep feeding the throttle smoothly!"`;
        } else if (eventType === "setup advice") {
          defaultFeedback = `Trackside Crew: "For ${trackName}, upgrading the Drivetrain and Aerodynamics will maximize high-speed stability."`;
        }

        return res.json({
          feedback: defaultFeedback,
          advice: defaultAdvice + " (Configure your GEMINI_API_KEY in Secrets for live AI race engineering radio)."
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `You are a professional Formula 1 / GT3 Race Engineer (Crew Chief) in the style of Real Racing 3, speaking to your driver over the team radio.
Current Context:
Running on Licensed Track: ${trackName} (a real-world circuit: Spa-Francorchamps, Silverstone, Monza, Bathurst Mount Panorama, or Suzuka).
Driving: ${carName} (e.g. Porsche 911 GT3 RS, Ferrari LaFerrari, McLaren P1, Aston Martin Valkyrie) with these car upgrades installed: ${JSON.stringify(upgrades || {})}.
Telemetry info:
- Speed: ${speed} km/h
- Current Track Sector: ${sector}
- Current Lap: ${lap}
- Race Position: ${trackPosition}
- Event Context: ${eventType} (This triggered the engineer communication, e.g. "crashed", "speeding through straight", "perfect apex cornering", "running wide", "won race", or "setup advice" requested in the garage).
- History of lap times: ${JSON.stringify(lapTimes || [])}

Instructions:
- Give a highly immersive, authentic racing comment. Put yourself on the pit wall, watching live telemetry.
- Refer to real-world features of the track if relevant (e.g., Eau Rouge or Blanchimont at Spa, Copse or Maggots-Becketts at Silverstone, Curva Grande or Parabolica at Monza, Dipper or Skyline at Bathurst).
- Keep it highly professional, short, and realistic (max 2 sentences).
- Avoid overly dramatic or generic AI hype. Use crisp motorsport jargon (e.g., oversteer, understeer, dirty air, tyre degradation, curb loading, sector split, trail braking, hitting the apex, short shifting).

Please respond strictly in a single JSON block with "feedback" and "advice" fields. Example:
{
  "feedback": "Outstanding speed through Copse! Copied green in sector 1, keep pushing.",
  "advice": "Apply light trail braking early to settle the nose into Maggots."
}
`;

      // Highly robust fallback model chain with retry loop to shield from 503 High Demand errors
      let response;
      const modelsToTry = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
      let lastError: any = null;

      for (const model of modelsToTry) {
        // Try up to 2 times for each model in case of transient network hiccups
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            response = await ai.models.generateContent({
              model,
              contents: prompt,
              config: {
                responseMimeType: "application/json",
              }
            });
            if (response) {
              break;
            }
          } catch (err: any) {
            lastError = err;
            console.warn(`Attempt ${attempt} failed with model ${model}. Error:`, err?.message || err);
            if (attempt < 2) {
              // Wait 150ms before retrying on the same model
              await new Promise(resolve => setTimeout(resolve, 150));
            }
          }
        }
        if (response) break;
      }

      if (!response) {
        throw lastError || new Error("All fallback models in the chain failed.");
      }

      const responseText = response.text || "{}";
      try {
        const parsed = JSON.parse(responseText.trim());
        res.json({
          feedback: parsed.feedback || "Pit Wall: Sounding clear. Keep hitting those markers.",
          advice: parsed.advice || "Focus on carrying speed through the mid-corner transitions."
        });
      } catch (err) {
        res.json({
          feedback: responseText,
          advice: "Keep the throttle pinned out of the chicane."
        });
      }
    } catch (error: any) {
      // Gracefully handle Gemini API transient limits / high demand to keep user immersion flawless
      console.log("Telemetry Radio Info: Gemini API offline or exhausted. Seamlessly activating high-fidelity offline telemetry feedback loop.");
      
      let fallbackFeedback = `Pit Wall: "Telemetry receiver active on ${trackName || "circuit"}. Signal strength 100%."`;
      let fallbackAdvice = "Watch your tire temperatures and maintain a consistent slip angle.";

      if (eventType === "crashed") {
        fallbackFeedback = `Race Engineer: "Big impact! Let's check the steering and suspension alignment. Get back on track when clear."`;
        fallbackAdvice = "Ensure no critical aerodynamic balance was lost in the gravel trap.";
      } else if (eventType === "won race") {
        fallbackFeedback = `Race Engineer: "P1! What a stellar campaign behind the wheel of the ${carName || "machine"}! Pure class!"`;
        fallbackAdvice = "Excellent drive! Cool down the brakes and bring her back to the parc fermé.";
      } else if (eventType === "perfect apex cornering") {
        fallbackFeedback = `Race Engineer: "Fabulous apex! Sector splits are green. You're extracting maximum mechanical grip here."`;
        fallbackAdvice = "Keep feeding the throttle smoothly as the steering wheel unwinds.";
      } else if (eventType === "running wide") {
        fallbackFeedback = `Race Engineer: "We notice you're pushing track limits. Ease off the throttle early to avoid understeer."`;
        fallbackAdvice = "Try dragging the brake a split second longer to load the front tires.";
      } else if (eventType === "speeding through straight") {
        fallbackFeedback = `Race Engineer: "Great exit! Sector time is flying down the straight. Let's make this lap record count."`;
        fallbackAdvice = "Look deep into the braking zone, identify your turn-in marker.";
      } else if (eventType === "setup advice") {
        fallbackFeedback = `Race Engineer: "For the unique speed curves at ${trackName || "this circuit"}, low-speed traction is paramount."`;
        fallbackAdvice = "Consider upgrading your Drivetrain and Aerodynamics to optimize high-speed downforce and response.";
      }

      res.json({
        feedback: fallbackFeedback,
        advice: fallbackAdvice
      });
    }
  });

  // Serve static assets in production, otherwise Vite dev server
  if (process.env.NODE_ENV !== "production") {
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
