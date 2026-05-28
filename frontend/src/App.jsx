import { useState } from "react";

// Read the backend URL from the Vite env variable.
// In local dev: VITE_API_URL=http://localhost:5000
// In production: VITE_API_URL=https://your-backend.onrender.com
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);   // { summary, ai_error, extracted_text, char_count }
  const [fetchError, setFetchError] = useState(null);  // network / server error string

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = url.trim();
    if (!trimmed) return;

    // Basic URL format check before hitting the backend
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      setFetchError("Please enter a full URL starting with http:// or https://");
      setResult(null);
      return;
    }

    setLoading(true);
    setResult(null);
    setFetchError(null);

    try {
      const response = await fetch(`${API_URL}/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Backend returned a 4xx/5xx with an error message
        setFetchError(data.error || "Something went wrong on the server.");
      } else {
        setResult(data);
      }
    } catch (err) {
      // Network error (backend down, CORS, etc.)
      setFetchError(
        "Could not reach the server. Make sure the backend is running and the API URL is correct."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setUrl("");
    setResult(null);
    setFetchError(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center px-4 py-12">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
          🌐 Web Page Summarizer AI
        </h1>
        <p className="text-gray-400 text-base">
          Paste any URL — get an instant AI-powered summary
        </p>
      </header>

      {/* ── Input Form ─────────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl flex gap-2 mb-6"
      >
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/article"
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-5 py-3 rounded-lg text-sm transition"
        >
          {loading ? "Summarizing…" : "Summarize"}
        </button>
        {(result || fetchError) && (
          <button
            type="button"
            onClick={handleClear}
            className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-3 rounded-lg text-sm transition"
          >
            Clear
          </button>
        )}
      </form>

      {/* ── Loading State ──────────────────────────────────────────── */}
      {loading && (
        <div className="w-full max-w-2xl bg-gray-800 rounded-xl p-6 text-center animate-pulse">
          <p className="text-blue-400 font-medium">
            ⏳ Scraping page &amp; generating summary…
          </p>
          <p className="text-gray-500 text-xs mt-1">This may take 5–15 seconds</p>
        </div>
      )}

      {/* ── Network / Server Error ─────────────────────────────────── */}
      {fetchError && !loading && (
        <div className="w-full max-w-2xl bg-red-950 border border-red-700 rounded-xl p-5">
          <p className="text-red-400 font-semibold mb-1">❌ Error</p>
          <p className="text-red-300 text-sm">{fetchError}</p>
        </div>
      )}

      {/* ── Results ────────────────────────────────────────────────── */}
      {result && !loading && (
        <div className="w-full max-w-2xl space-y-5">

          {/* AI Summary */}
          {result.summary ? (
            <section className="bg-gray-800 border border-blue-800 rounded-xl p-6">
              <h2 className="text-blue-400 font-semibold text-sm uppercase tracking-widest mb-3">
                ✨ AI Summary
              </h2>
              <p className="text-gray-100 text-sm leading-relaxed whitespace-pre-wrap">
                {result.summary}
              </p>
            </section>
          ) : result.ai_error ? (
            <section className="bg-yellow-950 border border-yellow-700 rounded-xl p-5">
              <p className="text-yellow-400 font-semibold mb-1">⚠️ AI Summary Unavailable</p>
              <p className="text-yellow-300 text-sm">{result.ai_error}</p>
            </section>
          ) : null}

          {/* Extracted Text Preview */}
          {result.extracted_text && (
            <section className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-gray-400 font-semibold text-sm uppercase tracking-widest">
                  📄 Extracted Text Preview
                </h2>
                {result.char_count && (
                  <span className="text-xs text-gray-500">
                    {result.char_count.toLocaleString()} chars scraped
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-xs leading-relaxed whitespace-pre-wrap font-mono">
                {result.extracted_text}
                {result.char_count > 1500 && (
                  <span className="text-gray-600"> … [truncated]</span>
                )}
              </p>
            </section>
          )}

        </div>
      )}

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="mt-16 text-gray-600 text-xs text-center">
        Powered by Gemini AI · Flask · React · Deployed on Render
      </footer>

    </div>
  );
}
