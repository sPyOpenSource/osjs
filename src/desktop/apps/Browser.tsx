import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Share, Plus } from "lucide-react";

export function Browser() {
  const [url, setUrl] = useState("https://lovable.dev");
  const [safeUrl, setSafeUrl] = useState("https://lovable.dev");
  const [error, setError] = useState("");

  const navigate = () => {
    try {
      const candidate = new URL(url.trim());
      if (candidate.protocol !== "https:" && candidate.protocol !== "http:") {
        throw new Error("Unsupported protocol");
      }
      setSafeUrl(candidate.href);
      setError("");
    } catch {
      setError("Enter a valid http:// or https:// address");
    }
  };

  return (
    <div className="h-full flex flex-col bg-window">
      <div className="h-11 flex items-center gap-2 px-3 border-b bg-muted/40">
        <button className="p-1 rounded hover:bg-black/5"><ArrowLeft className="w-4 h-4" /></button>
        <button className="p-1 rounded hover:bg-black/5"><ArrowRight className="w-4 h-4" /></button>
        <button className="p-1 rounded hover:bg-black/5"><RotateCw className="w-4 h-4" /></button>
        <div className="flex-1 mx-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") navigate();
            }}
            onBlur={navigate}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "browser-url-error" : undefined}
            className="w-full h-7 px-3 rounded-md bg-white border text-xs text-center outline-none focus:ring-2 ring-primary/40"
          />
          {error && <p id="browser-url-error" className="sr-only">{error}</p>}
        </div>
        <button className="p-1 rounded hover:bg-black/5"><Share className="w-4 h-4" /></button>
        <button className="p-1 rounded hover:bg-black/5"><Plus className="w-4 h-4" /></button>
      </div>
      {error ? (
        <div className="flex-1 grid place-items-center bg-muted/20 text-sm text-destructive">
          {error}
        </div>
      ) : (
        <iframe
          src={safeUrl}
          title="Web browser content"
          sandbox="allow-scripts allow-same-origin allow-forms"
          referrerPolicy="strict-origin-when-cross-origin"
          className="flex-1 w-full bg-window"
        />
      )}
    </div>
  );
}
