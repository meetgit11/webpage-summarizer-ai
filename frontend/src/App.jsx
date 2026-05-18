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

    const urlPattern = /^(https?:\/\/)/i;

    if (!urlPattern.test(url)) {
      setError("URL must start with http:// or https://");
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

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setSummary(data.summary);
      }

    } catch (err) {

      console.log(err);

      setError("Something went wrong.");

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8">

        <h1 className="text-5xl md:text-6xl font-bold text-center text-white mb-10">
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
            className="flex-1 px-5 py-4 rounded-xl bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleSummarize}
            disabled={loading}
            className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white font-semibold disabled:bg-gray-600 flex items-center justify-center min-w-[170px]"
          >

            {loading ? (
              <div className="flex items-center gap-3">

                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

                <span>Summarizing...</span>

              </div>
            ) : (
              "Summarize"
            )}

          </button>

        </div>

        {error && (
          <div className="mt-6 bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {summary && (
          <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">

            <div className="flex items-center justify-between mb-4">

              <h2 className="text-3xl font-bold text-white">
                Summary
              </h2>

              <button
                onClick={() => navigator.clipboard.writeText(summary)}
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition-all duration-300 text-white text-sm font-medium"
              >
                Copy
              </button>

            </div>

            <p className="text-gray-300 leading-8 whitespace-pre-line">
              {summary}
            </p>

          </div>
        )}

      </div>

    </div>
  );
}

export default App;