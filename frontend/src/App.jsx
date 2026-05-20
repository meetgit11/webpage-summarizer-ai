import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!url) {
      alert("Please enter a URL");
      return;
    }

    try {
      setLoading(true);
      setSummary("");

      const response = await fetch(
        "https://webpage-summarizer-ai.onrender.com/summarize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        }
      );

      const data = await response.json();

      console.log(data);

      if (data.summary) {
        setSummary(data.summary);
      } else if (data.error) {
        setSummary(JSON.stringify(data.error, null, 2));
      } else {
        setSummary("Something went wrong.");
      }

    } catch (error) {
      console.error(error);
      setSummary("Backend connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 text-white flex flex-col items-center px-6 py-12">

      <h1 className="text-5xl md:text-6xl font-bold text-center mb-12">
        Web Page Summarizer AI
      </h1>

      <div className="w-full max-w-3xl bg-slate-900/70 backdrop-blur-md border border-slate-700 rounded-2xl p-8 shadow-2xl">

        <input
          type="text"
          placeholder="Paste webpage URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-4 rounded-xl bg-slate-800 text-white border border-slate-600 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSummarize}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 py-4 rounded-xl text-lg font-semibold"
        >
          {loading ? "Summarizing..." : "Summarize"}
        </button>

        {summary && (
          <div className="mt-8 bg-slate-950 border border-slate-700 rounded-xl p-6 whitespace-pre-wrap leading-7 text-slate-200">
            {summary}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;