import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSummarize = async () => {
    if (!url) {
      setError("Please enter a URL");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSummary("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/summarize`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            url: url,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Request failed");
      }

      const data = await response.json();

      setSummary(data.summary);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const copySummary = () => {
    navigator.clipboard.writeText(summary);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-blue-950 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-10 shadow-2xl">
        
        <h1 className="text-6xl font-bold text-white text-center mb-12">
          Web Page Summarizer AI
        </h1>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter webpage URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSummarize();
              }
            }}
            className="flex-1 p-5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-300 outline-none"
          />

          <button
            onClick={handleSummarize}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white px-8 py-5 rounded-2xl font-semibold"
          >
            {loading ? "Loading..." : "Summarize"}
          </button>
        </div>

        {error && (
          <div className="mt-8 bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-2xl">
            {error}
          </div>
        )}

        {summary && (
          <div className="mt-10 bg-white/10 border border-white/20 rounded-2xl p-8 text-gray-200 leading-9 relative">
            
            <button
              onClick={copySummary}
              className="absolute top-5 right-5 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl text-white font-medium"
            >
              Copy
            </button>

            <h2 className="text-4xl font-bold mb-6 text-white">
              Summary
            </h2>

            <p>{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;